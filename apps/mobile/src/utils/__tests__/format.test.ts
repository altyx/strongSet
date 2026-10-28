import { formatDistance, formatDistanceValue, formatSpeed, parseDistance } from '@/src/utils/distance';
import { formatDuration, formatMinutes, parseDuration } from '@/src/utils/duration';
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

describe('parseDuration', () => {
  it('lit des minutes seules, avec ou sans virgule', () => {
    expect(parseDuration('30')).toBe(1800);
    expect(parseDuration(' 2,5 ')).toBe(150);
  });

  it('lit minutes:secondes et heures:minutes:secondes', () => {
    expect(parseDuration('25:30')).toBe(1530);
    expect(parseDuration('1:05:00')).toBe(3900);
    expect(parseDuration('90:00')).toBe(5400);
  });

  it('renvoie null pour une saisie vide ou invalide', () => {
    expect(parseDuration('')).toBeNull();
    expect(parseDuration('abc')).toBeNull();
    expect(parseDuration('1:75')).toBeNull();
    expect(parseDuration('1:75:00')).toBeNull();
    expect(parseDuration('1:2:3:4')).toBeNull();
    expect(parseDuration('-5')).toBeNull();
  });
});

describe('distance', () => {
  it('affiche des kilomètres avec la virgule', () => {
    expect(formatDistanceValue(8500, 'km')).toBe('8,5');
    expect(formatDistance(10000, 'km')).toBe('10 km');
    expect(formatDistance(5234, 'km')).toBe('5,23 km');
  });

  it('affiche des miles', () => {
    expect(formatDistance(1609, 'mi')).toBe('1 mi');
    expect(formatDistance(8500, 'mi')).toBe('5,28 mi');
  });

  it('convertit la distance saisie en mètres, dans l’unité choisie', () => {
    expect(parseDistance('8,5', 'km')).toBe(8500);
    expect(parseDistance('0.75', 'km')).toBe(750);
    expect(parseDistance('3,1', 'mi')).toBe(4989);
    expect(parseDistance('', 'mi')).toBeNull();
  });

  it('une distance saisie en miles se relit à l’identique', () => {
    expect(formatDistanceValue(parseDistance('3,1', 'mi')!, 'mi')).toBe('3,1');
    expect(formatDistanceValue(parseDistance('13,11', 'mi')!, 'mi')).toBe('13,11');
  });

  it('affiche la vitesse en km/h ou en mph', () => {
    expect(formatSpeed(12, 'km')).toBe('12 km/h');
    expect(formatSpeed(16.09344, 'mi')).toBe('10 mph');
  });
});
