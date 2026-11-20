import { Tracking } from "@/src/constants/tracking";
import {getDatabase} from "@/src/db/database";
import {normalizeSearch} from "@/src/utils/text";

export interface ExerciseListItem {
  id: number;
  name: string;
  equipment: string | null;
  tracking: Tracking;
  // Noms des muscles (en anglais en base, voir muscleLabel)
  muscles: string[];
}

// Fiche d'un exercice : la ligne de bibliothèque et ses consignes d'exécution
export interface ExerciseDetail extends ExerciseListItem {
  description: string | null;
  // Date de suppression si l'exercice a été retiré de la bibliothèque (voir delete), sinon null
  deleted_at: number | null;
}

export interface Muscle {
  id: number;
  name: string;
}

export interface NewExercise {
  name: string;
  equipment: string | null;
  muscleIds: number[];
  description?: string | null;
  // Charge et répétitions si absent
  tracking?: Tracking;
}

const now = () => Math.floor(Date.now() / 1000);

export const ExerciseRepository = {
  // Bibliothèque complète (sans les exercices supprimés), par ordre alphabétique, avec les muscles de chaque exercice
  getAll: (): ExerciseListItem[] => {
    const exercises = getDatabase()
      .getAllSync<Omit<ExerciseListItem, 'muscles'>>(
        'SELECT id, name, equipment, tracking FROM exercises WHERE deleted_at IS NULL',
      )
      // Tri en français : le tri SQLite (NOCASE) ne gère pas les accents et classerait « Écarté » après « Squat »
      .sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));
    const muscles = ExerciseRepository.getMusclesByExercise(exercises.map((exercise) => exercise.id));
    return exercises.map((exercise) => ({ ...exercise, muscles: muscles[exercise.id] ?? [] }));
  },

  // Trouve aussi un exercice supprimé : sa fiche de progression reste accessible depuis Progrès
  getById: (id: number): ExerciseDetail | null => {
    const exercise = getDatabase().getFirstSync<Omit<ExerciseDetail, 'muscles'>>(
      'SELECT id, name, equipment, tracking, description, deleted_at FROM exercises WHERE id = ?',
      [id],
    );
    if (!exercise) {
      return null;
    }
    return { ...exercise, muscles: ExerciseRepository.getMusclesByExercise([id])[id] ?? [] };
  },

  getMuscles: (): Muscle[] => {
    return getDatabase().getAllSync<Muscle>('SELECT id, name FROM muscles ORDER BY id');
  },

  /**
   * Nom déjà pris, sans tenir compte de la casse, des accents ni des espaces autour (comparé en JS : SQLite ne gère pas
   * les accents). `excludeId` : l'exercice en cours de modification, qui peut garder son nom.
   * Le nom d'un exercice supprimé est libre.
   */
  existsByName: (name: string, excludeId?: number): boolean => {
    const wanted = normalizeSearch(name);
    return getDatabase()
      .getAllSync<{ id: number; name: string }>('SELECT id, name FROM exercises WHERE deleted_at IS NULL')
      .some((exercise) => exercise.id !== excludeId && normalizeSearch(exercise.name) === wanted);
  },

  // Ids des muscles travaillés, pour préremplir la modification
  getMuscleIds: (exerciseId: number): number[] => {
    return getDatabase()
      .getAllSync<{ muscle_id: number }>(
        'SELECT muscle_id FROM exercise_muscles WHERE exercise_id = ? ORDER BY muscle_id',
        [exerciseId],
      )
      .map((row) => row.muscle_id);
  },

  /**
   * Où l'exercice est utilisé : séances (terminées ou en cours) et programmes.
   * Sert à prévenir avant une suppression et à bloquer le changement de saisie s'il a déjà des séries.
   */
  getUsage: (exerciseId: number): { workoutCount: number; templateCount: number } => {
    const row = getDatabase().getFirstSync<{ workoutCount: number; templateCount: number }>(
      `SELECT
         (SELECT COUNT(DISTINCT workout_id) FROM workout_exercises WHERE exercise_id = ?) AS workoutCount,
         (SELECT COUNT(DISTINCT template_id) FROM template_exercises WHERE exercise_id = ?) AS templateCount`,
      [exerciseId, exerciseId],
    );
    return { workoutCount: row?.workoutCount ?? 0, templateCount: row?.templateCount ?? 0 };
  },

  /**
   * Modifie un exercice et remplace ses muscles. Le nom copié dans les séances suit le nouveau nom, pour que
   * l'historique et la progression restent cohérents.
   * Ne vérifie pas le changement de saisie (`tracking`) : à bloquer avant si l'exercice a déjà des séances.
   */
  update: (exerciseId: number, exercise: NewExercise): void => {
    const db = getDatabase();
    const timestamp = now();
    const name = exercise.name.trim();
    db.withTransactionSync(() => {
      db.runSync(
        'UPDATE exercises SET name = ?, equipment = ?, description = ?, tracking = ?, updated_at = ? WHERE id = ?',
        [
          name,
          exercise.equipment,
          exercise.description?.trim() || null,
          exercise.tracking ?? 'weight_reps',
          timestamp,
          exerciseId,
        ],
      );
      db.runSync('DELETE FROM exercise_muscles WHERE exercise_id = ?', [exerciseId]);
      exercise.muscleIds.forEach((muscleId) => {
        db.runSync('INSERT INTO exercise_muscles (exercise_id, muscle_id) VALUES (?, ?)', [exerciseId, muscleId]);
      });
      db.runSync('UPDATE workout_exercises SET exercise_name = ?, updated_at = ? WHERE exercise_id = ?', [
        name,
        timestamp,
        exerciseId,
      ]);
    });
  },

  /**
   * Supprime un exercice de la bibliothèque et le retire des programmes.
   * S'il a déjà été fait en séance, il est seulement marqué supprimé : les séances et sa progression restent
   * consultables, mais il n'apparaît plus dans la bibliothèque ni dans les choix d'exercice. Sinon il est effacé.
   */
  delete: (exerciseId: number): void => {
    const db = getDatabase();
    db.withTransactionSync(() => {
      db.runSync('DELETE FROM template_exercises WHERE exercise_id = ?', [exerciseId]);
      const used = db.getFirstSync('SELECT 1 FROM workout_exercises WHERE exercise_id = ? LIMIT 1', [exerciseId]);
      if (used) {
        const timestamp = now();
        db.runSync('UPDATE exercises SET deleted_at = ?, updated_at = ? WHERE id = ?', [timestamp, timestamp, exerciseId]);
        return;
      }
      // exercise_muscles n'a pas de ON DELETE CASCADE
      db.runSync('DELETE FROM exercise_muscles WHERE exercise_id = ?', [exerciseId]);
      db.runSync('DELETE FROM exercises WHERE id = ?', [exerciseId]);
    });
  },

  // @returns l'id de l'exercice créé
  create: (exercise: NewExercise): number => {
    const db = getDatabase();
    const timestamp = now();
    let exerciseId = 0;
    db.withTransactionSync(() => {
      const description = exercise.description?.trim() || null;
      exerciseId = db.runSync(
        'INSERT INTO exercises (name, equipment, description, tracking, created_at) VALUES (?, ?, ?, ?, ?)',
        [exercise.name.trim(), exercise.equipment, description, exercise.tracking ?? 'weight_reps', timestamp],
      ).lastInsertRowId;
      exercise.muscleIds.forEach((muscleId) => {
        db.runSync('INSERT INTO exercise_muscles (exercise_id, muscle_id) VALUES (?, ?)', [exerciseId, muscleId]);
      });
    });
    return exerciseId;
  },

  // Note personnelle (réglage machine, prise…), affichée à chaque séance ; une note vide est effacée
  updateNote: (exerciseId: number, note: string): void => {
    const trimmed = note.trim();
    getDatabase().runSync('UPDATE exercises SET note = ?, updated_at = ? WHERE id = ?', [
      trimmed === '' ? null : trimmed,
      now(),
      exerciseId,
    ]);
  },

  // Nombre d'exercices de la bibliothèque, sans les supprimés
  count: (): number => {
    const row = getDatabase().getFirstSync<{ count: number }>(
      'SELECT COUNT(*) AS count FROM exercises WHERE deleted_at IS NULL',
    );
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
