#!/usr/bin/env python3
"""
Finanzsystem-Trainer — lokaler Launcher.

Startet einen kleinen HTTP-Server im aktuellen Ordner und oeffnet
finanzsystem-trainer.html automatisch im Standard-Browser.

Nutzung:
    python3 start.py
    python3 start.py --port 9000     # eigener Port
    python3 start.py --no-browser    # nur Server, ohne Browser zu oeffnen

Stoppen mit Ctrl+C.

Hintergrund:
- Die HTML-Datei nutzt ES-Module und (optional) eine externe lehrziele.json.
- Beides funktioniert NICHT bei Doppelklick (file://-Protokoll, CORS).
- Daher dieser kleine Launcher: er startet einen lokalen Server und
  oeffnet die richtige URL.
- Es werden KEINE Daten ins Internet gesendet — alles laeuft auf dem
  eigenen Rechner. Nur das KI-Modell wird beim ersten Start einmalig
  von einem CDN geladen und im Browser-Cache abgelegt.
"""

from __future__ import annotations

import argparse
import http.server
import os
import socket
import socketserver
import sys
import threading
import time
import webbrowser
from pathlib import Path

HTML_FILE = "finanzsystem-trainer.html"
DEFAULT_PORT = 8000


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    """SimpleHTTPRequestHandler ohne stdout-Geschwaetz pro Request."""

    def log_message(self, format, *args):  # noqa: A002 - signature vom Parent
        return


def find_free_port(preferred: int) -> int:
    for candidate in (preferred, *range(preferred + 1, preferred + 20)):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("127.0.0.1", candidate))
                return candidate
            except OSError:
                continue
    raise RuntimeError(f"Kein freier Port im Bereich {preferred}-{preferred + 19}.")


def serve(port: int, directory: Path) -> None:
    os.chdir(directory)
    handler = QuietHandler
    with socketserver.TCPServer(("127.0.0.1", port), handler) as httpd:
        url = f"http://127.0.0.1:{port}/{HTML_FILE}"
        print(f"Finanzsystem-Trainer laeuft auf {url}")
        print("Stoppen mit Ctrl+C.\n")
        httpd.serve_forever()


def main() -> int:
    parser = argparse.ArgumentParser(description="Finanzsystem-Trainer Launcher")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT, help="HTTP-Port (Default 8000)")
    parser.add_argument("--no-browser", action="store_true", help="Browser nicht automatisch oeffnen")
    args = parser.parse_args()

    here = Path(__file__).resolve().parent
    html_path = here / HTML_FILE
    if not html_path.exists():
        print(f"Fehler: {HTML_FILE} nicht gefunden in {here}", file=sys.stderr)
        return 1

    try:
        port = find_free_port(args.port)
    except RuntimeError as e:
        print(f"Fehler: {e}", file=sys.stderr)
        return 1

    if not args.no_browser:
        url = f"http://127.0.0.1:{port}/{HTML_FILE}"
        threading.Thread(target=lambda: (time.sleep(0.4), webbrowser.open(url)), daemon=True).start()

    try:
        serve(port, here)
    except KeyboardInterrupt:
        print("\nServer gestoppt.")
        return 0


if __name__ == "__main__":
    sys.exit(main())
