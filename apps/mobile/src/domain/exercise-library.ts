import { ExerciseListItem } from '@/src/repositories/exercise/exercise-repository';
import { normalizeSearch } from '@/src/utils/text';

/**
 * Exercices dont le nom contient la recherche (sans tenir compte des accents ni de la casse)
 * et, si un muscle est choisi, qui le travaillent.
 */
export function filterExercises(exercises: ExerciseListItem[], query: string, muscle: string | null) {
  const search = normalizeSearch(query);
  return exercises.filter(
    (exercise) =>
      normalizeSearch(exercise.name).includes(search) && (muscle === null || exercise.muscles.includes(muscle)),
  );
}

// @returns le message à afficher, ou null si l'exercice peut être créé
export function validateNewExercise(name: string, muscleIds: number[], nameTaken: boolean): string | null {
  if (name.trim() === '') {
    return "Donnez un nom à l'exercice.";
  }
  if (nameTaken) {
    return 'Un exercice porte déjà ce nom.';
  }
  if (muscleIds.length === 0) {
    return 'Choisissez au moins un muscle travaillé.';
  }
  return null;
}
