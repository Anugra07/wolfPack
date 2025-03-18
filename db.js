// db.js - Create this file in your project root
const mysql = require('mysql2/promise');

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'Prenitn09',
  password: '@Prenitn09',
  database: 'wolf_street_ventures',
  multipleStatements: true
};

// Create the connection pool
const pool = mysql.createPool(dbConfig);

// Test the connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Initialize database with tables
async function initializeDatabase() {
  try {
    const conn = await pool.getConnection();
    
    // Create database if not exists
    await conn.query(`CREATE DATABASE IF NOT EXISTS wolf_street_ventures; USE wolf_street_ventures;`);

    // Create Users table
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        contact_number VARCHAR(20) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        resume_path VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL
      )
    `);
    
    // Create Vacancies table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS vacancies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        business_idea TEXT NOT NULL,
        candidate_requirements TEXT NOT NULL,
        necessary_qualifications TEXT NOT NULL,
        contact_email VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    
    // Create Applications table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        vacancy_id INT NOT NULL,
        applicant_id INT NOT NULL,
        application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        FOREIGN KEY (vacancy_id) REFERENCES vacancies(id),
        FOREIGN KEY (applicant_id) REFERENCES users(id)
      )
    `);
    
    // Create Sessions table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(255) PRIMARY KEY,
        user_id INT NOT NULL,
        ip_address VARCHAR(45) NOT NULL,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    
    console.log('Database tables created successfully');
    conn.release();
    return true;
  } catch (error) {
    console.error('Failed to initialize database tables:', error);
    return false;
  }
}

module.exports = {
  pool,
  testConnection,
  initializeDatabase
};