// Opmaak van bedragen en lezen van invoer, in Nederlandse notatie.
// De notatie staat in de constanten hieronder, zodat er later een
// instelling voor kan komen (issue #8).

const TAAL = 'nl-NL';
export const DUIZENDTALTEKEN = '.';
export const DECIMAALTEKEN = ',';

const euroFormaat = new Intl.NumberFormat(TAAL, { style: 'currency', currency: 'EUR' });

// Boven deze grens toont de uitkomst een tekst in plaats van het bedrag.
const GRENS_BILJOEN = 1_000_000_000_000;

// Let op: tussen € en het bedrag staat een harde spatie (U+00A0).
export function formatteerEuro(bedrag) {
  return euroFormaat.format(bedrag);
}

// Zoals formatteerEuro, maar bedragen boven € 1 biljoen (of onder
// € -1 biljoen) worden een korte tekst, zodat ze op het scherm passen.
export function formatteerUitkomst(bedrag) {
  if (bedrag > GRENS_BILJOEN) {
    return 'meer dan € 1 biljoen';
  }
  if (bedrag < -GRENS_BILJOEN) {
    return 'minder dan € -1 biljoen';
  }
  return formatteerEuro(bedrag);
}

// Zet tekst als "1.000,50" om naar het getal 1000.5.
// Lege tekst of onzin geeft NaN ("geen getal").
export function leesGetal(tekst) {
  const schoon = tekst.trim();
  if (schoon === '') {
    return NaN;
  }
  const zonderDuizendtal = schoon.replaceAll(DUIZENDTALTEKEN, '');
  return Number(zonderDuizendtal.replace(DECIMAALTEKEN, '.'));
}
