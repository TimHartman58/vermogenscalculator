# Vermogenscalculator

## Projectbesluiten
- HTML, CSS en JavaScript zonder framework.
- Rekenlogica in `berekening.js`, getest met `node --test` (`berekening.test.js`).
- `berekening.js` is een ES-module (`export`/`import`). `package.json` bevat alleen `"type": "module"`. In de browser laden met `<script type="module">`; lokaal openen kan dan alleen via een lokale server (bijv. Live Server), niet door te dubbelklikken.
- Invoer: startbedrag, maandelijkse inleg, jaarrente, looptijd in jaren.
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
