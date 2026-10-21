import {getDatabase} from "@/src/db/database";
import {
  ExerciseSession,
  NewWorkoutExercise,
  PreviousSet,
  SetType,
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
         -- Les séries d'échauffement ne comptent pas dans le volume
         COALESCE(SUM(CASE WHEN s.type != 'warmup' THEN s.weight * s.reps END), 0) AS volume
  FROM workouts w
  LEFT JOIN workout_exercises we ON we.workout_id = w.id
  LEFT JOIN sets s ON s.workout_exercise_id = we.id AND s.completed_at IS NOT NULL`;

/**
 * Retire les séries non validées et les exercices restés vides, supprime la séance si plus rien n'est validé.
 * `finishedAt` : date de fin à enregistrer, ou null pour garder celle de la séance.
 * @returns true si la séance est gardée
 */
function closeWorkout(workoutId: number, finishedAt: number | null): boolean {
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
    db.runSync('UPDATE workouts SET finished_at = COALESCE(?, finished_at), updated_at = ? WHERE id = ?', [
      finishedAt,
      timestamp,
      workoutId,
    ]);
    saved = true;
  });

  return saved;
}

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
            'INSERT INTO sets (workout_exercise_id, position, weight, reps, type, created_at) VALUES (?, ?, ?, ?, ?, ?)',
            [workoutExerciseId, setPosition, set.weight, set.reps, set.type ?? 'normal', timestamp],
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
      `SELECT we.id, we.exercise_id, we.exercise_name AS name, we.position, we.rest_seconds, e.note AS exercise_note
       FROM workout_exercises we
       LEFT JOIN exercises e ON e.id = we.exercise_id
       WHERE we.workout_id = ?
       ORDER BY we.position, we.id`,
      [id],
    );
    const sets = db.getAllSync<SetRow>(
      `SELECT s.id, s.workout_exercise_id, s.position, s.type, s.weight, s.reps, s.completed_at
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
          'INSERT INTO sets (workout_exercise_id, position, weight, reps, type, created_at) VALUES (?, ?, ?, ?, ?, ?)',
          [workoutExerciseId, position, set.weight, set.reps, set.type ?? 'normal', timestamp],
        );
      });
    });

    return workoutExerciseId;
  },

  /**
   * Remplace un exercice de séance (ex. machine occupée).
   * Sans série validée, l'exercice est remplacé sur place. Sinon les séries validées restent sur l'ancien exercice,
   * ses séries non validées sont supprimées et le remplaçant est inséré juste après lui.
   * @returns l'id de l'exercice de séance remplaçant
   */
  replaceExercise: (workoutExerciseId: number, replacement: NewWorkoutExercise): number => {
    const db = getDatabase();
    const timestamp = now();
    let replacementId = workoutExerciseId;

    db.withTransactionSync(() => {
      const current = db.getFirstSync<{ workout_id: number; position: number; completed_count: number }>(
        `SELECT we.workout_id, we.position,
                (SELECT COUNT(*) FROM sets s WHERE s.workout_exercise_id = we.id AND s.completed_at IS NOT NULL) AS completed_count
         FROM workout_exercises we
         WHERE we.id = ?`,
        [workoutExerciseId],
      );
      if (!current) {
        return;
      }

      if (current.completed_count === 0) {
        db.runSync('DELETE FROM sets WHERE workout_exercise_id = ?', [workoutExerciseId]);
        db.runSync(
          `UPDATE workout_exercises SET exercise_id = ?, exercise_name = ?, rest_seconds = ?, updated_at = ? WHERE id = ?`,
          [replacement.exercise_id, replacement.name, replacement.rest_seconds ?? null, timestamp, workoutExerciseId],
        );
      } else {
        db.runSync('DELETE FROM sets WHERE workout_exercise_id = ? AND completed_at IS NULL', [workoutExerciseId]);
        db.runSync('UPDATE workout_exercises SET position = position + 1 WHERE workout_id = ? AND position > ?', [
          current.workout_id,
          current.position,
        ]);
        replacementId = db.runSync(
          `INSERT INTO workout_exercises (workout_id, exercise_id, exercise_name, position, rest_seconds, created_at)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            current.workout_id,
            replacement.exercise_id,
            replacement.name,
            current.position + 1,
            replacement.rest_seconds ?? null,
            timestamp,
          ],
        ).lastInsertRowId;
      }

      (replacement.sets ?? []).forEach((set, position) => {
        db.runSync(
          'INSERT INTO sets (workout_exercise_id, position, weight, reps, type, created_at) VALUES (?, ?, ?, ?, ?, ?)',
          [replacementId, position, set.weight, set.reps, set.type ?? 'normal', timestamp],
        );
      });
    });

    return replacementId;
  },

  // Échange un exercice de séance avec son voisin du dessus (-1) ou du dessous (+1) ; sans effet en bout de liste
  moveExercise: (workoutExerciseId: number, direction: -1 | 1): void => {
    const db = getDatabase();
    db.withTransactionSync(() => {
      const ids = db
        .getAllSync<{ id: number }>(
          `SELECT id FROM workout_exercises
           WHERE workout_id = (SELECT workout_id FROM workout_exercises WHERE id = ?)
           ORDER BY position, id`,
          [workoutExerciseId],
        )
        .map((row) => row.id);
      const from = ids.indexOf(workoutExerciseId);
      const to = from + direction;
      if (from === -1 || to < 0 || to >= ids.length) {
        return;
      }
      [ids[from], ids[to]] = [ids[to], ids[from]];
      // Positions réécrites de 0 à n - 1 : efface les trous laissés par les retraits
      const timestamp = now();
      ids.forEach((id, position) =>
        db.runSync('UPDATE workout_exercises SET position = ?, updated_at = ? WHERE id = ?', [position, timestamp, id]),
      );
    });
  },

  // Retire un exercice de la séance, avec toutes ses séries
  removeExercise: (workoutExerciseId: number): void => {
    getDatabase().runSync('DELETE FROM workout_exercises WHERE id = ?', [workoutExerciseId]);
  },

  // Ajoute une série en fin d'exercice. @returns l'id de la série
  addSet: (workoutExerciseId: number, values: SetValues, type: SetType = 'normal'): number => {
    const db = getDatabase();
    const next = db.getFirstSync<{ position: number }>(
      'SELECT COALESCE(MAX(position) + 1, 0) AS position FROM sets WHERE workout_exercise_id = ?',
      [workoutExerciseId],
    );
    return db.runSync(
      'INSERT INTO sets (workout_exercise_id, position, weight, reps, type, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [workoutExerciseId, next?.position ?? 0, values.weight, values.reps, type, now()],
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

  setType: (setId: number, type: SetType): void => {
    getDatabase().runSync('UPDATE sets SET type = ?, updated_at = ? WHERE id = ?', [type, now(), setId]);
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
  finishWorkout: (workoutId: number): boolean => closeWorkout(workoutId, now()),

  /**
   * Enregistre une séance terminée qui vient d'être modifiée : même nettoyage que finishWorkout, la date de fin
   * d'origine est gardée.
   * @returns false si la séance a été supprimée car plus aucune série n'est validée
   */
  saveEditedWorkout: (workoutId: number): boolean => closeWorkout(workoutId, null),

  // Abandonne une séance en cours, ou supprime une séance de l'historique, avec ses exercices et séries
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
   * Charge maximale validée par exercice, sur les séances terminées commencées avant `before`, hors échauffement.
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
         AND s.type != 'warmup'
         AND s.weight IS NOT NULL
         AND we.exercise_id IN (${exerciseIds.map(() => '?').join(', ')})
       GROUP BY we.exercise_id`,
      [before, ...exerciseIds],
    );
    return Object.fromEntries(rows.map((row) => [row.exercise_id, row.best]));
  },

  /**
   * Séries validées d'un exercice hors échauffement, séance terminée par séance terminée, de la plus récente à la
   * plus ancienne.
   * Un exercice fait deux fois dans la même séance donne deux entrées.
   */
  getExerciseSessions: (exerciseId: number): ExerciseSession[] => {
    const rows = getDatabase().getAllSync<{ workout_exercise_id: number; workout_id: number; started_at: number; weight: number | null; reps: number | null }>(
      `SELECT we.id AS workout_exercise_id, w.id AS workout_id, w.started_at, s.weight, s.reps
       FROM sets s
       JOIN workout_exercises we ON we.id = s.workout_exercise_id
       JOIN workouts w ON w.id = we.workout_id
       WHERE we.exercise_id = ? AND w.finished_at IS NOT NULL AND s.completed_at IS NOT NULL AND s.type != 'warmup'
       ORDER BY w.started_at DESC, we.id, s.position, s.id`,
      [exerciseId],
    );
    const sessions = new Map<number, ExerciseSession>();
    rows.forEach((row) => {
      let session = sessions.get(row.workout_exercise_id);
      if (!session) {
        session = { workout_id: row.workout_id, started_at: row.started_at, sets: [] };
        sessions.set(row.workout_exercise_id, session);
      }
      session.sets.push({ weight: row.weight, reps: row.reps });
    });
    return Array.from(sessions.values());
  },

  // Exercices déjà faits en séance terminée, du plus récemment fait au plus ancien
  getTrainedExercises: (): { id: number; name: string; last_done: number; session_count: number }[] => {
    return getDatabase().getAllSync(
      `SELECT e.id, e.name, MAX(w.started_at) AS last_done, COUNT(DISTINCT w.id) AS session_count
       FROM workout_exercises we
       JOIN workouts w ON w.id = we.workout_id
       JOIN exercises e ON e.id = we.exercise_id
       WHERE w.finished_at IS NOT NULL
         AND EXISTS (
           SELECT 1 FROM sets s WHERE s.workout_exercise_id = we.id AND s.completed_at IS NOT NULL AND s.type != 'warmup'
         )
       GROUP BY e.id
       ORDER BY last_done DESC`,
    );
  },

  updateNote: (workoutId: number, note: string | null): void => {
    getDatabase().runSync('UPDATE workouts SET note = ?, updated_at = ? WHERE id = ?', [note, now(), workoutId]);
  },

  /**
   * Séries validées de la dernière séance terminée contenant cet exercice (colonne « Précédent »).
   * `before` : ne regarde que les séances commencées avant (modification d'une séance passée).
   */
  getLastPerformance: (exerciseId: number, before = Number.MAX_SAFE_INTEGER): PreviousSet[] => {
    return getDatabase().getAllSync<PreviousSet>(
      `SELECT s.weight, s.reps, s.type
       FROM sets s
       WHERE s.completed_at IS NOT NULL
         AND s.workout_exercise_id = (
           SELECT we.id
           FROM workout_exercises we
           JOIN workouts w ON w.id = we.workout_id
           WHERE we.exercise_id = ? AND w.finished_at IS NOT NULL AND w.started_at < ?
           ORDER BY w.started_at DESC, we.id DESC
           LIMIT 1
         )
       ORDER BY s.position, s.id`,
      [exerciseId, before],
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
