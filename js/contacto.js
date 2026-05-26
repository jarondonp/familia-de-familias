/**
 * Script Modular para el Formulario de Contacto (RGPD / FormSubmit)
 * Asociación Familia de Familias
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const contactForm = document.getElementById('association-contact-form');
        const contactSection = document.getElementById('contacto');
        
        if (!contactForm) return;

        // Elementos de campos del formulario
        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const subjectInput = document.getElementById('contact-subject');
        const messageInput = document.getElementById('contact-message');
        const privacyCheckbox = document.getElementById('contact-privacy');
        const honeyInput = document.getElementById('contact-honey');

        // Elementos de control y estado
        const submitBtn = document.getElementById('contact-submit-btn');
        const submitSpinner = submitBtn.querySelector('.contact-spinner');
        const submitText = submitBtn.querySelector('.contact-btn-text');
        const generalErrorAlert = document.getElementById('contact-general-error');

        // Escuchar evento de envío
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1. Resetear errores previos
            resetFormErrors();

            // 2. Realizar validaciones en el cliente
            const isValid = validateForm();

            if (!isValid) {
                // Enfocar el primer campo con error
                const firstError = contactForm.querySelector('.contact-input.has-error, input[type="checkbox"].has-error');
                if (firstError) firstError.focus();
                return;
            }

            // 3. Control de Spam (Honeypot)
            // Si el campo invisible honey está relleno, simulamos éxito para despistar al bot sin enviar nada.
            if (honeyInput.value.trim() !== '') {
                console.warn('Bot detectado mediante Honeypot.');
                showSuccessState();
                return;
            }

            // 4. Preparar datos para enviar
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                subject: subjectInput.value.trim(),
                message: messageInput.value.trim(),
                _captcha: 'false', // Desactivar el captcha del servidor de FormSubmit
                _subject: `Nuevo mensaje de contacto: ${subjectInput.value.trim()}`
            };

            // 5. Cambiar a estado de carga
            setLoadingState(true);

            try {
                // 6. Enviar petición AJAX a FormSubmit
                const response = await fetch('https://formsubmit.co/ajax/asociacionfamiliadefamilias@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok && result.success === 'true') {
                    // 7. Mostrar éxito
                    showSuccessState();
                } else {
                    throw new Error(result.message || 'Error en la respuesta del servidor');
                }

            } catch (error) {
                console.error('Error al enviar el formulario:', error);
                // Mostrar alerta de error general
                generalErrorAlert.textContent = 'Ha ocurrido un error al enviar su mensaje. Por favor, compruebe su conexión e inténtelo de nuevo.';
                generalErrorAlert.style.display = 'block';
                window.scrollTo({
                    top: contactSection.offsetTop,
                    behavior: 'smooth'
                });
            } finally {
                // 8. Quitar estado de carga
                setLoadingState(false);
            }
        });

        // --- Funciones del ciclo de vida del formulario ---

        function validateForm() {
            let isValid = true;

            // Validación de Nombre
            if (nameInput.value.trim().length < 3) {
                showFieldError(nameInput, 'El nombre debe tener al menos 3 caracteres.');
                isValid = false;
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nameInput.value.trim())) {
                showFieldError(nameInput, 'El nombre solo debe contener letras y espacios.');
                isValid = false;
            }

            // Validación de Correo
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                showFieldError(emailInput, 'Introduzca una dirección de correo válida (ejemplo@correo.com).');
                isValid = false;
            }

            // Validación de Asunto
            if (subjectInput.value.trim().length < 3) {
                showFieldError(subjectInput, 'El asunto debe tener al menos 3 caracteres.');
                isValid = false;
            }

            // Validación de Mensaje
            if (messageInput.value.trim().length < 15) {
                showFieldError(messageInput, 'El mensaje debe tener al menos 15 caracteres.');
                isValid = false;
            }

            // Validación de Casilla de Privacidad (RGPD)
            if (!privacyCheckbox.checked) {
                const errorTextEl = document.getElementById(`${privacyCheckbox.id}-error`);
                if (errorTextEl) {
                    errorTextEl.textContent = 'Debe aceptar la política de privacidad para enviar su mensaje.';
                    errorTextEl.style.display = 'block';
                }
                privacyCheckbox.classList.add('has-error');
                isValid = false;
            }

            return isValid;
        }

        function showFieldError(inputElement, errorMessage) {
            inputElement.classList.add('has-error');
            const errorTextEl = document.getElementById(`${inputElement.id}-error`);
            if (errorTextEl) {
                errorTextEl.textContent = errorMessage;
                errorTextEl.style.display = 'block';
            }
        }

        function resetFormErrors() {
            generalErrorAlert.style.display = 'none';
            
            const errorInputs = contactForm.querySelectorAll('.contact-input.has-error, input[type="checkbox"].has-error');
            errorInputs.forEach(input => input.classList.remove('has-error'));

            const errorTexts = contactForm.querySelectorAll('.contact-error-text');
            errorTexts.forEach(text => {
                text.textContent = '';
                text.style.display = 'none';
            });
        }

        function setLoadingState(isLoading) {
            if (isLoading) {
                submitBtn.disabled = true;
                submitSpinner.style.display = 'inline-block';
                submitText.textContent = 'Enviando mensaje...';
                
                // Deshabilitar campos temporalmente
                nameInput.disabled = true;
                emailInput.disabled = true;
                subjectInput.disabled = true;
                messageInput.disabled = true;
                privacyCheckbox.disabled = true;
            } else {
                submitBtn.disabled = false;
                submitSpinner.style.display = 'none';
                submitText.textContent = 'Enviar mensaje';
                
                // Habilitar campos
                nameInput.disabled = false;
                emailInput.disabled = false;
                subjectInput.disabled = false;
                messageInput.disabled = false;
                privacyCheckbox.disabled = false;
            }
        }

        function showSuccessState() {
            // Guardar HTML original de la sección de contacto
            const originalInnerHTML = contactSection.querySelector('.section-inner').innerHTML;

            // Inyectar tarjeta de éxito en el contenedor
            contactSection.querySelector('.section-inner').innerHTML = `
                <div class="contact-success-card">
                    <div class="contact-success-icon-container">
                        <div class="contact-success-icon">&#10004;</div>
                    </div>
                    <h3>¡Mensaje enviado con éxito!</h3>
                    <p>Muchas gracias por contactar con nosotros. Hemos recibido su consulta y nos pondremos en contacto con usted en la dirección indicada lo antes posible.</p>
                    <button class="contact-success-close-btn" id="contact-success-back-btn">Volver</button>
                </div>
            `;

            // Escuchar clic en botón volver para restaurar formulario original
            document.getElementById('contact-success-back-btn').addEventListener('click', () => {
                contactSection.querySelector('.section-inner').innerHTML = originalInnerHTML;
                // Re-inicializar el script al restaurar
                window.location.reload();
            });
        }
    });
})();
