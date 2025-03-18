// server.js - Create this file in your project root
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const { pool, testConnection, initializeDatabase } = require('./db');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Set up file uploads for resumes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOC files are allowed!'), false);
    }
  }
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize database on startup
(async () => {
  await testConnection();
  await initializeDatabase();
})();

// Routes
app.post('/api/register', upload.single('resume'), async (req, res) => {
  try {
    const { username, email, contactNumber, password } = req.body;
    
    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email or username' });
    }
    
    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Get resume path if uploaded
    const resumePath = req.file ? req.file.path : null;
    
    // Insert new user
    const [result] = await pool.query(
      'INSERT INTO users (username, email, contact_number, password_hash, resume_path) VALUES (?, ?, ?, ?, ?)',
      [username, email, contactNumber, passwordHash, resumePath]
    );
    
    return res.status(201).json({ 
      success: true, 
      message: 'Registration successful', 
      userId: result.insertId 
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const user = users[0];
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Create session
    const sessionId = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Session expires in 7 days
    
    await pool.query(
      'INSERT INTO sessions (id, user_id, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)',
      [sessionId, user.id, req.ip, req.headers['user-agent'], expiresAt]
    );
    
    // Update last login
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );
    
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      sessionId,
      userId: user.id,
      username: user.username
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/vacancies', async (req, res) => {
  try {
    const { userId, businessIdea, candidateRequirements, qualifications, contactEmail } = req.body;
    
    // Calculate expiry date (1 week from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    // Insert vacancy
    const [result] = await pool.query(
      'INSERT INTO vacancies (user_id, business_idea, candidate_requirements, necessary_qualifications, contact_email, expires_at) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, businessIdea, candidateRequirements, qualifications, contactEmail, expiresAt]
    );
    
    return res.status(201).json({
      success: true,
      message: 'Vacancy posted successfully',
      vacancyId: result.insertId
    });
  } catch (error) {
    console.error('Error posting vacancy:', error);
    return res.status(500).json({ error: 'Failed to post vacancy' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});