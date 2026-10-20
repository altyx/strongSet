import {getDatabase} from "@/src/db/database";

export const WorkoutRepository = {
  // Timestamps (en secondes) des séances enregistrées entre `start` inclus et `end` exclu
  getWorkoutTimestampsBetween: (start: number, end: number): number[] => {
    const rows = getDatabase().getAllSync<{ created_at: number }>(
      'SELECT created_at FROM workouts WHERE created_at >= ? AND created_at < ? ORDER BY created_at',
      [start, end],
    );
    return rows.map((row) => row.created_at);
  },

  count: (): number => {
    const row = getDatabase().getFirstSync<{ count: number }>('SELECT COUNT(*) AS count FROM workouts');
    return row?.count ?? 0;
  },
}
