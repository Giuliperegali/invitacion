/**
 * Recibe las confirmaciones de la invitación y las guarda en esta planilla.
 * Instrucciones completas en el README (paso 3).
 */

const NOMBRE_HOJA = "Confirmaciones";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const hoja = obtenerHoja();
    const p = e.parameter || {};
    hoja.appendRow([
      new Date(),
      limpiar(p.nombre),
      limpiar(p.asiste),
      Number(p.acompanantes) || 0,
      limpiar(p.mensaje),
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Para probar que la URL funciona abriéndola en el navegador
function doGet() {
  return ContentService.createTextOutput("La invitación está conectada ✔");
}

function obtenerHoja() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = libro.getSheetByName(NOMBRE_HOJA);
  if (!hoja) {
    hoja = libro.insertSheet(NOMBRE_HOJA);
    hoja.appendRow(["Fecha de respuesta", "Nombre", "¿Viene?", "Acompañantes", "Mensaje"]);
    hoja.getRange(1, 1, 1, 5).setFontWeight("bold");
    hoja.setFrozenRows(1);
  }
  return hoja;
}

// Evita que alguien meta fórmulas en la planilla y limita el largo
function limpiar(v) {
  v = String(v || "").slice(0, 500);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}
