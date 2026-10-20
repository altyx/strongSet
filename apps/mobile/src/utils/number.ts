// 72.5 -> « 72,5 », 80 -> « 80 »
export function formatDecimal(value: number) {
  return value.toLocaleString('fr-FR', { maximumFractionDigits: 2, useGrouping: false });
}

/**
 * Lit un nombre saisi au clavier, avec virgule ou point décimal.
 * @returns null si la saisie est vide ou invalide
 */
export function parseDecimal(text: string): number | null {
  const normalized = text.trim().replace(',', '.');
  if (normalized === '') {
    return null;
  }
  const value = Number(normalized);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

// Comme parseDecimal, pour un nombre entier (répétitions)
export function parseInteger(text: string): number | null {
  const value = parseDecimal(text);
  return value === null ? null : Math.round(value);
}
