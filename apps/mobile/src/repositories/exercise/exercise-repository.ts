import {getDatabase} from "@/src/db/database";

export const ExerciseRepository = {
  count: (): number => {
    const row = getDatabase().getFirstSync<{ count: number }>('SELECT COUNT(*) AS count FROM exercises');
    return row?.count ?? 0;
  },

  // Noms des muscles travaillés par exercice ; un exercice sans muscle associé est absent du résultat
  getMusclesByExercise: (exerciseIds: number[]): Record<number, string[]> => {
    if (exerciseIds.length === 0) {
      return {};
    }
    const rows = getDatabase().getAllSync<{ exercise_id: number; name: string }>(
      `SELECT em.exercise_id, m.name
       FROM exercise_muscles em
       JOIN muscles m ON m.id = em.muscle_id
       WHERE em.exercise_id IN (${exerciseIds.map(() => '?').join(', ')})
       ORDER BY m.id`,
      exerciseIds,
    );
    const muscles: Record<number, string[]> = {};
    rows.forEach((row) => {
      (muscles[row.exercise_id] ??= []).push(row.name);
    });
    return muscles;
  },
}
