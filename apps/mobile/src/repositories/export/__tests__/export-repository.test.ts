import { ExportRepository } from '@/src/repositories/export/export-repository';
import { WorkoutRepository } from '@/src/repositories/workout/workout-repository';
import { createTestDatabase, type TestDatabase } from '@/src/test-utils/test-database';

let mockDb: TestDatabase;
jest.mock('@/src/db/database', () => ({ getDatabase: () => mockDb }));

const T0 = 1_760_000_000;

beforeEach(() => {
  mockDb = createTestDatabase();
  jest.spyOn(Date, 'now').mockReturnValue(T0 * 1000);
});

afterEach(() => {
  mockDb.close();
  jest.restoreAllMocks();
});

it('getCompletedSets renvoie les séries validées des séances terminées, numérotées par exercice', () => {
  const id = WorkoutRepository.startWorkout({
    name: 'Push',
    exercises: [
      { exercise_id: 1, name: 'Bench Press', sets: [{ weight: 60, reps: 10 }, { weight: 62.5, reps: 8 }, { weight: 65, reps: 6 }] },
      { exercise_id: 2, name: 'Squat', sets: [{ weight: null, reps: 12 }] },
    ],
  });
  const [bench, squat] = WorkoutRepository.getWorkout(id)!.exercises;
  // La 1re série n'est pas validée : la 2e devient la série 1
  [bench.sets[1], bench.sets[2], squat.sets[0]].forEach((set) => WorkoutRepository.setCompleted(set.id, true));
  WorkoutRepository.updateNote(id, 'Bonne séance');
  WorkoutRepository.finishWorkout(id);
  // Séance en cours : pas exportée
  const active = WorkoutRepository.startWorkout({ name: 'Pull', exercises: [{ exercise_id: 1, name: 'Bench Press', sets: [{ weight: 1, reps: 1 }] }] });
  WorkoutRepository.setCompleted(WorkoutRepository.getWorkout(active)!.exercises[0].sets[0].id, true);

  expect(ExportRepository.getCompletedSets()).toEqual([
    { started_at: T0, workout_name: 'Push', workout_note: 'Bonne séance', exercise_name: 'Bench Press', set_number: 1, type: 'normal', weight: 62.5, reps: 8, duration_seconds: null, distance_meters: null },
    { started_at: T0, workout_name: 'Push', workout_note: 'Bonne séance', exercise_name: 'Bench Press', set_number: 2, type: 'normal', weight: 65, reps: 6, duration_seconds: null, distance_meters: null },
    { started_at: T0, workout_name: 'Push', workout_note: 'Bonne séance', exercise_name: 'Squat', set_number: 1, type: 'normal', weight: null, reps: 12, duration_seconds: null, distance_meters: null },
  ]);
});

it('getBackup copie toutes les tables avec la version du schéma', () => {
  WorkoutRepository.startWorkout({ name: 'Push', exercises: [{ exercise_id: 1, name: 'Bench Press', sets: [{ weight: 60, reps: 10 }] }] });

  const backup = ExportRepository.getBackup(new Date(T0 * 1000));

  expect(backup.format_version).toBe(1);
  expect(backup.exported_at).toBe(new Date(T0 * 1000).toISOString());
  expect(Object.keys(backup.tables)).toEqual([
    'muscles',
    'exercises',
    'exercise_muscles',
    'templates',
    'template_exercises',
    'workouts',
    'workout_exercises',
    'sets',
  ]);
  expect(backup.tables.exercises).toHaveLength(183);
  expect(backup.tables.sets).toEqual([expect.objectContaining({ weight: 60, reps: 10 })]);
});
