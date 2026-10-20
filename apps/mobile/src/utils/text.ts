// Pour comparer des textes saisis : sans accents, en minuscules, sans espaces autour
export function normalizeSearch(text: string) {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}

// Petits mots ignorés pour les initiales (« Curl à la poulie » -> « CP » et non « CÀ »)
const MINOR_WORDS = new Set(['à', 'a', 'au', 'aux', 'la', 'le', 'les', 'de', 'du', 'des', 'd', 'en', 'et', 'l']);

// « Full Body » -> « FB », « Chest » -> « CH », « Développé incliné haltères » -> « DI », « Curl à la poulie » -> « CP »
export function initials(name: string) {
  const words = name
    .trim()
    .split(/[\s']+/)
    .filter((word) => word !== '' && !MINOR_WORDS.has(word.toLowerCase()));
  if (words.length === 0) {
    return '';
  }
  const letters = words.length > 1 ? words[0][0] + words[1][0] : words[0].slice(0, 2);
  return letters.toUpperCase();
}
