document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const title = document.querySelector('h1');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMenuButton = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const modal = document.getElementById('authModal');
    const joinHuntButtons = document.querySelectorAll('.join-hunt-btn');
    // Add this in the DOMContentLoaded event listener, near the joinHuntButtons event listener
    const createVacancyBtn = document.querySelector('.btn-danger');
    if (createVacancyBtn) {
        createVacancyBtn.addEventListener('click', () => {
            
            modal.classList.add('active');
            // Check if user is logged in (you would replace this with your actual auth check)
            const isLoggedIn = false; // Set to true to test the vacancy form
            
            if (isLoggedIn) {
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
    const closeModalBtn = document.getElementById('closeModalBtn');
    const signupTabBtn = document.getElementById('signupTabBtn');
    const loginTabBtn = document.getElementById('loginTabBtn');
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const switchToLoginBtn = document.getElementById('switchToLoginBtn');
    const switchToSignupBtn = document.getElementById('switchToSignupBtn');
    const resumeUpload = document.getElementById('resumeUpload');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    // Add this after the variables at the top
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
        loginForm.classList.remove('hidden');
        signupTabBtn.classList.remove('active');
        loginTabBtn.classList.add('active');
    }
    // Add this function near the showLoginForm and showSignupForm functions
    function showVacancyForm() {
        const vacancyForm = document.getElementById('vacancyForm');
        signupForm.classList.add('hidden');
        loginForm.classList.add('hidden');
        vacancyForm.classList.remove('hidden');
        
        // Update tab appearance if needed
        signupTabBtn.classList.remove('active');
        loginTabBtn.classList.remove('active');
        
        // Optionally add a new tab for vacancy, or handle differently since this is for logged-in users
    }
    
    // Switch to signup tab
    function showSignupForm() {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        loginTabBtn.classList.remove('active');
        signupTabBtn.classList.add('active');
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
    
    // Form submissions (prevent default for now)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Form submitted successfully! (This is just a demo)');
            modal.classList.remove('active');
        });
    });
});