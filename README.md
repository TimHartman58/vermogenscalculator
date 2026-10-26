# Vermogenscalculator

Een rekenhulp die laat zien hoeveel vermogen je opbouwt met een startbedrag, een maandelijkse inleg, een jaarrente en een looptijd in jaren. Je ziet het eindbedrag, het totaal dat je hebt ingelegd en de totale rente.

Gemaakt in HTML, CSS en JavaScript, zonder framework (oefenproject).

## Online

https://timhartman58.github.io/vermogenscalculator/

## Lokaal openen

Dubbelklikken op `index.html` werkt niet: de pagina laadt JavaScript als module, en browsers blokkeren dat bij bestanden vanaf je eigen schijf. Start daarom een lokale server. Je hebt [Python](https://www.python.org/) nodig. Draai in de projectmap:

```
python -m http.server 8000
```

Open daarna http://localhost:8000 in je browser. Stoppen doe je met Ctrl+C in het venster waar de server draait.

## Tests draaien

Je hebt [Node.js](https://nodejs.org/) nodig. Draai in de projectmap:

```
node --test
```

## Keuzemogelijkheden

- **Moment van inleg**: eind van de maand (standaard) of begin van de maand. Bij begin van de maand krijgt elke inleg een maand langer rente.
- **Rentemethode**: effectief (standaard) of jaarrente/12. Effectief geeft na een jaar precies de opgegeven jaarrente; bij jaarrente/12 kom je door rente-op-rente iets hoger uit (3% wordt ongeveer 3,04%).

De rente vul je in als percentage. Er wordt tussendoor niet afgerond, alleen de uitkomst op centen.

Getallen vul je in met Nederlandse notatie: een komma voor decimalen en een punt als duizendtalteken, bijvoorbeeld 3,5 of 10.000. Let op: 3.5 wordt gelezen als 35.

## Wat niet wordt meegerekend

- Belasting (box 3)
- Inflatie
- Kosten, zoals beheer- of transactiekosten

De uitkomst is een indicatie en geen financieel advies.
