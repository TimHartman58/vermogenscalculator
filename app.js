// Koppelt het formulier aan de rekenkern. Alle logica zit in
// berekening.js en opmaak.js; dit bestand geeft alleen door.

import { berekenVermogen } from './berekening.js';
import { formatteerEuro, leesGetal } from './opmaak.js';

const formulier = document.getElementById('formulier');

formulier.addEventListener('submit', (event) => {
  // Voorkomt dat de browser de pagina herlaadt.
  event.preventDefault();

  const velden = formulier.elements;
  const uitkomst = berekenVermogen({
    startbedrag: leesGetal(velden.startbedrag.value),
    maandInleg: leesGetal(velden.maandInleg.value),
    jaarrentePercentage: leesGetal(velden.jaarrente.value),
    looptijdJaren: leesGetal(velden.looptijd.value),
    inlegMoment: velden.inlegMoment.value,
    renteMethode: velden.renteMethode.value,
  });

  document.getElementById('eindbedrag').textContent = formatteerEuro(uitkomst.eindbedrag);
  document.getElementById('totaalIngelegd').textContent = formatteerEuro(uitkomst.totaalIngelegd);
  document.getElementById('totaleRente').textContent = formatteerEuro(uitkomst.totaleRente);
});
