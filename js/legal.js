/**
 * Script Modular para la Gestión de Consentimiento de Cookies (RGPD / LSSI-CE)
 * Asociación Familia de Familias
 */

(function () {
    'use strict';

    // Clave para almacenar el consentimiento en localStorage
    const STORAGE_KEY = 'cookieConsent';

    // Estructura por defecto de preferencias
    const defaultConsent = {
        necessary: true,
        analytics: false,
        personalization: false
    };

    // Inicialización al cargar el DOM
    document.addEventListener('DOMContentLoaded', () => {
        // 1. Inyectar el HTML del banner y el modal dinámicamente si no existen
        injectHTML();

        // 2. Obtener elementos del DOM recién creados
        const banner = document.getElementById('cookie-banner');
        const modal = document.getElementById('cookie-modal');
        const btnAcceptAll = document.getElementById('cookie-accept-all');
        const btnRejectAll = document.getElementById('cookie-reject-all');
        const btnOpenSettings = document.getElementById('cookie-open-settings');
        const btnSavePrefs = document.getElementById('cookie-save-preferences');
        const btnCloseModal = document.getElementById('cookie-modal-close-btn');

        const optAnalytics = document.getElementById('cookie-opt-analytics');
        const optPersonalization = document.getElementById('cookie-opt-personalization');

        // 3. Verificar estado actual de consentimiento
        const currentConsent = getConsent();

        if (!currentConsent) {
            // Usuario nuevo: mostrar el banner con animación suave
            setTimeout(() => {
                banner.classList.add('show');
            }, 600);
        } else {
            // Usuario existente: disparar el evento con la configuración guardada
            dispatchConsentEvent(currentConsent);
        }

        // 4. Asignar Event Listeners
        
        // Aceptar todas las cookies
        btnAcceptAll.addEventListener('click', () => {
            const consent = { necessary: true, analytics: true, personalization: true };
            saveConsent(consent);
            hideBanner();
        });

        // Rechazar todas las cookies (solo quedan las necesarias)
        btnRejectAll.addEventListener('click', () => {
            const consent = { necessary: true, analytics: false, personalization: false };
            saveConsent(consent);
            hideBanner();
        });

        // Abrir panel de configuración granular
        btnOpenSettings.addEventListener('click', () => {
            openPreferencesModal();
        });

        // Guardar configuración granular desde el modal
        btnSavePrefs.addEventListener('click', () => {
            const consent = {
                necessary: true,
                analytics: optAnalytics.checked,
                personalization: optPersonalization.checked
            };
            saveConsent(consent);
            closePreferencesModal();
            hideBanner();
        });

        // Cerrar modal
        btnCloseModal.addEventListener('click', closePreferencesModal);
        
        // Cerrar modal haciendo clic fuera de la tarjeta
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closePreferencesModal();
            }
        });

        // Enlace para volver a abrir la configuración desde el Footer
        const openConsentTrigger = document.getElementById('open-cookie-settings');
        if (openConsentTrigger) {
            openConsentTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                openPreferencesModal();
            });
        }

        // --- Funciones de Utilidad ---

        function getConsent() {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                return stored ? JSON.parse(stored) : null;
            } catch (e) {
                console.error("Error leyendo localStorage de cookies", e);
                return null;
            }
        }

        function saveConsent(consent) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
                dispatchConsentEvent(consent);
            } catch (e) {
                console.error("Error guardando consentimiento de cookies", e);
            }
        }

        function dispatchConsentEvent(consent) {
            // Crear y despachar un evento personalizado para que otros scripts (analítica, etc.) respondan
            const event = new CustomEvent('cookieConsentUpdated', { detail: consent });
            document.dispatchEvent(event);
            
            // Log para pruebas/auditoría
            console.log('Consentimiento de Cookies Actualizado:', consent);
        }

        function hideBanner() {
            banner.classList.remove('show');
        }

        function openPreferencesModal() {
            // Cargar los valores de checkboxes según lo almacenado actualmente
            const consent = getConsent() || defaultConsent;
            optAnalytics.checked = consent.analytics;
            optPersonalization.checked = consent.personalization;

            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevenir scroll al fondo
        }

        function closePreferencesModal() {
            modal.classList.remove('show');
            document.body.style.overflow = ''; // Restaurar scroll
        }
    });

    /**
     * Inyecta de forma limpia y dinámica el HTML requerido
     * para el banner y el modal en el body del documento
     */
    function injectHTML() {
        if (!document.getElementById('cookie-banner')) {
            const bannerDiv = document.createElement('div');
            bannerDiv.id = 'cookie-banner';
            bannerDiv.innerHTML = `
                <h3>Valoramos su privacidad</h3>
                <p>Utilizamos cookies propias y de terceros para analizar el tráfico de nuestro sitio web, recordar sus preferencias y mejorar su experiencia. Puede aceptar todas las cookies, rechazarlas o configurar sus preferencias. Para más información, consulte nuestra <a href="politica-cookies.html">Política de Cookies</a>.</p>
                <div class="cookie-buttons">
                    <button class="cookie-btn cookie-btn-primary" id="cookie-accept-all">Aceptar todas</button>
                    <button class="cookie-btn cookie-btn-secondary" id="cookie-reject-all">Rechazar todas</button>
                    <button class="cookie-btn cookie-btn-text" id="cookie-open-settings">Configurar preferencias</button>
                </div>
            `;
            document.body.appendChild(bannerDiv);
        }

        if (!document.getElementById('cookie-modal')) {
            const modalDiv = document.createElement('div');
            modalDiv.id = 'cookie-modal';
            modalDiv.innerHTML = `
                <div class="cookie-modal-card">
                    <div class="cookie-modal-header">
                        <h3>Configuración de Cookies</h3>
                        <button class="cookie-modal-close" id="cookie-modal-close-btn" aria-label="Cerrar modal">&times;</button>
                    </div>
                    <div class="cookie-modal-body">
                        <p style="font-size: 0.85rem; color: var(--muted); margin-bottom: 20px; line-height: 1.5; font-family: -apple-system, sans-serif;">
                            Configure sus preferencias sobre las cookies utilizadas en nuestro sitio web. Puede activar o desactivar cada categoría de manera libre y voluntaria.
                        </p>
                        
                        <div class="cookie-option-row">
                            <div class="cookie-option-info">
                                <h4>Cookies Técnicas y Esenciales</h4>
                                <p>Necesarias para el correcto funcionamiento del sitio web (navegación, seguridad, recordar consentimiento). No pueden ser desactivadas.</p>
                            </div>
                            <label class="cookie-switch">
                                <input type="checkbox" id="cookie-opt-necessary" checked disabled>
                                <span class="cookie-slider"></span>
                            </label>
                        </div>
                        
                        <div class="cookie-option-row">
                            <div class="cookie-option-info">
                                <h4>Cookies Analíticas y Métricas</h4>
                                <p>Permiten analizar el tráfico y comportamiento del usuario de forma agregada y anónima para optimizar la experiencia de la web.</p>
                            </div>
                            <label class="cookie-switch">
                                <input type="checkbox" id="cookie-opt-analytics">
                                <span class="cookie-slider"></span>
                            </label>
                        </div>
                        
                        <div class="cookie-option-row">
                            <div class="cookie-option-info">
                                <h4>Cookies de Personalización</h4>
                                <p>Facilitan recordar configuraciones personalizadas del usuario, mejorando el rendimiento y servicios específicos.</p>
                            </div>
                            <label class="cookie-switch">
                                <input type="checkbox" id="cookie-opt-personalization">
                                <span class="cookie-slider"></span>
                            </label>
                        </div>
                    </div>
                    <div class="cookie-modal-footer">
                        <button class="cookie-btn cookie-btn-primary" id="cookie-save-preferences" style="flex: 0 0 auto; width: auto; min-width: 180px;">Guardar preferencias</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modalDiv);
        }
    }

})();
