import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  controleerBedrag,
  controleerRente,
  controleerJaren,
  controleerMaanden,
  controleerInvoer,
  controleerUitkomst,
} from './controle.js';

// Per geval: de functie, de invoer en wat er uit moet komen.
// Bij goede invoer de waarde (melding is dan null), bij foute invoer de melding.
function controleerGevallen(naam, functie, gevallen) {
  for (const { tekst, waarde, melding, toelichting = '' } of gevallen) {
    test(`${naam}('${tekst}') ${toelichting}`.trim(), () => {
      const uitkomst = functie(tekst);
      if (melding === undefined) {
        assert.deepEqual(uitkomst, { waarde, melding: null });
      } else {
        assert.equal(uitkomst.melding, melding);
      }
    });
  }
}

controleerGevallen('twijfelachtige punt: controleerBedrag', controleerBedrag, [
  { tekst: '3.5', melding: 'Gebruik een komma voor decimalen: bedoel je 3,5?' },
  { tekst: '1.00', melding: 'Gebruik een komma voor decimalen: bedoel je 1,00?' },
  { tekst: '1.0000', melding: 'Gebruik een komma voor decimalen: bedoel je 1,0000?' },
  { tekst: '1.000.5', melding: 'Gebruik een komma voor decimalen en een punt alleen voor duizendtallen.' },
  { tekst: '10.000', waarde: 10000 },
  { tekst: '1.000,50', waarde: 1000.5 },
]);

controleerGevallen('controleerBedrag', controleerBedrag, [
  { tekst: '', waarde: 0, toelichting: '(leeg telt als 0)' },
  { tekst: 'abc', melding: 'Vul een getal in.' },
  { tekst: '-0,01', melding: 'Het bedrag mag niet negatief zijn.', toelichting: '(net onder de grens)' },
  { tekst: '0', waarde: 0, toelichting: '(precies op de grens)' },
  { tekst: '1.000.000.000', waarde: 1_000_000_000, toelichting: '(precies op de grens)' },
  { tekst: '1.000.000.000,01', melding: 'Het bedrag mag maximaal € 1.000.000.000 zijn.', toelichting: '(net erover)' },
  { tekst: '10,55', waarde: 10.55 },
  { tekst: '10,555', melding: 'Gebruik maximaal twee cijfers achter de komma.' },
]);

controleerGevallen('controleerRente', controleerRente, [
  { tekst: '', melding: 'Vul een rente in. Vul 0 in voor geen rente.' },
  { tekst: '3.5', melding: 'Gebruik een komma voor decimalen: bedoel je 3,5?' },
  { tekst: '-100', melding: 'De rente moet hoger zijn dan -100%.', toelichting: '(precies op de grens, uitgesloten)' },
  { tekst: '-99,99', waarde: -99.99, toelichting: '(net erboven)' },
  { tekst: '0', waarde: 0 },
  { tekst: '999', waarde: 999, toelichting: '(precies op de grens)' },
  { tekst: '999,01', melding: 'De rente mag maximaal 999% zijn.', toelichting: '(net erover)' },
]);

controleerGevallen('controleerJaren', controleerJaren, [
  { tekst: '', waarde: 0, toelichting: '(leeg telt als 0)' },
  { tekst: '-1', melding: 'Vul 0 tot en met 999 jaar in.' },
  { tekst: '1,5', melding: 'Vul hele jaren in.' },
  { tekst: '999', waarde: 999, toelichting: '(precies op de grens)' },
  { tekst: '1000', melding: 'Vul 0 tot en met 999 jaar in.', toelichting: '(net erover)' },
]);

controleerGevallen('controleerMaanden', controleerMaanden, [
  { tekst: '', waarde: 0, toelichting: '(leeg telt als 0)' },
  { tekst: '11', waarde: 11, toelichting: '(precies op de grens)' },
  { tekst: '12', melding: 'Vul 0 tot en met 11 maanden in.', toelichting: '(net erover)' },
  { tekst: '-1', melding: 'Vul 0 tot en met 11 maanden in.' },
]);

// Hele formulier. Standaard goede invoer; per test één ding anders.
function invoer(aanpassingen) {
  return {
    startbedrag: '1.000',
    maandInleg: '100',
    jaarrente: '3',
    looptijdJaren: '10',
    looptijdMaanden: '6',
    ...aanpassingen,
  };
}

const looptijden = [
  { jaren: '', maanden: '', melding: 'Vul een looptijd in van minimaal 1 maand.', toelichting: 'leeg / leeg' },
  { jaren: '0', maanden: '0', melding: 'Vul een looptijd in van minimaal 1 maand.', toelichting: '0 maanden' },
  { jaren: '0', maanden: '1', totaal: 1, toelichting: '1 maand' },
  { jaren: '999', maanden: '0', totaal: 11988, toelichting: 'precies 999 jaar' },
  { jaren: '999', maanden: '1', melding: 'De looptijd mag maximaal 999 jaar zijn.', toelichting: '999 jaar en 1 maand' },
];

for (const { jaren, maanden, totaal, melding, toelichting } of looptijden) {
  test(`controleerInvoer: looptijd ${toelichting}`, () => {
    const uitkomst = controleerInvoer(invoer({ looptijdJaren: jaren, looptijdMaanden: maanden }));
    if (melding === undefined) {
      assert.deepEqual(uitkomst.meldingen, {});
      assert.equal(uitkomst.waarden.looptijdMaanden, totaal);
    } else {
      assert.deepEqual(uitkomst.meldingen, { looptijd: melding });
    }
  });
}

test('controleerInvoer: alles goed geeft geen meldingen en de juiste waarden', () => {
  const uitkomst = controleerInvoer(invoer({}));
  assert.deepEqual(uitkomst, {
    waarden: { startbedrag: 1000, maandInleg: 100, jaarrentePercentage: 3, looptijdMaanden: 126 },
    meldingen: {},
  });
});

test('controleerInvoer: twee foute velden geven twee meldingen', () => {
  const uitkomst = controleerInvoer(invoer({ startbedrag: '-5', jaarrente: '3.5' }));
  assert.deepEqual(uitkomst.meldingen, {
    startbedrag: 'Het bedrag mag niet negatief zijn.',
    jaarrente: 'Gebruik een komma voor decimalen: bedoel je 3,5?',
  });
});

test('controleerInvoer: fout in jaren geeft geen extra melding over de looptijd', () => {
  const uitkomst = controleerInvoer(invoer({ looptijdJaren: 'abc', looptijdMaanden: '' }));
  assert.deepEqual(uitkomst.meldingen, { looptijdJaren: 'Vul een getal in.' });
});

test('controleerUitkomst: Infinity geeft een melding', () => {
  const melding = controleerUitkomst({ eindbedrag: Infinity, totaalIngelegd: 1000, totaleRente: Infinity });
  assert.equal(melding, 'De uitkomst is te groot om te berekenen. Kies een lagere rente of een kortere looptijd.');
});

test('controleerUitkomst: gewone uitkomst geeft geen melding', () => {
  assert.equal(controleerUitkomst({ eindbedrag: 1216.41, totaalIngelegd: 1200, totaleRente: 16.41 }), null);
});
