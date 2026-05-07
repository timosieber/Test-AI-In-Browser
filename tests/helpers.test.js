import { describe, it, expect } from "vitest";
import {
  escapeHtml,
  parseJsonLoose,
  topicDot,
  recordResult,
} from "./helpers.js";

describe("escapeHtml", () => {
  it("gibt fuer einen leeren String einen leeren String zurueck", () => {
    expect(escapeHtml("")).toBe("");
  });

  it("laesst harmlosen Text unveraendert", () => {
    expect(escapeHtml("Hallo Welt 123")).toBe("Hallo Welt 123");
  });

  it("escaped jedes der fuenf Sonderzeichen einzeln korrekt", () => {
    expect(escapeHtml("&")).toBe("&amp;");
    expect(escapeHtml("<")).toBe("&lt;");
    expect(escapeHtml(">")).toBe("&gt;");
    expect(escapeHtml('"')).toBe("&quot;");
    expect(escapeHtml("'")).toBe("&#39;");
  });

  it("neutralisiert eine klassische XSS-Payload", () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;"
    );
  });

  it("escaped ein Ampersand vor anderen Zeichen nur einmal (keine Doppel-Escapes)", () => {
    // Wichtig: `&` darf nicht zu `&amp;amp;` werden, wenn es nur einmal vorkommt.
    expect(escapeHtml("Tom & Jerry <3")).toBe("Tom &amp; Jerry &lt;3");
  });

  it("konvertiert Zahlen, null und undefined zu String und escaped sie", () => {
    expect(escapeHtml(42)).toBe("42");
    expect(escapeHtml(null)).toBe("null");
    expect(escapeHtml(undefined)).toBe("undefined");
  });

  it("behandelt gemischte Eingaben mit allen Sonderzeichen zugleich", () => {
    expect(escapeHtml(`a&b<c>d"e'f`)).toBe(
      "a&amp;b&lt;c&gt;d&quot;e&#39;f"
    );
  });
});

describe("parseJsonLoose", () => {
  it("parst sauberes JSON direkt", () => {
    expect(parseJsonLoose('{"a":1,"b":"x"}')).toEqual({ a: 1, b: "x" });
  });

  it("parst JSON mit umgebendem Whitespace und Newlines", () => {
    expect(parseJsonLoose('   \n  {"ok": true}   \n')).toEqual({ ok: true });
  });

  it("extrahiert ein eingebettetes JSON aus typischem Modell-Output", () => {
    const llmOutput =
      'Sicher! Hier ist meine Antwort:\n{"score": 0.8, "kind": "partial"}\nViel Erfolg!';
    expect(parseJsonLoose(llmOutput)).toEqual({
      score: 0.8,
      kind: "partial",
    });
  });

  it("gibt null zurueck bei kaputtem JSON ohne extrahierbares Objekt", () => {
    expect(parseJsonLoose("nicht mal ansatzweise json")).toBeNull();
    expect(parseJsonLoose('{"a": 1, "b":')).toBeNull();
  });

  it("gibt null zurueck bei leerem String", () => {
    expect(parseJsonLoose("")).toBeNull();
  });

  it("greift bei zwei JSON-Objekten im Text das ERSTE vollstaendige Objekt", () => {
    // Neues Verhalten: Klammer-Balance bricht ab, sobald das erste Paar
    // ausgewogen ist. Nachfolgende Objekte werden ignoriert. Loest das
    // alte Greedy-Problem, bei dem zwei valide Objekte zu null fuehrten.
    const twoObjects = 'Erst {"a":1} und dann {"b":2} fertig.';
    expect(parseJsonLoose(twoObjects)).toEqual({ a: 1 });
  });

  it("parst ein einzelnes JSON-Objekt auch wenn es Newlines enthaelt", () => {
    const pretty = 'Output:\n{\n  "a": 1,\n  "b": [1, 2, 3]\n}\nDanke';
    expect(parseJsonLoose(pretty)).toEqual({ a: 1, b: [1, 2, 3] });
  });

  it("laesst sich nicht von einem '}' innerhalb eines String-Werts taeuschen", () => {
    // Ein literales "}" im String darf das Objekt nicht vorzeitig schliessen.
    const tricky = '{"begruendung":"die Klammer } gehoert zum Text","ok":true}';
    expect(parseJsonLoose(tricky)).toEqual({
      begruendung: "die Klammer } gehoert zum Text",
      ok: true,
    });
  });

  it("gibt null zurueck, wenn das JSON unvollstaendig ist (Token-Limit-Fall)", () => {
    // Genau dieser Fall tritt auf, wenn max_tokens zu knapp ist und das
    // Modell mitten im JSON abbricht – darf nicht stillschweigend ein
    // halb-geparstes Objekt liefern.
    const truncated = '{"bewertung":"teilweise","begruendung":"der Text bricht hier ab';
    expect(parseJsonLoose(truncated)).toBeNull();
  });

  it("ignoriert Modell-Nachgeplapper nach dem JSON", () => {
    const withTail = '{"score":1}\n\nIch hoffe das hilft! Viel Erfolg.';
    expect(parseJsonLoose(withTail)).toEqual({ score: 1 });
  });
});

describe("topicDot", () => {
  it("gibt einen leeren String zurueck, wenn das progress-Objekt leer ist", () => {
    expect(topicDot({}, "1")).toBe("");
  });

  it("gibt einen leeren String zurueck, wenn das Topic existiert, aber `last` null/fehlend ist", () => {
    expect(topicDot({ 1: { good: 0, partial: 0, bad: 0, last: null } }, "1")).toBe("");
    expect(topicDot({ 2: { good: 1, partial: 0, bad: 0 } }, "2")).toBe("");
  });

  it("gibt 'good' zurueck, wenn das letzte Resultat 'good' war", () => {
    const progress = { 1: { good: 2, partial: 0, bad: 0, last: "good" } };
    expect(topicDot(progress, "1")).toBe("good");
  });

  it("gibt 'bad' zurueck, wenn das letzte Resultat 'bad' war", () => {
    const progress = { 7: { good: 1, partial: 1, bad: 3, last: "bad" } };
    expect(topicDot(progress, "7")).toBe("bad");
  });

  it("nutzt den uebergebenen Schluessel exakt (kein Auto-Cast zwischen number und string)", () => {
    const progress = { 3: { good: 0, partial: 0, bad: 0, last: "partial" } };
    // JS-Objekt-Keys sind Strings: progress[3] === progress["3"]
    expect(topicDot(progress, 3)).toBe("partial");
    expect(topicDot(progress, "3")).toBe("partial");
  });
});

describe("recordResult", () => {
  it("legt ein neues Topic an, wenn es noch nicht existiert", () => {
    const progress = {};
    const result = recordResult(progress, "1", "good");
    expect(result).toEqual({
      1: { good: 1, partial: 0, bad: 0, last: "good" },
    });
  });

  it("inkrementiert den Zaehler eines bestehenden Topics", () => {
    const progress = { 1: { good: 1, partial: 0, bad: 0, last: "good" } };
    recordResult(progress, "1", "good");
    expect(progress[1].good).toBe(2);
    expect(progress[1].last).toBe("good");
  });

  it("kann verschiedene Kinds nacheinander korrekt zaehlen", () => {
    const progress = {};
    recordResult(progress, "5", "good");
    recordResult(progress, "5", "partial");
    recordResult(progress, "5", "bad");
    recordResult(progress, "5", "good");
    expect(progress[5]).toEqual({
      good: 2,
      partial: 1,
      bad: 1,
      last: "good",
    });
  });

  it("aktualisiert `last` immer auf das zuletzt aufgezeichnete Kind", () => {
    const progress = {};
    recordResult(progress, "2", "good");
    expect(progress[2].last).toBe("good");
    recordResult(progress, "2", "bad");
    expect(progress[2].last).toBe("bad");
    recordResult(progress, "2", "partial");
    expect(progress[2].last).toBe("partial");
  });

  it("mutiert das uebergebene progress-Objekt (dokumentiertes Verhalten, kein Immutability)", () => {
    const progress = {};
    const returned = recordResult(progress, "9", "good");
    // Rueckgabewert ist die gleiche Referenz wie der Input.
    expect(returned).toBe(progress);
    expect(progress[9]).toBeDefined();
  });

  it("haelt mehrere Topics in einem progress-Objekt unabhaengig voneinander", () => {
    const progress = {};
    recordResult(progress, "1", "good");
    recordResult(progress, "2", "bad");
    recordResult(progress, "1", "partial");
    expect(progress[1]).toEqual({ good: 1, partial: 1, bad: 0, last: "partial" });
    expect(progress[2]).toEqual({ good: 0, partial: 0, bad: 1, last: "bad" });
  });
});
