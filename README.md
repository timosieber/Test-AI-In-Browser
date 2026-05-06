# Finanzsystem-Trainer

Ein lokaler KI-Lerncoach für Schweizer Wirtschaftsschülerinnen und -schüler rund um das Schweizer Finanzsystem.

---

## Über das Tool

Der **Finanzsystem-Trainer** ist eine interaktive Übungsumgebung, die 18 Lehrziele rund um das Schweizer Finanzsystem abdeckt – von der SNB und dem Leitzins über Bankenkrisen, Obligationen und Leverage bis hin zu Bitcoin, Stablecoins und Regionalwährungen. Die KI generiert Fragen, bewertet Antworten mit Begründung und Musterlösung und führt Buch über den Lernfortschritt.

Das Besondere: **Alles läuft lokal im Browser**. Es gibt keinen Server, keine Anmeldung, keine Cloud-API. Das KI-Modell wird einmalig in den Browser geladen und arbeitet danach offline weiter. Eingaben der Schülerinnen und Schüler verlassen den Computer nie.

---

## Voraussetzungen

### Browser

Der Trainer benötigt einen modernen Chromium-basierten Browser mit **WebGPU-Unterstützung**:

- **Google Chrome** ab Version 113
- **Microsoft Edge** ab Version 113
- **Arc Browser**
- **Brave** (mit aktiviertem WebGPU-Flag)

> Hinweis: **Safari** und **Firefox** unterstützen WebGPU aktuell nicht oder nur eingeschränkt. Der Trainer wird dort nicht zuverlässig laufen. Bitte einen der oben genannten Browser verwenden.

### Hardware

| Modellgrösse           | Empfohlener freier RAM | Bemerkung                          |
| ---------------------- | ---------------------- | ---------------------------------- |
| Llama-3.2-1B           | mind. 4 GB             | schnell, einfache Antworten        |
| Qwen2.5-3B (Standard)  | mind. 6 GB             | guter Kompromiss, ca. 1.9 GB Modell |
| Llama-3.2-3B           | mind. 6 GB             | ähnlich Qwen2.5-3B                 |
| Gemma-2-2B             | mind. 5 GB             | kompakt, robust                    |
| Qwen2.5-7B             | mind. 10 GB            | beste Qualität, ca. 4.4 GB Modell  |

Eine dedizierte GPU (oder eine moderne integrierte GPU wie Apple Silicon, Intel Iris Xe oder AMD Radeon der letzten Jahre) wird empfohlen. Auf älteren Geräten läuft der Trainer zwar, aber spürbar langsamer.

### Internet

Eine Internetverbindung wird **nur beim allerersten Start** benötigt, um das KI-Modell herunterzuladen. Je nach Verbindung dauert das **1 bis 10 Minuten** (das Modell ist 1–4 GB gross). Danach bleibt das Modell im Browser-Cache und der Trainer funktioniert vollständig offline.

---

## Erste Schritte (für Lehrkräfte)

### Variante A: Mit dem Python-Launcher (am einfachsten)

Im Ordner liegt eine Datei `start.py`. Sie startet einen kleinen lokalen Webserver und öffnet den Trainer automatisch im Standard-Browser. Keine Daten verlassen den Computer.

**macOS / Linux:**

1. Terminal im Ordner öffnen (Rechtsklick auf den Ordner → „Neues Terminal im Ordner" oder `cd /Pfad/zum/Ordner/BWL`).
2. Ausführen:
   ```bash
   python3 start.py
   ```
3. Der Browser öffnet sich automatisch unter `http://127.0.0.1:8000/finanzsystem-trainer.html`.
4. Stoppen mit `Ctrl+C` im Terminal.

**Windows (PowerShell oder Eingabeaufforderung):**

```powershell
python start.py
```

Optionen:

- `python3 start.py --port 9000` – Server auf einem anderen Port starten.
- `python3 start.py --no-browser` – Server starten, ohne Browser zu öffnen (z.B. wenn der Trainer auf einem anderen Gerät im selben WLAN aufgerufen werden soll).

> Python 3.8 oder neuer wird benötigt. Auf macOS und Linux meist vorinstalliert. Auf Windows: kostenlos von [python.org](https://www.python.org/) installieren (beim Setup das Häkchen bei „Add Python to PATH" setzen).

### Variante B: Manueller HTTP-Server (ohne Launcher)

Funktioniert genauso wie Variante A, nur ohne die `start.py`-Hilfe.

**macOS / Linux:**

```bash
cd /Pfad/zum/Ordner/BWL
python3 -m http.server 8000
```

Dann im Browser `http://localhost:8000/finanzsystem-trainer.html` öffnen.

**Windows (PowerShell):**

```powershell
cd C:\Pfad\zum\Ordner\BWL
python -m http.server 8000
```

### Variante C: VS Code mit „Live Server"-Extension

1. [Visual Studio Code](https://code.visualstudio.com/) installieren.
2. Extension **„Live Server"** (Autor: Ritwick Dey) installieren.
3. Den Ordner `BWL` in VS Code öffnen.
4. Rechtsklick auf `finanzsystem-trainer.html` → **„Open with Live Server"**.
5. Der Browser öffnet sich automatisch.

### Variante D: Direkt per Doppelklick

Funktioniert in manchen Browsern (z.B. Edge), in anderen nicht. Wenn das KI-Modell nicht lädt oder externe Lehrziele (`lehrziele.json`) nicht greifen: bitte Variante A, B oder C verwenden.

### Ablauf nach dem Öffnen

1. **Modell wählen.** Beim ersten Start ist `Qwen2.5-3B-Instruct` voreingestellt. Für schwächere Geräte das 1B-Modell wählen.
2. **Modell laden.** Beim ersten Mal lädt der Browser das Modell herunter (Fortschrittsbalken sichtbar). Beim nächsten Start läuft es aus dem Cache.
3. **Lehrziel auswählen.** In der Sidebar eines der 18 Lehrziele anklicken.
4. **Modus wählen** (Frage generieren, neu formulieren, Freier Modus oder Multiple-Choice) und **Schwierigkeit** (leicht / mittel / schwer).
5. **Antworten** und Bewertung mit Musterlösung lesen.

---

## Funktionen im Überblick

### 18 Lehrziele

Die Lehrziele sind in der Sidebar gruppiert:

- **Bankensystem & Geschäftsbanken** – Rolle der Banken, Geldschöpfung, Bilanzlogik
- **SNB & Leitzins** – Aufgaben der SNB, Geldpolitik, Wirkung des Leitzinses
- **Obligationen** – Funktionsweise, Verzinsung, Risiken
- **Bankenkrisen & Leverage** – historische Krisen, Hebelwirkung, Systemrisiken
- **Modernes Geld** – FIAT-Geld, Zentralbankgeld, CBDC, Stablecoins
- **Krypto & Blockchain** – Bitcoin, Funktionsweise der Blockchain, Mining
- **Zahlungssysteme & Zukunft** – TWINT, SIC, Regionalwährungen, Gesamtverständnis

### Vier Modi

| Modus               | Beschreibung                                                                 |
| ------------------- | ---------------------------------------------------------------------------- |
| **Frage generieren** | Die KI erzeugt eine neue Übungsfrage zum gewählten Lehrziel.                |
| **Neu formulieren** | Die aktuelle Frage wird umformuliert (anderer Blickwinkel, gleiches Thema). |
| **Freier Modus**    | Schüler stellt eine eigene Frage, KI prüft die Antwort dazu.                |
| **Multiple-Choice** | Klassische MC-Aufgabe mit 4 Antwortoptionen und Begründung.                 |

### Drei Schwierigkeitsgrade

- **Leicht** – Grundbegriffe, Definitionen, einfache Zusammenhänge
- **Mittel** – Anwendung, einfache Transferaufgaben
- **Schwer** – Analyse, kritische Reflexion, mehrstufige Argumentation

### Bewertung

Jede Antwort wird strukturiert bewertet (intern als JSON):

- **Bewertung** – richtig / teilweise / falsch
- **Begründung** – warum diese Bewertung
- **Fehlende Punkte** – was in der Antwort gefehlt hat
- **Musterlösung** – wie eine ideale Antwort aussehen könnte
- **Vagheits-Hinweis** – falls die Antwort zu unspezifisch war

### Hinweis-Button

Wer feststeckt: ein Klick auf **„Tipp"** liefert einen Lernhinweis ohne die Lösung zu verraten.

### Fortschrittsanzeige

Pro Lehrziel werden die Trefferquoten gespeichert (gut / teilweise / schlecht) sowie das letzte Resultat. So sehen Schüler und Lehrkräfte auf einen Blick, wo noch Übungsbedarf besteht.

---

## Hinweise zur Bewertungsqualität

Die KI läuft lokal mit relativ kleinen Modellen (1–7 Milliarden Parameter). Das ist beeindruckend für ein Browser-Modell, hat aber Grenzen:

- **Bei nuancierten Antworten** (z.B. „die SNB versucht, die Inflation indirekt über Erwartungen zu steuern") kann ein 1B-Modell gelegentlich danebenliegen.
- **Faktische Genauigkeit** ist bei Schweizer Spezifika (z.B. SIC-System, Regionalwährungen wie WIR) nicht immer hundertprozentig.
- **Längere Antworten** werden manchmal oberflächlich bewertet.

**Empfehlungen:**

1. Wenn Bewertungen wiederholt seltsam wirken: ein **grösseres Modell** wählen (Qwen2.5-7B benötigt aber ~4.4 GB RAM und einen leistungsfähigen Computer).
2. Schülerinnen und Schüler sollten Bewertungen **kritisch lesen**. Die KI ist eine Übungshilfe, **nicht ein Prüfungsorgan**.
3. Bei systematischen Fehlbewertungen die Musterlösung und die Begründung gemeinsam besprechen – das ist oft pädagogisch wertvoller als ein „richtig/falsch".

> 💡 Tipp: Lassen Sie die Klasse bewusst auch einmal eine bewusst falsche oder unvollständige Antwort eingeben, um zu sehen, was die KI erkennt und was nicht. Das schärft den kritischen Umgang mit KI-Tools.

---

## Datenschutz

Der Trainer wurde so gebaut, dass keine Daten den Computer verlassen:

- **Kein Server.** Der gesamte Code läuft im Browser.
- **Keine Telemetrie.** Es werden keine Nutzungsdaten gesammelt.
- **Kein Account.** Keine Anmeldung, keine E-Mail-Adresse, keine ID.
- **Keine externen API-Aufrufe** (ausser dem einmaligen Modell-Download von der CDN beim ersten Start).

Der Lernfortschritt wird ausschliesslich im **`localStorage`** des Browsers gespeichert. Das ist ein lokaler Speicher, der nur dem jeweiligen Browser auf dem jeweiligen Computer zugänglich ist.

**Reset des Fortschritts:** Über den **„Fortschritt zurücksetzen"**-Button im Trainer. Damit wird der gespeicherte Stand sofort gelöscht.

**Hinweis zur Cloud-Bereitstellung:** Wenn Sie den Trainer auf Netlify oder einem anderen Hoster bereitstellen, bleibt der Lernfortschritt standardmässig im `localStorage` des jeweiligen Browsers — beim Wechsel des Geräts oder Cache-Leeren geht er verloren. Beim Hosting auf Netlify mit aktivierten Blobs (siehe Online-Bereitstellung weiter unten) wird der Fortschritt zusätzlich pro Schüler-Name in der Netlify-Cloud gespeichert und ist auf jedem Gerät verfügbar.

**Hinweis bei Netlify-Hosting mit Cloud-Sync:** Wenn die App auf Netlify mit Cloud-Sync läuft, werden der eingegebene Name (normalisiert) und die Counter-Statistik (richtig/teilweise/falsch pro Lehrziel) auf dem Netlify-Speicher abgelegt. Es werden keine Antworten, Fragen oder Eingaben über die KI gesendet. Schülern empfehlen, einen Vornamen oder Spitznamen statt vollständiger Namen einzugeben.

---

## FAQ

### „Das Modell lädt ewig."

Nur **beim ersten Mal**. Je nach Modell und Verbindung 1–10 Minuten. Eine stabile Internetverbindung hilft. Ab dem zweiten Start liegt das Modell im Browser-Cache und ist innert Sekunden bereit.

### „Mein Browser zeigt eine WebGPU-Warnung."

Dann unterstützt der Browser kein WebGPU. Bitte **Chrome, Edge oder Arc** in einer aktuellen Version verwenden. Safari und Firefox funktionieren aktuell nicht zuverlässig.

### „Die KI sagt, meine richtige Antwort sei falsch."

Das kann bei kleinen Modellen vorkommen. Empfehlungen:

1. Auf **„Musterlösung anzeigen"** klicken und vergleichen – manchmal fehlt nur ein Detail.
2. **Schwierigkeitsgrad** anpassen.
3. Ein **grösseres Modell** wählen (z.B. Qwen2.5-7B, sofern Hardware ausreicht).
4. Mit der Klasse **kritisch reflektieren**: Wo lag die KI daneben, wo hatte sie recht? Das ist ein wertvolles Lernmoment.

### „Kann ich eigene Fragen oder Lehrziele einbauen?"

Aktuell nur über eine Anpassung der Lehrziele-Liste direkt im HTML-Code (`finanzsystem-trainer.html`). Eine Bedienoberfläche dafür gibt es noch nicht.

### „Funktioniert das Tool offline?"

**Ja**, nach dem ersten Modell-Download. Solange der Browser-Cache nicht geleert wird, läuft alles ohne Internet.

### „Wie viel Strom verbraucht das?"

Spürbar mehr als reine Webseiten, weil die GPU rechnet. Auf Laptops sinkt die Akkulaufzeit während der Nutzung. Für lange Sessions Netzteil empfohlen.

### „Mein Computer wird heiss / der Lüfter dreht hoch."

Normal. Das Modell rechnet auf der GPU. Nach dem Schliessen des Tabs hört das wieder auf.

### „Kann ich mehrere Modelle parallel ausprobieren?"

Ja, im Modell-Wahlmenü. Jedes Modell wird separat heruntergeladen und gecached. Achtung: jedes Modell belegt 1–4 GB im Browser-Cache.

### „Wie nehme ich meinen Fortschritt auf ein anderes Gerät mit?"

Wenn der Trainer **auf Netlify mit Cloud-Sync** läuft (siehe „Online-Bereitstellung"), erfolgt das automatisch: Den gleichen Namen auf dem anderen Gerät eingeben — der Fortschritt wird aus der Cloud geladen.

Lokal (`python3 start.py`) oder ohne Cloud-Sync gibt es derzeit keinen direkten Weg, den `localStorage` zu transferieren — am einfachsten ist dann der CSV-Export für den eigenen Überblick.

### „Ich habe meinen Namen vergessen / will einen neuen Namen verwenden."

In der Sidebar oben rechts neben dem aktuellen Namen auf **„abmelden"** klicken. Beim nächsten Start kommt das Namens-Modal wieder.

### „Funktioniert die Cloud-Synchronisierung auch lokal mit `python3 start.py`?"

Nein. Der Endpoint `/api/progress` existiert nur, wenn die Seite über Netlify (oder einen anderen Host mit Functions-Support) ausgeliefert wird. Lokal mit `start.py` funktioniert das Tool weiter, schreibt aber nur in den Browser-Speicher. Die Sidebar zeigt dann „Cloud nicht erreichbar – arbeite lokal weiter.".

---

## Bekannte Limitationen

- **Kein iPad / iPhone-Support.** WebGPU auf iOS ist noch eingeschränkt; das Modell lädt dort meist nicht oder nur sehr langsam.
- **Sprache:** nur Deutsch. Französisch, Italienisch und Englisch sind aktuell nicht implementiert.
- **Keine Mehrbenutzer-Funktion.** Jeder PC speichert seinen eigenen Fortschritt im Browser. Es gibt keine zentrale Klassen-Übersicht.
- **Modellqualität.** Die kleinen Modelle sind beeindruckend, aber nicht auf dem Niveau grosser Cloud-LLMs.
- **Keine Bilder oder Diagramme.** Der Trainer arbeitet rein textbasiert.
- **Browser-Cache-Abhängigkeit.** Wenn der Browser-Cache geleert wird (oder Inkognito-Modus genutzt wird), muss das Modell neu heruntergeladen werden.

---

## Online-Bereitstellung (optional)

Wenn Sie den Trainer über einen Link an Schülerinnen und Schüler verteilen möchten – statt jede Person den Ordner herunterladen zu lassen – können Sie ihn als statische Webseite hosten. Auch online läuft das KI-Modell **weiterhin lokal im Browser des Schülers**: der Hosting-Anbieter liefert nur die HTML/JSON aus, sieht aber keine Antworten und kann keine Nutzung mitlesen.

### Variante: Netlify (empfohlen, kostenlos)

Im Ordner liegt eine vorkonfigurierte `netlify.toml` mit den richtigen Headern und einem Redirect von `/` direkt auf `finanzsystem-trainer.html`.

1. Ordnerinhalt in ein neues GitHub- oder GitLab-Repository pushen (mind. `finanzsystem-trainer.html` und `netlify.toml`, optional `lehrziele.json`).
2. Auf [netlify.com](https://www.netlify.com/) anmelden (gratis).
3. **„Add new site" → „Import an existing project"** wählen und das Repository verbinden.
4. Build command leer lassen, Publish directory `.` (Punkt). Deployen.
5. Netlify gibt eine HTTPS-URL aus (z.B. `https://mein-finanzsystem-trainer.netlify.app`). Diese URL kann an die Klasse verteilt werden.

**Vorteile:**

- Schülerinnen und Schüler brauchen weder Python noch lokales Setup.
- HTTPS ist automatisch aktiv (für WebGPU notwendig).
- Updates an Lehrzielen oder Prompts: einmal ins Repo pushen, Netlify deployt automatisch neu.

**Nicht vergessen:**

- Auch online wird beim ersten Aufruf das KI-Modell heruntergeladen (1–4 GB). Das passiert pro Schüler einmal pro Browser. Bei einer ganzen Klasse gleichzeitig kann ein gutes Schul-WLAN helfen.
- Datenschutz bleibt gewahrt: Antworten werden nicht an den Server gesendet, der Lernfortschritt liegt im Browser des Schülers (oder bei aktivem Cloud-Sync zusätzlich pro Name im Netlify-Blob-Store).

#### Cloud-Sync für den Lernfortschritt aktivieren

Mit Netlify wird zusätzlich der Lernfortschritt jedes Schülers in **Netlify Blobs** (Key-Value-Speicher) abgelegt. Der Schüler gibt beim Start einmalig seinen Namen ein und kann auf jedem Gerät mit demselben Namen weiterarbeiten.

**Netlify Blobs ist auf allen Plans (auch Free) automatisch verfügbar — es gibt keinen „Enable"-Knopf.** Der Store wird beim ersten Function-Aufruf transparent angelegt.

1. Repo auf Netlify deployen (Build command leer, Publish directory `.`).
2. Im Netlify-Dashboard im Tab **„Functions"** prüfen, dass die Function `progress` aufgelistet ist (zeigt: Function wurde erkannt und deployed).
3. Site-URL öffnen, Namen eingeben, eine Frage beantworten. In der Sidebar muss in der Zeile „Sync" der Status **„Synchronisiert HH:MM"** erscheinen (statt „offline").
4. Erst danach erscheint im Tab **„Blobs"** der Store `finanzsystem-trainer` mit den Einträgen pro Schülername. (Solange noch nichts geschrieben wurde, zeigt der Tab nur eine Info-Seite — das ist normal.)

> Falls in der Sidebar dauerhaft „Cloud nicht erreichbar" steht: prüfen, ob die Function unter Functions-Tab gelistet ist und unter Deploys keine Build-Errors stehen. Häufigste Ursache: `netlify.toml` nicht im Root oder `package.json` fehlt im Repo.

**Free-Tier-Limits** (Stand 2026): ca. 100k Speicher-Operationen pro Monat und 5 GB Storage. Für eine Schulklasse mehr als ausreichend.

**Datenschutz:** Im Blob-Store landet ausschliesslich der vom Schüler eingegebene Name (zu einem Schlüssel normalisiert) und die zugehörige Counter-Statistik. Keine Antworten, keine Fragen, keine personenbezogenen Daten ausser dem Namen. DSGVO-Hinweis im Klassenkontext: Den Schülern empfehlen, einen Vornamen oder Spitznamen statt Vor- und Nachname zu verwenden.

**Anonym arbeiten:** Schüler, die keine Cloud-Speicherung möchten, klicken im Start-Modal auf **„Anonym fortfahren"**. Der Fortschritt bleibt dann nur lokal im Browser.

### Andere Hosts

Da der Trainer eine reine statische Webseite ist, funktioniert auch jeder andere Static-Hosting-Dienst: GitHub Pages, Cloudflare Pages, Vercel, eine eigene `nginx`-Instanz, ein Schulserver mit Apache. Wichtig: HTTPS muss aktiv sein (für WebGPU), und `.wasm`-Dateien müssen mit dem MIME-Typ `application/wasm` ausgeliefert werden (machen die meisten Hoster automatisch).

---

## Lizenz / Verwendung im Unterricht

Frei für Bildungszwecke (Schulen, Hochschulen, private Lernkreise). Bitte nicht kommerziell weiterverbreiten oder unter eigenem Namen veröffentlichen. Anpassungen und Erweiterungen für den eigenen Unterricht sind ausdrücklich erwünscht.

---

*Viel Erfolg im Unterricht! Bei Fragen oder Verbesserungsvorschlägen zur Aufgabenqualität: einfach die Lehrziele und Prompts in der HTML-Datei anpassen – alles ist offen einsehbar.*
