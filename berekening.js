// Rekenkern van de vermogenscalculator.
// Werkt in de browser (<script type="module">) en in Node (node --test).

const INLEGMOMENTEN = ['eind', 'begin'];
const RENTEMETHODEN = ['effectief', 'nominaal'];

// Rondt af op centen. Let op: randgevallen zoals 1.005 kunnen door
// floating point een cent te laag uitkomen.
function rondAf(bedrag) {
  return Math.round(bedrag * 100) / 100;
}

function maandrente(jaarrente, renteMethode) {
  if (renteMethode === 'nominaal') {
    return jaarrente / 12;
  }
  // Effectief: na 12 maanden precies de jaarrente.
  return Math.pow(1 + jaarrente, 1 / 12) - 1;
}

export function berekenVermogen({
  startbedrag,
  maandInleg,
  jaarrentePercentage,
  looptijdMaanden,
  inlegMoment = 'eind',
  renteMethode = 'effectief',
}) {
  // Alleen hele maanden, zodat de rekenlus en totaal ingelegd bij elkaar passen.
  if (!Number.isInteger(looptijdMaanden) || looptijdMaanden < 1) {
    throw new Error(`Ongeldige looptijdMaanden: ${looptijdMaanden}`);
  }
  if (!INLEGMOMENTEN.includes(inlegMoment)) {
    throw new Error(`Onbekend inlegMoment: ${inlegMoment}`);
  }
  if (!RENTEMETHODEN.includes(renteMethode)) {
    throw new Error(`Onbekende renteMethode: ${renteMethode}`);
  }

  const jaarrente = jaarrentePercentage / 100;
  const rente = maandrente(jaarrente, renteMethode);
  const maanden = looptijdMaanden;

  // Tussendoor niet afronden.
  let saldo = startbedrag;
  for (let maand = 0; maand < maanden; maand++) {
    if (inlegMoment === 'begin') {
      saldo += maandInleg;
    }
    saldo *= 1 + rente;
    if (inlegMoment === 'eind') {
      saldo += maandInleg;
    }
  }

  const eindbedrag = rondAf(saldo);
  const totaalIngelegd = rondAf(startbedrag + maandInleg * maanden);
  // Uit de afgeronde bedragen, zodat de drie uitkomsten precies optellen.
  const totaleRente = rondAf(eindbedrag - totaalIngelegd);

  return { eindbedrag, totaalIngelegd, totaleRente };
}
