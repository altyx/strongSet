import { formatDecimal, parseDecimal } from '@/src/utils/number';

// Les distances sont toujours enregistrées en mètres ; l'unité ne change que l'affichage et la saisie
export type DistanceUnit = 'km' | 'mi';

const METERS_PER_UNIT: Record<DistanceUnit, number> = { km: 1000, mi: 1609.344 };

// Mètres -> valeur dans l'unité choisie
export function toDistanceUnit(meters: number, unit: DistanceUnit) {
  return meters / METERS_PER_UNIT[unit];
}

// Nombre seul, à deux décimales : 8500 m -> « 8,5 » (km) ou « 5,28 » (mi)
export function formatDistanceValue(meters: number, unit: DistanceUnit) {
  return formatDecimal(Math.round(toDistanceUnit(meters, unit) * 100) / 100);
}

// Avec l'unité : « 8,5 km », « 5,28 mi »
export function formatDistance(meters: number, unit: DistanceUnit) {
  return `${formatDistanceValue(meters, unit)} ${unit}`;
}

// Pour les lecteurs d'écran : « 8,5 kilomètres », « 5,28 miles »
export function distanceUnitName(unit: DistanceUnit) {
  return unit === 'mi' ? 'miles' : 'kilomètres';
}

// Distance saisie dans l'unité choisie (« 8,5 ») -> mètres ; null si la saisie est vide ou invalide
export function parseDistance(text: string, unit: DistanceUnit): number | null {
  const value = parseDecimal(text);
  return value === null ? null : Math.round(value * METERS_PER_UNIT[unit]);
}

// Vitesse moyenne dans l'unité choisie (km/h ou mph), à une décimale
export function formatSpeed(kmh: number, unit: DistanceUnit) {
  const value = unit === 'mi' ? kmh / 1.609344 : kmh;
  return `${formatDecimal(Math.round(value * 10) / 10)} ${unit === 'mi' ? 'mph' : 'km/h'}`;
}
