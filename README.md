# Vermogenscalculator

Een rekenhulp die laat zien hoeveel vermogen je opbouwt met een startbedrag, een maandelijkse inleg, een jaarrente en een looptijd in jaren en maanden. Je ziet het eindbedrag, het totaal dat je hebt ingelegd en de totale rente.

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

Getallen vul je in met Nederlandse notatie: een komma voor decimalen en een punt als duizendtalteken, bijvoorbeeld 3,5 of 10.000. Typ je 3.5, dan vraagt de pagina of je 3,5 bedoelt.

## Invoerregels

- **Startbedrag en maandelijkse inleg**: leeg telt als 0; tussen € 0 en € 1.000.000.000; maximaal twee cijfers achter de komma.
- **Jaarrente**: verplicht; hoger dan -100% en hoogstens 999%.
- **Looptijd**: hele jaren (0 tot en met 999) en hele maanden (0 tot en met 11). Samen minimaal 1 maand en maximaal 999 jaar.

Klopt de invoer niet, dan verschijnt er een melding bij het veld en wordt er niet gerekend.

## Heel grote uitkomsten

Is een uitkomst groter dan € 1 biljoen (1.000.000.000.000), dan toont de pagina "meer dan € 1 biljoen". Onder € -1 biljoen staat er "minder dan € -1 biljoen". Precies € 1 biljoen wordt nog als bedrag getoond.

## Kleuren aanpassen

De kleuren staan bovenaan `style.css`, in het blok `:root`, als variabelen zoals `--kleur-accent: #1d4ed8;`. Pas daar de waarde aan; de rest van de pagina gebruikt die variabelen. Schrijf een kleur altijd als `#` met zes tekens.

Draai daarna `node --test`. De test controleert of tekst en randen genoeg contrast hebben met hun achtergrond, volgens de toegankelijkheidsrichtlijn WCAG 2.1 (minimaal 4,5:1 voor tekst en 3:1 voor randen). Bij te weinig contrast faalt de test en zie je welk kleurpaar het is.

De kleuren van het favicon (het spaarvarken in het tabblad) staan apart in `favicon.svg`.

## Wat niet wordt meegerekend

- Belasting (box 3)
- Inflatie
- Kosten, zoals beheer- of transactiekosten

De uitkomst is een indicatie en geen financieel advies.
