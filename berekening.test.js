import { test } from 'node:test';
import assert from 'node:assert/strict';
import { berekenVermogen } from './berekening.js';

// Testwaarden uit issue #3. Geval 5 en 6 zijn gecontroleerd in Excel.
const gevallen = [
  {
    naam: '1. start 1000, geen inleg, 3%, 1 jaar, effectief',
    invoer: { startbedrag: 1000, maandInleg: 0, jaarrentePercentage: 3, looptijdJaren: 1, inlegMoment: 'eind', renteMethode: 'effectief' },
    verwacht: { eindbedrag: 1030.0, totaalIngelegd: 1000.0, totaleRente: 30.0 },
  },
  {
    naam: '2. start 1000, geen inleg, 3%, 1 jaar, jaarrente/12',
    invoer: { startbedrag: 1000, maandInleg: 0, jaarrentePercentage: 3, looptijdJaren: 1, inlegMoment: 'eind', renteMethode: 'nominaal' },
    verwacht: { eindbedrag: 1030.42, totaalIngelegd: 1000.0, totaleRente: 30.42 },
  },
  {
    naam: '3. inleg 100, eind van de maand, 3%, 1 jaar, effectief',
    invoer: { startbedrag: 0, maandInleg: 100, jaarrentePercentage: 3, looptijdJaren: 1, inlegMoment: 'eind', renteMethode: 'effectief' },
    verwacht: { eindbedrag: 1216.41, totaalIngelegd: 1200.0, totaleRente: 16.41 },
  },
  {
    naam: '4. inleg 100, begin van de maand, 3%, 1 jaar, effectief',
    invoer: { startbedrag: 0, maandInleg: 100, jaarrentePercentage: 3, looptijdJaren: 1, inlegMoment: 'begin', renteMethode: 'effectief' },
    verwacht: { eindbedrag: 1219.41, totaalIngelegd: 1200.0, totaleRente: 19.41 },
  },
  {
    naam: '5. inleg 100, eind van de maand, 3%, 1 jaar, jaarrente/12',
    invoer: { startbedrag: 0, maandInleg: 100, jaarrentePercentage: 3, looptijdJaren: 1, inlegMoment: 'eind', renteMethode: 'nominaal' },
    verwacht: { eindbedrag: 1216.64, totaalIngelegd: 1200.0, totaleRente: 16.64 },
  },
  {
    naam: '6. inleg 100, begin van de maand, 3%, 1 jaar, jaarrente/12',
    invoer: { startbedrag: 0, maandInleg: 100, jaarrentePercentage: 3, looptijdJaren: 1, inlegMoment: 'begin', renteMethode: 'nominaal' },
    verwacht: { eindbedrag: 1219.68, totaalIngelegd: 1200.0, totaleRente: 19.68 },
  },
  {
    naam: '7. start 1000, inleg 100, 0% rente, 1 jaar',
    invoer: { startbedrag: 1000, maandInleg: 100, jaarrentePercentage: 0, looptijdJaren: 1, inlegMoment: 'eind', renteMethode: 'effectief' },
    verwacht: { eindbedrag: 2200.0, totaalIngelegd: 2200.0, totaleRente: 0 },
  },
  {
    naam: '8. start 1000, geen inleg, 3%, 10 jaar, effectief',
    invoer: { startbedrag: 1000, maandInleg: 0, jaarrentePercentage: 3, looptijdJaren: 10, inlegMoment: 'eind', renteMethode: 'effectief' },
    verwacht: { eindbedrag: 1343.92, totaalIngelegd: 1000.0, totaleRente: 343.92 },
  },
];

for (const { naam, invoer, verwacht } of gevallen) {
  test(naam, () => {
    assert.deepEqual(berekenVermogen(invoer), verwacht);
  });
}

test('standaard: inleg eind van de maand en effectieve rente', () => {
  const resultaat = berekenVermogen({ startbedrag: 0, maandInleg: 100, jaarrentePercentage: 3, looptijdJaren: 1 });
  assert.deepEqual(resultaat, { eindbedrag: 1216.41, totaalIngelegd: 1200.0, totaleRente: 16.41 });
});

test('onbekend inlegMoment geeft een fout', () => {
  assert.throws(
    () => berekenVermogen({ startbedrag: 0, maandInleg: 100, jaarrentePercentage: 3, looptijdJaren: 1, inlegMoment: 'midden' }),
    /Onbekend inlegMoment/,
  );
});

test('onbekende renteMethode geeft een fout', () => {
  assert.throws(
    () => berekenVermogen({ startbedrag: 0, maandInleg: 100, jaarrentePercentage: 3, looptijdJaren: 1, renteMethode: 'enkelvoudig' }),
    /Onbekende renteMethode/,
  );
});
