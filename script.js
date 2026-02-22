// Voice Recognition Setup
let recognition;
let isListening = false;
let currentSlideIndex = 0;
let tourActive = false;

// Initialize particles background
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#667eea' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#667eea',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 6,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
}

// Theme toggle functionality
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = body.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        body.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    }
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('themeToggle');
    
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseFloat(counter.parentElement.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                if (target === 8.63) {
                    counter.textContent = current.toFixed(2);
                } else if (target > 100) {
                    counter.textContent = Math.ceil(current);
                } else {
                    counter.textContent = Math.ceil(current) + '+';
                }
                setTimeout(updateCounter, 20);
            } else {
                if (target === 8.63) {
                    counter.textContent = target.toFixed(2);
                } else if (target > 100) {
                    counter.textContent = target;
                } else {
                    counter.textContent = target + '+';
                }
            }
        };
        
        updateCounter();
    });
}

// Skill progress animation
function animateSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        const skillLevel = item.getAttribute('data-skill');
        const skillBar = item.querySelector('.skill-bar');
        
        if (skillBar && skillLevel) {
            setTimeout(() => {
                skillBar.style.width = skillLevel + '%';
            }, 500);
        }
    });
}

// Testimonials slider
function currentSlide(n) {
    showSlide(currentSlideIndex = n - 1);
}

function showSlide(n) {
    const slides = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    
    if (n >= slides.length) currentSlideIndex = 0;
    if (n < 0) currentSlideIndex = slides.length - 1;
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (slides[currentSlideIndex]) {
        slides[currentSlideIndex].classList.add('active');
        dots[currentSlideIndex].classList.add('active');
    }
}

// Auto-slide testimonials
function autoSlideTestimonials() {
    setInterval(() => {
        currentSlideIndex++;
        showSlide(currentSlideIndex);
    }, 5000);
}

// Portfolio tour
function startTour() {
    if (tourActive) return;
    
    tourActive = true;
    const sections = ['about', 'skills', 'achievements', 'projects', 'experience', 'testimonials', 'contact'];
    let currentSection = 0;
    
    speak('Welcome to my portfolio tour! Let me show you around.');
    
    function nextSection() {
        if (currentSection < sections.length) {
            scrollToSection(sections[currentSection]);
            
            setTimeout(() => {
                switch(sections[currentSection]) {
                    case 'about':
                        speak('This is my about section where you can learn about my background and education.');
                        break;
                    case 'skills':
                        speak('Here are my technical skills with proficiency levels.');
                        break;
                    case 'achievements':
                        speak('These are my key achievements and certifications.');
                        break;
                    case 'projects':
                        speak('Check out my innovative AI projects.');
                        break;
                    case 'experience':
                        speak('This shows my work experience and internships.');
                        break;
                    case 'testimonials':
                        speak('Here are testimonials from my colleagues and mentors.');
                        break;
                    case 'contact':
                        speak('Finally, here is how you can get in touch with me.');
                        break;
                }
                
                currentSection++;
                setTimeout(nextSection, 3000);
            }, 1000);
        } else {
            speak('Thank you for taking the tour! Feel free to explore more or contact me.');
            tourActive = false;
        }
    }
    
    nextSection();
}

// Back to top functionality
function handleBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Loading screen
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 3000);
}

// Initialize voice recognition
function initVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            isListening = true;
            document.getElementById('voiceIndicator').classList.add('listening');
            document.getElementById('voiceIndicator').innerHTML = '<i class="fas fa-microphone"></i><span>Listening...</span>';
        };

        recognition.onend = () => {
            isListening = false;
            document.getElementById('voiceIndicator').classList.remove('listening');
            document.getElementById('voiceIndicator').innerHTML = '<i class="fas fa-microphone"></i><span>Say "Hey Amit" to activate</span>';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
            handleVoiceCommand(transcript);
        };

        // Start listening for "Hey Amit"
        recognition.start();
    } else {
        document.getElementById('voiceIndicator').innerHTML = '<i class="fas fa-microphone-slash"></i><span>Voice not supported</span>';
    }
}

// Handle voice commands
function handleVoiceCommand(command) {
    console.log('Voice command:', command);
    
    if (command.includes('hey amit') || command.includes('hi amit')) {
        speak('Hello! How can I help you navigate my portfolio?');
        return;
    }
    
    if (command.includes('go to home') || command.includes('home')) {
        scrollToSection('home');
        speak('Going to home section');
    } else if (command.includes('about') || command.includes('about me')) {
        scrollToSection('about');
        speak('Here is my about section');
    } else if (command.includes('skills') || command.includes('technical skills')) {
        scrollToSection('skills');
        speak('These are my technical skills');
    } else if (command.includes('achievements') || command.includes('my achievements')) {
        scrollToSection('achievements');
        speak('Here are my achievements and certifications');
    } else if (command.includes('projects') || command.includes('my projects')) {
        scrollToSection('projects');
        speak('Here are my projects');
    } else if (command.includes('experience') || command.includes('work experience')) {
        scrollToSection('experience');
        speak('This is my work experience');
    } else if (command.includes('testimonials') || command.includes('reviews')) {
        scrollToSection('testimonials');
        speak('Here are testimonials from my colleagues');
    } else if (command.includes('contact') || command.includes('get in touch')) {
        scrollToSection('contact');
        speak('Here is my contact information');
    } else if (command.includes('download resume') || command.includes('resume')) {
        downloadResume();
        speak('Downloading my resume');
    } else if (command.includes('dark mode') || command.includes('dark theme')) {
        toggleTheme();
        speak('Theme switched');
    } else if (command.includes('take a tour') || command.includes('tour')) {
        startTour();
    } else if (command.includes('linkedin') || command.includes('linked in')) {
        window.open('https://linkedin.com/in/amit-kumar-sharma', '_blank');
        speak('Opening my LinkedIn profile');
    } else if (command.includes('github') || command.includes('git hub')) {
        window.open('https://github.com/amitsharma4-5', '_blank');
        speak('Opening my GitHub profile');
    } else if (command.includes('leetcode') || command.includes('leet code')) {
        window.open('https://leetcode.com/u/amitsharma4-5', '_blank');
        speak('Opening my LeetCode profile');
    } else if (command.includes('stop listening') || command.includes('stop')) {
        recognition.stop();
        speak('Voice commands stopped');
    }
}

// Text-to-speech function
function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
    }
}

// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Download resume function
function downloadResume() {
    // Create a simple resume content
    const resumeContent = `
AMIT KUMAR SHARMA
Vadodara, Gujarat, India
Phone: +91 9918675501
Email: amit04.5sharma@gmail.com
LinkedIn: linkedin.com/in/amit-kumar-sharma
GitHub: github.com/amitsharma4-5
LeetCode: leetcode.com/u/amitsharma4-5

CAREER OBJECTIVE
Motivated Computer Science and Engineering undergraduate seeking a technical internship to apply strong problem-solving abilities, strengthen software development skills, and gain hands-on industry experience.

EDUCATION
Bachelor of Technology (B.Tech) — Computer Science & Engineering
Parul University, Vadodara, Gujarat
CGPA: 8.63 | Expected Graduation: 2027

INTERNSHIP EXPERIENCE
Laboratory Technician (Intern)
Parul University, Vadodara, Gujarat | Feb 2025– Present
• Assisted in preparation, calibration, and maintenance of laboratory equipment
• Conducted experiments, recorded observations, and supported result analysis
• Ensured compliance with laboratory safety standards and SOPs
• Supported faculty and students during practical sessions

TECHNICAL SKILLS
• Languages: C, Java, Python
• Web Technologies: HTML, CSS, JavaScript (Basic)
• Databases: SQL (Basic), MongoDB (Basic)
• Core Concepts: Data Structures & Algorithms, DBMS, Operating Systems
• Tools: Git, GitHub, VS Code

CODING & PROBLEM SOLVING
• Solved 260+ Data Structures and Algorithms problems on LeetCode
• Strong understanding of arrays, strings, recursion, trees, stacks, queues, and hashing
• Regular coding practice with long active-day streaks; primary language: Java

PROJECTS
AI-Powered Crop Health Diagnosis System
Designed an image-based system to detect crop nutrient deficiencies using leaf images.

Smart Rural Health & AI-IoT Medical Guidance System
Proposed an AI-driven healthcare platform for rural communities with disease prediction and health monitoring.

PROFESSIONAL ATTRIBUTES
• Strong analytical and problem-solving skills
• Quick learner with disciplined work ethic
• Effective team collaboration and communication
    `;
    
    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Amit_Kumar_Sharma_Resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Project details modal
function showProjectDetails(projectType) {
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    
    let content = '';
    
    if (projectType === 'crop') {
        content = `
            <h2>AI-Powered Crop Health Diagnosis System</h2>
            <div style="margin: 20px 0;">
                <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'><rect fill='%23667eea' width='400' height='200'/><text x='200' y='100' text-anchor='middle' fill='white' font-size='20'>Crop Health AI System</text></svg>" 
                     style="width: 100%; max-width: 400px; border-radius: 10px;" alt="Crop Health System">
            </div>
            <h3>Project Overview</h3>
            <p>An innovative AI-powered system designed to revolutionize agriculture by providing accurate crop health diagnosis through advanced image processing and machine learning techniques.</p>
            
            <h3>Key Features</h3>
            <ul>
                <li><strong>Nutrient Deficiency Detection:</strong> Identifies Nitrogen, Phosphorus, and Potassium deficiencies</li>
                <li><strong>Image-Based Analysis:</strong> Uses leaf images for accurate diagnosis</li>
                <li><strong>Fertilizer Recommendations:</strong> Provides precise fertilizer application guidance</li>
                <li><strong>User-Friendly Interface:</strong> Simple upload and analysis process</li>
            </ul>
            
            <h3>Technologies Used</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin: 15px 0;">
                <span class="tech-tag">Python</span>
                <span class="tech-tag">Machine Learning</span>
                <span class="tech-tag">Computer Vision</span>
                <span class="tech-tag">TensorFlow</span>
                <span class="tech-tag">OpenCV</span>
            </div>
            
            <h3>Impact</h3>
            <p>This system helps farmers make informed decisions about fertilizer application, potentially increasing crop yield by 15-20% while reducing unnecessary chemical usage.</p>
        `;
    } else if (projectType === 'health') {
        content = `
            <h2>Smart Rural Health & AI-IoT Medical Guidance System</h2>
            <div style="margin: 20px 0;">
                <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'><rect fill='%23764ba2' width='400' height='200'/><text x='200' y='100' text-anchor='middle' fill='white' font-size='18'>Rural Health AI System</text></svg>" 
                     style="width: 100%; max-width: 400px; border-radius: 10px;" alt="Rural Health System">
            </div>
            <h3>Project Overview</h3>
            <p>A comprehensive AI-driven healthcare platform specifically designed to address the healthcare challenges in rural communities through advanced technology and data privacy protection.</p>
            
            <h3>Key Features</h3>
            <ul>
                <li><strong>Disease Prediction:</strong> AI-powered early disease detection and risk assessment</li>
                <li><strong>Health Monitoring:</strong> Continuous health parameter tracking via IoT devices</li>
                <li><strong>Medical Chatbot:</strong> 24/7 medical guidance and consultation</li>
                <li><strong>Data Privacy:</strong> End-to-end encryption and secure data handling</li>
                <li><strong>Telemedicine:</strong> Remote consultation with healthcare professionals</li>
            </ul>
            
            <h3>Technologies Used</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin: 15px 0;">
                <span class="tech-tag">Python</span>
                <span class="tech-tag">AI/ML</span>
                <span class="tech-tag">IoT</span>
                <span class="tech-tag">Natural Language Processing</span>
                <span class="tech-tag">Cloud Computing</span>
                <span class="tech-tag">Blockchain</span>
            </div>
            
            <h3>Social Impact</h3>
            <p>This platform aims to bridge the healthcare gap in rural areas, providing accessible, affordable, and quality healthcare services to underserved communities.</p>
        `;
    }
    
    modalBody.innerHTML = content;
    modal.style.display = 'block';
}

// Contact form handling
function handleContactForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Simulate form submission
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        alert(`Thank you ${name}! Your message has been received. I'll get back to you soon at ${email}.`);
        document.getElementById('contactForm').reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        speak(`Thank you ${name}! Your message has been received.`);
    }, 2000);
}

// Scroll animations
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.skill-category, .project-card, .timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Navbar scroll effect
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });
}

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            if (text.charAt(i) === '<') {
                // Handle HTML tags
                let tagEnd = text.indexOf('>', i);
                if (tagEnd !== -1) {
                    element.innerHTML += text.substring(i, tagEnd + 1);
                    i = tagEnd + 1;
                } else {
                    element.innerHTML += text.charAt(i);
                    i++;
                }
            } else {
                element.innerHTML += text.charAt(i);
                i++;
            }
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen
    hideLoadingScreen();
    
    // Load theme
    loadTheme();
    
    // Initialize particles
    initParticles();
    
    // Initialize voice recognition
    initVoiceRecognition();
    
    // Setup theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Setup back to top
    handleBackToTop();
    
    // Setup mobile menu
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Setup navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
            
            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
    
    // Setup contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Setup modal
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Initialize scroll animations with counter and skill bar animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Trigger counter animation for stats section
                if (entry.target.classList.contains('stats')) {
                    animateCounters();
                }
                
                // Trigger skill bar animation for skills section
                if (entry.target.classList.contains('skills-grid')) {
                    animateSkillBars();
                }
            }
        });
    }, { threshold: 0.1 });
    
    const animatedElements = document.querySelectorAll('.skill-category, .project-card, .timeline-item, .achievement-card, .stats, .skills-grid');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    // Initialize testimonials slider
    autoSlideTestimonials();
    
    handleNavbarScroll();
    updateActiveNavLink();
    
// Add typing animation to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        // Fix HTML encoding issue and add typing animation
        heroTitle.innerHTML = 'Hi, I\'m <span class="highlight">Amit Kumar Sharma</span>';
        
        setTimeout(() => {
            const textContent = heroTitle.textContent;
            heroTitle.textContent = '';
            typeWriter(heroTitle, textContent, 50);
        }, 1000);
    }
    
    // Add some interactive effects
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.05)';
            item.style.transition = 'transform 0.2s ease';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1)';
        });
    });
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Welcome message
    setTimeout(() => {
        speak('Welcome to Amit Kumar Sharma\'s portfolio. Say "Hey Amit" to use voice commands or click "Take a Tour" for a guided experience.');
    }, 4000);
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav-link.active {
        color: var(--primary-color) !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);