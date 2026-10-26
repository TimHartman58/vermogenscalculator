// Koppelt het formulier aan de rekenkern. Alle logica zit in
// berekening.js, controle.js en opmaak.js; dit bestand geeft alleen door.

import { berekenVermogen } from './berekening.js';
import { controleerInvoer, controleerUitkomst } from './controle.js';
import { formatteerEuro } from './opmaak.js';

// In de volgorde van het formulier, zodat de focus naar het eerste foute veld gaat.
const TEKSTVELDEN = ['startbedrag', 'maandInleg', 'jaarrente', 'looptijdJaren', 'looptijdMaanden'];
const UITKOMSTEN = ['eindbedrag', 'totaalIngelegd', 'totaleRente'];

const formulier = document.getElementById('formulier');
const velden = formulier.elements;

function zetMelding(sleutel, tekst) {
  document.getElementById(`melding-${sleutel}`).textContent = tekst;
}

function wisMeldingen() {
  for (const veld of TEKSTVELDEN) {
    zetMelding(veld, '');
    velden[veld].removeAttribute('aria-invalid');
  }
  zetMelding('looptijd', '');
}

function wisUitkomst() {
  for (const id of UITKOMSTEN) {
    document.getElementById(id).textContent = '';
  }
  zetMelding('uitkomst', '');
}

function toonMeldingen(meldingen) {
  for (const [sleutel, tekst] of Object.entries(meldingen)) {
    zetMelding(sleutel, tekst);
  }
  // Een melding over de totale looptijd hoort bij beide looptijdvelden.
  const fouteVelden = Object.keys(meldingen).flatMap((sleutel) =>
    sleutel === 'looptijd' ? ['looptijdJaren', 'looptijdMaanden'] : [sleutel],
  );
  for (const veld of fouteVelden) {
    velden[veld].setAttribute('aria-invalid', 'true');
  }
  const eersteFouteVeld = TEKSTVELDEN.find((veld) => fouteVelden.includes(veld));
  velden[eersteFouteVeld].focus();
}

formulier.addEventListener('submit', (event) => {
  // Voorkomt dat de browser de pagina herlaadt.
  event.preventDefault();
  wisMeldingen();
  wisUitkomst();

  const teksten = Object.fromEntries(TEKSTVELDEN.map((veld) => [veld, velden[veld].value]));
  const { waarden, meldingen } = controleerInvoer(teksten);
  if (Object.keys(meldingen).length > 0) {
    toonMeldingen(meldingen);
    return;
  }

  const uitkomst = berekenVermogen({
    ...waarden,
    inlegMoment: velden.inlegMoment.value,
    renteMethode: velden.renteMethode.value,
  });
  const meldingUitkomst = controleerUitkomst(uitkomst);
  if (meldingUitkomst) {
    zetMelding('uitkomst', meldingUitkomst);
    return;
  }

  for (const id of UITKOMSTEN) {
    document.getElementById(id).textContent = formatteerEuro(uitkomst[id]);
  }
});

// Een oude uitkomst mag niet blijven staan bij nieuwe invoer.
formulier.addEventListener('input', wisUitkomst);
formulier.addEventListener('change', wisUitkomst);
