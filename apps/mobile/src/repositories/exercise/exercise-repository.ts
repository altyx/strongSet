import {getDatabase} from "@/src/db/database";
import {normalizeSearch} from "@/src/utils/text";

export interface ExerciseListItem {
  id: number;
  name: string;
  equipment: string | null;
  // Noms des muscles (en anglais en base, voir muscleLabel)
  muscles: string[];
}

// Fiche d'un exercice : la ligne de bibliothèque et ses consignes d'exécution
export interface ExerciseDetail extends ExerciseListItem {
  description: string | null;
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
}

const now = () => Math.floor(Date.now() / 1000);

export const ExerciseRepository = {
  // Bibliothèque complète, par ordre alphabétique, avec les muscles de chaque exercice
  getAll: (): ExerciseListItem[] => {
    const exercises = getDatabase()
      .getAllSync<{ id: number; name: string; equipment: string | null }>('SELECT id, name, equipment FROM exercises')
      // Tri en français : le tri SQLite (NOCASE) ne gère pas les accents et classerait « Écarté » après « Squat »
      .sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));
    const muscles = ExerciseRepository.getMusclesByExercise(exercises.map((exercise) => exercise.id));
    return exercises.map((exercise) => ({ ...exercise, muscles: muscles[exercise.id] ?? [] }));
  },

  getById: (id: number): ExerciseDetail | null => {
    const exercise = getDatabase().getFirstSync<Omit<ExerciseDetail, 'muscles'>>(
      'SELECT id, name, equipment, description FROM exercises WHERE id = ?',
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

  // Nom déjà pris, sans tenir compte de la casse, des accents ni des espaces autour (comparé en JS : SQLite ne gère pas les accents)
  existsByName: (name: string): boolean => {
    const wanted = normalizeSearch(name);
    return getDatabase()
      .getAllSync<{ name: string }>('SELECT name FROM exercises')
      .some((exercise) => normalizeSearch(exercise.name) === wanted);
  },

  // @returns l'id de l'exercice créé
  create: (exercise: NewExercise): number => {
    const db = getDatabase();
    const timestamp = now();
    let exerciseId = 0;
    db.withTransactionSync(() => {
      const description = exercise.description?.trim() || null;
      exerciseId = db.runSync('INSERT INTO exercises (name, equipment, description, created_at) VALUES (?, ?, ?, ?)', [
        exercise.name.trim(),
        exercise.equipment,
        description,
        timestamp,
      ]).lastInsertRowId;
      exercise.muscleIds.forEach((muscleId) => {
        db.runSync('INSERT INTO exercise_muscles (exercise_id, muscle_id) VALUES (?, ?)', [exerciseId, muscleId]);
      });
    });
    return exerciseId;
  },

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
