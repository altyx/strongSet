import { formatDuration, formatMinutes } from '@/src/utils/duration';
import { formatDecimal, parseDecimal, parseInteger } from '@/src/utils/number';

describe('formatDecimal', () => {
  it('utilise la virgule et n’affiche pas de décimales inutiles', () => {
    expect(formatDecimal(72.5)).toBe('72,5');
    expect(formatDecimal(80)).toBe('80');
    expect(formatDecimal(1250)).toBe('1250');
  });
});

describe('parseDecimal', () => {
  it('accepte la virgule ou le point', () => {
    expect(parseDecimal('72,5')).toBe(72.5);
    expect(parseDecimal(' 72.5 ')).toBe(72.5);
    expect(parseDecimal('0')).toBe(0);
  });

  it('renvoie null pour une saisie vide ou invalide', () => {
    expect(parseDecimal('')).toBeNull();
    expect(parseDecimal('abc')).toBeNull();
    expect(parseDecimal('-5')).toBeNull();
  });
});

it('parseInteger arrondit les répétitions', () => {
  expect(parseInteger('8')).toBe(8);
  expect(parseInteger('7,6')).toBe(8);
  expect(parseInteger('')).toBeNull();
});

it('formatDuration affiche minutes:secondes, avec les heures au-delà d’une heure', () => {
  expect(formatDuration(5)).toBe('0:05');
  expect(formatDuration(245)).toBe('4:05');
  expect(formatDuration(1934)).toBe('32:14');
  expect(formatDuration(3723)).toBe('1:02:03');
  expect(formatDuration(-3)).toBe('0:00');
});

it('formatMinutes arrondit à la minute et passe en heures au-delà de 60 min', () => {
  expect(formatMinutes(29)).toBe('0 min');
  expect(formatMinutes(54 * 60 + 12)).toBe('54 min');
  expect(formatMinutes(65 * 60)).toBe('1 h 05');
});
