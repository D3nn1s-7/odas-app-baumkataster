# Changelog


## 1.25.0 - 2026-08-17
- `apiurl.hilfe` verwendete das Wort „Datensatz" für das Feld, das explizit NICHT die Datensatzseite sein soll (plus Tippfehler „Ressoucen"); jetzt mit expliziter Abgrenzung zu `urlDaten` formuliert (F-68)

## 1.24.0 - 2026-08-17
- `fetchOdasJson()` wirft jetzt bei nicht-JSON-Antworten (CSV, HTML, leerer Body) eine sprechende Konfigurationsfehlermeldung statt der rohen `JSON.parse`-Parserfehlermeldung (F-66)
- `urlDaten` zeigte auf einen nicht mehr existierenden Host (`offenedaten.esslingen.de`/`open-data-esslingen.de`, NXDOMAIN) bzw. auf den Platzhalter `.../testdaten` (HTTP 404) — jetzt auf die reale Datensatz-Landingpage der tatsächlich konfigurierten `apiurl`-Quelle verweisend, live per HTTP-Abruf verifiziert (F-67)

## 1.23.0 - 2026-08-17
- **CHG:** `instanz-config`-`category`-Vokabular auf Deutsch umgestellt (`allgemein`, `beschreibung`, `datenherkunft`, `kontakt-rechtliches`, `sonstiges`); die entfallenen Kategorien `metrics` und `advanced` wurden auf `beschreibung` bzw. `sonstiges` verteilt

## 1.22.0 - 2026-08-12
- FIX: Laufzeitressourcen werden beim Seitenwechsel vollständig freigegeben (F-57): der Teardown wird jetzt synchron und früh in `renderApp()` registriert, sobald die Ressourcenclosure existiert — nicht erst im asynchronen Leaflet-Init-Callback. Er markiert die Instanz als disposed, ruft für `artenChart`, `jahrzehnteChart` und `alterChart` jeweils `destroy()` und setzt sie auf `null`, entfernt die `leafletMap` per `remove()`, nullt Heat- und Punkte-Layer und setzt `karteInitialisiert` zurück. Zusätzlich blockiert ein früher disposed-State in `app()` die späten `.then`-/`ensureChartJsLoaded`-Fortsetzungen nach einem Seitenwechsel vor `renderApp`, sodass keine Ressourcen oder DOM-Inhalte mehr erzeugt werden. Die vorhandenen pre-rebuild-destroy/removes bleiben erhalten

## 1.21.0 - 2026-08-12
- FIX: `app/index.html` auf den Template-Stand (F-47): Datei byte-gleich aus `oda-generic` übernommen — gültiges HTML, deutsche ARIA-Labels, Footer im Body; Titel und Fußzeile bleiben Platzhalter und werden zur Laufzeit aus der Instanz-Config überschrieben

## 1.20.0 - 2026-08-12
- FIX: Laufzeitressourcen einer Leaflet-Instanz werden beim Seitenwechsel freigegeben (F-51): neue Registry `baumTeardowns` (Container -> Teardown-Callback) mit Modul-Hook `onPageLeave`; die Karteninstanz registriert ihre Abbaufunktion in `renderContent()` (ruft `leafletMap.remove()`, setzt Karte, Heat-, Punkte-Layer und Initialisierungs-Flag zurück), sodass beim Verlassen der Seite keine globale Leaflet-Instanz samt Resize-Handlern zurückbleibt

## 1.19.0 - 2026-08-11
- FIX: CSV-Parsing auf PapaParse 5.4.1 umgestellt (F-40): `parseCsv` nutzt jetzt `Papa.parse` mit `header: true`, `skipEmptyLines: "greedy"` und Delimiter-Auto-Detect; gequotete Felder mit Zeilenumbruch und doppelten Anführungszeichen werden RFC-4180-konform geparst; PapaParse-Fehler werden als sichtbarer Datenfehler angezeigt statt still übergangen; der Alt-Helfer `splitCsvLine` entfällt
- FIX: Vollständige Pagination und konfigurierbare Feldmappings (F-41): die Obergrenze `MAX_RECORD_LIMIT` (5000) entfällt — JSON-Datenquellen werden bis zum gemeldeten Gesamtbestand geladen bzw. bis die Datenquelle eine leere Seite liefert; ein Fehler beim Abrufen weiterer Seiten bricht den Ladevorgang nicht mehr still ab, sondern zeigt sichtbar, dass Kennzahlen, Diagramme, Karte und Tabelle auf einem Teilbestand basieren. Neue optionale Instanz-Konfiguration `stadtbezirk-feld`, `baumart-feld`, `pflanzjahr-feld`, `baumhoehe-feld`, `standalter-feld`: gesetzt erzwingt sie das exakt genannte Quellfeld, fehlt das Feld in den Daten, erscheint ein sichtbarer Konfigurationsfehler statt des Alias-Fallbacks; leer = automatische Felderkennung

## 1.18.0 - 2026-08-07
- CHG: Bootstrap-Ziele instanzeindeutig (F-32): KPI-Kontext- und Methodik-Ziele (`#bk-kpi-kontext-<n>` und `#bk-methodik-body`) um eine Instanzkennung ergänzt — mehrere Instanzen derselben App auf einer Seite klappen ihre Panels unabhängig auf
- CHG: Leaflet-Karte container-gebunden: `L.map(root.querySelector("#bk-karte"))` statt `L.map("bk-karte")` — der dokumentweite ID-Lookup ist beseitigt

## 1.17.0 - 2026-08-07
- FIX: Kartenzustand aus Fensterglobalen in Instanz-Scope (Bestandsfehler): `window._bk_leafletMap`/`window._bk_heatLayer`/`window._bk_punkteLayer` durch die bereits vorhandenen lokalen Variablen `leafletMap`/`heatLayer`/`punkteLayer` ersetzt — zwei Instanzen derselben App überschreiben sich nicht mehr gegenseitig die Karte; der Daten-Cache `_bk_cachedRecordsMap` bleibt unverändert

## 1.16.0 - 2026-08-06
- CHG: DOM-Zugriffe auf den App-Container gescopt (F-25, Tranche 3): alle Elemente der App werden über den App-Container (root/container.querySelector) angesprochen statt über document; unpräfixierte IDs mit `bk-`-Präfix versehen (`lade-balken` → `bk-lade-balken`, `lade-text` → `bk-lade-text`, `lade-container` → `bk-lade-container` einschließlich der zugehörigen CSS-Selektoren im Ladebereich)

## 1.15.0 - 2026-08-06
- FIX: Datenschutzangabe beschreibt den tatsaechlichen Stand nach dem Vendoring (Welle G)

## 1.14.0 - 2026-08-06
- FIX: Drittanbietersektion nennt keine Beim-Aufruf-Behauptung mehr (Welle G)

## 1.13.0 - 2026-08-06
- FIX: Drittanbieterliste "Beim Aufruf kontaktierte Drittanbieter" an das Vendoring angepasst — jetzt lokal ausgelieferte Bibliotheken (Leaflet.heat) sind aus der Liste entfernt, weiterhin extern geladene Dienste (Kartenkacheln) bleiben genannt

## 1.12.0 - 2026-08-06
- FIX: Leaflet.heat vendored in `app/vendor/` statt von CDN geladen (Vendoring Teil 3) — Standalone-Betrieb laedt die Zusatzbibliotheken nicht mehr extern

## 1.11.0 - 2026-08-06
- FIX: Base auf Template oda-generic 1.6.0 vereinheitlicht (Hook renderPageOverride)

## 1.10.0 - 2026-08-04
- FIX: Datenschutzhinweis "Beim Aufruf kontaktierte Drittanbieter" an das Vendoring angepasst — jetzt lokal ausgelieferte Bibliotheken (Bootstrap/Leaflet/Chart.js) sind aus der Liste entfernt, weiterhin extern geladene Dienste (Kartenkacheln, Zusatzbibliotheken) bleiben genannt

## 1.9.0 - 2026-08-04
- FIX: Bootstrap, Leaflet, Chart.js vendored in `app/vendor/` statt von CDN geladen (F-07 Teil 2) — Standalone-Betrieb laedt diese Bibliotheken nicht mehr extern

## 1.8.0 - 2026-08-04
- FIX: Chart.js-Version vereinheitlicht auf 4.4.9 (vorher uneinheitlich gepinnt oder ganz ungepinnt, laedt bei jedem Aufruf die neueste Version) — Voraussetzung fuer das geplante Vendoring (F-07 Teil 2)

## 1.7.0 - 2026-08-04
- FIX: Drittanbieter (CDN, Kartendienste) in `datenschutz`-Default und README dokumentiert (F-07 Teil 1)
- FIX: Bootstrap CSS/JS auf einheitlich 5.3.8 gezogen (vorher gemischt 5.3.0/5.3.1 bzw. 5.3.0/5.3.0) (F-31)

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
