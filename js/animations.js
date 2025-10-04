/**
 * AL FAHD SEAFOOD - GSAP ANIMATIONS
 * High-quality, tasteful, and performance-minded animations.
 */

// This function will be called by main.js after the preloader is hidden
window.startGsapAnimations = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        console.log('Reduced motion enabled. Animations will be disabled.');
        // Set all animated elements to their final, visible state
        gsap.set([
            ".navbar", ".hero-visual", ".hero-image-3d", ".hero-title .title-line",
            ".hero-description", ".hero-buttons .btn", ".product-card", ".feature-card"
        ], {
            opacity: 1, y: 0, x: 0, yPercent: 0, scale: 1
        });
        return;
    }

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, Flip);

    // Initialize all GSAP animations now
    initGlobalAnimations();
    initHeroAnimations();
    initProductAnimations();
    initUIElementAnimations();
    initPageSpecificAnimations();
};


function initGlobalAnimations() {
    // B. Header & Navigation
    // ==================================================
    // Smooth entrance for header on page load
    gsap.from('.navbar', {
        yPercent: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2 // A small delay after preloader
    });

    // Animated mobile menu
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (navToggle && navMenu) {
        const navLinks = navMenu.querySelectorAll('.nav-link');

        gsap.set(navMenu, { autoAlpha: 0, yPercent: -100 });
        gsap.set(navLinks, { opacity: 0, y: 20 });

        const menuTimeline = gsap.timeline({ paused: true, reversed: true })
            .to(navMenu, {
                autoAlpha: 1,
                yPercent: 0,
                duration: 0.5,
                ease: 'power3.out'
            })
            .to(navLinks, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.1,
                ease: 'power2.out'
            }, "-=0.3");

        window.toggleMainMenuAnimation = (isOpen) => {
            if (isOpen) {
                menuTimeline.play();
            } else {
                menuTimeline.reverse();
            }
        };
    }

    // G. Footer & Floating Elements
    // ==================================================
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (whatsappFloat) {
        // Bobbing animation
        gsap.to(whatsappFloat, {
            y: -8,
            repeat: -1,
            yoyo: true,
            duration: 1.5,
            ease: 'power1.inOut'
        });

        // Tooltip animation on hover
        const tooltip = whatsappFloat.querySelector('.whatsapp-tooltip');
        if (tooltip) {
            gsap.set(tooltip, { scale: 0.8, opacity: 0, x: 20 });
            whatsappFloat.addEventListener('mouseenter', () => {
                gsap.to(tooltip, {
                    scale: 1,
                    opacity: 1,
                    x: 0,
                    visibility: 'visible',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            whatsappFloat.addEventListener('mouseleave', () => {
                gsap.to(tooltip, {
                    scale: 0.8,
                    opacity: 0,
                    x: 20,
                    duration: 0.2,
                    ease: 'power2.in',
                    onComplete: () => {
                        gsap.set(tooltip, { visibility: 'hidden' });
                    }
                });
            });
        }
    }
}

function initHeroAnimations() {
    // C. Hero / Intro Section (Homepage)
    // ==================================================
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    gsap.to('.hero-background', {
        y: "20%",
        ease: 'none',
        scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5
        }
    });

    const heroTitleLines = gsap.utils.toArray('.hero-title .title-line');
    if (heroTitleLines.length > 0) {
        gsap.from(heroTitleLines, {
            y: 100,
            opacity: 0,
            stagger: 0.2,
            duration: 1.2,
            ease: 'power4.out',
            delay: 0.5
        });
    }

    gsap.from('.hero-description', {
       opacity: 0,
       y: 20,
       duration: 1,
       ease: 'power3.out',
       delay: 1
    });

    gsap.from('.hero-buttons .btn', {
        opacity: 0,
        y: 20,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
        delay: 1.2
    });

    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        gsap.from(heroVisual, {
            opacity: 0,
            scale: 0.9,
            duration: 1.5,
            ease: 'power3.out',
            delay: 0.8
        });
        const floatTimeline = gsap.timeline({ repeat: -1, yoyo: true, delay: 2.5 });
        floatTimeline.to(heroVisual, {
            y: -15,
            duration: 4,
            ease: 'power1.inOut'
        })
        .to('.hero-image-shadow', {
            scale: 0.85,
            opacity: 0.6,
            duration: 4,
            ease: 'power1.inOut'
        }, "<"); // The "<" syncs the start of this tween with the previous one
    }
}

function initProductAnimations() {
    // D. Product Cards (Products & Home pages)
    // ==================================================
    const productCards = gsap.utils.toArray('.product-card');
    if (productCards.length === 0) return;

    gsap.set(productCards, { opacity: 0, y: 30 });

    ScrollTrigger.batch(productCards, {
        interval: 0.1,
        batchMax: 4,
        onEnter: batch => gsap.to(batch, {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            overwrite: true,
            ease: 'power3.out'
        }),
        onLeaveBack: batch => gsap.set(batch, {
            opacity: 0,
            y: 30,
            overwrite: true
        })
    });

    window.animateProductFilter = (grid) => {
        const cards = gsap.utils.toArray(grid.children);
        const state = Flip.getState(cards);

        Flip.from(state, {
            duration: 0.7,
            scale: true,
            ease: "power2.inOut",
            stagger: 0.08,
            onEnter: elements => gsap.fromTo(elements, {opacity: 0, scale: 0.8}, {opacity: 1, scale: 1, duration: 0.5}),
            onLeave: elements => gsap.to(elements, {opacity: 0, scale: 0.8, duration: 0.5})
        });
    };

    window.animateCartButton = (container) => {
        const state = Flip.getState(container.children);

        Flip.from(state, {
            duration: 0.5,
            ease: "power2.inOut",
            scale: true,
        });
    };
}

function initUIElementAnimations() {
    // E. CTAs, Buttons & Inputs
    // ==================================================
    const buttons = gsap.utils.toArray('.btn-primary, .btn-secondary, .btn-whatsapp, .btn-whatsapp-large, .btn-outline');
    buttons.forEach(btn => {
        const ripple = btn.querySelector('.btn-ripple');
        if (ripple) {
            btn.addEventListener('mouseenter', () => {
                gsap.fromTo(ripple,
                    { scale: 0, opacity: 0.5 },
                    { scale: 3, opacity: 0, duration: 0.6, ease: 'power2.out' }
                );
            });
        }

        gsap.set(btn, { overflow: 'hidden' });
        const shine = document.createElement('div');
        shine.className = 'btn-shine';
        btn.appendChild(shine);

        btn.addEventListener('mouseenter', () => {
            gsap.fromTo(shine, { x: '-110%' }, { x: '110%', duration: 0.8, ease: 'power2.inOut' });
        });
    });

    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;

        const line = document.createElement('div');
        line.className = 'focus-line';
        formGroup.appendChild(line);

        const tl = gsap.timeline({ paused: true });
        tl.fromTo(line,
            { scaleX: 0, transformOrigin: 'left' },
            { scaleX: 1, duration: 0.5, ease: 'power3.out' }
        );

        input.addEventListener('focus', () => tl.play());
        input.addEventListener('blur', () => tl.reverse());
    });

    const successModal = document.getElementById('successModal');
    if (successModal) {
        gsap.set(successModal, { display: 'none' });

        window.animateSuccessModal = (isOpen) => {
            if (isOpen) {
                gsap.to(successModal, {
                    autoAlpha: 1,
                    duration: 0.4,
                    onStart: () => successModal.style.display = 'flex'
                });
                gsap.fromTo('.success-modal .modal-content',
                    { scale: 0.7, opacity: 0, y: 50 },
                    { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
                );
            } else {
                gsap.to(successModal, {
                    autoAlpha: 0,
                    duration: 0.3,
                    onComplete: () => successModal.style.display = 'none'
                });
            }
        };
    }
}

function initPageSpecificAnimations() {
    // Animations for specific pages like About, Contact, etc.
    if (document.querySelector('.story-content')) {
        const storyTrigger = {
            trigger: '.story-content',
            start: 'top 80%',
            toggleActions: 'play none none none'
        };

        gsap.from('.story-visual', {
            scrollTrigger: storyTrigger,
            opacity: 0,
            x: -100,
            duration: 1.2,
            ease: 'power3.out'
        });
         gsap.from('.story-text > *', {
            scrollTrigger: storyTrigger,
            opacity: 0,
            y: 50,
            stagger: 0.2,
            duration: 1,
            ease: 'power3.out'
        });
    }

    if (document.querySelector('.stats-grid')) {
        const counters = gsap.utils.toArray('.stat-number');
        gsap.from(counters, {
            textContent: 0,
            duration: 2,
            ease: "power1.inOut",
            snap: { textContent: 1 },
            stagger: 0.2,
            scrollTrigger: {
                trigger: ".stats-grid",
                start: "top 80%",
                toggleActions: "play none none none",
            }
        });
    }
}