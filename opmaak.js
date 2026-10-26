// Opmaak van bedragen en lezen van invoer, in Nederlandse notatie.
// De notatie staat in de constanten hieronder, zodat er later een
// instelling voor kan komen (issue #8).

const TAAL = 'nl-NL';
const DUIZENDTALTEKEN = '.';
const DECIMAALTEKEN = ',';

const euroFormaat = new Intl.NumberFormat(TAAL, { style: 'currency', currency: 'EUR' });

// Let op: tussen € en het bedrag staat een harde spatie (U+00A0).
export function formatteerEuro(bedrag) {
  return euroFormaat.format(bedrag);
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
