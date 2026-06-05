document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const navbar = document.querySelector('.navbar');
    const menuButton = document.querySelector('.mobile-menu-icon');
    const navLinks = document.querySelector('.nav-links');

    const closeMenu = () => {
        if (!menuButton || !navLinks) return;
        menuButton.classList.remove('active');
        navLinks.classList.remove('active');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation menu');
        body.classList.remove('no-scroll');
    };

    if (menuButton && navLinks) {
        menuButton.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            menuButton.classList.toggle('active', isOpen);
            menuButton.setAttribute('aria-expanded', String(isOpen));
            menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
            body.classList.toggle('no-scroll', isOpen);
        });

        navLinks.addEventListener('click', (event) => {
            if (event.target.closest('a')) closeMenu();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeMenu();
        });
    }

    if (navbar) {
        const updateNavbar = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 24);
        };
        updateNavbar();
        window.addEventListener('scroll', updateNavbar, { passive: true });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            closeMenu();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    const today = new Date();
    const timezoneOffset = today.getTimezoneOffset() * 60000;
    const todayValue = new Date(today - timezoneOffset).toISOString().split('T')[0];
    const checkin = document.getElementById('checkin');
    const checkout = document.getElementById('checkout');

    if (checkin) checkin.min = todayValue;
    if (checkout) checkout.min = todayValue;

    if (checkin && checkout) {
        checkin.addEventListener('change', () => {
            checkout.min = checkin.value || todayValue;
            if (checkout.value && checkout.value < checkout.min) {
                checkout.value = checkout.min;
            }
        });
    }

    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!bookingForm.checkValidity()) {
                bookingForm.reportValidity();
                return;
            }

            const formData = new FormData(bookingForm);
            const message = [
                'Hello Mt Kenya Gatepark Hotel, I would like to check availability.',
                `Check-in: ${formData.get('checkin')}`,
                `Check-out: ${formData.get('checkout')}`,
                `Guests: ${formData.get('guests')}`,
                `Room type: ${formData.get('room-type')}`
            ].join('\n');

            const status = document.getElementById('booking-status');
            if (status) status.textContent = 'Opening WhatsApp with your booking request...';
            window.open(`https://wa.me/254722276712?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
        });
    }

    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            const formData = new FormData(contactForm);
            const subject = encodeURIComponent(formData.get('subject') || 'Website enquiry');
            const bodyText = encodeURIComponent([
                `Name: ${formData.get('name')}`,
                `Email: ${formData.get('email')}`,
                '',
                formData.get('message')
            ].join('\n'));

            const status = document.getElementById('contact-status');
            if (status) status.textContent = 'Opening your email app to send the message...';
            window.location.href = `mailto:mtkenyagatepark@gmail.com?subject=${subject}&body=${bodyText}`;
        });
    }

    document.querySelectorAll('.footer-newsletter-form, .newsletter-form').forEach((form) => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const status = form.querySelector('.form-status');
            if (status) status.textContent = 'Thank you. You are on the update list.';
            form.reset();
        });
    });

    const revealElements = document.querySelectorAll('.reveal, section');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        });

        revealElements.forEach((element) => observer.observe(element));
    } else {
        revealElements.forEach((element) => element.classList.add('is-visible'));
    }
});
