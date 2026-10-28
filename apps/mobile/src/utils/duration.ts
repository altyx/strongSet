// Durée en secondes -> « 4:05 », « 32:14 » ou « 1:02:03 »
export function formatDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = String(seconds % 60).padStart(2, '0');
  return hours > 0 ? `${hours}:${String(minutes).padStart(2, '0')}:${rest}` : `${minutes}:${rest}`;
}

// Durée arrondie à la minute -> « 54 min » ou « 1 h 05 »
export function formatMinutes(totalSeconds: number) {
  const minutes = Math.max(0, Math.round(totalSeconds / 60));
  if (minutes < 60) {
    return `${minutes} min`;
  }
  return `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, '0')}`;
}

/**
 * Lit une durée saisie au clavier : « 30 » (minutes), « 25:30 » (minutes:secondes) ou « 1:05:00 » (heures:minutes:secondes).
 * Les minutes seules acceptent une virgule (« 2,5 » = 2 min 30).
 * @returns la durée en secondes, ou null si la saisie est vide ou invalide
 */
export function parseDuration(text: string): number | null {
  const normalized = text.trim().replace(',', '.');
  if (normalized === '') {
    return null;
  }
  const parts = normalized.split(':');
  if (parts.length === 1) {
    const minutes = Number(parts[0]);
    return Number.isFinite(minutes) && minutes >= 0 ? Math.round(minutes * 60) : null;
  }
  if (parts.length > 3 || parts.some((part) => !/^\d+$/.test(part))) {
    return null;
  }
  const [last, ...rest] = parts.map(Number).reverse();
  // Secondes et minutes au-delà de 59 refusées après un « : » (« 1:75 » est sans doute une faute de frappe)
  if (last > 59 || (rest.length === 2 && rest[0] > 59)) {
    return null;
  }
  return rest.reduce((total, value, index) => total + value * 60 ** (index + 1), last);
}
