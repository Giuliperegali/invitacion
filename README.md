# Invitación interactiva con video 💌

Al abrir el link, la persona ve una pantalla de **"Tocá para abrir"**. Cuando toca, arranca el **video a pantalla completa con sonido**. Al terminar (o si toca **Saltar**) aparece la invitación con:

- fecha, hora y lugar, con link al mapa
- una cuenta regresiva
- botones para agendar el evento en Google Calendar y en iPhone/Outlook
- un formulario de confirmación que guarda las respuestas en una planilla de Google Sheets

Si la persona vuelve a entrar al link, va directo a la invitación y ve la respuesta que ya mandó. Abajo de todo hay un botón para ver el video de nuevo.

---

## Archivos

```
index.html            → estructura de la página (no tocar)
style.css             → diseño (no tocar, salvo que quieras cambiar el estilo)
script.js             → funcionamiento (no tocar)
config.js             → ✏️ TUS DATOS: fecha, lugar, textos y colores
assets/video.mp4      → 🎬 reemplazalo por tu video
assets/portada.jpg    → 🖼️ imagen de carga del video y vista previa en WhatsApp
google-apps-script/   → código para guardar las confirmaciones en Google Sheets
```

---

## Paso 1: Poné tus datos

Abrí `config.js` y cambiá los textos entre comillas: nombre, fecha (`"2027-01-23"`), horas (`"21:00"`), lugar, dirección, etc.

- Para el link del mapa: en Google Maps, buscá el lugar, tocá **Compartir → Copiar vínculo** y pegalo en `linkMapa`.
- Si dejás un campo vacío (`""`), no se muestra.

## Paso 2: Poné tu video

Reemplazá `assets/video.mp4` por tu video. **Tiene que llamarse igual** (`video.mp4`).

Recomendaciones:
- Vertical (9:16), como un video de TikTok o de historias.
- Formato **MP4**. Cualquier video grabado con el celular sirve.
- Idealmente que **no pese más de 15 MB**, para que cargue rápido con datos. Si pesa más, comprimilo con [HandBrake](https://handbrake.fr/) (preset "Fast 720p30") o una web como [freeconvert.com/video-compressor](https://www.freeconvert.com/video-compressor).
- GitHub **no acepta archivos de más de 100 MB**, y por la web solo deja subir archivos de hasta 25 MB.

Reemplazá también `assets/portada.jpg` por una captura del primer cuadro de tu video o una foto. Esa imagen se ve mientras carga el video.

## Paso 3: Conectá Google Sheets (para recibir las confirmaciones)

1. Entrá a [sheets.new](https://sheets.new) para crear una planilla nueva y ponele un nombre (ej. "Confirmaciones cumple").
2. En el menú: **Extensiones → Apps Script**.
3. Borrá todo lo que hay en el editor y pegá el contenido de `google-apps-script/Codigo.gs`. Guardá (💾).
4. Arriba a la derecha: **Implementar → Nueva implementación**.
5. En el engranaje ⚙️, elegí **Aplicación web** y configurá:
   - **Ejecutar como:** Yo
   - **Quién tiene acceso:** Cualquier usuario
6. Tocá **Implementar** y aceptá los permisos. Si aparece "Google no verificó esta app", entrá en **Configuración avanzada → Ir a (nombre del proyecto)**. Es normal porque es tu propio script.
7. Copiá la **URL de la aplicación web** (termina en `/exec`).
8. Pegala en `config.js`, en `urlGoogleScript: "..."`.

Para comprobar que funciona, abrí esa URL en el navegador. Tiene que decir *"La invitación está conectada ✔"*. Las respuestas van a aparecer en una pestaña llamada **Confirmaciones** de tu planilla.

> Mientras `urlGoogleScript` esté vacío, el formulario funciona en **modo prueba**: muestra el "gracias" pero no guarda nada.

> Si más adelante cambiás el código del script, tenés que hacer **Implementar → Gestionar implementaciones → editar (lápiz) → Versión: Nueva versión** para que se apliquen los cambios.

## Paso 4: Publicalo en GitHub Pages

1. Creá una cuenta en [github.com](https://github.com) si no tenés.
2. Tocá **+ → New repository**. Ponele un nombre (ej. `cumple`), dejalo **Public** y tocá **Create repository**.
3. Tocá **uploading an existing file** y arrastrá **todo el contenido** de esta carpeta: los archivos y las carpetas `assets` y `google-apps-script`. Tienen que quedar `index.html`, `config.js`, etc. en la raíz, no dentro de otra carpeta. Después tocá **Commit changes**.
4. Andá a **Settings → Pages**. En *Branch* elegí `main` y la carpeta `/ (root)`, y tocá **Save**.
5. Esperá 1 o 2 minutos y refrescá. Arriba va a aparecer tu link, algo como:
   `https://tu-usuario.github.io/cumple/`

¡Listo! Ese es el link para mandar por WhatsApp.

Para cambiar algo después: en el repo, abrí el archivo (ej. `config.js`), tocá el lápiz ✏️, editá y tocá **Commit changes**. En un minuto se actualiza.

---

## Probar antes de mandarlo

- Abrí el link **en tu celular** (iPhone y Android si podés) y fijate que el video suene.
- Mandate una confirmación de prueba y revisá que aparezca en la planilla. Después borrá esa fila.
- Para volver a ver la pantalla inicial después de haber entrado una vez, abrí el link en una pestaña de incógnito.

## Notas

- El video suena porque arranca cuando la persona toca el botón. Los navegadores de celular no dejan que un video arranque con sonido solo.
- Algunos navegadores internos (como el de Instagram) pueden bloquear el sonido igual. En ese caso el video arranca sin sonido, así que conviene que también se entienda sin audio.
- Para ver la página en tu computadora antes de subirla, abrí `index.html` en el navegador.
