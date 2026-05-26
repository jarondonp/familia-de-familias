# Plan de Pruebas y Validación (RGPD y Cookies)

Este plan de pruebas describe cómo verificar manualmente el correcto funcionamiento del banner de cookies, el modal de preferencias, la persistencia en `localStorage` y las redirecciones de las páginas legales del sitio **Familia de Familias**.

---

## Casos de Prueba (Test Cases)

### Caso 1: Carga Inicial (Usuario Nuevo)
*   **Procedimiento**:
    1.  Abrir el navegador en modo incógnito (o borrar el historial/localStorage del sitio).
    2.  Acceder a la página web (`index.html`).
*   **Comportamiento Esperado**:
    - El banner de cookies aparece en la parte inferior de la pantalla.
    - El scroll y el resto de la página son navegables, pero el banner debe mantenerse fijo.
    - Si se inspecciona la consola (`localStorage`), no debe existir la clave `cookieConsent`.

---

### Caso 2: Aceptación Total
*   **Procedimiento**:
    1.  Estando en el Caso 1, hacer clic en el botón **"Aceptar todas"** del banner.
*   **Comportamiento Esperado**:
    - El banner de cookies desaparece de forma fluida.
    - Se añade la clave `cookieConsent` a `localStorage` con un objeto que tiene activas todas las categorías de cookies:
      `{"necessary":true,"analytics":true,"personalization":true}`.
    - Al recargar la página, el banner **no** vuelve a aparecer.

---

### Caso 3: Rechazo Total
*   **Procedimiento**:
    1.  Borrar el `localStorage` o abrir una nueva pestaña de incógnito.
    2.  Hacer clic en el botón **"Rechazar todas"** del banner.
*   **Comportamiento Esperado**:
    - El banner de cookies desaparece.
    - Se añade la clave `cookieConsent` a `localStorage` con el siguiente valor:
      `{"necessary":true,"analytics":false,"personalization":false}`.
    - Al recargar la página, el banner **no** vuelve a aparecer.

---

### Caso 4: Configuración Granular (Modal)
*   **Procedimiento**:
    1.  Limpiar el consentimiento previo (`localStorage.removeItem('cookieConsent')` en la consola).
    2.  Recargar la página.
    3.  Hacer clic en el botón **"Configurar"** (o "Personalizar") en el banner de cookies.
    4.  Verificar que se abre el modal de configuración de cookies con el fondo atenuado.
    5.  Observar que las cookies *Necesarias* están marcadas y deshabilitadas para cambios.
    6.  Activar el interruptor de *Cookies Analíticas*, pero dejar desactivado el de *Cookies de Personalización*.
    7.  Hacer clic en el botón **"Guardar preferencias"**.
*   **Comportamiento Esperado**:
    - El modal y el banner se ocultan.
    - En `localStorage`, la clave `cookieConsent` debe almacenar:
      `{"necessary":true,"analytics":true,"personalization":false}`.

---

### Caso 5: Revocación de Consentimiento
*   **Procedimiento**:
    1.  Con las cookies ya aceptadas o rechazadas previamente, bajar hasta el pie de página (`<footer>`).
    2.  Hacer clic en el enlace **"Configuración de Cookies"**.
*   **Comportamiento Esperado**:
    - Se abre inmediatamente el modal de configuración.
    - Los interruptores del modal deben reflejar las preferencias guardadas anteriormente.
    - Si el usuario cambia las opciones y pulsa "Guardar preferencias", los datos del `localStorage` deben actualizarse en consecuencia.

---

### Caso 6: Navegación de Páginas Legales
*   **Procedimiento**:
    1.  Hacer clic en los enlaces del pie de página: "Aviso Legal", "Política de Privacidad" y "Política de Cookies".
    2.  Verificar que abren sus respectivos archivos HTML.
    3.  Verificar que cada página legal tiene un botón o enlace visible para "Volver al Inicio" que regrese a `index.html`.
*   **Comportamiento Esperado**:
    - Todas las páginas cargan de inmediato, muestran la información legal correspondiente y permiten la navegación de regreso.
