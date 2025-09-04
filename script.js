// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeSmoothScrolling();
    initializeScrollAnimations();
    fixLogoDisplay();
    initializeEnhancedLogos(); // Add enhanced logo initialization
    initializeLogoHoverControls(); // Add hover control initialization
    initializeScrollProgress();
    initializeParallaxEffects();
    initializeDynamicSkills();
});

// Fix HEADER logo display issues ONLY
function fixLogoDisplay() {
    const headerLogo = document.querySelector('.header .logo');
    const headerLogoText = document.querySelector('.header .logo-text');
    
    if (headerLogo && headerLogoText) {
        // Force style application ONLY for header logo
        headerLogo.style.background = '#000000';
        headerLogo.style.border = '2px solid #000000';
        headerLogo.style.zIndex = '1001';
        headerLogo.style.isolation = 'isolate';
        headerLogo.style.mixBlendMode = 'normal';
        headerLogo.style.filter = 'none';
        
        headerLogoText.style.color = '#ffffff';
        headerLogoText.style.opacity = '1';
        headerLogoText.style.display = 'block';
        headerLogoText.style.visibility = 'visible';
        headerLogoText.style.textRendering = 'optimizeLegibility';
        
        // Force repaint
        headerLogo.style.transform = 'translateZ(0)';
        
        // Backup method: recreate logo if still not visible
        setTimeout(() => {
            const computedStyle = window.getComputedStyle(headerLogo);
            const textStyle = window.getComputedStyle(headerLogoText);
            
            if (computedStyle.backgroundColor !== 'rgb(0, 0, 0)' || textStyle.color !== 'rgb(255, 255, 255)') {
                console.warn('Header logo not displaying correctly, applying backup fix');
                createBackupLogo();
            } else {
                console.log('Header logo styles applied successfully');
            }
        }, 100);
    }
    
    // Ensure company logos DON'T get black styling
    fixCompanyLogos();
}

// Backup HEADER logo creation ONLY
function createBackupLogo() {
    const headerLogo = document.querySelector('.header .logo');
    if (headerLogo) {
        // Clear existing content
        headerLogo.innerHTML = '';
        
        // Create new logo structure
        headerLogo.style.cssText = `
            width: 48px !important;
            height: 48px !important;
            background: rgb(0, 0, 0) !important;
            border: 2px solid rgb(0, 0, 0) !important;
            border-radius: 8px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 1001 !important;
            isolation: isolate !important;
            position: relative !important;
        `;
        
        // Create new text element
        const newText = document.createElement('span');
        newText.textContent = 'AS';
        newText.style.cssText = `
            color: rgb(255, 255, 255) !important;
            font-size: 18px !important;
            font-weight: 700 !important;
            letter-spacing: -0.02em !important;
            font-family: 'Inter', sans-serif !important;
            opacity: 1 !important;
            display: block !important;
            visibility: visible !important;
        `;
        
        headerLogo.appendChild(newText);
        console.log('Backup header logo created');
    }
}

// Fix company logos - ensure they look clean and are properly sized (larger)
function fixCompanyLogos() {
    // Company logos (Tabby, Metary) - larger size
    const companyLogos = document.querySelectorAll('.company-logo .logo');
    companyLogos.forEach(logo => {
        logo.style.background = '#f8fafc';
        logo.style.border = '1px solid #e2e8f0';
        logo.style.color = 'initial';
        logo.style.isolation = 'auto';
        logo.style.mixBlendMode = 'normal';
        logo.style.filter = 'none';
        logo.style.width = '72px';
        logo.style.height = '72px';
        logo.style.objectFit = 'contain';
        logo.style.objectPosition = 'center';
        logo.style.padding = '12px';
    });
    
    // Institution logos (LJMU) - much larger
    const institutionLogos = document.querySelectorAll('.institution-logo .logo');
    institutionLogos.forEach(logo => {
        logo.style.background = '#f8fafc';
        logo.style.border = '1px solid #e2e8f0';
        logo.style.color = 'initial';
        logo.style.isolation = 'auto';
        logo.style.mixBlendMode = 'normal';
        logo.style.filter = 'none';
        logo.style.width = '100px';
        logo.style.height = '100px';
        logo.style.objectFit = 'contain';
        logo.style.objectPosition = 'center';
        logo.style.padding = '24px 28px'; // Adjusted for wider LJMU logo
    });
    
    // Certification logos (Tableau) - much larger
    const certificationLogos = document.querySelectorAll('.certification-logo .logo');
    certificationLogos.forEach(logo => {
        logo.style.background = '#f8fafc';
        logo.style.border = '1px solid #e2e8f0';
        logo.style.color = 'initial';
        logo.style.isolation = 'auto';
        logo.style.mixBlendMode = 'normal';
        logo.style.filter = 'none';
        logo.style.width = '100px';
        logo.style.height = '100px';
        logo.style.objectFit = 'contain';
        logo.style.objectPosition = 'center';
        logo.style.padding = '22px'; // Uniform padding for square Tableau logo
    });
    
    console.log(`Fixed ${companyLogos.length + institutionLogos.length + certificationLogos.length} company/institution/certification logos with much larger prominent sizing`);
}

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (nav.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav) {
                nav.classList.remove('active');
                const spans = navToggle?.querySelectorAll('span');
                spans?.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations using Intersection Observer
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Animate elements on scroll
    const animatedElements = document.querySelectorAll(
        '.timeline-item, .project-card, .hero-content, .contact-content'
    );
    
    animatedElements.forEach((el, index) => {
        // Initial state
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        observer.observe(el);
    });
}

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (!header) return;
    
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        header.style.borderBottomColor = '#e0e0e0';
    } else {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.borderBottomColor = '#f0f0f0';
    }
});

// Parallax effect for hero section (subtle)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && scrolled < window.innerHeight) {
        const rate = scrolled * -0.3;
        heroContent.style.transform = `translateY(${rate}px)`;
    }
});

// Contact form handling (if needed in future)
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add contact form handling logic here
            console.log('Contact form submitted');
        });
    }
}

// Email and phone link interactions
document.addEventListener('click', function(e) {
    const target = e.target.closest('a[href^="mailto:"], a[href^="tel:"]');
    if (target) {
        // Add analytics tracking or other functionality
        console.log(`${target.href.includes('mailto') ? 'Email' : 'Phone'} link clicked`);
    }
});

// Keyboard navigation improvements
document.addEventListener('keydown', function(e) {
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
        const nav = document.querySelector('.nav');
        const navToggle = document.getElementById('nav-toggle');
        
        if (nav && nav.classList.contains('active')) {
            nav.classList.remove('active');
            const spans = navToggle?.querySelectorAll('span');
            spans?.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        }
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll handlers
const debouncedScrollHandler = debounce(() => {
    updateActiveNavLink();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add focus visible support for better accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Enhanced accessibility styles
const accessibilityStyles = document.createElement('style');
accessibilityStyles.textContent = `
    .keyboard-nav *:focus-visible {
        outline: 2px solid #6366f1 !important;
        outline-offset: 2px !important;
        border-radius: 4px !important;
    }
    
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
    }
`;
document.head.appendChild(accessibilityStyles);

// Initialize Scroll Progress Indicator
function initializeScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) return;
    
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (scrollTop / documentHeight) * 100;
        
        progressBar.style.width = `${Math.min(scrollPercentage, 100)}%`;
    }
    
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollProgress();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
    updateScrollProgress();
    
    console.log('📊 Scroll progress indicator initialized!');
}

// Initialize Parallax Effects
function initializeParallaxEffects() {
    const floatingElements = document.querySelectorAll('.floating-circle, .floating-square, .floating-triangle');
    const heroBackground = document.querySelector('.hero::before');
    
    function updateParallax() {
        const scrollTop = window.pageYOffset;
        const scrollSpeed = scrollTop * 0.5;
        
        // Parallax effect for floating elements
        floatingElements.forEach((element, index) => {
            const speed = element.dataset.speed || 1;
            const yPos = -(scrollTop * speed * 0.1);
            const rotation = scrollTop * speed * 0.05;
            element.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
        });
        
        // Parallax for project cards and timeline items
        const projectCards = document.querySelectorAll('.project-card');
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        projectCards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight && rect.bottom > 0) {
                const parallaxSpeed = (windowHeight - rect.top) * 0.1;
                card.style.transform = `translateY(${parallaxSpeed * 0.02}px)`;
            }
        });
        
        timelineItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight && rect.bottom > 0) {
                const parallaxSpeed = (windowHeight - rect.top) * 0.05;
                item.style.transform = `translateX(${parallaxSpeed * 0.01}px)`;
            }
        });
    }
    
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
    
    console.log('🌟 Parallax effects initialized!');
}

// Initialize Dynamic Skills Animation
function initializeDynamicSkills() {
    // Add skill tags to projects dynamically
    const projects = [
        {
            selector: '.project-card',
            skills: ['Python', 'SQL', 'Data Analysis', 'Automation', 'Tableau', 'BigQuery']
        }
    ];
    
    // Create intersection observer for skill animations
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillTags = entry.target.querySelectorAll('.skill-tag');
                skillTags.forEach((tag, index) => {
                    setTimeout(() => {
                        tag.style.opacity = '1';
                        tag.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, {
        threshold: 0.3
    });
    
    // Observe project cards for skill animations
    document.querySelectorAll('.project-card').forEach(card => {
        skillObserver.observe(card);
    });
    
    // Add dynamic hover effects to existing elements
    const logos = document.querySelectorAll('.company-logo .logo, .institution-logo .logo, .certification-logo .logo');
    logos.forEach(logo => {
        logo.addEventListener('mouseenter', () => {
            logo.style.transform = 'scale(1.05) rotate(2deg)';
            logo.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
        
        logo.addEventListener('mouseleave', () => {
            logo.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    console.log('✨ Dynamic skills and interactions initialized!');
}

// Force project logos to display correctly with enhanced reliability - FOOLPROOF VERSION
function forceLogoDisplay() {
    // Force mini project logos to display with strict constraints
    const miniLogos = document.querySelectorAll('.project-logo-mini');
    miniLogos.forEach(logo => {
        logo.style.cssText = `
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: relative !important;
            width: 48px !important;
            height: 48px !important;
            align-items: center !important;
            justify-content: center !important;
            overflow: hidden !important;
            flex-shrink: 0 !important;
        `;
    });
    
    // Force featured project logos to display WITHOUT overlay interference
    const featuredLogos = document.querySelectorAll('.project-logo-container .project-logo');
    featuredLogos.forEach(logo => {
        logo.style.cssText = `
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: relative !important;
            z-index: 10 !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 16px !important;
        `;
        
        // Ensure all children are visible
        const children = logo.querySelectorAll('*');
        children.forEach(child => {
            child.style.visibility = 'visible';
            child.style.opacity = '1';
            if (child.tagName !== 'STYLE') {
                child.style.display = child.style.display || 'block';
            }
        });
    });
    
    // Force overlays to be properly configured (hidden by default)
    const overlays = document.querySelectorAll('.project-overlay');
    overlays.forEach(overlay => {
        overlay.style.cssText = `
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: rgba(0, 0, 0, 0.85) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            opacity: 0 !important;
            visibility: hidden !important;
            transition: all 0.3s ease !important;
            z-index: 100 !important;
            pointer-events: none !important;
            border-radius: 12px !important;
        `;
    });
    
    // Force all logo icons and animations to display
    const logoElements = [
        '.logo-icon', '.logo-text', '.logo-title', '.logo-subtitle',
        '.chart-bars', '.bar', '.shield-icon', '.automation-icon', 
        '.slack-icon', '.nps-icon', '.sales-icon', '.co2-icon', '.ml-icon'
    ];
    
    logoElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.style.visibility = 'visible';
            element.style.opacity = '1';
            if (element.tagName !== 'STYLE') {
                element.style.display = element.style.display || 'block';
            }
        });
    });
    
    // Specifically fix featured project logo containers
    const containers = document.querySelectorAll('.project-logo-container');
    containers.forEach(container => {
        container.style.cssText = `
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            position: relative !important;
            width: 100% !important;
            height: 200px !important;
            background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%) !important;
            border-radius: 12px !important;
            border: 1px solid #e2e8f0 !important;
            overflow: visible !important;
        `;
    });
    
    // Fix specific mini logo icon containers
    const iconContainers = document.querySelectorAll(
        '.sales-icon, .ml-icon, .slack-icon, .nps-icon, .co2-icon'
    );
    iconContainers.forEach(icon => {
        icon.style.cssText = `
            width: 36px !important;
            height: 36px !important;
            position: relative !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            overflow: hidden !important;
        `;
    });
    
    console.log(`🎨 FOOLPROOF logo display: ${miniLogos.length} mini + ${featuredLogos.length} featured + ${containers.length} containers`);
}

// Enhanced logo initialization with fallback detection
function initializeEnhancedLogos() {
    // Wait for fonts and styles to load
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            setTimeout(() => {
                forceLogoDisplay();
                verifyLogoDisplay();
            }, 100);
        });
    } else {
        setTimeout(() => {
            forceLogoDisplay();
            verifyLogoDisplay();
        }, 500);
    }
    
    // Multiple attempts to ensure logos load
    const attempts = [1000, 2000, 3000, 5000];
    attempts.forEach(delay => {
        setTimeout(() => {
            forceLogoDisplay();
            verifyLogoDisplay();
        }, delay);
    });
}

// Verify that logos are actually displaying correctly
function verifyLogoDisplay() {
    const featuredLogos = document.querySelectorAll('.project-logo-container .project-logo');
    let invisibleCount = 0;
    
    featuredLogos.forEach((logo, index) => {
        const rect = logo.getBoundingClientRect();
        const computed = window.getComputedStyle(logo);
        
        if (rect.width === 0 || rect.height === 0 || computed.visibility === 'hidden' || computed.opacity === '0') {
            invisibleCount++;
            console.warn(`Logo ${index + 1} is not displaying correctly, applying emergency fix...`);
            applyEmergencyLogoFix(logo, index);
        }
    });
    
    if (invisibleCount === 0) {
        console.log('✅ All featured logos verified as visible');
    } else {
        console.log(`⚠️ ${invisibleCount} logos needed emergency fixes`);
    }
}

// Emergency fallback for logos that aren't displaying - ENHANCED
function applyEmergencyLogoFix(logoContainer, index) {
    const logoNames = ['Budget Analytics', 'Salary Security', 'LinkedIn Automation'];
    const logoColors = ['#3b82f6', '#16a34a', '#f59e0b'];
    
    if (logoContainer && index < logoNames.length) {
        // Only apply if logo isn't actually visible
        const rect = logoContainer.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            // Logo seems to be visible, just ensure it's properly displayed
            forceLogoDisplay();
            return;
        }
        
        // Clear existing content and create simple fallback
        logoContainer.innerHTML = `
            <div class="emergency-logo-fallback">
                <div class="emergency-logo-icon" style="background: ${logoColors[index]};">
                    ${logoNames[index].charAt(0)}${logoNames[index].split(' ')[1]?.charAt(0) || ''}
                </div>
                <div class="emergency-logo-text">
                    ${logoNames[index]}
                </div>
            </div>
        `;
        
        logoContainer.style.cssText = `
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: relative !important;
            z-index: 15 !important;
            width: 100% !important;
            height: 200px !important;
        `;
        
        console.log(`🔧 Applied emergency fallback for logo: ${logoNames[index]}`);
    }
}

// Add logo hover event handlers for better overlay control
function initializeLogoHoverControls() {
    const containers = document.querySelectorAll('.project-logo-container');
    containers.forEach(container => {
        const overlay = container.querySelector('.project-overlay');
        if (overlay) {
            container.addEventListener('mouseenter', () => {
                overlay.style.opacity = '1';
                overlay.style.visibility = 'visible';
                overlay.style.pointerEvents = 'auto';
            });
            
            container.addEventListener('mouseleave', () => {
                overlay.style.opacity = '0';
                overlay.style.visibility = 'hidden';
                overlay.style.pointerEvents = 'none';
            });
        }
    });
    
    console.log(`🎯 Initialized hover controls for ${containers.length} project containers`);
}

// Initialize logo display when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeEnhancedLogos(); // Use enhanced logo initialization
});

// Console log for development
console.log('🚀 Portfolio loaded successfully!');
console.log('📧 Contact: Aaqil9365@gmail.com');
console.log('🔗 LinkedIn: https://www.linkedin.com/in/aaqilshiraz/');
console.log('💻 GitHub: https://aaqil1.github.io/');
console.log('✨ Professional dynamic effects active!');