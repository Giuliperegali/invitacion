/* =========================================================
   CONFIGURACIÓN DE LA INVITACIÓN
   Este es el ÚNICO archivo que tenés que editar.
   Cambiá los textos entre comillas y guardá.
   ========================================================= */

const CONFIG = {
  // --- Pantalla inicial (antes del video) ---
  intro: {
    titulo: "",                        // vacío = no se muestra
    subtitulo: "Subí el volumen 🔊",
    boton: "Abrir para revolear",
  },

  // --- Video ---
  video: {
    archivo: "assets/video.mp4",       // reemplazá este archivo por tu video
    portada: "assets/portada.jpg",     // imagen que se ve mientras carga
    mostrarBotonSaltar: true,
    // Si la persona vuelve a entrar al link, ¿va directo al formulario?
    saltarSiYaLoVio: true,
  },

  // --- Datos del evento ---
  evento: {
    titulo: "Mi cumpleaños",
    nombre: "Giuli",                   // aparece arriba del título
    descripcion: "",                   // vacío = no se muestra

    // Fecha en formato AAAA-MM-DD y horas en formato 24 hs (HH:MM)
    fecha: "2026-11-22",
    horaInicio: "21:30",
    horaFin: "",                       // vacío = solo se muestra la hora de inicio. Si es menor que la de inicio, se toma como el día siguiente

    lugar: "Pirovano 2253",
    direccion: "Ramos Mejía, Buenos Aires",
    // Link de Google Maps (en Maps: Compartir → Copiar vínculo). Si lo dejás vacío se arma solo con la dirección.
    linkMapa: "https://maps.app.goo.gl/7tQ2JeHqFmn3vYnf8",

    dressCode: "",                     // ej: "Todo de negro". Vacío = no se muestra
    notas: "Cada uno traiga lo que quiera tomar 🍻",                         // ej: "Traé tu bebida". Vacío = no se muestra
    // Aviso para los acompañantes. Se muestra en una tarjeta y debajo del contador de acompañantes
    avisoInvitados: "Si traés invitados, que lleguen después de las 00:30",

    mostrarCuentaRegresiva: true,
  },

  // --- Formulario de confirmación ---
  formulario: {
    // URL de la Web App de Google Apps Script (ver README, paso 3).
    // Mientras esté vacía, el formulario funciona en "modo prueba" y no guarda nada.
    urlGoogleScript: "https://script.google.com/macros/s/AKfycbwmkx-M35Iyt7aqKV5yCFyLjdzGR0gX_mzcGPALG2NC3AjuNhqFVpUCuDKyn8xtg9if/exec",

    preguntarAcompanantes: true,
    maxAcompanantes: 3,
    preguntarMensaje: true,
    // Fecha límite para confirmar (AAAA-MM-DD). Vacío = sin límite
    fechaLimite: "",

    graciasSi: "Te espero en mis sexys chambelan",
    graciasNo: "El que no viene es gay",
  },

  // --- Colores ---
  estilo: {
    colorAcento: "#3f7d55",            // verde de botones y tarjetas destacadas
    colorFondo: "#16201a",             // verde muy oscuro de fondo
    colorTexto: "#f4f5f1",
    colorClaro: "#eef0ea",             // tarjetas claras (lugar, botones de agendar)
  },
};
