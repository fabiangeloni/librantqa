document.addEventListener("DOMContentLoaded", function() {

    // --- 1. REGISTRAR PLUGINS DE GSAP ---
    gsap.registerPlugin(ScrollTrigger);

    // --- 2. CONFIGURACIÓN DE SCROLL SUAVE (LENIS) + INTEGRACIÓN GSAP ---
    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);


    // --- 3. LÓGICA DE SEGMENTACIÓN (INTERACTIVA) ---
    const cards = document.querySelectorAll(".card");
    const panels = document.querySelectorAll(".content-panel");
    const generalPanel = document.getElementById("general");
    const contentSection = document.querySelector('.content-section');
    let currentActivePanel = generalPanel;

    cards.forEach(card => {
        card.addEventListener("click", () => {
            const targetId = card.dataset.target;
            const targetPanel = document.getElementById(targetId);

            cards.forEach(c => c.classList.remove("active"));
            card.classList.add("active");

            if (targetPanel === currentActivePanel) return;

            gsap.to(currentActivePanel, {
                duration: 0.5,
                height: 0,
                autoAlpha: 0,
                ease: "power3.inOut"
            });

            gsap.fromTo(targetPanel, 
                { height: 0, autoAlpha: 0 },
                { 
                    duration: 0.8,
                    height: "auto",
                    autoAlpha: 1,
                    delay: 0.3,
                    ease: "power3.out"
                }
            );

            currentActivePanel = targetPanel;
            
            lenis.scrollTo(contentSection, {
                offset: -180, 
                duration: 1.2,
                ease: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        });
    });


    // --- 4. ANIMACIONES DE SCROLL (BARRIDO HORIZONTAL + TRIGGER CORREGIDO) ---
    
    // 4.1. Animación General de Carga
    gsap.from('body', { duration: 0.5, autoAlpha: 0, ease: 'power3.out' });
    gsap.from('.main-header', { duration: 1, yPercent: -100, autoAlpha: 0, ease: 'power3.out', delay: 0.1 });
    gsap.from(".hero-content > *", { 
        duration: 1.2,
        y: 30,
        autoAlpha: 0,
        stagger: 0.1, 
        delay: 0.4,
        ease: "power3.out"
    });

    // 4.2. Animación "Weave" (Alternancia Horizontal)
    const sections = gsap.utils.toArray('main > section:not(.hero-section)');

    ScrollTrigger.matchMedia({

        // 1. Configuración para DESKTOP
        "(min-width: 993px)": function() {
            sections.forEach((section, index) => {
                const heading = section.querySelector('h2');
                const subtitle = section.querySelector('.section-subtitle');
                // ¡Animamos los hijos/cards individuales!
                const content = section.querySelectorAll('.splide, .card, .content-panel#general, .process-card, .service-item, .pre-footer-container > *, .main-footer p');

                const xPercent = (index % 2 === 0) ? -50 : 50;
                
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%', // Lento en desktop
                        toggleActions: 'play none none none'
                    }
                });
                
                if (heading) tl.from(heading, { autoAlpha: 0, xPercent: xPercent, duration: 1.2, ease: 'power3.out' });
                if (subtitle) tl.from(subtitle, { autoAlpha: 0, xPercent: xPercent, duration: 1.2, ease: 'power3.out' }, "-=1.0");
                if (content) tl.from(content, { autoAlpha: 0, xPercent: xPercent, duration: 1.0, stagger: 0.1, ease: 'power3.out' }, "-=0.9");
            });
        },

        // 2. Configuración para MÓVIL
        "(max-width: 992px)": function() {
            sections.forEach((section, index) => {
                const heading = section.querySelector('h2');
                const subtitle = section.querySelector('.section-subtitle');
                const content = section.querySelectorAll('.splide, .card, .content-panel#general, .process-card, .service-item, .pre-footer-container > *, .main-footer p');
                
                const xPercent = (index % 2 === 0) ? -30 : 30; // Animación horizontal más sutil

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        // --- ¡ESTE ES EL ARREGLO! ---
                        // "Inicia cuando el TOP de la sección esté 10% por ENCIMA del BOTTOM de la pantalla"
                        start: 'top bottom-=10%', 
                        toggleActions: 'play none none none'
                    }
                });

                // Animación más rápida para móvil
                if (heading) tl.from(heading, { autoAlpha: 0, xPercent: xPercent, duration: 0.8, ease: 'power3.out' });
                if (subtitle) tl.from(subtitle, { autoAlpha: 0, xPercent: xPercent, duration: 0.8, ease: 'power3.out' }, "-=0.7");
                if (content) tl.from(content, { autoAlpha: 0, xPercent: xPercent, duration: 0.8, stagger: 0.05, ease: 'power3.out' }, "-=0.7");
            });
        }
    });

    
    // --- 5. SLIDER DE TESTIMONIOS (Splide.js) ---
    if (typeof Splide !== 'undefined') {
        new Splide('#testimonial-slider', {
            type   : 'loop',
            perPage: 2,
            perMove: 1,
            gap    : '30px',
            pagination: true,
            arrows: true,
            breakpoints: {
                992: { perPage: 1 },
                600: { perPage: 1, arrows: false }
            }
        }).mount();
    }

    // --- 6. NAVEGACIÓN MÓVIL ---
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.main-nav a');
    const body = document.body;

    function openMenu() {
        navToggle.classList.add('is-active');
        mainNav.classList.add('is-active');
        navOverlay.classList.add('is-active');
        body.classList.add('nav-active');
        navToggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        navToggle.classList.remove('is-active');
        mainNav.classList.remove('is-active');
        navOverlay.classList.remove('is-active');
        body.classList.remove('nav-active');
        navToggle.setAttribute('aria-expanded', 'false');
    }

    navToggle.addEventListener('click', () => {
        if (mainNav.classList.contains('is-active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    navOverlay.addEventListener('click', closeMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

});