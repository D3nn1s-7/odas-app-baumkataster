/*
 * Baumkataster-App
 * Visualisiert kommunale Baumkataster-Daten interaktiv.
 *
 * Unterstützte Datenformate (auto-detect):
 *  - OpenDataSoft API v2  { total_count, results: [...] }
 *  - OpenDataSoft API v1  { records: [{fields:{...}}] }
 *  - CKAN Datastore API   { result: { records: [...] } }
 *  - Direktes JSON-Array  [{...}, ...]
 *  - CSV (Semikolon-getrennt, via /exports/csv)
 *
 * ConfigData (JSON) enthält:
 *   apiurl  : "https://...",  // URL zur JSON/CSV-Ressource (Pflicht)
 *   titel   : "Baumkataster", // optional
 *   limit   : 5000            // optional, max. Datensätze laden (default 5000)
 */
function app(configdata, enclosingHtmlDivElement) {
  // ── Fortschrittsbalken-CSS und Ladebereich-HTML ──────────────────────────
  function renderContent(container) {
    container.innerHTML = `
      <style>
        #lade-container { margin: 40px auto; max-width: 500px; text-align: center; color: #212529; font-size: 0.95rem; }
        #lade-balken-wrapper { background: #e9ecef; border-radius: 8px; overflow: hidden; height: 12px; margin: 16px 0 10px; border: 1px solid #dee2e6; }
        #lade-balken { height: 100%; width: 0%; background: linear-gradient(90deg, #00bcd4, #4caf50); border-radius: 8px; transition: width 0.3s ease; }
        #lade-text { font-size: 0.85rem; color: #212529; }
        @keyframes pulsieren {
          0%   { width: 20%; margin-left: 0%; }
          50%  { width: 40%; margin-left: 50%; }
          100% { width: 20%; margin-left: 0%; }
        }
        #lade-balken.unbekannt { animation: pulsieren 1.5s ease-in-out infinite; }
      </style>
      <div id="lade-container">
        <div style="font-size:1.1rem; margin-bottom:8px;">🌳 Baumdaten werden geladen…</div>
        <div id="lade-balken-wrapper">
          <div id="lade-balken"></div>
        </div>
        <div id="lade-text">Verbinde mit Datenquelle…</div>
      </div>
    `;
  }

  // ── CSV mit Streaming und Fortschritt laden ──────────────────────────────
  async function loadCsvWithProgress(url) {
    let totalCount = 0;
    try {
      // Basis-URL extrahieren (bis zum ersten ?)
      const baseUrl = url.split("?")[0];
      // Dataset-Pfad: /exports/csv → /records
      const recordsBase = baseUrl.replace("/exports/csv", "/records");
      const metaUrl = recordsBase + "?limit=1";
      const meta = await fetch(metaUrl).then((r) => r.json());
      totalCount = meta.total_count || 0;
    } catch (e) {
      console.warn("Meta-Request fehlgeschlagen:", e);
    }

    // Fortschritt initialisieren
    const balken = document.getElementById("lade-balken");
    const text = document.getElementById("lade-text");
    if (totalCount > 0) {
      if (text)
        text.textContent = `0 von ${totalCount.toLocaleString("de-DE")} Zeilen geladen (0 %)`;
    } else {
      if (balken) balken.classList.add("unbekannt");
      if (text) text.textContent = "Daten werden geladen…";
    }

    const response = await fetch(url);
    const contentLength = response.headers.get("Content-Length");
    const totalBytes = contentLength ? parseInt(contentLength) : 0;

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let receivedBytes = 0;
    let csvText = "";
    let lastLines = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      receivedBytes += value.length;
      csvText += decoder.decode(value, { stream: true });

      if (totalBytes > 0) {
        // Byte-basierter Fortschritt
        const pct = Math.min(
          100,
          Math.round((receivedBytes / totalBytes) * 100),
        );
        if (balken) balken.style.width = pct + "%";
        if (text) {
          const mb = (receivedBytes / 1024 / 1024).toFixed(1);
          const mbTotal = (totalBytes / 1024 / 1024).toFixed(1);
          text.textContent = `${mb} MB von ${mbTotal} MB geladen (${pct} %)`;
        }
      } else if (totalCount > 0) {
        // Zeilen-basierter Fortschritt (alle ~5000 Zeilen aktualisieren)
        const lines = csvText.split("\n").length - 1;
        if (lines - lastLines >= 5000) {
          lastLines = lines;
          const pct = Math.min(100, Math.round((lines / totalCount) * 100));
          if (balken) balken.style.width = pct + "%";
          if (text)
            text.textContent = `ca. ${lines.toLocaleString("de-DE")} von ${totalCount.toLocaleString("de-DE")} Zeilen geladen (${pct} %)`;
        }
      }
    }

    // Abschluss
    if (balken) {
      balken.classList.remove("unbekannt");
      balken.style.width = "100%";
    }
    if (text)
      text.textContent = `${totalCount > 0 ? totalCount.toLocaleString("de-DE") : "Alle"} Zeilen geladen ✓`;

    return csvText;
  }

  // ── Haupteinstieg ────────────────────────────────────────────────────────
  const apiUrl = configdata.apiurl || configdata.apiUrl;
  const appTitel = configdata.titel || "Baumkataster";
  const maxLimit = configdata.limit || 5000;

  if (!apiUrl) {
    enclosingHtmlDivElement.innerHTML = `
      <div class="alert alert-warning mt-4">
        <strong>Konfigurationsfehler:</strong> Keine API-URL angegeben. de>apiurl</code> fehlt in der config.json.
      </div>`;
    return null;
  }

  // Ladebereich anzeigen
  renderContent(enclosingHtmlDivElement);

  // Chart.js dynamisch laden, falls nicht vorhanden
  function ensureChartJsLoaded(callback) {
    if (window.Chart) {
      callback();
      return;
    }
    if (document.getElementById("chartjs-script")) {
      document
        .getElementById("chartjs-script")
        .addEventListener("load", callback);
      return;
    }
    const script = document.createElement("script");
    script.id = "chartjs-script";
    script.src =
      "https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js";
    script.onload = callback;
    script.onerror = () => {
      enclosingHtmlDivElement.innerHTML = `<div class="alert alert-danger mt-4">Chart.js konnte nicht geladen werden.</div>`;
    };
    document.head.appendChild(script);
  }

  // Daten laden und nach Chart.js-Load rendern
  loadAllRecords(apiUrl, maxLimit)
    .then((records) => {
      if (!records || records.length === 0)
        throw new Error("Keine Datensätze gefunden.");
      ensureChartJsLoaded(() => {
        renderApp(records, enclosingHtmlDivElement, appTitel);
        // Ladebereich ausblenden
        const ladeContainer = document.getElementById("lade-container");
        if (ladeContainer) ladeContainer.remove();
      });
    })
    .catch((err) => {
      enclosingHtmlDivElement.innerHTML = `
        <div class="alert alert-danger mt-4">
          <strong>Fehler beim Laden der Daten:</strong> ${escapeHtml(err.message)}
          <hr>URL: de>${escapeHtml(apiUrl)}</code>
        </div>`;
    });

  return null;

  // ── Fortschrittsbalken-Hilfsfunktion ────────────────────────────────────
  function updateProgress(geladen, gesamt, seitenNr) {
    const balken = document.getElementById("lade-balken");
    const text = document.getElementById("lade-text");
    if (!balken || !text) return;
    const pct =
      gesamt > 0 ? Math.min(100, Math.round((geladen / gesamt) * 100)) : 0;
    balken.style.width = pct + "%";
    if (gesamt > 0) {
      text.textContent = `${geladen.toLocaleString("de-DE")} von ${gesamt.toLocaleString("de-DE")} Bäumen geladen (${pct} %)`;
    } else {
      text.textContent = `Seite ${seitenNr} wird geladen…`;
    }
  }

  // ── DATEN LADEN (paginiert / CSV) ────────────────────────────────────────
  async function loadAllRecords(apiUrl, maxLimit) {
    const PAGE_SIZE = 100;
    let allRecords = [];
    let offset = 0;
    let seite = 1;

    const urlLower = apiUrl.toLowerCase();
    const isCsv =
      urlLower.includes("/exports/csv") || urlLower.includes("delimiter=");

    if (isCsv) {
      let csvUrl = apiUrl;
      if (!/[?&]limit=/.test(csvUrl)) {
        csvUrl += (csvUrl.includes("?") ? "&" : "?") + "limit=-1";
      }
      const csvText = await loadCsvWithProgress(csvUrl);
      return parseCsv(csvText);
    }

    // JSON Pagination
    const resp = await fetch(buildUrl(apiUrl, PAGE_SIZE, offset));
    if (!resp.ok) throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
    const firstJson = await resp.json();
    const {
      records: firstBatch,
      totalCount,
      isOdsSingle,
    } = parseResponse(firstJson);
    allRecords = allRecords.concat(firstBatch);
    offset += PAGE_SIZE;
    updateProgress(allRecords.length, totalCount || 0, seite);
    seite++;

    if (
      isOdsSingle ||
      totalCount === null ||
      allRecords.length >= Math.min(totalCount, maxLimit)
    ) {
      updateProgress(allRecords.length, totalCount || 0, seite);
      return normalizeRecords(allRecords);
    }

    while (allRecords.length < Math.min(totalCount, maxLimit)) {
      const nextResp = await fetch(buildUrl(apiUrl, PAGE_SIZE, offset));
      if (!nextResp.ok) break;
      const nextJson = await nextResp.json();
      const { records: batch } = parseResponse(nextJson);
      if (!batch || batch.length === 0) break;
      allRecords = allRecords.concat(batch);
      offset += PAGE_SIZE;
      updateProgress(allRecords.length, totalCount || 0, seite);
      seite++;
    }

    updateProgress(allRecords.length, totalCount || 0, seite);
    return normalizeRecords(allRecords.slice(0, maxLimit));
  }

  function buildUrl(apiUrl, limit, offset) {
    const base = apiUrl.split("?")[0];
    const params = new URLSearchParams(
      apiUrl.includes("?") ? apiUrl.split("?")[1] : "",
    );
    params.set("limit", limit);
    if (offset > 0) params.set("offset", offset);
    return `${base}?${params.toString()}`;
  }

  function parseResponse(json) {
    if (Array.isArray(json?.results))
      return {
        records: json.results,
        totalCount: json.total_count ?? null,
        isOdsSingle: false,
      };
    if (Array.isArray(json?.records) && json.records[0]?.fields)
      return {
        records: json.records.map((r) => r.fields),
        totalCount: json.nhits ?? null,
        isOdsSingle: false,
      };
    if (json?.result && Array.isArray(json.result.records))
      return {
        records: json.result.records,
        totalCount: json.result.total ?? null,
        isOdsSingle: false,
      };
    if (Array.isArray(json))
      return { records: json, totalCount: json.length, isOdsSingle: true };
    throw new Error("Unbekanntes JSON-Format.");
  }

  // ── NORMALISIERUNG ───────────────────────────────────────────────────────
  function normalizeRecords(records) {
    if (!records.length) return [];
    const sample = records[0];
    const keys = Object.keys(sample);
    const clean = (s) =>
      String(s)
        .toLowerCase()
        .replace(/[_\-\s]/g, "");
    const find = (...aliases) => {
      for (const a of aliases) {
        const k = keys.find((k) => clean(k).includes(a));
        if (k) return k;
      }
      return null;
    };
    const kArtDeutsch = find(
      "artdeutsc",
      "artdeutsch",
      "artname",
      "deutsch",
      "baumart",
    );
    const kArtBotanik = find("artbotani", "botanisch", "latein", "species");
    const kPflanzjahr = find("pflanzjahr", "pflanzung", "year", "jahr");
    const kAlter = find("standalter", "alter", "age");
    const kHoehe = find("baumhoehe", "hoehe", "height");
    const kStamm = find("stammdurch", "stamm", "trunk");
    const kKrone = find("kronendurc", "krone", "crown");
    const kBezirk = find(
      "stadtbezbe",
      "stadtbez",
      "bezirk",
      "district",
      "stadtteil",
    );
    const kBezirkNr = find("stadtbeznr");
    const kKommune = find("kommune", "stadt", "city");
    const kGeo = find(
      "geopoint2d",
      "geopoint",
      "geopunkt",
      "position",
      "koordinate",
    );

    return records.map((r) => {
      let lat = null,
        lon = null;
      if (kGeo && r[kGeo]) {
        const g = r[kGeo];
        if (typeof g === "object") {
          lat = g.lat;
          lon = g.lon;
        } else if (typeof g === "string" && g.includes(",")) {
          [lat, lon] = g.split(",").map(Number);
        }
      }
      return {
        artDeutsch: String(r[kArtDeutsch] || "Unbekannt").trim(),
        artBotanik: String(r[kArtBotanik] || "").trim(),
        pflanzjahr: parseInt(r[kPflanzjahr]) || null,
        alter: parseFloat(r[kAlter]) || null,
        hoehe: parseFloat(r[kHoehe]) || null,
        stamm: parseFloat(r[kStamm]) || null,
        krone: parseFloat(r[kKrone]) || null,
        bezirk: String(r[kBezirk] || "Unbekannt").trim(),
        bezirkNr: kBezirkNr ? String(r[kBezirkNr]) : null,
        kommune: String(r[kKommune] || "").trim(),
        lat,
        lon,
      };
    });
  }

  // ── RENDERING ────────────────────────────────────────────────────────────
  function renderApp(allRecords, container, appTitel) {
    const bezirke = [
      ...new Set(allRecords.map((r) => r.bezirk).filter(Boolean)),
    ].sort();
    const kommunen = [
      ...new Set(allRecords.map((r) => r.kommune).filter(Boolean)),
    ].sort();
    const kommuneLabel = kommunen.length === 1 ? ` · ${kommunen[0]}` : "";

    const bezirkOptionen = bezirke
      .map((b) => `<option value="${escapeHtml(b)}">${escapeHtml(b)}</option>`)
      .join("");

    container.innerHTML = `
      <h2 class="mb-1">${escapeHtml(appTitel)}</h2>
      <p class="text-muted mb-3">Interaktiver Überblick über den kommunalen Baumbestand${kommuneLabel ? escapeHtml(kommuneLabel) : ""}</p>
      <div class="d-flex flex-wrap align-items-center gap-3 mb-4">
        <div class="d-flex align-items-center gap-2">
          <label class="form-label fw-semibold mb-0">Stadtbezirk:</label>
          <select id="bk-bezirk-select" class="form-select form-select-sm" style="width:auto;min-width:180px">
            <option value="">Alle Bezirke</option>
            ${bezirkOptionen}
          </select>
        </div>
        <div class="d-flex align-items-center gap-2">
          <input type="text" id="bk-search" class="form-control form-control-sm" placeholder="Baumart suchen…" style="width:220px">
        </div>
      </div>

      <!-- KPI-Kacheln -->
      <div id="bk-kpis" class="row g-3 mb-4"></div>

      <!-- Charts -->
      <div class="row g-4 mb-4">
        <div class="col-lg-6">
          <div class="card border-secondary h-100">
            <div class="card-body">
              <h6 class="card-title fw-semibold">Top-15 Baumarten</h6>
              <div style="position:relative;max-height:340px">
                <canvas id="bk-chart-arten" style="max-height:320px"></canvas>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="card border-secondary h-100">
            <div class="card-body">
              <h6 class="card-title fw-semibold">Pflanzungen pro Jahrzehnt</h6>
              <div style="position:relative;max-height:340px">
                <canvas id="bk-chart-jahrzehnte" style="max-height:320px"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Altersverteilung -->
      <div class="card border-secondary mb-4">
        <div class="card-body">
          <h6 class="card-title fw-semibold">Altersverteilung (Pflanzjahr-Histogramm)</h6>
          <div style="position:relative;max-height:200px">
            <canvas id="bk-chart-alter" style="max-height:180px"></canvas>
          </div>
        </div>
      </div>

      <!-- Karte -->
      <div class="card border-secondary mb-4">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="card-title fw-semibold mb-0">Baumstandorte</h6>
            <div class="btn-group btn-group-sm" role="group">
              <button id="bk-map-heatmap" class="btn btn-primary btn-sm">Heatmap</button>
              <button id="bk-map-punkte" class="btn btn-outline-secondary btn-sm">Einzelpunkte</button>
            </div>
          </div>
          <div id="bk-karte" style="height:480px; border-radius:8px; z-index:0;"></div>
        </div>
      </div>

      <!-- Detailtabelle -->
      <div class="card border-secondary">
        <div class="card-body p-0">
          <div class="d-flex justify-content-between align-items-center p-3 border-bottom">
            <span class="fw-semibold">Detailtabelle</span>
            <span id="bk-table-count" class="badge bg-secondary"></span>
          </div>
          <div style="max-height:420px;overflow-y:auto">
            <table class="table table-sm table-hover mb-0">
              <thead class="table-dark sticky-top">
                <tr>
                  <th>Baumart deutsch</th><th>Botanisch</th><th>Pflanzjahr</th>
                  <th>Alter J.</th><th>Höhe m</th><th>Stamm cm</th>
                  <th>Krone m</th><th>Stadtbezirk</th>
                </tr>
              </thead>
              <tbody id="bk-table-body"></tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // State
    let currentBezirk = "";
    let currentSearch = "";
    let sortCol = null; // aktuell sortierte Spalte (Feldname als String)
    let sortDir = "asc"; // 'asc' oder 'desc'
    let artenChart = null,
      jahrzehnteChart = null,
      alterChart = null;
    let leafletMap = null;
    let heatLayer = null;
    let punkteLayer = null;
    let karteInitialisiert = false;
    function renderKarte(records) {
      // Nur Datensätze mit gültigen Koordinaten
      const mitGeo = records.filter(
        (r) => r.lat && r.lon && !isNaN(r.lat) && !isNaN(r.lon),
      );
      if (mitGeo.length === 0) return;

      const mapEl = document.getElementById("bk-karte");
      if (!mapEl) return;

      // Karte und Layer nur einmal initialisieren
      if (!window._bk_leafletMap) {
        function ladeLeaflet(callback) {
          if (window.L) {
            callback();
            return;
          }
          const css = document.createElement("link");
          css.rel = "stylesheet";
          css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(css);

          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.onload = () => {
            const heat = document.createElement("script");
            heat.src =
              "https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js";
            heat.onload = callback;
            document.head.appendChild(heat);
          };
          document.head.appendChild(script);
        }

        ladeLeaflet(() => {
          // Karte erstellen
          const center = [mitGeo[0].lat, mitGeo[0].lon];
          window._bk_leafletMap = L.map("bk-karte").setView(center, 12);

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
          }).addTo(window._bk_leafletMap);

          window._bk_heatLayer = null;
          window._bk_punkteLayer = null;

          // Buttons initialisieren (nur einmal!)
          const btnHeat = document.getElementById("bk-map-heatmap");
          const btnPunkte = document.getElementById("bk-map-punkte");

          btnHeat.replaceWith(btnHeat.cloneNode(true));
          btnPunkte.replaceWith(btnPunkte.cloneNode(true));

          const btnHeatNew = document.getElementById("bk-map-heatmap");
          const btnPunkteNew = document.getElementById("bk-map-punkte");

          btnHeatNew.addEventListener("click", () => {
            zeigeHeatmap(mitGeo);
            btnHeatNew.className = "btn btn-primary btn-sm";
            btnPunkteNew.className = "btn btn-outline-secondary btn-sm";
          });

          btnPunkteNew.addEventListener("click", () => {
            zeigePunkte(mitGeo);
            btnPunkteNew.className = "btn btn-primary btn-sm";
            btnHeatNew.className = "btn btn-outline-secondary btn-sm";
          });

          // Standard: Heatmap anzeigen
          zeigeHeatmap(mitGeo);
          btnHeatNew.className = "btn btn-primary btn-sm";
          btnPunkteNew.className = "btn btn-outline-secondary btn-sm";
        });
      } else {
        // Karte existiert schon, nur Layer aktualisieren
        zeigeHeatmap(mitGeo);
        const btnHeat = document.getElementById("bk-map-heatmap");
        const btnPunkte = document.getElementById("bk-map-punkte");
        if (btnHeat && btnPunkte) {
          btnHeat.className = "btn btn-primary btn-sm";
          btnPunkte.className = "btn btn-outline-secondary btn-sm";
        }
        btnHeat.replaceWith(btnHeat.cloneNode(true));
        btnPunkte.replaceWith(btnPunkte.cloneNode(true));
        const btnHeatNew = document.getElementById("bk-map-heatmap");
        const btnPunkteNew = document.getElementById("bk-map-punkte");
        btnHeatNew.addEventListener("click", () => {
          zeigeHeatmap(mitGeo);
          btnHeatNew.className = "btn btn-primary btn-sm";
          btnPunkteNew.className = "btn btn-outline-secondary btn-sm";
        });
        btnPunkteNew.addEventListener("click", () => {
          zeigePunkte(mitGeo);
          btnPunkteNew.className = "btn btn-primary btn-sm";
          btnHeatNew.className = "btn btn-outline-secondary btn-sm";
        });
      }

      function zeigeHeatmap(mitGeo) {
        const map = window._bk_leafletMap;
        if (!map) return;
        if (window._bk_punkteLayer) {
          map.removeLayer(window._bk_punkteLayer);
          window._bk_punkteLayer = null;
        }
        if (window._bk_heatLayer) {
          map.removeLayer(window._bk_heatLayer);
          window._bk_heatLayer = null;
        }
        const heatData = mitGeo.map((r) => [r.lat, r.lon, 0.5]);
        window._bk_heatLayer = L.heatLayer(heatData, {
          radius: 10,
          blur: 8,
          maxZoom: 17,
          gradient: {
            0.2: "#4caf50",
            0.5: "#ffeb3b",
            0.8: "#ff5722",
            1.0: "#b71c1c",
          },
        }).addTo(map);
        const bounds = L.latLngBounds(
          mitGeo.slice(0, 1000).map((r) => [r.lat, r.lon]),
        );
        map.fitBounds(bounds, { padding: [20, 20] });
      }

      function zeigePunkte(mitGeo) {
        const map = window._bk_leafletMap;
        if (!map) return;
        if (window._bk_heatLayer) {
          map.removeLayer(window._bk_heatLayer);
          window._bk_heatLayer = null;
        }
        if (window._bk_punkteLayer) {
          map.removeLayer(window._bk_punkteLayer);
          window._bk_punkteLayer = null;
        }
        const renderer = L.canvas({ padding: 0.5 });
        window._bk_punkteLayer = L.layerGroup();
        mitGeo.forEach((r) => {
          L.circleMarker([r.lat, r.lon], {
            renderer,
            radius: 3,
            color: "#2d7a2d",
            fillColor: "#4caf50",
            fillOpacity: 0.7,
            weight: 0.5,
          })
            .bindPopup(
              `
                <strong>${escapeHtml(r.artDeutsch)}</strong><br>
                <em>${escapeHtml(r.artBotanik)}</em><br>
                Pflanzjahr: ${r.pflanzjahr || "–"}<br>
                Höhe: ${r.hoehe ? r.hoehe.toFixed(1) + " m" : "–"}<br>
                Bezirk: ${escapeHtml(r.bezirk)}
              `,
            )
            .addTo(window._bk_punkteLayer);
        });
        window._bk_punkteLayer.addTo(map);
        const bounds = L.latLngBounds(
          mitGeo.slice(0, 1000).map((r) => [r.lat, r.lon]),
        );
        map.fitBounds(bounds, { padding: [20, 20] });
      }

      function escapeHtml(str) {
        return String(str)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      }
    }

    function getFiltered() {
      return allRecords.filter((r) => {
        if (currentBezirk && r.bezirk !== currentBezirk) return false;
        if (currentSearch) {
          const s = currentSearch.toLowerCase();
          if (
            !r.artDeutsch.toLowerCase().includes(s) &&
            !r.artBotanik.toLowerCase().includes(s) &&
            !r.bezirk.toLowerCase().includes(s)
          )
            return false;
        }
        return true;
      });
    }

    function renderKpis(records) {
      const total = records.length;
      const mitAlter = records.filter((r) => r.alter !== null);
      const avgAlter = mitAlter.length
        ? (mitAlter.reduce((s, r) => s + r.alter, 0) / mitAlter.length).toFixed(
            1,
          )
        : "–";
      const mitHoehe = records.filter((r) => r.hoehe !== null && r.hoehe > 0);
      const avgHoehe = mitHoehe.length
        ? (mitHoehe.reduce((s, r) => s + r.hoehe, 0) / mitHoehe.length).toFixed(
            1,
          )
        : "–";
      const anzBezirke = new Set(records.map((r) => r.bezirk)).size;
      const kpiEl = document.getElementById("bk-kpis");
      if (!kpiEl) return;
      kpiEl.innerHTML = `
        <div class="col-6 col-md-3">
          <div class="card border-success h-100"><div class="card-body text-center py-3">
            <div class="fs-3 fw-bold text-success">${total.toLocaleString("de-DE")}</div>
            <div class="text-muted small">Bäume gesamt</div>
          </div></div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card border-info h-100"><div class="card-body text-center py-3">
            <div class="fs-3 fw-bold text-info">${avgAlter} J.</div>
            <div class="text-muted small">Ø Baumalter</div>
          </div></div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card border-warning h-100"><div class="card-body text-center py-3">
            <div class="fs-3 fw-bold text-warning">${avgHoehe} m</div>
            <div class="text-muted small">Ø Baumhöhe</div>
          </div></div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card border-secondary h-100"><div class="card-body text-center py-3">
            <div class="fs-3 fw-bold">${anzBezirke}</div>
            <div class="text-muted small">Stadtbezirke</div>
          </div></div>
        </div>
      `;
    }

    function renderArtenChart(records) {
      const map = new Map();
      records.forEach((r) => {
        const key = r.artDeutsch || "Unbekannt";
        map.set(key, (map.get(key) || 0) + 1);
      });
      const sorted = [...map.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15);
      const labels = sorted.map(([k]) => kuerze(k, 30));
      const data = sorted.map(([, v]) => v);
      const ctx = document.getElementById("bk-chart-arten");
      if (!ctx) return;
      if (artenChart) artenChart.destroy();
      artenChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Anzahl Bäume",
              data,
              backgroundColor: "rgba(25,135,84,0.75)",
              borderColor: "rgba(25,135,84,1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ctx.parsed.x.toLocaleString("de-DE") + " Bäume",
              },
            },
          },
          scales: {
            x: { ticks: { callback: (v) => v.toLocaleString("de-DE") } },
            y: { ticks: { font: { size: 11 } } },
          },
        },
      });
    }

    function renderJahrzehnteChart(records) {
      const map = new Map();
      records.forEach((r) => {
        if (!r.pflanzjahr || r.pflanzjahr < 1800 || r.pflanzjahr > 2030) return;
        const jahrzehnt = Math.floor(r.pflanzjahr / 10) * 10;
        map.set(jahrzehnt, (map.get(jahrzehnt) || 0) + 1);
      });
      const sorted = [...map.entries()].sort((a, b) => a[0] - b[0]);
      const labels = sorted.map(([k]) => `${k}er`);
      const data = sorted.map(([, v]) => v);
      const ctx = document.getElementById("bk-chart-jahrzehnte");
      if (!ctx) return;
      if (jahrzehnteChart) jahrzehnteChart.destroy();
      jahrzehnteChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Pflanzungen",
              data,
              backgroundColor: "rgba(13,110,253,0.7)",
              borderColor: "rgba(13,110,253,1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ctx.parsed.y.toLocaleString("de-DE") + " Bäume",
              },
            },
          },
          scales: {
            x: { ticks: { maxRotation: 45, font: { size: 11 } } },
            y: { ticks: { callback: (v) => v.toLocaleString("de-DE") } },
          },
        },
      });
    }

    function renderAlterChart(records) {
      const buckets = {};
      const step = 10;
      records.forEach((r) => {
        if (!r.alter || r.alter < 0 || r.alter > 300) return;
        const b = Math.floor(r.alter / step) * step;
        buckets[b] = (buckets[b] || 0) + 1;
      });
      const sorted = Object.entries(buckets).sort(
        (a, b) => Number(a[0]) - Number(b[0]),
      );
      const labels = sorted.map(([k]) => `${k}–${Number(k) + step - 1} J.`);
      const data = sorted.map(([, v]) => v);
      const ctx = document.getElementById("bk-chart-alter");
      if (!ctx) return;
      if (alterChart) alterChart.destroy();
      alterChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Anzahl Bäume",
              data,
              backgroundColor: "rgba(255,193,7,0.7)",
              borderColor: "rgba(255,193,7,1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ctx.parsed.y.toLocaleString("de-DE") + " Bäume",
              },
            },
          },
          scales: {
            x: { ticks: { maxRotation: 45, font: { size: 10 } } },
            y: { ticks: { callback: (v) => v.toLocaleString("de-DE") } },
          },
        },
      });
    }

    function renderTabelle(records) {
      const tbody = document.getElementById("bk-table-body");
      const countEl = document.getElementById("bk-table-count");
      if (!tbody) return;

      // Sortierung anwenden
      let sorted = [...records];
      if (sortCol) {
        sorted.sort((a, b) => {
          let va = a[sortCol],
            vb = b[sortCol];
          if (va === null || va === undefined) return 1;
          if (vb === null || vb === undefined) return -1;
          if (typeof va === "string") va = va.toLowerCase();
          if (typeof vb === "string") vb = vb.toLowerCase();
          if (va < vb) return sortDir === "asc" ? -1 : 1;
          if (va > vb) return sortDir === "asc" ? 1 : -1;
          return 0;
        });
      }

      const anzeige = sorted.slice(0, 500);
      if (countEl)
        countEl.textContent = `${records.length.toLocaleString("de-DE")} Bäume${records.length > 500 ? " · Top 500" : ""}`;

      // Pfeil-Icon je nach Sortierzustand
      const pfeil = (col) => {
        if (sortCol !== col)
          return ' <span style="color:#aaa;font-size:0.75em">↕</span>';
        return sortDir === "asc"
          ? ' <span style="color:#0d6efd;font-size:0.85em">↑</span>'
          : ' <span style="color:#0d6efd;font-size:0.85em">↓</span>';
      };

      // Tabellenkopf mit klickbaren Spalten neu rendern
      const thead = document
        .querySelector("#bk-table-body")
        ?.closest("table")
        ?.querySelector("thead tr");
      if (thead) {
        const cols = [
          { key: "artDeutsch", label: "Baumart deutsch" },
          { key: "artBotanik", label: "Botanisch" },
          { key: "pflanzjahr", label: "Pflanzjahr" },
          { key: "alter", label: "Alter J." },
          { key: "hoehe", label: "Höhe m" },
          { key: "stamm", label: "Stamm cm" },
          { key: "krone", label: "Krone m" },
          { key: "bezirk", label: "Stadtbezirk" },
        ];
        thead.innerHTML = cols
          .map(
            (c) => `
          <th style="cursor:pointer;white-space:nowrap;user-select:none;" 
              data-col="${c.key}">
            ${c.label}${pfeil(c.key)}
          </th>
        `,
          )
          .join("");

        // Klick-Listener auf jeden th
        thead.querySelectorAll("th[data-col]").forEach((th) => {
          th.addEventListener("click", () => {
            const col = th.dataset.col;
            if (sortCol === col) {
              sortDir = sortDir === "asc" ? "desc" : "asc";
            } else {
              sortCol = col;
              sortDir = "asc";
            }
            renderTabelle(getFiltered());
          });
        });
      }

      // Tabelleninhalt rendern
      if (anzeige.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-3">
      Keine Bäume für die aktuelle Auswahl.</td></tr>`;
        return;
      }

      tbody.innerHTML = anzeige
        .map(
          (r) => `
        <tr>
          <td>${escapeHtml(r.artDeutsch)}</td>
          <td class="text-muted fst-italic small">${escapeHtml(r.artBotanik)}</td>
          <td>${r.pflanzjahr || ""}</td>
          <td>${r.alter !== null ? r.alter : ""}</td>
          <td>${r.hoehe !== null ? r.hoehe.toFixed(1) : ""}</td>
          <td>${r.stamm !== null ? r.stamm : ""}</td>
          <td>${r.krone !== null ? r.krone.toFixed(2) : ""}</td>
          <td>${escapeHtml(r.bezirk)}</td>
        </tr>
      `,
        )
        .join("");
    }

    function updateAll() {
      const records = getFiltered();
      renderKpis(records);
      renderArtenChart(records);
      renderJahrzehnteChart(records);
      renderAlterChart(records);
      renderKarte(records);
      renderTabelle(records);
    }

    // Event-Listener
    document
      .getElementById("bk-bezirk-select")
      ?.addEventListener("change", (e) => {
        currentBezirk = e.target.value;
        updateAll();
      });
    document.getElementById("bk-search")?.addEventListener("input", (e) => {
      currentSearch = e.target.value.trim();
      updateAll();
    });

    // Initiales Rendering
    updateAll();
  }

  // ── HILFSFUNKTIONEN ──────────────────────────────────────────────────────
  function kuerze(str, maxLen) {
    if (!str) return "";
    return str.length <= maxLen ? str : str.slice(0, maxLen - 1) + "…";
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function parseCsv(text) {
    const lines = text
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .split("\n")
      .filter((l) => l.trim());
    if (lines.length < 2) throw new Error("CSV enthält zu wenig Zeilen.");
    const sep = lines[0].includes(";") ? ";" : ",";
    const headers = splitCsvLine(lines[0], sep).map((h) =>
      h.trim().replace(/^"|"$/g, ""),
    );
    const records = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = splitCsvLine(lines[i], sep);
      if (vals.length < 2) continue;
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = (vals[idx] || "").trim().replace(/^"|"$/g, "");
      });
      records.push(obj);
    }
    return normalizeRecords(records);
  }

  function splitCsvLine(line, sep) {
    const result = [];
    let cur = "";
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        inQuote = !inQuote;
      } else if (c === sep && !inQuote) {
        result.push(cur);
        cur = "";
      } else {
        cur += c;
      }
    }
    result.push(cur);
    return result;
  }
} // Ende app()

// ── BIBLIOTHEKEN LADEN ───────────────────────────────────────────────────────
function addToHead() {
  // Wird nicht mehr benötigt – Chart.js wird dynamisch per ensureChartJsLoaded() geladen.
  return;
}
