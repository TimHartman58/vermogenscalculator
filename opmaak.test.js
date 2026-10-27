import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatteerEuro, formatteerUitkomst, leesGetal } from './opmaak.js';

//   is de harde spatie tussen € en het bedrag.
const bedragen = [
  { getal: 1216.41, verwacht: '€ 1.216,41' },
  { getal: 0, verwacht: '€ 0,00' },
  { getal: 368485.7, verwacht: '€ 368.485,70' },
];

for (const { getal, verwacht } of bedragen) {
  test(`formatteerEuro(${getal}) geeft ${verwacht}`, () => {
    assert.equal(formatteerEuro(getal), verwacht);
  });
}

// Boven € 1 biljoen (10^12) een tekst in plaats van het bedrag.
//   is de harde spatie tussen € en het bedrag.
const uitkomsten = [
  { getal: 999_999_999_999.99, verwacht: '€ 999.999.999.999,99' },
  { getal: 1_000_000_000_000, verwacht: '€ 1.000.000.000.000,00' },
  { getal: 1_000_000_000_000.01, verwacht: 'meer dan € 1 biljoen' },
  { getal: 5e15, verwacht: 'meer dan € 1 biljoen' },
  { getal: 0, verwacht: '€ 0,00' },
  { getal: -1_000_000_000_000, verwacht: '€ -1.000.000.000.000,00' },
  { getal: -1_000_000_000_000.01, verwacht: 'minder dan € -1 biljoen' },
];

for (const { getal, verwacht } of uitkomsten) {
  test(`formatteerUitkomst(${getal}) geeft ${verwacht}`, () => {
    assert.equal(formatteerUitkomst(getal), verwacht);
  });
}

const invoer = [
  { tekst: '3,5', verwacht: 3.5 },
  { tekst: '10.000', verwacht: 10000 },
  { tekst: '1.000,50', verwacht: 1000.5 },
  { tekst: ' 100 ', verwacht: 100 },
  { tekst: '', verwacht: NaN },
  { tekst: 'abc', verwacht: NaN },
];

for (const { tekst, verwacht } of invoer) {
  test(`leesGetal('${tekst}') geeft ${verwacht}`, () => {
    assert.equal(leesGetal(tekst), verwacht);
  });
}
