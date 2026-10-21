import { Workout, WorkoutSet } from '@/src/repositories/workout/workout-type';

const isCompleted = (set: WorkoutSet) => set.completed_at !== null;
// Série validée qui compte dans les statistiques : l'échauffement n'en fait pas partie
const isWorkingSet = (set: WorkoutSet) => isCompleted(set) && set.type !== 'warmup';

export function summarizeWorkout(workout: Workout, now = Math.floor(Date.now() / 1000)) {
  const completedSets = workout.exercises.flatMap((exercise) => exercise.sets.filter(isCompleted));
  return {
    durationSeconds: (workout.finished_at ?? now) - workout.started_at,
    // Somme charge × répétitions ; les séries sans charge (poids du corps) et l'échauffement ne comptent pas
    volume: completedSets.filter(isWorkingSet).reduce((total, set) => total + (set.weight ?? 0) * (set.reps ?? 0), 0),
    // Toutes les séries faites, échauffement compris
    completedSetCount: completedSets.length,
    exerciseCount: workout.exercises.filter((exercise) => exercise.sets.some(isCompleted)).length,
  };
}

export type WeightRecord = {
  exerciseName: string;
  weight: number;
  reps: number;
  previousBest: number;
};

/**
 * Records de charge : exercices dont la série de travail la plus lourde dépasse la meilleure charge des séances précédentes.
 * Un exercice fait pour la première fois n'est pas un record (rien à battre).
 * @param bestWeightsBefore charge max par exercice avant cette séance (WorkoutRepository.getBestWeightsBefore)
 */
export function findWeightRecords(workout: Workout, bestWeightsBefore: Record<number, number>): WeightRecord[] {
  return workout.exercises.flatMap((exercise) => {
    const previousBest = exercise.exercise_id === null ? undefined : bestWeightsBefore[exercise.exercise_id];
    if (previousBest === undefined) {
      return [];
    }
    const top = exercise.sets
      .filter((set) => isWorkingSet(set) && set.weight !== null)
      // À charge égale, la série avec le plus de répétitions
      .sort((a, b) => b.weight! - a.weight! || (b.reps ?? 0) - (a.reps ?? 0))[0];
    if (!top || top.weight! <= previousBest) {
      return [];
    }
    return [{ exerciseName: exercise.name, weight: top.weight!, reps: top.reps ?? 0, previousBest }];
  });
}

// Évolution en % du volume par rapport à une séance précédente, arrondie ; null si pas de comparaison possible
export function volumeChange(current: number, previous: number | null | undefined): number | null {
  if (!previous) {
    return null;
  }
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Nombre de séries de travail (hors échauffement) par muscle, une série comptant pour chaque muscle de son exercice,
 * du plus au moins travaillé.
 */
export function setsPerMuscle(workout: Workout, musclesByExercise: Record<number, string[]>) {
  const counts = new Map<string, number>();
  workout.exercises.forEach((exercise) => {
    const sets = exercise.sets.filter(isWorkingSet).length;
    const muscles = exercise.exercise_id === null ? [] : (musclesByExercise[exercise.exercise_id] ?? []);
    muscles.forEach((muscle) => counts.set(muscle, (counts.get(muscle) ?? 0) + sets));
  });
  return [...counts.entries()]
    .filter(([, sets]) => sets > 0)
    .map(([muscle, sets]) => ({ muscle, sets }))
    .sort((a, b) => b.sets - a.sets);
}
