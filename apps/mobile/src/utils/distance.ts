import { formatDecimal, parseDecimal } from '@/src/utils/number';

// Les distances sont enregistrées en mètres et saisies ou affichées en kilomètres

// 8500 -> « 8,5 », 10 000 -> « 10 »
export function formatDistanceValue(meters: number) {
  return formatDecimal(Math.round(meters / 10) / 100);
}

// Avec l'unité : « 8,5 km »
export function formatDistance(meters: number) {
  return `${formatDistanceValue(meters)} km`;
}

// Kilomètres saisis (« 8,5 ») -> mètres ; null si la saisie est vide ou invalide
export function parseDistance(text: string): number | null {
  const kilometers = parseDecimal(text);
  return kilometers === null ? null : Math.round(kilometers * 1000);
}
