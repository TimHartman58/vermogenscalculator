// Controleert of de kleuren in style.css genoeg contrast hebben volgens
// WCAG 2.1: minimaal 4,5:1 voor tekst (1.4.3) en 3:1 voor randen van
// velden en knoppen (1.4.11). Formule uit de woordenlijst van WCAG 2.1
// ("relative luminance" en "contrast ratio"), w3.org/TR/WCAG21.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('./style.css', import.meta.url), 'utf8');

// Haalt alle --kleur-...: waarde; uit het :root-blok.
function leesKleuren(cssTekst) {
  const root = cssTekst.match(/:root\s*\{([^}]*)\}/);
  const kleuren = {};
  if (!root) {
    return kleuren;
  }
  for (const [, naam, waarde] of root[1].matchAll(/--kleur-([a-z-]+):\s*([^;]+);/g)) {
    kleuren[naam] = waarde.trim();
  }
  return kleuren;
}

const kleuren = leesKleuren(css);

// Hoe licht een kleur is voor het oog: 0 is zwart, 1 is wit.
function relatieveHelderheid(hex) {
  const [rood, groen, blauw] = [1, 3, 5].map((start) => {
    const kanaal = parseInt(hex.slice(start, start + 2), 16) / 255;
    return kanaal <= 0.04045 ? kanaal / 12.92 : ((kanaal + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rood + 0.7152 * groen + 0.0722 * blauw;
}

// Contrast tussen 1 (gelijk) en 21 (zwart op wit). Volgorde maakt niet uit.
function contrast(hexA, hexB) {
  const [licht, donker] = [relatieveHelderheid(hexA), relatieveHelderheid(hexB)].sort((a, b) => b - a);
  return (licht + 0.05) / (donker + 0.05);
}

function metKomma(getal) {
  return String(Math.round(getal * 100) / 100).replace('.', ',');
}

// Geeft de kleur uit style.css, of laat de test falen met een duidelijke reden.
function kleur(naam) {
  const waarde = kleuren[naam];
  assert.ok(waarde, `--kleur-${naam} ontbreekt in :root in style.css`);
  assert.match(waarde, /^#[0-9a-fA-F]{6}$/, `--kleur-${naam} is '${waarde}'; schrijf de kleur als #rrggbb`);
  return waarde;
}

// Eerst de formule zelf.
test('contrast: zwart op wit is 21:1', () => {
  assert.equal(contrast('#000000', '#ffffff'), 21);
});

test('contrast: een kleur op zichzelf is 1:1', () => {
  assert.equal(contrast('#1d4ed8', '#1d4ed8'), 1);
});

test('contrast: volgorde van de kleuren maakt niet uit', () => {
  assert.equal(contrast('#ffffff', '#000000'), contrast('#000000', '#ffffff'));
});

test('style.css bevat kleuren in :root', () => {
  assert.ok(Object.keys(kleuren).length > 0, 'geen --kleur-... gevonden in :root in style.css');
});

// Kleurparen zoals ze op de pagina voorkomen. De rode rand bij een fout
// veld en de focusrand (minimaal 3:1) zijn gedekt door fout en accent op
// achtergrond (minimaal 4,5:1).
const paren = [
  { voorgrond: 'tekst', achtergrond: 'achtergrond', waar: 'gewone tekst', minimum: 4.5 },
  { voorgrond: 'tekst-zacht', achtergrond: 'achtergrond', waar: 'uitleg en hint', minimum: 4.5 },
  { voorgrond: 'fout', achtergrond: 'achtergrond', waar: 'meldingen', minimum: 4.5 },
  { voorgrond: 'accent', achtergrond: 'achtergrond', waar: 'kop uitkomst', minimum: 4.5 },
  { voorgrond: 'achtergrond', achtergrond: 'accent', waar: 'tekst op de knop', minimum: 4.5 },
  { voorgrond: 'tekst', achtergrond: 'accent-licht', waar: 'uitkomst tijdens oplichten', minimum: 4.5 },
  { voorgrond: 'rand', achtergrond: 'achtergrond', waar: 'rand invoervelden', minimum: 3 },
];

for (const { voorgrond, achtergrond, waar, minimum } of paren) {
  test(`${voorgrond} op ${achtergrond} (${waar}): minimaal ${metKomma(minimum)}:1`, (t) => {
    const verhouding = contrast(kleur(voorgrond), kleur(achtergrond));
    t.diagnostic(`gemeten: ${metKomma(verhouding)}:1`);
    assert.ok(verhouding >= minimum, `contrast is ${metKomma(verhouding)}:1, minimaal ${metKomma(minimum)}:1 nodig`);
  });
}
