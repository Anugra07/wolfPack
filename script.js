
document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const title = document.querySelector('h1');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMenuButton = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const modal = document.getElementById('authModal');
    const joinHuntButtons = document.querySelectorAll('.join-hunt-btn');
    const createVacancyBtn = document.querySelector('.btn-danger');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const signupTabBtn = document.getElementById('signupTabBtn');
    const loginTabBtn = document.getElementById('loginTabBtn');
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const vacancyForm = document.getElementById('vacancyForm');
    const switchToLoginBtn = document.getElementById('switchToLoginBtn');
    const switchToSignupBtn = document.getElementById('switchToSignupBtn');
    const resumeUpload = document.getElementById('resumeUpload');
    const fileNameDisplay = document.getElementById('fileNameDisplay');

    // Check if user is logged in
    function isUserLoggedIn() {
        return localStorage.getItem('sessionId') !== null;
    }
    
    // Get user data from localStorage
    function getUserData() {
        return {
            sessionId: localStorage.getItem('sessionId'),
            userId: localStorage.getItem('userId'),
            username: localStorage.getItem('username')
        };
    }
    
    // Update UI based on login status
    function updateUIForUser() {
        if (isUserLoggedIn()) {
            const userData = getUserData();
            
            // Update navigation if needed
            const navLinks = document.querySelector('.hidden.md\\:flex');
            if (navLinks) {
                // Clear existing links
                navLinks.innerHTML = '';
                
                // Add new links
                const links = [
                    { text: 'Home', href: '#' },
                    { text: 'My Profile', href: '#' },
                    { text: 'My Vacancies', href: '#' },
                    { text: 'Logout', href: '#', id: 'logoutBtn' }
                ];
                
                links.forEach(link => {
                    const a = document.createElement('a');
                    a.href = link.href;
                    a.className = 'nav-link hover:text-green-400 transition';
                    a.textContent = link.text;
                    if (link.id) a.id = link.id;
                    navLinks.appendChild(a);
                });
                
                // Add logout functionality
                document.getElementById('logoutBtn').addEventListener('click', (e) => {
                    e.preventDefault();
                    logout();
                });
            }
            
            // Update mobile menu
            if (document.querySelector('.mobile-menu .flex.flex-col')) {
                const mobileNav = document.querySelector('.mobile-menu .flex.flex-col');
                mobileNav.innerHTML = `
                    <a href="#" class="text-lg hover:text-green-400 transition pb-2 border-b border-gray-700">Home</a>
                    <a href="#" class="text-lg hover:text-green-400 transition pb-2 border-b border-gray-700">My Profile</a>
                    <a href="#" class="text-lg hover:text-green-400 transition pb-2 border-b border-gray-700">My Vacancies</a>
                    <a href="#" id="mobileLogoutBtn" class="text-lg hover:text-green-400 transition pb-2 border-b border-gray-700">Logout</a>
                `;
                
                document.getElementById('mobileLogoutBtn').addEventListener('click', (e) => {
                    e.preventDefault();
                    logout();
                });
            }
            
            // Update tab structure for logged-in user
            updateTabsForLoggedInUser(true);
        }
    }
    
    // Logout function
    function logout() {
        localStorage.removeItem('sessionId');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        
        // Reload page to reset UI
        window.location.reload();
    }
    
    // Update tabs for logged-in user
    function updateTabsForLoggedInUser(isLoggedIn) {
        const tabContainer = document.querySelector('.modal .flex.justify-center');
        
        if (isLoggedIn) {
            // Check if we already have the vacancy tab
            if (!document.getElementById('vacancyTabBtn')) {
                // Create a vacancy tab button
                const vacancyTabBtn = document.createElement('button');
                vacancyTabBtn.id = 'vacancyTabBtn';
                vacancyTabBtn.className = 'tab-button px-4 py-2 text-lg font-bold';
                vacancyTabBtn.textContent = 'CREATE VACANCY';
                
                // Add event listener
                vacancyTabBtn.addEventListener('click', showVacancyForm);
                
                // Add it to the tab container
                tabContainer.appendChild(vacancyTabBtn);
            }
        }
    }
    
    // Initialize modal as hidden
    modal.classList.remove('active');
    
    // Subtle pulse animation for the heading
    setTimeout(() => {
        title.classList.add('opacity-0');
        setTimeout(() => {
            title.classList.remove('opacity-0');
            title.classList.add('transition-all', 'duration-1000');
        }, 100);
    }, 300);
    
    // Mobile menu toggle
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.add('active');
        });
    }
    
    if (closeMenuButton) {
        closeMenuButton.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    }
    
    // Add subtle hover effect to cards only on desktop
    if (window.innerWidth >= 768) {
        const cards = document.querySelectorAll('.option-card');
        cards.forEach(card => {
            card.addEventListener('mouseover', () => {
                cards.forEach(c => {
                    if (c !== card) c.style.opacity = '0.7';
                });
            });
            
            card.addEventListener('mouseout', () => {
                cards.forEach(c => c.style.opacity = '1');
            });
        });
    }
    
    // Open modal when JOIN THE HUNT button is clicked
    joinHuntButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.classList.add('active');
            // Add slight delay to the modal container animation for a smoother effect
            setTimeout(() => {
                document.querySelector('.modal-container').style.opacity = '1';
                document.querySelector('.modal-container').style.transform = 'translateY(0) scale(1)';
            }, 50);
        });
    });
    
    if (createVacancyBtn) {
        createVacancyBtn.addEventListener('click', () => {
            modal.classList.add('active');
            
            // Check if user is logged in
            if (isUserLoggedIn()) {
                showVacancyForm();
            } else {
                // Show signup by default for non-logged in users
                showSignupForm();
            }
            
            // Add slight delay to the modal container animation
            setTimeout(() => {
                document.querySelector('.modal-container').style.opacity = '1';
                document.querySelector('.modal-container').style.transform = 'translateY(0) scale(1)';
            }, 50);
        });
    }
    
    // Close modal
    closeModalBtn.addEventListener('click', () => {
        document.querySelector('.modal-container').style.opacity = '0';
        document.querySelector('.modal-container').style.transform = 'translateY(20px) scale(0.95)';
        setTimeout(() => {
            modal.classList.remove('active');
        }, 300);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.querySelector('.modal-container').style.opacity = '0';
            document.querySelector('.modal-container').style.transform = 'translateY(20px) scale(0.95)';
            setTimeout(() => {
                modal.classList.remove('active');
            }, 300);
        }
    });
    
    // Switch to login tab
    function showLoginForm() {
        signupForm.classList.add('hidden');
        if (vacancyForm) vacancyForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        signupTabBtn.classList.remove('active');
        loginTabBtn.classList.add('active');
        if (document.getElementById('vacancyTabBtn')) {
            document.getElementById('vacancyTabBtn').classList.remove('active');
        }
    }
    
    function showVacancyForm() {
        signupForm.classList.add('hidden');
        loginForm.classList.add('hidden');
        vacancyForm.classList.remove('hidden');
        
        // Update tab appearance
        signupTabBtn.classList.remove('active');
        loginTabBtn.classList.remove('active');
        
        if (document.getElementById('vacancyTabBtn')) {
            document.getElementById('vacancyTabBtn').classList.add('active');
        }
    }
    
    // Switch to signup tab
    function showSignupForm() {
        loginForm.classList.add('hidden');
        if (vacancyForm) vacancyForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        loginTabBtn.classList.remove('active');
        signupTabBtn.classList.add('active');
        if (document.getElementById('vacancyTabBtn')) {
            document.getElementById('vacancyTabBtn').classList.remove('active');
        }
    }
    
    // Tab switching
    signupTabBtn.addEventListener('click', showSignupForm);
    loginTabBtn.addEventListener('click', showLoginForm);
    
    if (switchToLoginBtn) {
        switchToLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginForm();
        });
    }
    
    if (switchToSignupBtn) {
        switchToSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSignupForm();
        });
    }
    
    // File upload display
    if (resumeUpload) {
        resumeUpload.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                fileNameDisplay.textContent = e.target.files[0].name;
                fileNameDisplay.classList.remove('text-gray-400');
                fileNameDisplay.classList.add('text-green-400');
            } else {
                fileNameDisplay.textContent = 'Upload your resume (PDF/DOC)';
                fileNameDisplay.classList.remove('text-green-400');
                fileNameDisplay.classList.add('text-gray-400');
            }
        });
    }
    
    // Handle form submissions
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(signupForm);
            
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    alert('Registration successful! You can now log in.');
                    showLoginForm();
                } else {
                    alert(`Registration failed: ${data.error}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Registration failed. Please try again later.');
            }
        });
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = loginForm.querySelector('input[type="text"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Store session data
                    localStorage.setItem('sessionId', data.sessionId);
                    localStorage.setItem('userId', data.userId);
                    localStorage.setItem('username', data.username);
                    
                    alert('Login successful!');
                    
                    // Update UI for logged-in user
                    updateUIForUser();
                    
                    // Close modal
                    modal.classList.remove('active');
                } else {
                    alert(`Login failed: ${data.error}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Login failed. Please try again later.');
            }
        });
    }
    
    if (vacancyForm) {
        vacancyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!isUserLoggedIn()) {
                alert('You must be logged in to post a vacancy.');
                showLoginForm();
                return;
            }
            
            const userData = getUserData();
            const businessIdea = vacancyForm.querySelector('textarea[placeholder="Describe your business idea in detail"]').value;
            const candidateRequirements = vacancyForm.querySelector('textarea[placeholder="What are you looking for in a candidate?"]').value;
            const qualifications = vacancyForm.querySelector('textarea[placeholder="List necessary qualifications or skills"]').value;
            const contactEmail = vacancyForm.querySelector('input[type="email"]').value;
            
            try {
                const response = await fetch('/api/vacancies', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: userData.userId,
                        businessIdea,
                        candidateRequirements,
                        qualifications,
                        contactEmail
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    alert('Vacancy posted successfully!');
                    modal.classList.remove('active');
                } else {
                    alert(`Failed to post vacancy: ${data.error}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to post vacancy. Please try again later.');
            }
        });
    }
    
    // Check login status on page load and update UI accordingly
    updateUIForUser();
});
