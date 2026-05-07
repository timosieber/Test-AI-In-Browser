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
  if (typeof s !== "string" || !s) return null;
  try {
    return JSON.parse(s);
  } catch {}
  // Sucht das erste vollstaendige JSON-Objekt im Text. Zaehlt Klammern mit
  // String- und Escape-Behandlung, damit ein "}" in einem String-Wert nicht
  // das Match vorzeitig schliesst. Bricht ab, sobald ein ausgewogenes Paar
  // gefunden ist – im Gegensatz zum frueheren greedy Regex, der bei zwei
  // JSON-Objekten alles dazwischen geschluckt hat.
  const start = s.indexOf("{");
  if (start === -1) return null;
  let depth = 0, inString = false, escape = false;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (escape) { escape = false; continue; }
    if (inString) {
      if (c === "\\") escape = true;
      else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') { inString = true; continue; }
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        try { return JSON.parse(s.slice(start, i + 1)); } catch { return null; }
      }
    }
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
