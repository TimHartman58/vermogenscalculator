# Vermogenscalculator

## Projectbesluiten
- HTML, CSS en JavaScript zonder framework.
- Rekenlogica in `berekening.js`, getest met `node --test`.
- Invoer: startbedrag, maandelijkse inleg, jaarrente, looptijd in jaren.
- Uitvoer: eindbedrag, totaal ingelegd, totale rente.
- Effectieve maandrente: `(1 + jaarrente) ^ (1/12) - 1`.
- Afronden op centen.
- Belasting (box 3) wordt niet meegerekend.
- Let op kommagetallen in JavaScript (0.1 + 0.2 is niet precies 0.3).
- Controle: 3% jaarrente levert na 12 maanden precies 3% op.

## Nog te beslissen in issue 2
- Moment van inleg: begin of eind van de maand.
- Wanneer afronden: elke maand of alleen de uitvoer.
- Rente-invoer: als percentage (5) of als fractie (0,05).

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
