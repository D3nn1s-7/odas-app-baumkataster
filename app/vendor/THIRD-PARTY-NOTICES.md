# Hinweise zu gebündelten Drittanbieter-Bibliotheken

Diese App liefert die folgenden Programmbibliotheken mit sich aus (`app/vendor/`).
Version und Herkunft jeder Datei wurden am 03.11.2026 byte-genau gegen die
angegebene Original-Auslieferung geprüft. Die vollständigen Lizenztexte stehen unten.

| Bibliothek | Version | Lizenz | Dateien |
| --- | --- | --- | --- |
| Bootstrap | 5.3.8 | MIT | `app/vendor/bootstrap/` |
| Leaflet | 1.9.4 | BSD-2-Clause | `app/vendor/leaflet/` |
| Leaflet.heat | 0.2.0 | BSD-2-Clause | `app/vendor/leafletheat/` |
| Chart.js | 4.4.9 | MIT | `app/vendor/chartjs/` |
| Papa Parse | 5.4.1 | MIT | `app/vendor/papaparse/` |

Die Bibliotheken werden unverändert weitergegeben. Ihre Lizenztexte sind
urheberrechtlich geschützt und dürfen nicht verändert werden.

## Bootstrap 5.3.8 — MIT

Herkunft: npm-Paket [`bootstrap@5.3.8`](https://www.npmjs.com/package/bootstrap/v/5.3.8), Dateien `dist/css/bootstrap.min.css` und `dist/js/bootstrap.bundle.min.js`, byte-identisch. Lizenztext: `LICENSE` aus dem npm-Paket.

```
The MIT License (MIT)

Copyright (c) 2011-2025 The Bootstrap Authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

## Leaflet 1.9.4 — BSD-2-Clause

Herkunft: npm-Paket [`leaflet@1.9.4`](https://www.npmjs.com/package/leaflet/v/1.9.4), Dateien `dist/leaflet.js`, `dist/leaflet.css` und `dist/images/*.png`, byte-identisch. Lizenztext: `LICENSE` aus dem npm-Paket.

```
BSD 2-Clause License

Copyright (c) 2010-2023, Volodymyr Agafonkin
Copyright (c) 2010-2011, CloudMade
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

## Leaflet.heat 0.2.0 — BSD-2-Clause

Herkunft: npm-Paket [`leaflet.heat@0.2.0`](https://www.npmjs.com/package/leaflet.heat/v/0.2.0), Datei `dist/leaflet-heat.js`, byte-identisch. Laut Kopfkommentar enthält die Datei auch [simpleheat](https://github.com/mourner/simpleheat) desselben Autors. Lizenztext: `LICENSE` aus dem npm-Paket (das Paket führt kein `license`-Feld; der Text ist die BSD-2-Clause-Lizenz).

```
Copyright (c) 2014, Vladimir Agafonkin
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are
permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice, this list of
      conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright notice, this list
      of conditions and the following disclaimer in the documentation and/or other materials
      provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

## Chart.js 4.4.9 — MIT

Herkunft: npm-Paket [`chart.js@4.4.9`](https://www.npmjs.com/package/chart.js/v/4.4.9), bezogen über jsDelivr (`https://cdn.jsdelivr.net/npm/chart.js@4.4.9/dist/chart.umd.min.js`). `chart.umd.min.js` ist byte-identisch zu dieser Auslieferung, also zu `dist/chart.umd.js` mit vorangestelltem jsDelivr-Hinweiskommentar. Lizenztext: `LICENSE.md` aus dem npm-Paket.

```
The MIT License (MIT)

Copyright (c) 2014-2024 Chart.js Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

## Papa Parse 5.4.1 — MIT

Herkunft: npm-Paket [`papaparse@5.4.1`](https://www.npmjs.com/package/papaparse/v/5.4.1), Datei `papaparse.min.js`, byte-identisch. Lizenztext: `LICENSE` aus dem npm-Paket.

```
The MIT License (MIT)

Copyright (c) 2015 Matthew Holt

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
