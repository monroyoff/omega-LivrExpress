/**
 * OMEGA LivrExpress - JavaScript Interactivity
 * High-performance, clean vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initPriceCalculator();
    initFaqAccordion();
    initScrollEffects();
});

/* ===================================================================
   1. NAVIGATION & MOBILE MENU
   =================================================================== */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const openCalcBtn = document.getElementById('openCalcBtn');

    // Sticky shadow on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Hamburger Toggle
    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            hamburgerBtn.classList.toggle('active', isOpen);
            hamburgerBtn.setAttribute('aria-expanded', isOpen.toString());
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                hamburgerBtn.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // Scroll directly to calculator
    if (openCalcBtn) {
        openCalcBtn.addEventListener('click', () => {
            const simSection = document.getElementById('simulateur');
            if (simSection) {
                simSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section[id], header[id], footer[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
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

/* ===================================================================
   2. INTERACTIVE PRICE CALCULATOR & WHATSAPP GENERATOR
   =================================================================== */
function initPriceCalculator() {
    const pickupZone = document.getElementById('pickupZone');
    const dropoffZone = document.getElementById('dropoffZone');
    const packageType = document.getElementById('packageType');
    const calculatedPrice = document.getElementById('calculatedPrice');
    const calculatedTime = document.getElementById('calculatedTime');
    const sendOrderBtn = document.getElementById('sendCalculatedOrder');

    if (!pickupZone || !dropoffZone || !calculatedPrice) return;

    function computeEstimate() {
        const pickup = pickupZone.value;
        const dropoff = dropoffZone.value;
        const pkg = packageType ? packageType.value : 'pli';

        let basePrice = 700;
        let timeMinutes = '15 à 25 minutes';

        // Distance / Zone matrix
        if (pickup === 'intra' && dropoff === 'intra') {
            basePrice = 700;
            timeMinutes = '15 à 25 minutes';
        } else if ((pickup === 'intra' && dropoff === 'peripherie') || (pickup === 'peripherie' && dropoff === 'intra')) {
            basePrice = 1200;
            timeMinutes = '25 à 35 minutes';
        } else if (pickup === 'peripherie' && dropoff === 'peripherie') {
            basePrice = 1500;
            timeMinutes = '30 à 45 minutes';
        } else if (pickup === 'inter' || dropoff === 'inter') {
            basePrice = 2500;
            timeMinutes = '45 à 60 minutes';
        } else if (pickup === 'inter_lointain' || dropoff === 'inter_lointain') {
            basePrice = 4000;
            timeMinutes = '60 à 90 minutes';
        }

        // Package type adjustments
        if (pkg === 'repas') {
            // Keep accessible, standard flat rate
            basePrice += 0;
        } else if (pkg === 'colis_moyen') {
            basePrice += 300;
        } else if (pkg === 'colis_lourd') {
            basePrice += 800;
        }

        // Format to Beninese FCFA (with spaces)
        calculatedPrice.textContent = basePrice.toLocaleString('fr-FR') + ' FCFA';
        if (calculatedTime) {
            calculatedTime.textContent = `⏱️ Estimé en ~${timeMinutes}`;
        }

        return {
            price: basePrice,
            time: timeMinutes,
            pickupText: pickupZone.options[pickupZone.selectedIndex].text,
            dropoffText: dropoffZone.options[dropoffZone.selectedIndex].text,
            packageText: packageType ? packageType.options[packageType.selectedIndex].text : 'Plis'
        };
    }

    // Trigger update on change
    [pickupZone, dropoffZone, packageType].forEach(el => {
        if (el) el.addEventListener('change', computeEstimate);
    });

    // Initial computation
    computeEstimate();

    // Trigger WhatsApp booking with personalized message
    if (sendOrderBtn) {
        sendOrderBtn.addEventListener('click', () => {
            const data = computeEstimate();
            const message = `Bonjour OMEGA LivrExpress ! 🛵💨\nJe souhaite commander une livraison :\n\n📍 *Départ* : ${data.pickupText}\n🎯 *Destination* : ${data.dropoffText}\n📦 *Type de colis* : ${data.packageText}\n💰 *Estimation* : ${data.price.toLocaleString('fr-FR')} FCFA\n\nPouvez-vous m'envoyer un coursier svp ?`;
            
            const encodedMsg = encodeURIComponent(message);
            const waNumber = '22997001234';
            const waUrl = `https://wa.me/${waNumber}?text=${encodedMsg}`;

            showToast("Redirection vers WhatsApp pour confirmer votre coursier...");
            
            setTimeout(() => {
                window.open(waUrl, '_blank');
            }, 500);
        });
    }
}

/* ===================================================================
   3. FAQ ACCORDION
   =================================================================== */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all others for a neat accordion effect
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                // Toggle current
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

/* ===================================================================
   4. SCROLL REVEAL & MICRO-ANIMATIONS
   =================================================================== */
function initScrollEffects() {
    const animatedElements = document.querySelectorAll('.step-card, .pricing-card, .testimonial-card, .simulator-card');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(24px)';
            el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            observer.observe(el);
        });
    }
}

/* ===================================================================
   5. TOAST NOTIFICATION UTILITY
   =================================================================== */
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}
