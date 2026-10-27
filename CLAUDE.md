# Vermogenscalculator

## Projectbesluiten
- HTML, CSS en JavaScript zonder framework.
- Rekenlogica in `berekening.js`, getest met `node --test` (`berekening.test.js`).
- `berekening.js` is een ES-module (`export`/`import`). `package.json` bevat alleen `"type": "module"`. In de browser laden met `<script type="module">`; lokaal openen kan dan alleen via een lokale server (`python -m http.server 8000`, dan http://localhost:8000), niet door te dubbelklikken.
- Taakverdeling: `berekening.js` rekent, `opmaak.js` maakt bedragen op en leest invoer (getest met `opmaak.test.js`), `controle.js` controleert de invoer en de uitkomst (getest met `controle.test.js`), `app.js` koppelt alleen de pagina en wordt niet getest met `node --test`. `style.css` bevat alle opmaak, `favicon.svg` het spaarvarken.
- De pagina rekent pas bij de knop "Bereken" (of Enter), niet bij elke wijziging.
- Invoervelden zijn tekstvelden (`type="text"`, `inputmode="decimal"`) in Nederlandse notatie: punt = duizendtal, komma = decimaal. `leesGetal` zet om; leeg of onzin geeft `NaN`. Een punt die niet gevolgd wordt door precies drie cijfers (zoals "3.5") geeft een melding: "bedoel je 3,5?".
- Bedragen tonen via `Intl.NumberFormat('nl-NL')` in `formatteerEuro`. Tussen € en het bedrag staat een harde spatie (U+00A0); in tests `'€ 1.216,41'`.
- De notatie staat in constanten bovenaan `opmaak.js`. Een instelling voor de notatie volgt in issue #8.
- Invoer: startbedrag, maandelijkse inleg, jaarrente, looptijd in twee velden (jaren en maanden).
- `berekenVermogen` krijgt `looptijdMaanden` (heel getal, minimaal 1); anders een fout. `app.js` geeft jaren × 12 + maanden door.
- Invoergrenzen (in `controle.js`):
  - Startbedrag en maandelijkse inleg: leeg telt als 0; 0 t/m € 1.000.000.000; maximaal twee decimalen.
  - Jaarrente: verplicht; hoger dan -100% en hoogstens 999%.
  - Jaren 0 t/m 999 en maanden 0 t/m 11, hele getallen, leeg telt als 0. Totaal minimaal 1 maand en maximaal 999 jaar.
- Meldingen: per veld een tekst achter het veld, het veld krijgt `aria-invalid` en de focus gaat naar het eerste foute veld. Bij `Infinity` of `NaN` als uitkomst een melding boven de uitkomst. Opmaak: rode tekst en een rode rand, via CSS op `[aria-invalid="true"]` en `[id^="melding-"]`.
- De uitkomst wordt leeggemaakt zodra een veld of keuze verandert.
- Uitkomsten tonen via `formatteerUitkomst` (in `opmaak.js`): boven € 1 biljoen (10^12) de tekst "meer dan € 1 biljoen", onder € -1 biljoen "minder dan € -1 biljoen". Precies € 1 biljoen wordt nog als bedrag getoond. Lange bedragen lopen door op een volgende regel.
- Na een geslaagde berekening licht het uitkomstblok 1 seconde op (klasse `licht-op`, gezet in `app.js`). Uit bij `prefers-reduced-motion`.
- Opmaak: rustig en zakelijk, veel wit, één accentkleur, mobile first (brede schermen via `@media (min-width: 40rem)`).
- Kleuren staan als CSS-variabelen (`--kleur-...`) in `:root` bovenaan `style.css`, altijd als `#rrggbb`. `contrast.test.js` leest ze uit en controleert het WCAG-contrast: minimaal 4,5:1 voor tekst, 3:1 voor randen. Een nieuw kleurpaar op de pagina ook aan die test toevoegen.
- Favicon: `favicon.svg`, een egaal roze spaarvarken. De kleuren staan in het bestand zelf, los van de CSS-variabelen.
- Uitvoer: eindbedrag, totaal ingelegd, totale rente.
- Rente-invoer als percentage (3), intern als fractie (0,03).
- Moment van inleg instelbaar: `'eind'` (standaard) of `'begin'` van de maand.
- Rentemethode instelbaar: `'effectief'` (standaard), maandrente `(1 + jaarrente) ^ (1/12) - 1`, of `'nominaal'`, maandrente jaarrente / 12.
- Tussendoor niet afronden, alleen de uitkomst op centen.
- Totale rente = afgerond eindbedrag - afgerond totaal ingelegd.
- 0% rente moet werken (geen deling door de rente).
- Belasting (box 3) wordt niet meegerekend.
- Let op kommagetallen in JavaScript (0.1 + 0.2 is niet precies 0.3).
- Beperking: afronden met `Math.round(x * 100) / 100` kan bij randgevallen zoals 1,005 een cent te laag uitkomen (1,00 in plaats van 1,01).
- Controle: €1.000 zonder inleg, 3%, 1 jaar, effectief → €1.030,00.

## Werkregels
- Windows en PowerShell.
- Eén commando per blok.
- Kleine stappen.
- Wacht op akkoord voordat je verdergaat.
- Open nooit `.env`.
- Issues en PR's alleen met mijn akkoord.
- Leg uit zonder voorkennis te veronderstellen en leg vaktermen uit.
- Wees eerlijk over wat moeilijk is en wat ik zelf moet controleren.
- Geef tips voor betere prompts.
- Pas bestanden aan met de bewerkingstool, niet met een shell-commando, zodat ik de diff vooraf zie.
