import { WorkoutRepository } from '@/src/repositories/workout/workout-repository';
import { createTestDatabase, type TestDatabase } from '@/src/test-utils/test-database';

let mockDb: TestDatabase;
jest.mock('@/src/db/database', () => ({ getDatabase: () => mockDb }));

// Exercices des données par défaut
const BENCH = { exercise_id: 1, name: 'Bench Press' };
const SQUAT = { exercise_id: 2, name: 'Squat' };

const DAY = 24 * 60 * 60;
const T0 = 1_760_000_000;

// Fige l'horloge (en secondes) pour ordonner les séances
function setNow(seconds: number) {
  jest.spyOn(Date, 'now').mockReturnValue(seconds * 1000);
}

// Démarre une séance, valide toutes ses séries et la termine
function recordWorkout(at: number, exercises: Parameters<typeof WorkoutRepository.startWorkout>[0]['exercises']) {
  setNow(at);
  const id = WorkoutRepository.startWorkout({ name: 'Séance', exercises });
  WorkoutRepository.getWorkout(id)!.exercises.forEach((exercise) =>
    exercise.sets.forEach((set) => WorkoutRepository.setCompleted(set.id, true)),
  );
  WorkoutRepository.finishWorkout(id);
  return id;
}

function countRows(table: string) {
  return mockDb.getFirstSync<{ count: number }>(`SELECT COUNT(*) AS count FROM ${table}`)!.count;
}

beforeEach(() => {
  mockDb = createTestDatabase();
  setNow(T0);
});

afterEach(() => {
  mockDb.close();
  jest.restoreAllMocks();
});

describe('startWorkout', () => {
  it('crée la séance avec ses exercices dans l’ordre et leurs séries initiales', () => {
    const id = WorkoutRepository.startWorkout({
      template_id: 1,
      name: 'Full Body',
      exercises: [
        { ...SQUAT, sets: [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }] },
        { ...BENCH, sets: [{ weight: null, reps: null }] },
      ],
    });

    const workout = WorkoutRepository.getWorkout(id)!;
    expect(workout).toMatchObject({ template_id: 1, name: 'Full Body', started_at: T0, finished_at: null });
    expect(workout.exercises.map((exercise) => exercise.name)).toEqual(['Squat', 'Bench Press']);
    expect(workout.exercises[0].sets).toEqual([
      expect.objectContaining({ position: 0, weight: 100, reps: 5, completed_at: null }),
      expect.objectContaining({ position: 1, weight: 100, reps: 5, completed_at: null }),
    ]);
    expect(workout.exercises[1].sets).toEqual([expect.objectContaining({ weight: null, reps: null })]);
  });

  it('est la séance active tant qu’elle n’est pas terminée', () => {
    expect(WorkoutRepository.getActiveWorkout()).toBeNull();
    const id = WorkoutRepository.startWorkout({ name: 'Push', exercises: [BENCH] });
    expect(WorkoutRepository.getActiveWorkout()?.id).toBe(id);
  });
});

describe('séries', () => {
  it('ajoute, modifie, valide et supprime une série', () => {
    const id = WorkoutRepository.startWorkout({ name: 'Push', exercises: [{ ...BENCH, sets: [{ weight: 60, reps: 10 }] }] });
    const exerciseId = WorkoutRepository.getWorkout(id)!.exercises[0].id;

    const setId = WorkoutRepository.addSet(exerciseId, { weight: 70, reps: 8 });
    WorkoutRepository.updateSet(setId, { weight: 72.5, reps: 6 });
    setNow(T0 + 120);
    WorkoutRepository.setCompleted(setId, true);

    let sets = WorkoutRepository.getWorkout(id)!.exercises[0].sets;
    expect(sets[1]).toMatchObject({ id: setId, position: 1, weight: 72.5, reps: 6, completed_at: T0 + 120 });

    WorkoutRepository.setCompleted(setId, false);
    expect(WorkoutRepository.getWorkout(id)!.exercises[0].sets[1].completed_at).toBeNull();

    WorkoutRepository.deleteSet(setId);
    sets = WorkoutRepository.getWorkout(id)!.exercises[0].sets;
    expect(sets).toHaveLength(1);
  });

  it('ajoute un exercice en fin de séance', () => {
    const id = WorkoutRepository.startWorkout({ name: 'Push', exercises: [BENCH] });
    WorkoutRepository.addExercise(id, { ...SQUAT, sets: [{ weight: 80, reps: 8 }] });

    const exercises = WorkoutRepository.getWorkout(id)!.exercises;
    expect(exercises.map((exercise) => [exercise.name, exercise.position])).toEqual([
      ['Bench Press', 0],
      ['Squat', 1],
    ]);
    expect(exercises[1].sets).toHaveLength(1);
  });
});

describe('finishWorkout', () => {
  it('garde les séries validées et retire les séries non faites et les exercices vides', () => {
    const id = WorkoutRepository.startWorkout({
      name: 'Full Body',
      exercises: [
        { ...BENCH, sets: [{ weight: 60, reps: 10 }, { weight: 60, reps: 10 }] },
        { ...SQUAT, sets: [{ weight: 100, reps: 5 }] },
      ],
    });
    const bench = WorkoutRepository.getWorkout(id)!.exercises[0];
    WorkoutRepository.setCompleted(bench.sets[0].id, true);

    setNow(T0 + 3600);
    expect(WorkoutRepository.finishWorkout(id)).toBe(true);

    const workout = WorkoutRepository.getWorkout(id)!;
    expect(workout.finished_at).toBe(T0 + 3600);
    expect(workout.exercises).toHaveLength(1);
    expect(workout.exercises[0].sets).toHaveLength(1);
    expect(WorkoutRepository.getActiveWorkout()).toBeNull();
  });

  it('supprime une séance sans aucune série validée', () => {
    const id = WorkoutRepository.startWorkout({ name: 'Push', exercises: [{ ...BENCH, sets: [{ weight: 60, reps: 10 }] }] });

    expect(WorkoutRepository.finishWorkout(id)).toBe(false);
    expect(WorkoutRepository.getWorkout(id)).toBeNull();
    expect(countRows('sets')).toBe(0);
  });
});

it('discardWorkout supprime la séance avec ses exercices et séries', () => {
  const id = WorkoutRepository.startWorkout({ name: 'Push', exercises: [{ ...BENCH, sets: [{ weight: 60, reps: 10 }] }] });

  WorkoutRepository.discardWorkout(id);

  expect(WorkoutRepository.getWorkout(id)).toBeNull();
  expect(countRows('workout_exercises')).toBe(0);
  expect(countRows('sets')).toBe(0);
});

describe('lectures', () => {
  it('getHistory liste les séances terminées, la plus récente d’abord, avec leur volume', () => {
    recordWorkout(T0, [{ ...BENCH, sets: [{ weight: 60, reps: 10 }, { weight: 70, reps: 8 }] }]);
    recordWorkout(T0 + DAY, [
      { ...BENCH, sets: [{ weight: 80, reps: 5 }] },
      { ...SQUAT, sets: [{ weight: 0, reps: 20 }] },
    ]);
    setNow(T0 + 2 * DAY);
    WorkoutRepository.startWorkout({ name: 'En cours', exercises: [BENCH] });

    const history = WorkoutRepository.getHistory();
    expect(history).toEqual([
      expect.objectContaining({ started_at: T0 + DAY, exercise_count: 2, completed_set_count: 2, volume: 400 }),
      expect.objectContaining({ started_at: T0, exercise_count: 1, completed_set_count: 2, volume: 1160 }),
    ]);
    expect(WorkoutRepository.count()).toBe(2);
  });

  it('getLastPerformance renvoie les séries validées de la dernière séance terminée avec cet exercice', () => {
    recordWorkout(T0, [{ ...BENCH, sets: [{ weight: 60, reps: 10 }] }]);
    recordWorkout(T0 + DAY, [{ ...BENCH, sets: [{ weight: 70, reps: 8 }, { weight: 75, reps: 6 }] }]);
    recordWorkout(T0 + 2 * DAY, [{ ...SQUAT, sets: [{ weight: 100, reps: 5 }] }]);
    setNow(T0 + 3 * DAY);
    WorkoutRepository.startWorkout({ name: 'En cours', exercises: [{ ...BENCH, sets: [{ weight: 90, reps: 1 }] }] });

    expect(WorkoutRepository.getLastPerformance(BENCH.exercise_id)).toEqual([
      expect.objectContaining({ weight: 70, reps: 8 }),
      expect.objectContaining({ weight: 75, reps: 6 }),
    ]);
    expect(WorkoutRepository.getLastPerformance(5)).toEqual([]);
  });

  it('getWorkoutTimestampsBetween ignore les séances en cours et hors période', () => {
    recordWorkout(T0, [{ ...BENCH, sets: [{ weight: 60, reps: 10 }] }]);
    recordWorkout(T0 + 10 * DAY, [{ ...BENCH, sets: [{ weight: 60, reps: 10 }] }]);
    setNow(T0 + DAY);
    WorkoutRepository.startWorkout({ name: 'En cours', exercises: [BENCH] });

    expect(WorkoutRepository.getWorkoutTimestampsBetween(T0, T0 + 7 * DAY)).toEqual([T0]);
  });
});

describe('récap', () => {
  it('getBestWeightsBefore renvoie la charge max validée par exercice avant une date', () => {
    recordWorkout(T0, [{ ...BENCH, sets: [{ weight: 70, reps: 8 }, { weight: 75, reps: 6 }] }]);
    recordWorkout(T0 + DAY, [{ ...BENCH, sets: [{ weight: 80, reps: 5 }] }]);
    recordWorkout(T0 + 2 * DAY, [{ ...SQUAT, sets: [{ weight: null, reps: 20 }] }]);

    expect(WorkoutRepository.getBestWeightsBefore([BENCH.exercise_id, SQUAT.exercise_id], T0 + DAY)).toEqual({ 1: 75 });
    expect(WorkoutRepository.getBestWeightsBefore([BENCH.exercise_id], T0 + 3 * DAY)).toEqual({ 1: 80 });
    expect(WorkoutRepository.getBestWeightsBefore([], T0)).toEqual({});
  });

  it('getPreviousOfTemplate renvoie la séance précédente du même programme', () => {
    setNow(T0);
    const first = WorkoutRepository.startWorkout({ template_id: 1, name: 'Full Body', exercises: [{ ...BENCH, sets: [{ weight: 60, reps: 10 }] }] });
    WorkoutRepository.setCompleted(WorkoutRepository.getWorkout(first)!.exercises[0].sets[0].id, true);
    WorkoutRepository.finishWorkout(first);
    recordWorkout(T0 + DAY, [{ ...SQUAT, sets: [{ weight: 100, reps: 5 }] }]);

    expect(WorkoutRepository.getPreviousOfTemplate(1, T0 + 2 * DAY)).toMatchObject({ id: first, volume: 600 });
    expect(WorkoutRepository.getPreviousOfTemplate(1, T0)).toBeNull();
  });

  it('updateNote enregistre la note de la séance', () => {
    const id = recordWorkout(T0, [{ ...BENCH, sets: [{ weight: 60, reps: 10 }] }]);
    WorkoutRepository.updateNote(id, 'Épaule un peu raide');
    expect(WorkoutRepository.getWorkout(id)!.note).toBe('Épaule un peu raide');
  });
});

it('garde le nom de l’exercice dans l’historique s’il est supprimé de la bibliothèque', () => {
  const id = recordWorkout(T0, [{ ...BENCH, sets: [{ weight: 60, reps: 10 }] }]);

  mockDb.runSync('DELETE FROM exercise_muscles WHERE exercise_id = ?', [BENCH.exercise_id]);
  mockDb.runSync('DELETE FROM exercises WHERE id = ?', [BENCH.exercise_id]);

  expect(WorkoutRepository.getWorkout(id)!.exercises[0]).toMatchObject({ exercise_id: null, name: 'Bench Press' });
});
