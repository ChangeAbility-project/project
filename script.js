/**
 * ChangeAbility Website - Main JavaScript File
 * ============================================
 * Funktionen:
 * - Mobile Navigation Toggle
 * - Smooth Scrolling
 * - Form Handling
 * - Notifications
 * - Intersection Observer für Animationen
 */

// ============================================
// 1. MOBILE NAVIGATION TOGGLE
// ============================================

/**
 * Initialisiert das Mobile Menu Toggle
 * Macht die Navigation auf mobilen Geräten benutzbar
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (!menuToggle) return;

    // Menu Toggle Listener
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Menü schließen wenn Link geklickt wird
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Menü schließen bei Außenklick
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ============================================
// 2. SMOOTH SCROLLING FÜR INTERNE LINKS
// ============================================

/**
 * Fügt Smooth Scrolling zu internen Links hinzu
 * Verbessert die UX bei Navigation
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Verhindere default nur bei internen Links
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// ============================================
// 3. FORM HANDLING
// ============================================

/**
 * Initialisiert Contact Form
 * Behandelt Formular-Submission mit Validierung
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Form Daten sammeln
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        // Basis-Validierung
        if (!data.name || !data.email || !data.message) {
            showNotification('Bitte fülle alle Felder aus!', 'error');
            return;
        }

        // Email-Validierung
        if (!isValidEmail(data.email)) {
            showNotification('Bitte gib eine gültige E-Mail ein!', 'error');
            return;
        }

        // Erfolg Nachricht
        showNotification('Danke für deine Nachricht! Wir kontaktieren dich bald.', 'success');
        
        // Form zurücksetzen
        this.reset();

        // Hinweis: In einer echten Anwendung würde hier
        // eine Anfrage an den Server gesendet
        console.log('Formulardaten:', data);
    });
}

/**
 * Validiert eine E-Mail-Adresse
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ============================================
// 4. NOTIFICATION SYSTEM
// ============================================

/**
 * Zeigt eine Benachrichtigung an
 * @param {string} message - Nachrichtentext
 * @param {string} type - 'success' oder 'error'
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    
    // Styles basierend auf Type
    const bgColor = type === 'success' ? '#2ecc71' : '#e74c3c';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${bgColor};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-weight: 500;
        font-size: 14px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);

    // Auto-entfernen nach 3 Sekunden
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// 5. INTERSECTION OBSERVER FÜR ANIMATIONEN
// ============================================

/**
 * Initialisiert Intersection Observer
 * Animiert Elemente wenn sie in den Viewport kommen
 */
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Element wird sichtbar
                entry.target.style.opacity = '1';
                entry.target.style.animation = 'slideInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Beobachte alle Cards
    document.querySelectorAll('.project-card, .impact-item').forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });
}

// ============================================
// 6. BUTTON INTERACTIONS
// ============================================

/**
 * Initialisiert Button Interaktionen
 */
function initButtons() {
    const heroBtn = document.getElementById('heroBtn');
    
    if (heroBtn) {
        heroBtn.addEventListener('click', function() {
            // Scrolle zu Projekte Section
            const projektSection = document.getElementById('projekte');
            if (projektSection) {
                projektSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// ============================================
// 7. DYNAMISCHE ANIMATIONEN IN CSS HINZUFÜGEN
// ============================================

/**
 * Fügt Animations-Keyframes zum Document hinzu
 */
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(30px);
            }
        }

        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Responsive hidden für mobile */
        @media (max-width: 480px) {
            .nav-menu {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// 8. MAIN INITIALIZATION
// ============================================

/**
 * DOMContentLoaded Event
 * Initialisiert alle Funktionen wenn das DOM bereit ist
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('ChangeAbility Website - Initialisierung gestartet');

    // Alle Funktionen aufrufen
    addAnimationStyles();
    initMobileMenu();
    initSmoothScroll();
    initContactForm();
    initIntersectionObserver();
    initButtons();

    console.log('✓ Alle Komponenten erfolgreich initialisiert');
});

// ============================================
// 9. UTILITY FUNCTIONS
// ============================================

/**
 * Prüft ob Gerät mobile ist
 */
function isMobileDevice() {
    return window.innerWidth <= 768;
}

/**
 * Scrollt zu einem Element
 */
function scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}
