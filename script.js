/* Lógica de la invitación. No hace falta tocar este archivo: todo se configura en config.js */
(function () {
  "use strict";

  const C = CONFIG;
  const ZONA = "America/Argentina/Buenos_Aires";
  const OFFSET = "-03:00"; // Argentina no tiene horario de verano
  const KEY_VISTO = "invitacion_video_visto";
  const KEY_RSVP = "invitacion_respuesta";

  const $ = (id) => document.getElementById(id);

  // ---------- Almacenamiento (puede fallar en modo incógnito) ----------
  const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const leer = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  const borrar = (k) => { try { localStorage.removeItem(k); } catch (e) {} };

  // ---------- Colores ----------
  const raiz = document.documentElement.style;
  raiz.setProperty("--acento", C.estilo.colorAcento);
  raiz.setProperty("--fondo", C.estilo.colorFondo);
  raiz.setProperty("--texto", C.estilo.colorTexto);
  if (C.estilo.colorClaro) raiz.setProperty("--claro", C.estilo.colorClaro);
  document.querySelector('meta[name="theme-color"]').setAttribute("content", C.estilo.colorFondo);

  // ---------- Fechas ----------
  const ev = C.evento;
  const inicio = new Date(`${ev.fecha}T${ev.horaInicio}:00${OFFSET}`);
  // Sin hora de fin, para el calendario se toman 5 horas de duración
  let fin = ev.horaFin
    ? new Date(`${ev.fecha}T${ev.horaFin}:00${OFFSET}`)
    : new Date(inicio.getTime() + 5 * 3600 * 1000);
  if (fin <= inicio) fin = new Date(fin.getTime() + 24 * 3600 * 1000);

  const fechaLarga = inicio.toLocaleDateString("es-AR", {
    weekday: "long", day: "numeric", month: "long", timeZone: ZONA,
  });
  const capitalizar = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // ---------- Pantallas ----------
  const pantallas = { intro: $("intro"), video: $("pantalla-video"), invitacion: $("invitacion") };
  function mostrar(nombre) {
    Object.entries(pantallas).forEach(([k, el]) => el.classList.toggle("activa", k === nombre));
  }

  // ---------- Botón deslizable ----------
  // Hay que arrastrar el círculo hasta el final. Si solo se toca, el botón "rebota" para mostrar que se desliza.
  function hacerDeslizable(btn, alCompletar) {
    const pulgar = btn.querySelector(".slide-icono");
    let inicioX = null, dx = 0, max = 0, movido = false;

    const pintar = (x, animar) => {
      pulgar.style.transition = animar ? "transform 0.3s ease" : "none";
      pulgar.style.transform = `translateX(${x}px)`;
      btn.style.setProperty("--avance", max ? x / max : 0);
    };
    btn.reiniciar = () => { btn.classList.remove("completo"); pintar(0, true); };

    btn.addEventListener("pointerdown", (e) => {
      if (btn.disabled || btn.classList.contains("completo")) return;
      max = btn.clientWidth - pulgar.offsetWidth - 12;
      inicioX = e.clientX; dx = 0; movido = false;
      btn.setPointerCapture(e.pointerId);
      btn.classList.add("arrastrando");
    });
    btn.addEventListener("pointermove", (e) => {
      if (inicioX === null) return;
      dx = Math.max(0, Math.min(max, e.clientX - inicioX));
      if (dx > 4) movido = true;
      pintar(dx, false);
    });
    const soltar = (e) => {
      if (inicioX === null) return;
      inicioX = null;
      btn.classList.remove("arrastrando");
      if (e.type === "pointerup" && dx >= max * 0.85) {
        pintar(max, true);
        btn.classList.add("completo");
        alCompletar(); // se llama dentro del gesto, así el video puede sonar
      } else {
        pintar(0, true);
        if (!movido) { btn.classList.remove("rebote"); void btn.offsetWidth; btn.classList.add("rebote"); }
      }
    };
    btn.addEventListener("pointerup", soltar);
    btn.addEventListener("pointercancel", soltar);
    // Con teclado (Enter / espacio) también funciona
    btn.addEventListener("click", (e) => { if (e.detail === 0 && !btn.disabled) alCompletar(); });
    btn.addEventListener("animationend", () => btn.classList.remove("rebote"));
  }

  // ---------- 1. Intro ----------
  $("intro-titulo").textContent = C.intro.titulo;
  if (!C.intro.titulo) $("intro-titulo").classList.add("oculto");
  $("intro-subtitulo").textContent = C.intro.subtitulo;
  if (!C.intro.subtitulo) $("intro-subtitulo").classList.add("oculto");
  $("btn-abrir").querySelector(".slide-texto").textContent = C.intro.boton;

  // ---------- 2. Video ----------
  const video = $("video");
  const btnSaltar = $("btn-saltar");
  const cargando = $("video-cargando");
  video.src = C.video.archivo;
  if (C.video.portada) {
    video.poster = C.video.portada;
    $("video-fondo").style.backgroundImage = `url("${C.video.portada}")`;
  }
  // Si el video es horizontal, se muestra entero (con fondo difuminado) en vez de recortarlo
  video.addEventListener("loadedmetadata", () => {
    pantallas.video.classList.toggle("horizontal", video.videoWidth > video.videoHeight);
  });
  if (!C.video.mostrarBotonSaltar) btnSaltar.classList.add("oculto");

  let timerSaltar;
  function reproducirVideo() {
    mostrar("video");
    video.currentTime = 0;
    // play() tiene que llamarse directo desde el toque para que suene en celulares
    const p = video.play();
    if (p && p.catch) {
      p.catch(() => {
        // Si no se puede reproducir con sonido, intentamos sin sonido
        video.muted = true;
        video.play().catch(terminarVideo);
      });
    }
    clearTimeout(timerSaltar);
    btnSaltar.classList.remove("visible");
    timerSaltar = setTimeout(() => btnSaltar.classList.add("visible"), 1500);
  }

  function terminarVideo() {
    video.pause();
    guardar(KEY_VISTO, true);
    mostrar("invitacion");
  }

  video.addEventListener("ended", terminarVideo);
  video.addEventListener("error", () => { if (pantallas.video.classList.contains("activa")) terminarVideo(); });
  video.addEventListener("waiting", () => cargando.classList.remove("oculto"));
  video.addEventListener("playing", () => cargando.classList.add("oculto"));
  video.addEventListener("timeupdate", () => {
    if (video.duration) $("progreso").style.width = (video.currentTime / video.duration) * 100 + "%";
  });
  btnSaltar.addEventListener("click", terminarVideo);

  hacerDeslizable($("btn-abrir"), () => {
    document.querySelector(".sobre").classList.add("abierto");
    reproducirVideo();
  });
  $("btn-ver-video").addEventListener("click", () => {
    video.muted = false;
    reproducirVideo();
  });

  // ---------- 3. Datos del evento ----------
  $("ev-nombre").textContent = ev.nombre;
  $("ev-titulo").textContent = ev.titulo;
  $("ev-descripcion").textContent = ev.descripcion;
  if (!ev.descripcion) $("ev-descripcion").classList.add("oculto");
  document.title = `${ev.titulo} · ${ev.nombre}`;
  $("ev-fecha").textContent = capitalizar(fechaLarga);
  $("ev-hora").textContent = ev.horaFin ? `${ev.horaInicio} a ${ev.horaFin} hs` : `${ev.horaInicio} hs`;
  $("ev-lugar").textContent = ev.lugar;
  $("ev-direccion").textContent = ev.direccion;
  $("ev-mapa").href = ev.linkMapa ||
    "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(`${ev.lugar}, ${ev.direccion}`);

  if (ev.dressCode) { $("ev-dress").textContent = ev.dressCode; $("ev-dress-wrap").classList.remove("oculto"); }
  if (ev.avisoInvitados) {
    $("ev-invitados").textContent = ev.avisoInvitados;
    $("ev-invitados-wrap").classList.remove("oculto");
  }
  if (ev.notas) { $("ev-notas").textContent = ev.notas; $("ev-notas-wrap").classList.remove("oculto"); }

  // Cuenta regresiva
  if (ev.mostrarCuentaRegresiva) {
    const cr = $("cuenta-regresiva");
    const barras = $("barras");
    const N_BARRAS = 20;
    for (let i = 0; i < N_BARRAS; i++) barras.appendChild(document.createElement("i"));
    const tick = () => {
      const ms = inicio - Date.now();
      if (ms <= 0) { cr.classList.add("oculto"); return; }
      cr.classList.remove("oculto");
      $("cr-dias").textContent = Math.floor(ms / 864e5);
      $("cr-horas").textContent = Math.floor((ms % 864e5) / 36e5);
      $("cr-min").textContent = Math.floor((ms % 36e5) / 6e4);
      $("cr-seg").textContent = Math.floor((ms % 6e4) / 1e3);
      // Las barritas se van llenando a medida que se acerca la fecha (últimos 60 días)
      const llenas = Math.round(N_BARRAS * (1 - Math.min(ms / 864e5, 60) / 60));
      [...barras.children].forEach((b, i) => b.classList.toggle("llena", i < Math.max(llenas, 1)));
    };
    tick();
    setInterval(tick, 1000);
  }

  // ---------- Calendario ----------
  const utc = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const ubicacion = `${ev.lugar}, ${ev.direccion}`;
  const tituloCal = `${ev.titulo} · ${ev.nombre}`;
  const detalles = [ev.descripcion, ev.notas, ev.avisoInvitados, `Invitación: ${location.href.split("#")[0]}`]
    .filter(Boolean).join("\n\n");

  $("btn-gcal").href = "https://calendar.google.com/calendar/render?" + new URLSearchParams({
    action: "TEMPLATE",
    text: tituloCal,
    dates: `${utc(inicio)}/${utc(fin)}`,
    details: detalles,
    location: ubicacion,
    ctz: ZONA,
  });

  const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Invitacion//ES", "BEGIN:VEVENT",
    `UID:${utc(inicio)}-invitacion@github`, `DTSTAMP:${utc(new Date())}`,
    `DTSTART:${utc(inicio)}`, `DTEND:${utc(fin)}`,
    `SUMMARY:${esc(tituloCal)}`, `LOCATION:${esc(ubicacion)}`, `DESCRIPTION:${esc(detalles)}`,
    "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", `DESCRIPTION:${esc(tituloCal)}`, "END:VALARM",
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  // En iPhone funciona mejor un archivo .ics real. Si existe "invitacion.ics" en el repo se usa ese;
  // si no, se genera uno en el momento.
  const btnIcs = $("btn-ics");
  btnIcs.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
  btnIcs.download = "invitacion.ics";
  fetch("invitacion.ics", { method: "HEAD" })
    .then((r) => { if (r.ok) { btnIcs.href = "invitacion.ics"; btnIcs.removeAttribute("download"); } })
    .catch(() => {});

  // ---------- Formulario ----------
  const F = C.formulario;
  const form = $("form");
  const inputAcomp = $("f-acomp");

  function setAcomp(n) {
    n = Math.max(0, Math.min(F.maxAcompanantes, n));
    inputAcomp.value = n;
    $("acomp-num").textContent = n;
    $("acomp-label").textContent = n === 0 ? "Voy solo/a" : n === 1 ? "Acompañante" : "Acompañantes";
    $("acomp-menos").disabled = n === 0;
    $("acomp-mas").disabled = n === F.maxAcompanantes;
    const aviso = $("aviso-acomp");
    aviso.textContent = "🕧 " + (ev.avisoInvitados || "");
    aviso.classList.toggle("oculto", !(n > 0 && ev.avisoInvitados));
  }
  $("acomp-menos").addEventListener("click", () => setAcomp(+inputAcomp.value - 1));
  $("acomp-mas").addEventListener("click", () => setAcomp(+inputAcomp.value + 1));
  setAcomp(0);
  if (F.preguntarMensaje) $("campo-mensaje").classList.remove("oculto");

  form.addEventListener("change", (e) => {
    if (e.target.name === "asiste") {
      $("campo-acomp").classList.toggle("oculto", !(F.preguntarAcompanantes && e.target.value === "Sí"));
    }
  });

  // Fecha límite
  if (F.fechaLimite) {
    const limite = new Date(`${F.fechaLimite}T23:59:59${OFFSET}`);
    const txt = limite.toLocaleDateString("es-AR", { day: "numeric", month: "long", timeZone: ZONA });
    const aviso = $("fecha-limite");
    aviso.classList.remove("oculto");
    if (Date.now() > limite) {
      aviso.textContent = `La confirmación cerró el ${txt}.`;
      form.querySelectorAll("input, select, textarea, button").forEach((el) => (el.disabled = true));
    } else {
      aviso.textContent = `Confirmá antes del ${txt}.`;
    }
  }

  function mostrarGracias(asiste) {
    $("gracias-texto").textContent = asiste === "Sí" ? F.graciasSi : F.graciasNo;
    form.classList.add("oculto");
    $("gracias").classList.remove("oculto");
  }

  $("btn-cambiar").addEventListener("click", () => {
    borrar(KEY_RSVP);
    $("gracias").classList.add("oculto");
    form.classList.remove("oculto");
    $("btn-enviar").reiniciar();
  });

  // Enter en un campo no envía: hay que deslizar el botón
  form.addEventListener("submit", (e) => e.preventDefault());
  hacerDeslizable($("btn-enviar"), enviar);

  async function enviar() {
    const btn = $("btn-enviar");
    const error = $("form-error");
    error.classList.add("oculto");

    const datos = new FormData(form);
    const nombre = (datos.get("nombre") || "").trim();
    const asiste = datos.get("asiste");
    if (!nombre) { btn.reiniciar(); return mostrarError("Escribí tu nombre."); }
    if (!asiste) { btn.reiniciar(); return mostrarError("Contame si venís o no."); }

    const registro = {
      nombre,
      asiste,
      acompanantes: asiste === "Sí" && F.preguntarAcompanantes ? datos.get("acompanantes") : "0",
      mensaje: (datos.get("mensaje") || "").trim(),
    };

    const btnTexto = btn.querySelector(".slide-texto");
    btn.disabled = true;
    btnTexto.textContent = "Enviando…";

    try {
      if (F.urlGoogleScript) {
        await fetch(F.urlGoogleScript, {
          method: "POST",
          mode: "no-cors",
          body: new URLSearchParams(registro),
        });
      } else {
        console.info("[Modo prueba] No hay urlGoogleScript configurada. Respuesta:", registro);
        await new Promise((r) => setTimeout(r, 600));
      }
      guardar(KEY_RSVP, registro);
      mostrarGracias(asiste);
    } catch (err) {
      mostrarError("No se pudo enviar. Revisá tu conexión y probá de nuevo.");
    } finally {
      btn.disabled = false;
      btnTexto.textContent = "Deslizá para confirmar";
      btn.reiniciar();
    }

    function mostrarError(msg) {
      error.textContent = msg;
      error.classList.remove("oculto");
    }
  }

  // ---------- Arranque ----------
  const previa = leer(KEY_RSVP);
  if (previa) {
    $("f-nombre").value = previa.nombre || "";
    mostrarGracias(previa.asiste);
  }

  if (C.video.saltarSiYaLoVio && leer(KEY_VISTO)) {
    mostrar("invitacion");
  } else {
    mostrar("intro");
  }
})();
