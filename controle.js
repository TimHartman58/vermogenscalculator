// Invoercontrole: zet de tekst uit de velden om naar getallen en geeft
// per veld een melding als de invoer niet bruikbaar is.

import { leesGetal, DUIZENDTALTEKEN, DECIMAALTEKEN } from './opmaak.js';

const MAX_BEDRAG = 1_000_000_000;
const MIN_RENTE = -100; // uitgesloten: bij -100% is alles weg
const MAX_RENTE = 999;
const MAX_JAREN = 999;
const MAX_MAANDEN_IN_VELD = 11;
const MAX_LOOPTIJD_MAANDEN = MAX_JAREN * 12;

function goed(waarde) {
  return { waarde, melding: null };
}

function fout(melding) {
  return { waarde: NaN, melding };
}

// Een punt die niet gevolgd wordt door precies drie cijfers (zoals 3.5 of
// 1.00) is waarschijnlijk als decimaalteken bedoeld.
function meldingBijTwijfelachtigePunt(tekst) {
  const delen = tekst.split(DUIZENDTALTEKEN);
  const twijfelachtig = delen.slice(1).some((deel) => !/^\d{3}(?!\d)/.test(deel));
  if (!twijfelachtig) {
    return null;
  }
  if (delen.length === 2) {
    return `Gebruik een komma voor decimalen: bedoel je ${delen.join(DECIMAALTEKEN)}?`;
  }
  return 'Gebruik een komma voor decimalen en een punt alleen voor duizendtallen.';
}

function aantalDecimalen(tekst) {
  const [, decimalen = ''] = tekst.split(DECIMAALTEKEN);
  return decimalen.length;
}

// Startbedrag en maandelijkse inleg. Leeg telt als 0.
export function controleerBedrag(tekst) {
  const schoon = tekst.trim();
  if (schoon === '') {
    return goed(0);
  }
  const twijfel = meldingBijTwijfelachtigePunt(schoon);
  if (twijfel) {
    return fout(twijfel);
  }
  const waarde = leesGetal(schoon);
  if (Number.isNaN(waarde)) {
    return fout('Vul een getal in.');
  }
  if (waarde < 0) {
    return fout('Het bedrag mag niet negatief zijn.');
  }
  if (waarde > MAX_BEDRAG) {
    return fout('Het bedrag mag maximaal € 1.000.000.000 zijn.');
  }
  if (aantalDecimalen(schoon) > 2) {
    return fout('Gebruik maximaal twee cijfers achter de komma.');
  }
  return goed(waarde);
}

// Jaarrente in procenten. Verplicht.
export function controleerRente(tekst) {
  const schoon = tekst.trim();
  if (schoon === '') {
    return fout('Vul een rente in. Vul 0 in voor geen rente.');
  }
  const twijfel = meldingBijTwijfelachtigePunt(schoon);
  if (twijfel) {
    return fout(twijfel);
  }
  const waarde = leesGetal(schoon);
  if (Number.isNaN(waarde)) {
    return fout('Vul een getal in.');
  }
  if (waarde <= MIN_RENTE) {
    return fout('De rente moet hoger zijn dan -100%.');
  }
  if (waarde > MAX_RENTE) {
    return fout('De rente mag maximaal 999% zijn.');
  }
  return goed(waarde);
}

// Gedeelde controle voor de velden jaren en maanden. Leeg telt als 0.
function controleerHeelGetal(tekst, max, meervoud, eenheid) {
  const schoon = tekst.trim();
  if (schoon === '') {
    return goed(0);
  }
  const twijfel = meldingBijTwijfelachtigePunt(schoon);
  if (twijfel) {
    return fout(twijfel);
  }
  const waarde = leesGetal(schoon);
  if (Number.isNaN(waarde)) {
    return fout('Vul een getal in.');
  }
  if (!Number.isInteger(waarde)) {
    return fout(`Vul hele ${meervoud} in.`);
  }
  if (waarde < 0 || waarde > max) {
    return fout(`Vul 0 tot en met ${max} ${eenheid} in.`);
  }
  return goed(waarde);
}

export function controleerJaren(tekst) {
  return controleerHeelGetal(tekst, MAX_JAREN, 'jaren', 'jaar');
}

export function controleerMaanden(tekst) {
  return controleerHeelGetal(tekst, MAX_MAANDEN_IN_VELD, 'maanden', 'maanden');
}

// Controleert het hele formulier. Alle invoer is tekst.
// Geeft { waarden, meldingen }. meldingen bevat alleen velden met een
// probleem; een leeg object betekent dat alles in orde is.
export function controleerInvoer({ startbedrag, maandInleg, jaarrente, looptijdJaren, looptijdMaanden }) {
  const velden = {
    startbedrag: controleerBedrag(startbedrag),
    maandInleg: controleerBedrag(maandInleg),
    jaarrente: controleerRente(jaarrente),
    looptijdJaren: controleerJaren(looptijdJaren),
    looptijdMaanden: controleerMaanden(looptijdMaanden),
  };

  const meldingen = {};
  for (const [veld, { melding }] of Object.entries(velden)) {
    if (melding) {
      meldingen[veld] = melding;
    }
  }

  const totaalMaanden = velden.looptijdJaren.waarde * 12 + velden.looptijdMaanden.waarde;
  // Alleen het totaal beoordelen als jaren en maanden elk in orde zijn.
  if (!meldingen.looptijdJaren && !meldingen.looptijdMaanden) {
    if (totaalMaanden < 1) {
      meldingen.looptijd = 'Vul een looptijd in van minimaal 1 maand.';
    } else if (totaalMaanden > MAX_LOOPTIJD_MAANDEN) {
      meldingen.looptijd = 'De looptijd mag maximaal 999 jaar zijn.';
    }
  }

  return {
    waarden: {
      startbedrag: velden.startbedrag.waarde,
      maandInleg: velden.maandInleg.waarde,
      jaarrentePercentage: velden.jaarrente.waarde,
      looptijdMaanden: totaalMaanden,
    },
    meldingen,
  };
}

// Geeft een melding als de uitkomst geen bruikbaar getal is (te groot of NaN).
export function controleerUitkomst(uitkomst) {
  if (!Number.isFinite(uitkomst.eindbedrag)) {
    return 'De uitkomst is te groot om te berekenen. Kies een lagere rente of een kortere looptijd.';
  }
  return null;
}
