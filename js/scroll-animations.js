document.addEventListener('DOMContentLoaded', () => {
    // Ensure GSAP and ScrollTrigger are loaded
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        /* ==========================================
           Parallax Hero Effect (Disabled to prevent image cropping/zooming)
           ========================================== */

        /* ==========================================
           Fade Up Reveals
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
                        start: 'top 85%', // trigger when top of element hits 85% down viewport
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

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
