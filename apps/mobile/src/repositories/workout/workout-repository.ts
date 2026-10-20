import {getDatabase} from "@/src/db/database";
import {
  NewWorkoutExercise,
  SetValues,
  Workout,
  WorkoutExercise,
  WorkoutSet,
  WorkoutSummary,
} from "@/src/repositories/workout/workout-type";

const now = () => Math.floor(Date.now() / 1000);

type SetRow = WorkoutSet & { workout_exercise_id: number };

// Résumé d'une séance (WorkoutSummary) : à compléter par WHERE / GROUP BY w.id / ORDER BY
const SUMMARY_SELECT = `
  SELECT w.id, w.name, w.started_at, w.finished_at,
         COUNT(DISTINCT we.id) AS exercise_count,
         COUNT(s.id) AS completed_set_count,
         COALESCE(SUM(s.weight * s.reps), 0) AS volume
  FROM workouts w
  LEFT JOIN workout_exercises we ON we.workout_id = w.id
  LEFT JOIN sets s ON s.workout_exercise_id = we.id AND s.completed_at IS NOT NULL`;

export const WorkoutRepository = {
  /**
   * Démarre une séance et crée ses exercices (dans l'ordre donné) et leurs séries initiales.
   * Ne vérifie pas qu'une autre séance est en cours : voir getActiveWorkout.
   * @returns l'id de la séance
   */
  startWorkout: (params: { template_id?: number | null; name: string; exercises: NewWorkoutExercise[] }): number => {
    const db = getDatabase();
    const timestamp = now();
    let workoutId = 0;

    db.withTransactionSync(() => {
      workoutId = db.runSync(
        'INSERT INTO workouts (template_id, name, started_at, created_at) VALUES (?, ?, ?, ?)',
        [params.template_id ?? null, params.name, timestamp, timestamp],
      ).lastInsertRowId;

      params.exercises.forEach((exercise, position) => {
        const workoutExerciseId = db.runSync(
          `INSERT INTO workout_exercises (workout_id, exercise_id, exercise_name, position, rest_seconds, created_at)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [workoutId, exercise.exercise_id, exercise.name, position, exercise.rest_seconds ?? null, timestamp],
        ).lastInsertRowId;

        (exercise.sets ?? []).forEach((set, setPosition) => {
          db.runSync(
            'INSERT INTO sets (workout_exercise_id, position, weight, reps, created_at) VALUES (?, ?, ?, ?, ?)',
            [workoutExerciseId, setPosition, set.weight, set.reps, timestamp],
          );
        });
      });
    });

    return workoutId;
  },

  // La séance commencée et pas encore terminée, s'il y en a une
  getActiveWorkout: (): Workout | null => {
    const row = getDatabase().getFirstSync<{ id: number }>(
      'SELECT id FROM workouts WHERE finished_at IS NULL ORDER BY started_at DESC LIMIT 1',
    );
    return row ? WorkoutRepository.getWorkout(row.id) : null;
  },

  getWorkout: (id: number): Workout | null => {
    const db = getDatabase();
    const workout = db.getFirstSync<Omit<Workout, 'exercises'>>(
      'SELECT id, template_id, name, note, started_at, finished_at FROM workouts WHERE id = ?',
      [id],
    );
    if (!workout) {
      return null;
    }

    const exercises = db.getAllSync<Omit<WorkoutExercise, 'sets'>>(
      `SELECT id, exercise_id, exercise_name AS name, position, rest_seconds
       FROM workout_exercises
       WHERE workout_id = ?
       ORDER BY position, id`,
      [id],
    );
    const sets = db.getAllSync<SetRow>(
      `SELECT s.id, s.workout_exercise_id, s.position, s.weight, s.reps, s.completed_at
       FROM sets s
       JOIN workout_exercises we ON we.id = s.workout_exercise_id
       WHERE we.workout_id = ?
       ORDER BY s.position, s.id`,
      [id],
    );

    return {
      ...workout,
      exercises: exercises.map((exercise) => ({
        ...exercise,
        sets: sets
          .filter((set) => set.workout_exercise_id === exercise.id)
          .map(({workout_exercise_id, ...set}) => set),
      })),
    };
  },

  // Ajoute un exercice en fin de séance. @returns l'id de l'exercice de séance
  addExercise: (workoutId: number, exercise: NewWorkoutExercise): number => {
    const db = getDatabase();
    const timestamp = now();
    let workoutExerciseId = 0;

    db.withTransactionSync(() => {
      const next = db.getFirstSync<{ position: number }>(
        'SELECT COALESCE(MAX(position) + 1, 0) AS position FROM workout_exercises WHERE workout_id = ?',
        [workoutId],
      );
      workoutExerciseId = db.runSync(
        `INSERT INTO workout_exercises (workout_id, exercise_id, exercise_name, position, rest_seconds, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [workoutId, exercise.exercise_id, exercise.name, next?.position ?? 0, exercise.rest_seconds ?? null, timestamp],
      ).lastInsertRowId;
      (exercise.sets ?? []).forEach((set, position) => {
        db.runSync(
          'INSERT INTO sets (workout_exercise_id, position, weight, reps, created_at) VALUES (?, ?, ?, ?, ?)',
          [workoutExerciseId, position, set.weight, set.reps, timestamp],
        );
      });
    });

    return workoutExerciseId;
  },

  // Ajoute une série en fin d'exercice. @returns l'id de la série
  addSet: (workoutExerciseId: number, values: SetValues): number => {
    const db = getDatabase();
    const next = db.getFirstSync<{ position: number }>(
      'SELECT COALESCE(MAX(position) + 1, 0) AS position FROM sets WHERE workout_exercise_id = ?',
      [workoutExerciseId],
    );
    return db.runSync(
      'INSERT INTO sets (workout_exercise_id, position, weight, reps, created_at) VALUES (?, ?, ?, ?, ?)',
      [workoutExerciseId, next?.position ?? 0, values.weight, values.reps, now()],
    ).lastInsertRowId;
  },

  updateSet: (setId: number, values: SetValues): void => {
    getDatabase().runSync('UPDATE sets SET weight = ?, reps = ?, updated_at = ? WHERE id = ?', [
      values.weight,
      values.reps,
      now(),
      setId,
    ]);
  },

  setCompleted: (setId: number, completed: boolean): void => {
    const timestamp = now();
    getDatabase().runSync('UPDATE sets SET completed_at = ?, updated_at = ? WHERE id = ?', [
      completed ? timestamp : null,
      timestamp,
      setId,
    ]);
  },

  deleteSet: (setId: number): void => {
    getDatabase().runSync('DELETE FROM sets WHERE id = ?', [setId]);
  },

  /**
   * Termine la séance : les séries non validées et les exercices restés vides sont supprimés.
   * Une séance sans aucune série validée n'est pas gardée.
   * @returns true si la séance est enregistrée dans l'historique, false si elle a été supprimée car vide
   */
  finishWorkout: (workoutId: number): boolean => {
    const db = getDatabase();
    let saved = false;

    db.withTransactionSync(() => {
      db.runSync(
        `DELETE FROM sets
         WHERE completed_at IS NULL
           AND workout_exercise_id IN (SELECT id FROM workout_exercises WHERE workout_id = ?)`,
        [workoutId],
      );
      db.runSync(
        `DELETE FROM workout_exercises
         WHERE workout_id = ?
           AND NOT EXISTS (SELECT 1 FROM sets WHERE sets.workout_exercise_id = workout_exercises.id)`,
        [workoutId],
      );

      const remaining = db.getFirstSync<{ count: number }>(
        'SELECT COUNT(*) AS count FROM workout_exercises WHERE workout_id = ?',
        [workoutId],
      );
      if (!remaining?.count) {
        db.runSync('DELETE FROM workouts WHERE id = ?', [workoutId]);
        return;
      }

      const timestamp = now();
      db.runSync('UPDATE workouts SET finished_at = ?, updated_at = ? WHERE id = ?', [timestamp, timestamp, workoutId]);
      saved = true;
    });

    return saved;
  },

  // Abandonne une séance : elle est supprimée avec ses exercices et séries
  discardWorkout: (workoutId: number): void => {
    getDatabase().runSync('DELETE FROM workouts WHERE id = ?', [workoutId]);
  },

  // Séances terminées, de la plus récente à la plus ancienne
  getHistory: (limit = 20): WorkoutSummary[] => {
    return getDatabase().getAllSync<WorkoutSummary>(
      `${SUMMARY_SELECT}
       WHERE w.finished_at IS NOT NULL
       GROUP BY w.id
       ORDER BY w.started_at DESC
       LIMIT ?`,
      [limit],
    );
  },

  // Dernière séance terminée du même programme, commencée avant `before` (pour comparer)
  getPreviousOfTemplate: (templateId: number, before: number): WorkoutSummary | null => {
    return getDatabase().getFirstSync<WorkoutSummary>(
      `${SUMMARY_SELECT}
       WHERE w.finished_at IS NOT NULL AND w.template_id = ? AND w.started_at < ?
       GROUP BY w.id
       ORDER BY w.started_at DESC
       LIMIT 1`,
      [templateId, before],
    );
  },

  /**
   * Charge maximale validée par exercice, sur les séances terminées commencées avant `before`.
   * Les exercices jamais faits (ou sans charge) sont absents du résultat.
   */
  getBestWeightsBefore: (exerciseIds: number[], before: number): Record<number, number> => {
    if (exerciseIds.length === 0) {
      return {};
    }
    const rows = getDatabase().getAllSync<{ exercise_id: number; best: number }>(
      `SELECT we.exercise_id, MAX(s.weight) AS best
       FROM sets s
       JOIN workout_exercises we ON we.id = s.workout_exercise_id
       JOIN workouts w ON w.id = we.workout_id
       WHERE w.finished_at IS NOT NULL
         AND w.started_at < ?
         AND s.completed_at IS NOT NULL
         AND s.weight IS NOT NULL
         AND we.exercise_id IN (${exerciseIds.map(() => '?').join(', ')})
       GROUP BY we.exercise_id`,
      [before, ...exerciseIds],
    );
    return Object.fromEntries(rows.map((row) => [row.exercise_id, row.best]));
  },

  updateNote: (workoutId: number, note: string | null): void => {
    getDatabase().runSync('UPDATE workouts SET note = ?, updated_at = ? WHERE id = ?', [note, now(), workoutId]);
  },

  // Séries validées de la dernière séance terminée contenant cet exercice (colonne « Précédent »)
  getLastPerformance: (exerciseId: number): SetValues[] => {
    return getDatabase().getAllSync<SetValues>(
      `SELECT s.weight, s.reps
       FROM sets s
       WHERE s.completed_at IS NOT NULL
         AND s.workout_exercise_id = (
           SELECT we.id
           FROM workout_exercises we
           JOIN workouts w ON w.id = we.workout_id
           WHERE we.exercise_id = ? AND w.finished_at IS NOT NULL
           ORDER BY w.started_at DESC, we.id DESC
           LIMIT 1
         )
       ORDER BY s.position, s.id`,
      [exerciseId],
    );
  },

  // Timestamps de début des séances terminées entre `start` inclus et `end` exclu
  getWorkoutTimestampsBetween: (start: number, end: number): number[] => {
    const rows = getDatabase().getAllSync<{ started_at: number }>(
      `SELECT started_at FROM workouts
       WHERE finished_at IS NOT NULL AND started_at >= ? AND started_at < ?
       ORDER BY started_at`,
      [start, end],
    );
    return rows.map((row) => row.started_at);
  },

  // Nombre de séances terminées
  count: (): number => {
    const row = getDatabase().getFirstSync<{ count: number }>(
      'SELECT COUNT(*) AS count FROM workouts WHERE finished_at IS NOT NULL',
    );
    return row?.count ?? 0;
  },
}
