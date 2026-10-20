import { Template } from '@/src/repositories/template/template-type';
import { NewWorkoutExercise, SetValues } from '@/src/repositories/workout/workout-type';

/**
 * Exercices d'une séance démarrée depuis un programme. Chaque exercice reçoit autant de séries vides que lors de
 * la dernière séance (sinon le nombre de séries par défaut) : les valeurs précédentes s'affichent en indication et
 * servent de valeur quand on valide une série laissée vide.
 */
export function buildWorkoutExercises(
  template: Template,
  getLastPerformance: (exerciseId: number) => SetValues[],
  defaultSetCount: number,
): NewWorkoutExercise[] {
  return template.exercises.map((exercise) => {
    const setCount = getLastPerformance(exercise.id).length || defaultSetCount;
    return {
      exercise_id: exercise.id,
      name: exercise.name,
      sets: Array.from({ length: Math.max(1, setCount) }, () => ({ weight: null, reps: null })),
    };
  });
}

/**
 * Valeurs à enregistrer quand on valide une série : la saisie, complétée par la série correspondante de la dernière
 * séance, puis par les répétitions par défaut.
 * @returns null si les répétitions restent inconnues (la série ne peut pas être validée)
 */
export function resolveSetValues(
  entered: SetValues,
  previous: SetValues | undefined,
  defaultReps: number,
): SetValues | null {
  const reps = entered.reps ?? previous?.reps ?? defaultReps;
  if (reps === null || reps <= 0) {
    return null;
  }
  return { weight: entered.weight ?? previous?.weight ?? null, reps };
}
