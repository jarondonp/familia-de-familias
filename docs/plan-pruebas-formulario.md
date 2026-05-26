# Plan de Pruebas y Validación del Formulario de Contacto

Este plan detalla los casos de prueba necesarios para verificar el correcto funcionamiento, la validación de errores y el envío real de correos mediante el nuevo formulario.

---

## Casos de Prueba (Test Cases)

### Caso 1: Validación de Campos Obligatorios (Intento de Envío Vacío)
*   **Procedimiento**:
    1.  Ir a la sección de contacto en `index.html`.
    2.  Sin rellenar ningún campo, hacer clic en el botón **"Enviar mensaje"**.
*   **Comportamiento Esperado**:
    - El formulario **no** debe enviarse.
    - Se debe mostrar un mensaje de error debajo de cada campo obligatorio indicando que no puede estar vacío.
    - Los campos correspondientes deben resaltarse con un borde de error en rojo.

---

### Caso 2: Validación del Formato de Correo Electrónico
*   **Procedimiento**:
    1.  Escribir un nombre válido (ej. "Juan Pérez").
    2.  En el campo de correo, introducir un texto no válido (ej. "juan.perez", "juan@perez", o "juan@.com").
    3.  Rellenar el asunto, mensaje y marcar la casilla de aceptación.
    4.  Hacer clic en **"Enviar mensaje"**.
*   **Comportamiento Esperado**:
    - El formulario **no** debe enviarse.
    - Debajo del campo de correo electrónico, debe aparecer el mensaje específico: "Introduzca una dirección de correo válida".
    - El borde del campo de correo electrónico debe cambiar a rojo.

---

### Caso 3: Restricción de Mensaje Corto
*   **Procedimiento**:
    1.  Rellenar nombre y correo correctamente.
    2.  Introducir un asunto válido.
    3.  En el cuadro de texto del mensaje, escribir un mensaje muy corto (ej. "Hola amigos").
    4.  Marcar el checkbox de privacidad y pulsar **"Enviar mensaje"**.
*   **Comportamiento Esperado**:
    - El formulario **no** debe enviarse.
    - Debajo del campo de mensaje debe aparecer: "El mensaje debe tener al menos 15 caracteres".

---

### Caso 4: Obligatoriedad de Aceptación de Privacidad (RGPD)
*   **Procedimiento**:
    1.  Rellenar todos los campos de texto correctamente con datos válidos.
    2.  **No** marcar la casilla de "He leído y acepto la Política de Privacidad".
    3.  Hacer clic en **"Enviar mensaje"**.
*   **Comportamiento Esperado**:
    - El formulario **no** debe enviarse.
    - Debajo de la casilla de verificación debe aparecer el mensaje: "Debe aceptar la política de privacidad para continuar".

---

### Caso 5: Envío Exitoso y Recepción (AJAX)
*   **Procedimiento**:
    1.  Rellenar todos los campos correctamente con datos reales de prueba.
    2.  Marcar la casilla de aceptación de privacidad.
    3.  Hacer clic en **"Enviar mensaje"**.
*   **Comportamiento Esperado**:
    - El botón de envío cambia a un estado de carga (ej. "Enviando mensaje...") y se deshabilita junto con los campos de entrada.
    - Tras completarse la petición de red (1-3 segundos):
      - El formulario se oculta de forma fluida.
      - Aparece una tarjeta de éxito con un diseño limpio ("¡Gracias por contactar con nosotros! Hemos recibido su mensaje correctamente...").
      - Se limpia el formulario internamente.

---

### Caso 6: Activación de FormSubmit (Un solo clic)
*   **Procedimiento**:
    1.  Tras realizar el Caso 5 por primera vez en producción (después del despliegue en GitHub Pages).
    2.  Iniciar sesión en la cuenta `asociacionfamiliadefamilias@gmail.com`.
    3.  Buscar un correo electrónico proveniente de `FormSubmit.co` titulado **"FormSubmit - Action Required"**.
    4.  Hacer clic en el botón de confirmación/activación contenido en el cuerpo del correo.
*   **Comportamiento Esperado**:
    - Se abrirá una página web de FormSubmit confirmando que la dirección de correo electrónico ha sido enlazada y verificada de forma correcta.
    - A partir de este momento, todos los envíos posteriores irán directos a la bandeja de entrada sin requerir nuevas confirmaciones.
