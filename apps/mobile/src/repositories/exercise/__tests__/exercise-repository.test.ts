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
