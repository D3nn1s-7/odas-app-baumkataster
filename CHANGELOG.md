# Changelog

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
