// Reine, isolierte Hilfsfunktionen, gespiegelt aus finanzsystem-trainer.html.
// Hinweis: topicDot/recordResult greifen im Original auf globale `progress`
// und auf das DOM zu. Hier sind sie als reine Funktionen umgeschrieben, sodass
// sie ohne Browser-Kontext getestet werden koennen. Bei Aenderungen an der
// Hauptdatei muss diese Datei ggf. manuell nachgezogen werden.

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

export function parseJsonLoose(s) {
  try {
    return JSON.parse(s);
  } catch {}
  const m = s.match(/\{[\s\S]*\}/);
  if (m) {
    try {
      return JSON.parse(m[0]);
    } catch {}
  }
  return null;
}

// progress: { "1": { good: 2, partial: 1, bad: 0, last: "good" }, ... }
// Pure-Variante: erwartet das progress-Objekt explizit als Parameter.
export function topicDot(progress, nr) {
  const p = progress[nr];
  if (!p || !p.last) return "";
  return p.last;
}

// Pure-Variante: mutiert das uebergebene progress-Objekt und gibt es zurueck.
// kind muss "good" | "partial" | "bad" sein.
export function recordResult(progress, topicNr, kind) {
  if (!progress[topicNr]) {
    progress[topicNr] = { good: 0, partial: 0, bad: 0, last: null };
  }
  progress[topicNr][kind]++;
  progress[topicNr].last = kind;
  return progress;
}
