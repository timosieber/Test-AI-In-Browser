# Tests fuer den Finanzsystem-Trainer

Kleines Vitest-Setup, das die isolierten Hilfsfunktionen aus
`finanzsystem-trainer.html` testet.

## Installieren

```bash
npm install
```

## Ausfuehren

```bash
npm test           # einmalig
npm run test:watch # im Watch-Modus
```

## Hinweis zur Architektur

Die Tests laufen NICHT gegen die HTML-Datei direkt. Stattdessen liegt eine
gespiegelte, reine Variante der Hilfsfunktionen (`escapeHtml`,
`parseJsonLoose`, `topicDot`, `recordResult`) in `tests/helpers.js`. Das
erlaubt schnelles Unit-Testing ohne DOM, WebLLM oder localStorage.

Wenn die Hauptdatei `finanzsystem-trainer.html` geaendert wird, muss
`tests/helpers.js` ggf. manuell angeglichen werden — bis ein Refactoring
diese Helfer aus dem Inline-Script in echte ES-Module zieht und HTML wie
Tests aus derselben Quelle importieren.

DOM-, WebLLM- und localStorage-abhaengige Funktionen sind hier bewusst
nicht abgedeckt.
