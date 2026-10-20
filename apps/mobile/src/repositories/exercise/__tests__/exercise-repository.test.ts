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
  expect(ExerciseRepository.count()).toBe(25);
});

it('getMusclesByExercise regroupe les muscles par exercice (données par défaut)', () => {
  // 1 Développé couché : Chest, Triceps · 2 Squat : Quadriceps
  expect(ExerciseRepository.getMusclesByExercise([1, 2])).toEqual({ 1: ['Chest', 'Triceps'], 2: ['Quadriceps'] });
  expect(ExerciseRepository.getMusclesByExercise([])).toEqual({});
});

it('getAll trie la bibliothèque en français (accents compris) avec matériel et muscles', () => {
  const names = ExerciseRepository.getAll().map((exercise) => exercise.name);
  expect(names.slice(0, 4)).toEqual(['Deadlift', 'Développé couché', 'Développé couché haltères', 'Développé couché machine guidée']);
  // « Écarté » se range avec les E, avant « Pec deck » et « Squat »
  expect(names.indexOf('Écarté couché haltères')).toBeLessThan(names.indexOf('Pec deck (butterfly)'));
  expect(names[names.length - 1]).toBe('Squat');
  expect(ExerciseRepository.getAll().find((exercise) => exercise.id === 1)).toEqual({
    id: 1,
    name: 'Développé couché',
    equipment: 'Barre',
    muscles: ['Chest', 'Triceps'],
  });
});

it('les exercices pectoraux par défaut travaillent tous les pectoraux', () => {
  const chest = ExerciseRepository.getAll().filter((exercise) => exercise.id === 1 || (exercise.id >= 6 && exercise.id <= 25));
  expect(chest).toHaveLength(21);
  chest.forEach((exercise) => {
    expect(exercise.muscles).toContain('Chest');
    expect(exercise.equipment).not.toBeNull();
  });
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
  expect(ExerciseRepository.count()).toBe(26);
  jest.restoreAllMocks();
});

it('existsByName ignore la casse et les espaces', () => {
  expect(ExerciseRepository.existsByName(' développé couché ')).toBe(true);
  expect(ExerciseRepository.existsByName('DEVELOPPE COUCHE')).toBe(true);
  expect(ExerciseRepository.existsByName('Hip thrust')).toBe(false);
});

it('getById renvoie un exercice avec ses muscles, ou null', () => {
  expect(ExerciseRepository.getById(2)).toEqual({ id: 2, name: 'Squat', equipment: null, muscles: ['Quadriceps'] });
  expect(ExerciseRepository.getById(999)).toBeNull();
});
