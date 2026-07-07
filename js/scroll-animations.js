document.addEventListener('DOMContentLoaded', () => {
    // Ensure GSAP and ScrollTrigger are loaded
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        /* ==========================================
           Cinematic Hero Load
           ========================================== */
        gsap.fromTo('.hero-bg img', 
            { scale: 1.15, filter: 'brightness(0.5)' }, 
            { scale: 1, filter: 'brightness(1)', duration: 3, ease: 'power2.out' }
        );
        gsap.fromTo('.hero-content > *', 
            { y: 30, autoAlpha: 0 }, 
            { y: 0, autoAlpha: 1, stagger: 0.2, duration: 1.5, ease: 'power3.out', delay: 0.5 }
        );

        /* ==========================================
           Fade Up Reveals & Staggers
           ========================================== */
        const revealElements = document.querySelectorAll('.gs-reveal');
        
        revealElements.forEach((el) => {
            gsap.fromTo(el, 
                { autoAlpha: 0, y: 50 },
                {
                    duration: 1,
                    autoAlpha: 1,
                    y: 0,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        /* ==========================================
           Cinematic Mask Reveals
           ========================================== */
        const maskElements = document.querySelectorAll('.gs-mask');
        maskElements.forEach(el => {
            gsap.to(el.querySelector('.mask-overlay'), {
                width: '0%',
                duration: 1.5,
                ease: 'power4.inOut',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
            gsap.fromTo(el.querySelector('img'), 
                { scale: 1.1 }, 
                { scale: 1, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 80%' } }
            );
        });

        /* ==========================================
           Staggered Typography & Grid Reveals
           ========================================== */
        const staggerContainers = document.querySelectorAll('.gs-stagger');
        staggerContainers.forEach(container => {
            gsap.fromTo(container.querySelectorAll('.stagger-text'), 
                { y: 30, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, stagger: 0.15, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: container, start: 'top 85%' } }
            );
        });

        gsap.fromTo('.stagger-amenity', 
            { y: 50, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.amenities-grid', start: 'top 80%' } }
        );

        /* ==========================================
           3D Tilt Hover Effect
           ========================================== */
        // For a true 3D interactive feel on desktop
        const tiltElements = document.querySelectorAll('.3d-tilt');

        tiltElements.forEach(element => {
            // Only apply hover 3D on non-touch devices
            if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
                element.addEventListener('mousemove', (e) => {
                    const rect = element.getBoundingClientRect();
                    
                    // Calculate mouse position relative to element center (-1 to 1)
                    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
                    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
                    
                    // Maximum rotation degrees
                    const maxRotation = 10; 
                    
                    // Calculate rotation (invert y for natural tilt)
                    const rotX = -y * maxRotation;
                    const rotY = x * maxRotation;

                    gsap.to(element, {
                        duration: 0.1, // Significantly faster for snappy tracking
                        rotationX: rotX,
                        rotationY: rotY,
                        transformPerspective: 1000,
                        ease: 'none' // Direct tracking feels better without easing
                    });
                });

                element.addEventListener('mouseleave', () => {
                    // Reset on mouse leave
                    gsap.to(element, {
                        duration: 0.8,
                        rotationX: 0,
                        rotationY: 0,
                        ease: 'elastic.out(1, 0.3)'
                    });
                });
            }
        });

    } else {
        console.warn('GSAP or ScrollTrigger not loaded.');
    }
});
