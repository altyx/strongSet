import { Template, TemplateExercise } from '@/src/repositories/template/template-type';
import { NewWorkoutExercise, SetValues } from '@/src/repositories/workout/workout-type';

/**
 * Exercice de séance à créer pour un exercice de programme, ou de la bibliothèque (ajouté en cours de séance).
 * - Nombre de séries : l'objectif du programme, sinon autant que lors de la dernière séance, sinon la valeur par défaut.
 * - Les séries sont vides : les valeurs de la dernière séance s'affichent en indication et servent de valeur quand
 *   on valide une série laissée vide. Sans historique pour une série, on pré-remplit les répétitions visées.
 * - Le repos visé par le programme est copié sur l'exercice de séance.
 */
export function buildWorkoutExercise(
  exercise: Pick<TemplateExercise, 'id' | 'name' | 'target_sets' | 'target_reps' | 'rest_seconds'>,
  lastPerformance: SetValues[],
  defaultSetCount: number,
): NewWorkoutExercise {
  const setCount = exercise.target_sets ?? (lastPerformance.length || defaultSetCount);
  return {
    exercise_id: exercise.id,
    name: exercise.name,
    rest_seconds: exercise.rest_seconds ?? null,
    sets: Array.from({ length: Math.max(1, setCount) }, (_, index) => ({
      weight: null,
      reps: lastPerformance[index] ? null : (exercise.target_reps ?? null),
    })),
  };
}

// Exercices d'une séance démarrée depuis un programme, dans l'ordre du programme (voir buildWorkoutExercise)
export function buildWorkoutExercises(
  template: Template,
  getLastPerformance: (exerciseId: number) => SetValues[],
  defaultSetCount: number,
): NewWorkoutExercise[] {
  return template.exercises.map((exercise) =>
    buildWorkoutExercise(exercise, getLastPerformance(exercise.id), defaultSetCount),
  );
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
