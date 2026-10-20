import { formatDecimal } from '@/src/utils/number';

// Les charges sont toujours enregistrées en kg ; l'unité ne change que l'affichage et la saisie
export type WeightUnit = 'kg' | 'lb';

const LB_PER_KG = 2.20462262;

// Charge en kg -> valeur dans l'unité choisie
export function toUnit(kg: number, unit: WeightUnit) {
  return unit === 'lb' ? kg * LB_PER_KG : kg;
}

// Valeur saisie dans l'unité choisie -> charge en kg
export function fromUnit(value: number, unit: WeightUnit) {
  return unit === 'lb' ? value / LB_PER_KG : value;
}

// Nombre seul, dans l'unité choisie : 72.5 kg -> « 72,5 » (kg) ou « 159,8 » (lb)
export function formatWeightValue(kg: number, unit: WeightUnit) {
  // Une décimale en livres : une saisie de 135 lb se relit 135 et non 134,99
  return unit === 'lb' ? formatDecimal(Math.round(toUnit(kg, unit) * 10) / 10) : formatDecimal(kg);
}

// Avec l'unité : « 72,5 kg », « 159,8 lb »
export function formatWeight(kg: number, unit: WeightUnit) {
  return `${formatWeightValue(kg, unit)} ${unit}`;
}

// Pour les lecteurs d'écran
export function spokenWeight(kg: number, unit: WeightUnit) {
  return `${formatWeightValue(kg, unit)} ${unit === 'lb' ? 'livres' : 'kilos'}`;
}
