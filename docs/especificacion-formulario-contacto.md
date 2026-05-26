# Especificación de Requisitos del Formulario de Contacto

Este documento detalla los requisitos funcionales, técnicos y de seguridad implementados para el formulario de contacto de la **Asociación Familia de Familias**.

---

## 1. Requisitos Funcionales y de Interfaz (UI)

El formulario reemplazará el botón estático de la sección "Participa" (`#contacto`) e incluirá los siguientes campos interactivos:

*   **Nombre Completo (`name="name"`)**:
    *   *Tipo*: Texto (`input type="text"`).
    *   *Validación*: Obligatorio, mínimo 3 caracteres. Solo letras y espacios.
    *   *Marcador (Placeholder)*: "Su nombre completo"
*   **Correo Electrónico (`name="email"`)**:
    *   *Tipo*: Email (`input type="email"`).
    *   *Validación*: Obligatorio, patrón de correo electrónico válido (`^[^\s@]+@[^\s@]+\.[^\s@]+$`).
    *   *Marcador (Placeholder)*: "ejemplo@correo.com"
*   **Asunto (`name="subject"`)**:
    *   *Tipo*: Texto (`input type="text"`).
    *   *Validación*: Obligatorio, mínimo 3 caracteres.
    *   *Marcador (Placeholder)*: "Motivo del contacto (ej. Consulta sobre encuentros)"
*   **Mensaje (`name="message"`)**:
    *   *Tipo*: Área de texto (`textarea`).
    *   *Validación*: Obligatorio, mínimo 15 caracteres.
    *   *Marcador (Placeholder)*: "Escriba aquí su mensaje detallado..."
*   **Aceptación de Privacidad (`name="privacy_accepted"`)**:
    *   *Tipo*: Casilla de verificación (`input type="checkbox"`).
    *   *Validación*: Obligatorio (debe estar marcado para permitir el envío).
    *   *Etiqueta*: "He leído y acepto la Política de Privacidad" (donde "Política de Privacidad" es un enlace a `politica-privacidad.html` que abre en una pestaña nueva).

---

## 2. Requisitos Técnicos y de Envío (AJAX)

*   **Endpoint**: El envío de datos se realiza de forma asíncrona hacia la API de FormSubmit:
    `https://formsubmit.co/ajax/javierr_ucv@hotmail.com`
*   **Método**: `POST`
*   **Cabeceras**: `Content-Type: application/json` y `Accept: application/json`
*   **Flujo de Estados**:
    1.  *Estado Inicial*: Formulario visible listo para ser rellenado.
    2.  *Estado de Envío (Carga)*: Al pulsar "Enviar mensaje", se desactivan todos los campos y el botón de envío para evitar envíos duplicados. El botón muestra un spinner o texto de "Enviando...".
    3.  *Estado de Éxito*: Se oculta el formulario y se muestra un panel con un diseño premium con un check de confirmación, agradeciendo el contacto. Se limpia el formulario.
    4.  *Estado de Error*: Si falla la red, se muestra un mensaje de error y se habilitan de nuevo los campos para reintentar el envío.

---

## 3. Seguridad y Anti-Spam

Para proteger el formulario de correos basura sin interferir en la usabilidad del usuario final:
*   **Campo Trampa (Honeypot)**: Se incluye un campo invisible para humanos (`name="_honey"`) mediante CSS (`display: none;`). Los bots automatizados suelen rellenar todos los campos del formulario por defecto. Si el script de recepción detecta que este campo contiene algún valor, descarta el correo automáticamente.
*   **Configuración FormSubmit**:
    *   `_captcha=false`: Se desactiva el captcha visual de FormSubmit en su servidor (ya que usamos el Honeypot) para que el envío AJAX sea directo y transparente.
