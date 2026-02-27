# Kommunaler Baumkataster – App für den Open Data App-Store (ODAS)

Die App **Baumkataster** bietet eine interaktive Visualisierung des kommunalen Baumbestands einer Stadt.
Die App ist eine ODAS App V1.

---

## Funktionen

Die App ist eine Single Page Application (Webapp) mit:

- Logo-Anzeige
- Menü
- Seiten für Impressum, Datenschutz, Beschreibung, Kontakt, Hauptinhalt
- Inhaltsbereich
- Fußzeile

Die Konfiguration wird vom ODAS geladen. Die App zeigt folgende Inhalte:

- **Kennzahlen**: Gesamtanzahl Bäume, Ø Baumalter, Ø Baumhöhe, Anzahl Stadtbezirke
- **Top-15 Baumarten**: Horizontales Balkendiagramm der häufigsten Baumarten
- **Pflanzungen pro Jahrzehnt**: Balkendiagramm der Neupflanzungen je Dekade
- **Altersverteilung**: Histogramm der Bäume nach Standalter
  - **Kartenansicht**: Interaktive Karte mit allen Baumstandorten (Leaflet.js, OpenStreetMap)
    - **Heatmap** (farbige Dichtekarte, unbegrenzte Anzahl Bäume)
    - **Einzelpunkte** (WebGL-basiert mit Leaflet.glify, performant für sehr große Datenmengen, Popup mit Details)
    - Umschaltbar zwischen Heatmap und Einzelpunkten
    - Automatische Filterung nach Stadtbezirk/Baumart wirkt auch auf die Karte
- **Stadtbezirk-Filter**: Alle Auswertungen und Karte filterbar nach Stadtbezirk
- **Baumart-Suche**: Freitextsuche zur Filterung nach Baumart

---

## Datenformat

Die App unterstützt sowohl **JSON** als auch **CSV** als Datenquelle:

- **JSON**: API-Endpunkt gibt ein Objekt mit `results`-Array zurück (z.B. OpenDataSoft `/records`-Endpunkt)
- **CSV**: API-Endpunkt liefert Semikolon-separierte CSV-Datei (z.B. OpenDataSoft `/exports/csv`-Endpunkt)

Die Erkennung erfolgt automatisch anhand der URL. CSV wird erkannt wenn die URL `/exports/csv` oder `delimiter=` enthält.

---

## Kompatible Datensätze

Die App ist kompatibel mit kommunalen Baumkataster-Datensätzen, die folgende Kernfelder enthalten:

| Schema-Feld        | Beschreibung         | Dortmund-Beispiel |
| ------------------ | -------------------- | ----------------- |
| `id`               | Eindeutige Baum-ID   | `id`              |
| `art_botanisch`    | Botanischer Artname  | `art_botani`      |
| `art_deutsch`      | Deutscher Artname    | `art_deutsc`      |
| `pflanzjahr`       | Pflanzjahr           | `pflanzjahr`      |
| `standalter_jahre` | Standalter in Jahren | `standalter`      |
| `baumhoehe_m`      | Baumhöhe in Metern   | `baumhoehe`       |
| `stadtbezirk_name` | Stadtbezirk          | `stadtbezbe`      |

Die Feldnamen können in der Instanz-Konfiguration der App angepasst werden.

---

## Entwicklung

### Systemvoraussetzungen

- Docker / Docker Compose
- Make

Die Entwicklung wurde getestet unter Windows und Ubuntu.

### Starten

```bash
make build up
```

Die App wird gestartet und steht auf Port 8089 zur Verfügung: http://localhost:8089

Weil die App mit localhost gestartet wird, wird die Konfiguration lokal geladen.

### Aufbau der App

Der Inhaltsbereich wird in `app.js` erstellt. Dort ist die gesamte Visualisierungslogik implementiert.

### Wichtige Dateien

| Datei                      | Beschreibung                                                            |
| -------------------------- | ----------------------------------------------------------------------- |
| `app.js`                   | Hauptlogik: Datenladen, Aufbereitung, Chart.js-Diagramme, Leaflet-Karte |
| `app-package.json`         | App-Metadaten und Instanz-Konfigurationsfelder für den ODAS             |
| `schema.json`              | Frictionless Data Schema – allgemeingültiges Datenmodell                |
| `assets/odas-app-icon.svg` | App-Icon                                                                |
| `config.json`              | Lokale Konfiguration für die Entwicklung                                |

---

## Kartenfunktion

Die App verwendet [Leaflet.js](https://leafletjs.com/), [Leaflet.heat](https://github.com/Leaflet/Leaflet.heat) und [Leaflet.glify](https://github.com/robertleeplummerjr/Leaflet.glify) für die performante Darstellung aller Baumstandorte – unabhängig von der Anzahl – als Heatmap oder Einzelpunkte. Die Einzelpunktdarstellung nutzt WebGL für maximale Performance auch bei sehr großen Datensätzen (z.B. >100.000 Bäume). Die Karte nutzt OpenStreetMap-Kacheln und benötigt keinen API-Key. Die Ansicht kann zwischen Heatmap und Einzelpunkten umgeschaltet werden. Die Filter (Bezirk, Baumart) wirken direkt auf die Karte.

**Hinweis:** Dank WebGL (Leaflet.glify) können alle Einzelpunkte auch bei sehr großen Datensätzen flüssig dargestellt werden.

## Konfiguration (Instanz)

Folgende Parameter werden bei der App-Instanzierung im ODAS konfiguriert:

| Parameter          | Beschreibung                                      | Pflicht |
| ------------------ | ------------------------------------------------- | ------- |
| `apiurl`           | URL zum JSON- oder CSV-Endpunkt der Baudaten      | ja      |
| `urlDaten`         | URL zur Katalog-Seite des Datensatzes im ODP      | ja      |
| `stadtbezirk-feld` | Feldname für Stadtbezirk im Quelldatensatz        | ja      |
| `baumart-feld`     | Feldname für deutschen Artnamen im Quelldatensatz | ja      |
| `pflanzjahr-feld`  | Feldname für Pflanzjahr im Quelldatensatz         | ja      |
| `baumhoehe-feld`   | Feldname für Baumhöhe im Quelldatensatz           | nein    |
| `standalter-feld`  | Feldname für Standalter im Quelldatensatz         | nein    |
| `titel`            | Anzeigetitel der App                              | ja      |
| `seitentitel`      | Browser-Tab-Titel                                 | ja      |

Was bei der App-Entwicklung beachtet werden sollte, steht in der ODA-Spezifikation.

---

## Autor

© 2026, Ondics GmbH
