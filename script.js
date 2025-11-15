document.addEventListener("DOMContentLoaded", function() {

    // --- 1. REGISTRAR PLUGINS DE GSAP ---
    gsap.registerPlugin(ScrollTrigger);

    // --- 2. CONFIGURACIÓN DE SCROLL SUAVE (LENIS) + INTEGRACIÓN GSAP ---
    
    // 2.1. Configura Lenis
    const lenis = new Lenis();

    // 2.2. Conecta Lenis con ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // 2.3. Sincroniza el "ticker" (reloj) de GSAP con Lenis
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000); // Lenis usa milisegundos
    });
    gsap.ticker.lagSmoothing(0);


    // --- 3. LÓGICA DE SEGMENTACIÓN (INTERACTIVA) ---
    const cards = document.querySelectorAll(".card");
    const panels = document.querySelectorAll(".content-panel");
    const generalPanel = document.getElementById("general");

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
        });
    });


    // --- 4. ANIMACIONES DE SCROLL (GSAP) ---
    
    // 4.1. Animación del Hero (al cargar)
    gsap.from(".hero-content", {
        duration: 1,
        y: 40,
        autoAlpha: 0,
        delay: 0.2,
        ease: "power3.out"
    });

    // 4.2. Animación de las Cards (al scrollear)
    gsap.from(".card", {
        duration: 0.8,
        y: 30,
        autoAlpha: 0,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".cards-container",
            start: "top 85%",
            toggleActions: "play none none none"
        }
    });

    // 4.3. Animación genérica de Secciones (¡INCLUYE EL FOOTER!)
    const sections = gsap.utils.toArray('.gsap-fade-in');
    
    sections.forEach(section => {
        gsap.from(section, {
            autoAlpha: 0,
            y: 40,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    
    // --- 5. SLIDER DE TESTIMONIOS (Splide.js) ---
    if (typeof Splide !== 'undefined') {
        new Splide('#testimonial-slider', {
            type   : 'loop',    // El carrusel es infinito
            perPage: 2,       // 2 slides en desktop
            perMove: 1,
            gap    : '30px',  // Espacio entre slides
            pagination: true, // Muestra los puntitos
            arrows: true,   // Muestra las flechas
            breakpoints: {
                992: { // Tablet
                    perPage: 1,
                },
                600: { // Móvil
                    perPage: 1,
                    arrows: false, // Ocultar flechas en móvil
                }
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