document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================
       Mobile Navigation Toggle
       ========================================== */
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        // Animate hamburger to X (optional simple toggle)
        const spans = hamburger.querySelectorAll('span');
        if (mobileMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    /* ==========================================
       Navbar Scroll Effect
       ========================================== */
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            navbar.style.padding = '5px 0';
        } else {
            navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
            navbar.style.padding = '0';
        }
    });

    /* ==========================================
       Image Modal Logic
       ========================================== */
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const closeBtn = document.querySelector('.close-modal');

    // Attach to global window object so onclick attributes work
    window.openModal = function(imageSrc) {
        modal.style.display = 'block';
        modalImg.src = imageSrc;
        document.body.style.overflow = 'hidden'; // Prevent scrolling under modal
    };

    window.pendingAction = null;

    function ungatePlans() {
        document.querySelectorAll('.gated-plan').forEach(el => {
            el.classList.remove('gated-plan');
        });
    }

    // Ungate immediately on load if already submitted
    if (localStorage.getItem('enquirySubmitted') === 'true') {
        ungatePlans();
    }

    window.handleGatedAction = function(actionType, url) {
        if (localStorage.getItem('enquirySubmitted') === 'true') {
            executeAction(actionType, url);
        } else {
            window.pendingAction = { type: actionType, url: url };
            const popupModal = document.getElementById('popupModal');
            if (popupModal) {
                popupModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        }
    };

    function executeAction(type, url) {
        if (type === 'image') {
            window.openModal(url);
        } else if (type === 'download') {
            const link = document.createElement('a');
            link.href = url;
            link.download = '';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close on click outside image
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    /* ==========================================
       Google Sheets Form Submission & Validation
       ========================================== */
    // IMPORTANT: Replace this URL with your Google Apps Script Web App URL
    const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE'; 

    function setupForm(formId, submitBtnId, messageId, prefix = '') {
        const form = document.getElementById(formId);
        if (!form) return;
        const submitBtn = document.getElementById(submitBtnId);
        const formMessage = document.getElementById(messageId);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameId = prefix ? prefix + 'Name' : 'name';
            const phoneId = prefix ? prefix + 'Phone' : 'phone';
            const emailId = prefix ? prefix + 'Email' : 'email';
            const consentId = prefix ? prefix + 'Consent' : 'consent';

            const nameEl = document.getElementById(nameId);
            const phoneEl = document.getElementById(phoneId);
            const emailEl = document.getElementById(emailId);
            const consentEl = document.getElementById(consentId);

            if (!nameEl || !phoneEl || !emailEl || !consentEl) return;

            const name = nameEl.value.trim();
            const phone = phoneEl.value.trim();
            const email = emailEl.value.trim();
            const consent = consentEl.checked;

            if (!name || !phone || !email || !consent) {
                formMessage.textContent = 'Please fill out all fields and agree to the Terms.';
                formMessage.className = 'form-message error';
                formMessage.style.display = 'block';
                return;
            }

            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Submitting...</span>';
            submitBtn.disabled = true;
            formMessage.style.display = 'none';

            const formData = new FormData();
            formData.append('name', name);
            formData.append('phone', phone);
            formData.append('email', email);

            const handleSuccess = () => {
                form.reset();
                formMessage.textContent = 'Thank you! Your enquiry has been submitted securely.';
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                // Mark as submitted to stop popups
                localStorage.setItem('enquirySubmitted', 'true');
                
                // Ungate plans visually
                ungatePlans();
                
                // Execute any pending action (e.g. downloading a brochure or viewing a floor plan)
                if (window.pendingAction) {
                    executeAction(window.pendingAction.type, window.pendingAction.url);
                    window.pendingAction = null;
                }
                
                // Close popup if it was the popup form
                const popupModal = document.getElementById('popupModal');
                if (popupModal && popupModal.style.display === 'block') {
                    setTimeout(() => {
                        popupModal.style.display = 'none';
                        // Only restore scrolling if image modal isn't open
                        const imageModal = document.getElementById('imageModal');
                        if (!imageModal || imageModal.style.display !== 'block') {
                            document.body.style.overflow = 'auto';
                        }
                    }, 2000);
                }
            };

            if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
                // Simulate successful form submission if no script URL is provided
                setTimeout(handleSuccess, 1000);
            } else {
                fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors'
                })
                .then(handleSuccess)
                .catch(error => {
                    console.error('Error!', error.message);
                    formMessage.textContent = 'Oops! Something went wrong. Please try again.';
                    formMessage.className = 'form-message error';
                    formMessage.style.display = 'block';
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
            }
        });
    }

    setupForm('enquireForm', 'submitBtn', 'formMessage', '');
    setupForm('popupEnquireForm', 'popupSubmitBtn', 'popupFormMessage', 'popup');

    /* ==========================================
       10-Second Popup Logic
       ========================================== */
    const popupModal = document.getElementById('popupModal');
    const closePopupBtn = document.querySelector('.close-popup');

    if (popupModal && closePopupBtn) {
        closePopupBtn.addEventListener('click', () => {
            popupModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        // Close on click outside
        window.addEventListener('click', (e) => {
            if (e.target == popupModal) {
                popupModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Trigger every 10 seconds until submitted
        setInterval(() => {
            if (localStorage.getItem('enquirySubmitted') !== 'true' && popupModal.style.display !== 'block') {
                popupModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        }, 10000);
    }

    /* ==========================================
       Carousel Navigation & Auto-Scroll
       ========================================== */
    const carousels = document.querySelectorAll('.carousel-wrapper');
    
    carousels.forEach(wrapper => {
        const track = wrapper.querySelector('.carousel-track');
        const prevBtn = wrapper.querySelector('.prev-btn');
        const nextBtn = wrapper.querySelector('.next-btn');
        let autoScrollInterval;

        if (track && prevBtn && nextBtn) {
            const getScrollAmount = () => {
                const item = track.children[0];
                if (item) {
                    const style = window.getComputedStyle(track);
                    const gap = parseFloat(style.gap) || 0;
                    return item.offsetWidth + gap;
                }
                return 300;
            };

            const scrollNext = () => {
                // If at the end, scroll back to start, else scroll next
                if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
                    track.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
                }
            };

            nextBtn.addEventListener('click', () => {
                scrollNext();
                resetAutoScroll();
            });

            prevBtn.addEventListener('click', () => {
                track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
                resetAutoScroll();
            });

            // Auto-scroll logic
            const startAutoScroll = () => {
                autoScrollInterval = setInterval(scrollNext, 3000); // Scroll every 3 seconds
            };

            const resetAutoScroll = () => {
                clearInterval(autoScrollInterval);
                startAutoScroll();
            };

            // Pause on hover or touch
            wrapper.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
            wrapper.addEventListener('mouseleave', startAutoScroll);
            wrapper.addEventListener('touchstart', () => clearInterval(autoScrollInterval));
            wrapper.addEventListener('touchend', startAutoScroll);

            // Start initially
            startAutoScroll();
        }
    });
});
