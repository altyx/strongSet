import { formatWeight, formatWeightValue, fromUnit, spokenWeight, toUnit } from '@/src/utils/weight';

describe('unités de charge', () => {
  it('laisse les kilos tels quels', () => {
    expect(toUnit(72.5, 'kg')).toBe(72.5);
    expect(fromUnit(72.5, 'kg')).toBe(72.5);
    expect(formatWeight(72.5, 'kg')).toBe('72,5 kg');
  });

  it('convertit en livres, à une décimale', () => {
    expect(formatWeight(100, 'lb')).toBe('220,5 lb');
    expect(spokenWeight(100, 'lb')).toBe('220,5 livres');
    expect(spokenWeight(100, 'kg')).toBe('100 kilos');
  });

  it('relit une saisie en livres sans dérive', () => {
    expect(formatWeightValue(fromUnit(135, 'lb'), 'lb')).toBe('135');
    expect(formatWeightValue(fromUnit(137.5, 'lb'), 'lb')).toBe('137,5');
  });
});
