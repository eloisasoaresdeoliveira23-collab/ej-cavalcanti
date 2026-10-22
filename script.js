document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. GERENCIAMENTO DE CONSENTIMENTO E TRACKING
    // ==========================================
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    // Verifica consentimento
    if (!localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('show'), 1000);
    }

    acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBanner.classList.remove('show');
        // Aqui você dispararia o GTM/GA4 real
        console.log('Consentimento aceito. Tags de rastreamento ativadas.');
    });

    // Função de rastreamento segura
    window.trackEvent = function(action, label) {
        const consent = localStorage.getItem('cookieConsent');
        if (consent === 'accepted') {
            // Exemplo: gtag('event', action, { event_label: label });
            console.log(`[TRACK] Evento: ${action} | Label: ${label}`);
        }
    };

    // ==========================================
    // 2. HEADER GLASSMORPHISM NO SCROLL
    // ==========================================
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ==========================================
    // 3. MENU MOBILE
    // ==========================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isExpanded = navMenu.classList.contains('active');
        mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // ==========================================
    // 4. SCROLL REVEAL (Intersection Observer)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Anima apenas uma vez
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // 5. FAQ ACCORDION
    // ==========================================
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            const content = header.nextElementSibling;

            // Fecha todos os outros (opcional, remova se quiser múltiplos abertos)
            document.querySelectorAll('.accordion-header').forEach(h => {
                h.setAttribute('aria-expanded', 'false');
                h.nextElementSibling.style.maxHeight = null;
            });

            if (!isExpanded) {
                header.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // ==========================================
    // 6. FORMULÁRIO: RASCUNHO NO LOCALSTORAGE
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const formInputs = contactForm.querySelectorAll('input, select, textarea');

    // Carregar rascunho
    formInputs.forEach(input => {
        const savedValue = localStorage.getItem(`form_draft_${input.name}`);
        if (savedValue) input.value = savedValue;

        // Salvar ao digitar
        input.addEventListener('input', (e) => {
            localStorage.setItem(`form_draft_${e.target.name}`, e.target.value);
        });
    });

    // Limpar rascunho ao enviar com sucesso
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulação de envio
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        btn.innerText = 'Enviando...';
        btn.disabled = true;

        setTimeout(() => {
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            contactForm.reset();
            formInputs.forEach(input => localStorage.removeItem(`form_draft_${input.name}`));
            btn.innerText = originalText;
            btn.disabled = false;
            trackEvent('submit', 'form_contato');
        }, 1500);
    });

    // ==========================================
    // 7. WHATSAPP CONTEXTUAL
    // ==========================================
    const whatsappFloat = document.getElementById('whatsapp-float');
    const tooltip = whatsappFloat.querySelector('.whatsapp-tooltip');
    
    // Mensagem muda baseada na seção visível ou horário
    const updateWhatsappMessage = () => {
        const hour = new Date().getHours();
        let greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
        
        // Verifica se o usuário rolou até os serviços
        const servicosSection = document.getElementById('servicos');
        const rect = servicosSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            tooltip.textContent = `${greeting}! Quer agendar um serviço?`;
        } else {
            tooltip.textContent = `${greeting}! Podemos ajudar?`;
        }
    };

    window.addEventListener('scroll', updateWhatsappMessage);
    updateWhatsappMessage(); // Executa no load
});