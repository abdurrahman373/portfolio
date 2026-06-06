document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Mobile Navigation Menu Toggle
       ========================================================================== */
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileNavToggle && navMenu) {
        mobileNavToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileNavToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = mobileNavToggle.querySelector('i');
                icon.className = 'fa-solid fa-bars';
            });
        });
    }


    /* ==========================================================================
       2. Typewriter Effect
       ========================================================================== */
    const typewriterElement = document.querySelector('.typewriter');
    if (typewriterElement) {
        const words = JSON.parse(typewriterElement.getAttribute('data-words'));
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50; // Faster when deleting
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                typingSpeed = 2000; // Pause at full word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 500; // Pause before starting next word
            }

            setTimeout(type, typingSpeed);
        }

        // Start typing
        setTimeout(type, 500);
    }


    /* ==========================================================================
       3. Interactive Particles Canvas
       ========================================================================== */
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const maxParticles = 65;
        const connectionDistance = 120;
        let mouse = { x: null, y: null, radius: 150 };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 1.5 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Wall bounce
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

                // Mouse interaction - push slightly
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = this.x - mouse.x;
                    let dy = this.y - mouse.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        let force = (mouse.radius - dist) / mouse.radius;
                        this.x += (dx / dist) * force * 1.5;
                        this.y += (dy / dist) * force * 1.5;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 210, 255, 0.4)';
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < maxParticles; i++) {
                particles.push(new Particle());
            }
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    let dx = particles[i].x - particles[j].x;
                    let dy = particles[i].y - particles[j].y;
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        let alpha = (1 - (dist / connectionDistance)) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 210, 255, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawConnections();
            requestAnimationFrame(animate);
        }

        // Event listeners
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Initialize and play
        resizeCanvas();
        animate();
    }


    /* ==========================================================================
       4. Roles Tab Switcher
       ========================================================================== */
    const tabButtons = document.querySelectorAll('.role-tab-btn');
    const tabPanels = document.querySelectorAll('.role-panel');

    function switchTab(roleId) {
        // Update Buttons
        tabButtons.forEach(btn => {
            if (btn.getAttribute('data-role') === roleId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update Panels
        tabPanels.forEach(panel => {
            if (panel.id === roleId) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const roleId = btn.getAttribute('data-role');
            switchTab(roleId);
        });
    });


    /* ==========================================================================
       5. Project Highlights Jump-Links
       ========================================================================== */
    const summaryItems = document.querySelectorAll('.summary-item');
    
    summaryItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetRole = item.getAttribute('data-target-role');
            const targetProject = item.getAttribute('data-target-project');

            if (targetRole && targetProject) {
                // 1. Switch the role tab to show the project
                switchTab(targetRole);

                // 2. Locate the project card
                const projectCard = document.getElementById(targetProject);
                if (projectCard) {
                    // 3. Smooth scroll to the role section
                    const sectionOffset = document.getElementById('roles').offsetTop - 90;
                    window.scrollTo({
                        top: sectionOffset,
                        behavior: 'smooth'
                    });

                    // 4. Trigger flash highlight effect
                    projectCard.classList.remove('highlight-flash');
                    void projectCard.offsetWidth; // Trigger reflow to restart animation
                    projectCard.classList.add('highlight-flash');

                    // Clear class after animation completes
                    setTimeout(() => {
                        projectCard.classList.remove('highlight-flash');
                    }, 2500);
                }
            }
        });
    });


    /* ==========================================================================
       6. Active Navigation Scroll Spy
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    const header = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        let currentSection = '';
        const scrollPosition = window.pageYOffset + 120;

        // Sticky header class
        if (window.pageYOffset > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }

        // Section detector
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
                currentSection = section.getAttribute('id');
            }
        });

        // Set active link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });


    /* ==========================================================================
       7. Interactive Contact Form Submission
       ========================================================================== */
    const contactForm = document.getElementById('portfolio-contact-form');
    const statusMsg = document.getElementById('form-status');

    if (contactForm && statusMsg) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get inputs
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim();
            const message = document.getElementById('form-message').value.trim();

            if (!name || !email || !subject || !message) {
                statusMsg.className = 'form-status-msg error';
                statusMsg.textContent = 'Please fill out all fields.';
                return;
            }

            // Simulate sending API call
            statusMsg.className = 'form-status-msg';
            statusMsg.style.color = 'var(--text-secondary)';
            statusMsg.textContent = 'Sending message...';

            setTimeout(() => {
                statusMsg.className = 'form-status-msg success';
                statusMsg.textContent = `Thank you, ${name}! Your message has been sent successfully. Abdur will get back to you shortly.`;
                
                // Reset form
                contactForm.reset();

                // Clear success message after 5 seconds
                setTimeout(() => {
                    statusMsg.textContent = '';
                }, 5000);
            }, 1500);
        });
    }

});
