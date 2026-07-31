# Changelog

## 1.6.0 - 2026-07-31
- CHG: toter Konfigurationsschlüssel lizenz entfernt (F-17)
- CHG: nie gelesener Schlüssel schemaHinweis entfernt (F-17)
- CHG: brandingCSS und brandingCSSFile als Base-Abhängigkeiten deklariert und lokal gespiegelt (F-17)
- CHG: Groß-/Kleinschreibung der Config-Schlüssel vereinheitlicht, Fallback-Ketten entfernt (F-17)
- CHG: Satzlimit als App-Konstante festgeschrieben statt als undeklarierter Config-Schlüssel (F-17)
- CHG: format.typ von "String" auf v1-sicheres "string" korrigiert (F-18)
- CHG: dropdown-Default auf Feldebene verschoben statt in format (F-18)

## 1.5.0 - 2026-07-30

- **FIX:** Laufzeitfehler nach dem Laden der Konfiguration werden jetzt sichtbar gemeldet; `handleRouting()` wird `await`et und besitzt einen Fehlerpfad. Bisher blieb die Seite bei einem Fehler im Seitenaufbau stumm leer
- **FIX:** `getConfigUrl()` schneidet bei einer URL ohne abschliessenden Schraegstrich nicht mehr das letzte Verzeichnis ab; die Konfiguration wird auch unter `.../app` gefunden
- **FIX:** Klick auf einen Hash-Link, der bereits die aktive Seite bezeichnet, rendert die Seite neu (`setupSamePageLinks()`) - das Logo fuehrt damit aus Unteransichten zurueck zur Startseite
- **ENH:** `app/app-base.js` ist wieder byte-identisch zum Template `oda-generic` 1.4.0; app-spezifisches Aufraeumen laeuft ueber den neuen Hook `onPageLeave(page)` in `app/app.js`
- **FIX:** Der Pfad zur Branding-CSS wird jetzt relativ zum App-Verzeichnis aufgeloest (`../assets/branding.css`); bisher wurde die Datei beim lokalen Test unterhalb von `app/` gesucht und deshalb nicht gefunden

## 1.4.0 - 2026-07-24

- **FIX:** Laufzeit-Fehlermeldung wird vor der Anzeige HTML-maskiert (`escapeHtmlForBase`); ein Fehlertext kann kein Markup mehr in die Seite einschleusen (XSS)
- **FIX:** Startseiten-Renderer wird nun `await`et; bei asynchronen Apps erscheint kein kurzzeitiges `[object Promise]` in `#main-content`

## 1.3.0 - 2026-07-23

- **ENH:** Datenabruf auf den Schalter `proxyAktiv` umgestellt; direkte Abrufe sind der Standard, der ODAS-Proxy wird nur noch bei `ja` verwendet
- **ENH:** Einfachen Standalone-Betrieb hinter Traefik mit derselben `odas-config/config.json` wie in der Entwicklung ergänzt
- **ENH:** Traefik-Anbindung auf das externe Netzwerk `proxynet`, den EntryPoint `websecure` und den Zertifikatsresolver `letsencrypt` festgelegt
- **FIX:** Proxy-Basispfad funktioniert jetzt auch bei URLs mit `index.html`; der Ziel-Pfad wird URL-kodiert
- **FIX:** Doppelte escapeHtml-Definition zu einer kanonischen zusammengeführt
- **DOC:** Start über `STANDALONE=true make up` dokumentiert

## 1.2.2 — 2026-06-30

- FIX: Beschreibungsseite („Über diese App") strukturiert und vollständig. Die `beschreibung` hatte nur einen Abschnitt mit echter `##`-Überschrift; „Funktionen"/„Datenquelle" waren reiner Fließtext. Jetzt mit vollständigen Abschnitten (Für wen / Inhalte / Datenquelle / Open Data App Store) und dreistufiger Datenquelle-Linkliste (Portal → Datensatz → Ressource). Lokale `config.json` synchronisiert.

## 1.2.1 — 2026-06-26

- ENH: Datenfrische-Indikator aus Quellenmetadaten ergänzt.
- ENH: Abschnitt „Weitere Informationen" an das Schale-4-Panel-Pattern angepasst.
- ENH: KPI-Kontext-Hilfetexte an das Info-Icon-Pattern angepasst.

## 1.2.0 — 2026-06-16

- ENH: Methodikbox (ausklappbar) mit Datenquelle-Hinweis und Datenstand ergänzt (`datenquelleHinweis`, `datenStand`).
- ENH: KPI-Erklärungstexte unter den Kennzahlen ergänzt (`kpiKontext1`–`kpiKontext4`).

## 1.1.0 — 2026-06-16

- ENH: Schale-4-Verständlichkeit ergänzt – „Für wen ist diese App?"-Block in Beschreibung und README.
- ENH: Konfigurierbarer Abschnitt „Weitere Informationen" mit weiterführenden Links (neues Feld `weiterfuehrendeLinks`, leer = ausgeblendet).

## 1.0.0 — 2026-02-26 (Initial Release)

- Erste Veröffentlichung der App am 2026-02-26. Die App wurde an diesem Tag neu erstellt.

Implemented features:

- Interaktive Kartenansicht (Leaflet.js) mit Heatmap und Einzelpunkt-Darstellung
- Heatmap: Darstellung aller Punkte (kein 50.000-Limit)
- Einzelpunkte: Canvas-Renderer mit `L.circleMarker` (performant) und Popups für Details
- Robustere Karten-Logik: Karte wird nur einmal initialisiert; Toggle-Button-Listener werden nicht gestapelt
- CSV-Streaming mit Fortschrittsbalken; automatische Erkennung von JSON/CSV-Quellen
- KPI-Kacheln, Top-15 Baumarten, Pflanzungen pro Jahrzehnt, Altersverteilung (Chart.js)
- Detailtabelle (Top 500) und Filter (Stadtbezirk, Baumart-Suche)
- Dokumentation (`README.md`) und App-Metadaten (`app-package.json`) aktualisiert

## Hinweise

- Änderungen betreffen primär `app/app.js`, `README.md` und `app-package.json`.
- Test: Karte mit großem Datensatz (z. B. 151.204 Einträge) prüfen — Heatmap und Einzelpunkt-Umschaltung sollten flüssig funktionieren.
