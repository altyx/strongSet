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

// Bibliothèque par défaut : ids 1 à 144
const DEFAULT_EXERCISE_COUNT = 144;

it('count compte les exercices de la bibliothèque', () => {
  expect(ExerciseRepository.count()).toBe(DEFAULT_EXERCISE_COUNT);
});

it('getMusclesByExercise regroupe les muscles par exercice (données par défaut)', () => {
  // 1 Développé couché : Chest, Triceps · 2 Squat : Quadriceps, Glutes
  expect(ExerciseRepository.getMusclesByExercise([1, 2])).toEqual({
    1: ['Chest', 'Triceps'],
    2: ['Quadriceps', 'Glutes'],
  });
  expect(ExerciseRepository.getMusclesByExercise([])).toEqual({});
});

describe('bibliothèque par défaut', () => {
  it('est triée en français, accents compris', () => {
    const names = ExerciseRepository.getAll().map((exercise) => exercise.name);
    expect(names[0]).toBe('Abducteurs à la machine');
    // « Écarté » et « Élévations » se rangent avec les E, avant « Extension » et « Face pull »
    expect(names.indexOf('Écarté couché haltères')).toBeLessThan(names.indexOf('Extension nuque haltère'));
    expect(names.indexOf('Élévations latérales haltères')).toBeLessThan(names.indexOf('Face pull'));
    expect([...names].sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }))).toEqual(names);
  });

  it('a des noms uniques, sans accent ni casse près', () => {
    const names = ExerciseRepository.getAll().map((exercise) =>
      exercise.name.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase(),
    );
    expect(new Set(names).size).toBe(names.length);
  });

  it('donne à chaque exercice un matériel et au moins un muscle', () => {
    ExerciseRepository.getAll().forEach((exercise) => {
      expect({ name: exercise.name, equipment: exercise.equipment }).toEqual({ name: exercise.name, equipment: expect.any(String) });
      expect({ name: exercise.name, muscles: exercise.muscles.length > 0 }).toEqual({ name: exercise.name, muscles: true });
    });
  });

  it('couvre chaque muscle avec plusieurs exercices', () => {
    const exercises = ExerciseRepository.getAll();
    ExerciseRepository.getMuscles().forEach((muscle) => {
      const count = exercises.filter((exercise) => exercise.muscles.includes(muscle.name)).length;
      expect({ muscle: muscle.name, enough: count >= 2 }).toEqual({ muscle: muscle.name, enough: true });
    });
  });

  it('est en français pour les exercices de base', () => {
    expect([1, 2, 3, 4, 5].map((id) => ExerciseRepository.getById(id)?.name)).toEqual([
      'Développé couché',
      'Squat',
      'Soulevé de terre',
      'Tractions',
      'Développé militaire',
    ]);
  });
});

it('associe chaque variante à ses muscles', () => {
  const exercise = ExerciseRepository.getAll().find(({ name }) => name === 'Extension triceps poulie haute à un bras');
  expect(exercise).toMatchObject({ equipment: 'Poulie', muscles: ['Triceps'] });
});

it('getMuscles liste les muscles par défaut', () => {
  expect(ExerciseRepository.getMuscles().map((muscle) => muscle.name)).toEqual([
    'Chest', 'Triceps', 'Biceps', 'Back', 'Shoulders', 'Quadriceps', 'Calves', 'Glutes', 'Hamstrings', 'Abs', 'Forearms',
  ]);
});

it('create ajoute un exercice avec son matériel et ses muscles', () => {
  jest.spyOn(Date, 'now').mockReturnValue(1_760_000_000_000);
  const id = ExerciseRepository.create({ name: '  Tirage maison ', equipment: 'Autre', muscleIds: [4, 3] });

  expect(ExerciseRepository.getById(id)).toEqual({
    id,
    name: 'Tirage maison',
    equipment: 'Autre',
    description: null,
    muscles: ['Biceps', 'Back'],
  });
  expect(ExerciseRepository.count()).toBe(DEFAULT_EXERCISE_COUNT + 1);
  jest.restoreAllMocks();
});

it('existsByName ignore la casse, les accents et les espaces', () => {
  expect(ExerciseRepository.existsByName(' développé couché ')).toBe(true);
  expect(ExerciseRepository.existsByName('DEVELOPPE COUCHE')).toBe(true);
  expect(ExerciseRepository.existsByName('Tirage maison')).toBe(false);
});

it('getById renvoie un exercice avec ses muscles, ou null', () => {
  expect(ExerciseRepository.getById(2)).toMatchObject({ id: 2, name: 'Squat', equipment: 'Barre', muscles: ['Quadriceps', 'Glutes'] });
  expect(ExerciseRepository.getById(999)).toBeNull();
});

describe('descriptions', () => {
  it('chaque exercice par défaut a une description en trois étapes', () => {
    ExerciseRepository.getAll().forEach(({ id, name }) => {
      const lines = ExerciseRepository.getById(id)?.description?.split('\n') ?? [];
      expect({ name, prefixes: lines.map((line) => line.split(' : ')[0]) }).toEqual({
        name,
        prefixes: ['Installation', 'Exécution', 'Conseil'],
      });
    });
  });

  it('garde les apostrophes intactes', () => {
    expect(ExerciseRepository.getById(1)?.description).toContain('jusqu’au bas des pectoraux');
  });

  it('create enregistre la description facultative, sans texte vide', () => {
    const withText = ExerciseRepository.create({ name: 'A', equipment: null, muscleIds: [1], description: '  Mon conseil  ' });
    const empty = ExerciseRepository.create({ name: 'B', equipment: null, muscleIds: [1], description: '   ' });
    expect(ExerciseRepository.getById(withText)?.description).toBe('Mon conseil');
    expect(ExerciseRepository.getById(empty)?.description).toBeNull();
  });
});
