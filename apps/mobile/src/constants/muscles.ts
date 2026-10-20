// Libellés français des muscles des données par défaut (stockés en anglais en base)
const MUSCLE_LABELS: Record<string, string> = {
  Chest: 'Pectoraux',
  Triceps: 'Triceps',
  Biceps: 'Biceps',
  Back: 'Dos',
  Shoulders: 'Épaules',
  Quadriceps: 'Quadriceps',
  Calves: 'Mollets',
  Glutes: 'Fessiers',
  Hamstrings: 'Ischios',
  Abs: 'Abdominaux',
  Forearms: 'Avant-bras',
};

// Un muscle ajouté par l'utilisateur garde son nom tel quel
export function muscleLabel(name: string) {
  return MUSCLE_LABELS[name] ?? name;
}
