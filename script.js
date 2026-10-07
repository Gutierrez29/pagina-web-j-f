/**
 * Inversiones y Representaciones J&F Hrnos S.A.C.
 * Scripts principales - Modular, accesible y optimizado
 */
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        initHeaderScroll();
        initMobileMenu();
        initHeroSlider();
        initRevealAnimations();
        initFaqAccordion();
        initEmailDeobfuscation();
    });

    /**
     * 1. Header con sombra dinámica al scrollear
     */
    function initHeaderScroll() {
        const header = document.querySelector('.header');
        if (!header) return;

        const handleScroll = () => {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    /**
     * 2. Menú de navegación móvil accesible (a11y)
     */
    function initMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const navbar = document.querySelector('.navbar');
        if (!mobileMenu || !navbar) return;

        const navLinks = navbar.querySelectorAll('a');

        const toggleMenu = (forceClose = false) => {
            const shouldOpen = forceClose ? false : !navbar.classList.contains('active');
            navbar.classList.toggle('active', shouldOpen);
            mobileMenu.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
        };

        mobileMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Cerrar menú al hacer clic en enlaces de navegación
        navLinks.forEach(link => {
            link.addEventListener('click', () => toggleMenu(true));
        });

        // Cerrar con la tecla Escape para accesibilidad
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navbar.classList.contains('active')) {
                toggleMenu(true);
                mobileMenu.focus();
            }
        });

        // Cerrar al hacer clic fuera del menú
        document.addEventListener('click', (e) => {
            if (navbar.classList.contains('active') && !navbar.contains(e.target) && e.target !== mobileMenu) {
                toggleMenu(true);
            }
        });
    }

    /**
     * 3. Carrusel Hero interactivo y táctil con soporte Swipe
     */
    function initHeroSlider() {
        const sliderContainer = document.querySelector('.hero-slider');
        const slides = document.querySelectorAll('.hero-slider .slide');
        const prevBtn = document.getElementById('slider-prev');
        const nextBtn = document.getElementById('slider-next');

        if (!sliderContainer || slides.length === 0) return;

        let currentSlide = 0;
        const totalSlides = slides.length;
        let slideTimer = null;
        let isPaused = false;

        const updateSlideAria = () => {
            slides.forEach((slide, idx) => {
                const isActive = idx === currentSlide;
                slide.classList.toggle('active', isActive);
                slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
            });
        };

        const showSlide = (index) => {
            if (index >= totalSlides) {
                currentSlide = 0;
            } else if (index < 0) {
                currentSlide = totalSlides - 1;
            } else {
                currentSlide = index;
            }
            updateSlideAria();
        };

        const nextSlide = () => showSlide(currentSlide + 1);
        const prevSlide = () => showSlide(currentSlide - 1);

        const startAutoPlay = () => {
            stopAutoPlay();
            slideTimer = setInterval(() => {
                if (!isPaused) nextSlide();
            }, 5500);
        };

        const stopAutoPlay = () => {
            if (slideTimer) {
                clearInterval(slideTimer);
                slideTimer = null;
            }
        };

        const restartTimer = () => {
            stopAutoPlay();
            startAutoPlay();
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                restartTimer();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                restartTimer();
            });
        }

        // Pausa en hover y reanudación
        sliderContainer.addEventListener('mouseenter', () => { isPaused = true; });
        sliderContainer.addEventListener('mouseleave', () => { isPaused = false; });

        // Soporte para gestos táctiles (Swipe)
        let touchStartX = 0;
        let touchEndX = 0;

        sliderContainer.addEventListener('touchstart', (e) => {
            isPaused = true;
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderContainer.addEventListener('touchend', (e) => {
            isPaused = false;
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            restartTimer();
        }, { passive: true });

        const handleSwipe = () => {
            const threshold = 40;
            const diff = touchStartX - touchEndX;
            if (diff > threshold) {
                nextSlide();
            } else if (diff < -threshold) {
                prevSlide();
            }
        };

        // Inicializar estado ARIA inicial y ciclo automático
        updateSlideAria();
        startAutoPlay();
    }

    /**
     * 4. Animaciones de revelado y contadores con IntersectionObserver
     */
    function initRevealAnimations() {
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        if (revealElements.length === 0) return;

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    if (entry.target.classList.contains('count-up')) {
                        animateNumber(entry.target);
                    }
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    function animateNumber(element) {
        const target = parseInt(element.getAttribute('data-target'), 10);
        if (isNaN(target)) return;

        const suffix = element.getAttribute('data-suffix') || '';
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out quad
            const easeProgress = progress * (2 - progress);
            const currentCount = Math.floor(easeProgress * target);

            element.textContent = `+${currentCount}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = `+${target}${suffix}`;
            }
        }

        requestAnimationFrame(update);
    }

    /**
     * 5. Acordeón accesible de Preguntas Frecuentes (FAQ)
     */
    function initFaqAccordion() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        if (faqQuestions.length === 0) return;

        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const isActive = question.classList.contains('active');
                const answer = question.nextElementSibling;

                // Cerrar cualquier otra pregunta abierta
                faqQuestions.forEach(otherQuestion => {
                    if (otherQuestion !== question && otherQuestion.classList.contains('active')) {
                        otherQuestion.classList.remove('active');
                        otherQuestion.setAttribute('aria-expanded', 'false');
                        if (otherQuestion.nextElementSibling) {
                            otherQuestion.nextElementSibling.style.maxHeight = null;
                        }
                    }
                });

                // Alternar estado actual
                question.classList.toggle('active', !isActive);
                question.setAttribute('aria-expanded', !isActive ? 'true' : 'false');

                if (answer) {
                    answer.style.maxHeight = !isActive ? `${answer.scrollHeight}px` : null;
                }
            });
        });
    }

    /**
     * 6. Desofuscación segura de correos electrónicos
     */
    function initEmailDeobfuscation() {
        const emailElements = document.querySelectorAll('.obfuscated-email');
        emailElements.forEach(el => {
            const user = el.getAttribute('data-user');
            const domain = el.getAttribute('data-domain');
            if (user && domain) {
                const email = `${user}@${domain}`;
                el.innerHTML = `<a href="mailto:${email}">${email}</a>`;
            }
        });
    }
})();