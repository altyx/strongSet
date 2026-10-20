import { ExerciseRepository } from '@/src/repositories/exercise/exercise-repository';
import { createTestDatabase, type TestDatabase } from '@/src/test-utils/test-database';

let mockDb: TestDatabase;
jest.mock('@/src/db/database', () => ({ getDatabase: () => mockDb }));

beforeEach(() => {
  mockDb = createTestDatabase();
});

afterEach(() => {
  mockDb.close();
});

it('count compte les exercices de la bibliothèque', () => {
  expect(ExerciseRepository.count()).toBe(5);
});

it('getMusclesByExercise regroupe les muscles par exercice (données par défaut)', () => {
  // 1 Bench Press : Chest, Triceps · 2 Squat : Quadriceps
  expect(ExerciseRepository.getMusclesByExercise([1, 2])).toEqual({ 1: ['Chest', 'Triceps'], 2: ['Quadriceps'] });
  expect(ExerciseRepository.getMusclesByExercise([])).toEqual({});
});

it('getAll liste la bibliothèque par ordre alphabétique avec les muscles', () => {
  const exercises = ExerciseRepository.getAll();
  expect(exercises.map((exercise) => exercise.name)).toEqual(['Bench Press', 'Deadlift', 'Pull-ups', 'Shoulder Press', 'Squat']);
  expect(exercises[0]).toEqual({ id: 1, name: 'Bench Press', equipment: null, muscles: ['Chest', 'Triceps'] });
});

it('getMuscles liste les muscles par défaut', () => {
  expect(ExerciseRepository.getMuscles().map((muscle) => muscle.name)).toEqual([
    'Chest', 'Triceps', 'Biceps', 'Back', 'Shoulders', 'Quadriceps', 'Calves', 'Glutes', 'Hamstrings', 'Abs', 'Forearms',
  ]);
});

it('create ajoute un exercice avec son matériel et ses muscles', () => {
  jest.spyOn(Date, 'now').mockReturnValue(1_760_000_000_000);
  const id = ExerciseRepository.create({ name: '  Hip thrust ', equipment: 'Barre', muscleIds: [8, 9] });

  expect(ExerciseRepository.getAll().find((exercise) => exercise.id === id)).toEqual({
    id,
    name: 'Hip thrust',
    equipment: 'Barre',
    muscles: ['Glutes', 'Hamstrings'],
  });
  expect(ExerciseRepository.count()).toBe(6);
  jest.restoreAllMocks();
});

it('existsByName ignore la casse et les espaces', () => {
  expect(ExerciseRepository.existsByName(' bench press ')).toBe(true);
  expect(ExerciseRepository.existsByName('Hip thrust')).toBe(false);
});

it('getById renvoie un exercice avec ses muscles, ou null', () => {
  expect(ExerciseRepository.getById(2)).toEqual({ id: 2, name: 'Squat', equipment: null, muscles: ['Quadriceps'] });
  expect(ExerciseRepository.getById(999)).toBeNull();
});
