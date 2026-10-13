const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const noop = () => {};
const c = vm.createContext({ console, window: { location: { href: "https://fixture.test/app/", pathname: "/app/" }, addEventListener: noop },
  document: { addEventListener: noop, querySelector: () => null, querySelectorAll: () => [] } });
vm.runInContext(fs.readFileSync(path.join(__dirname, "../app/app.js"), "utf8"), c);

// F-144: 0 Jahre ist nur mit Pflanzjahr ein Messwert. Dortmund kodiert unbekanntes Alter als
// standalter=0 ohne Pflanzjahr (82.708 von 157.550 Bäumen, Stand 13.10.2026).
test("Alter 0 mit Pflanzjahr bleibt 0", () => {
  assert.equal(c.baumAlter("0", "2026"), 0);
});
test("Alter 0 ohne Pflanzjahr ist unbekannt", () => {
  for (const pj of ["", undefined, null, "0"]) assert.equal(c.baumAlter("0", pj), null, String(pj));
});
test("normale und fehlende Alter", () => {
  assert.equal(c.baumAlter("78", "1948"), 78);
  assert.equal(c.baumAlter("12.5", ""), 12.5);
  assert.equal(c.baumAlter("", "1990"), null);
  assert.equal(c.baumAlter("k.A.", "1990"), null);
});
