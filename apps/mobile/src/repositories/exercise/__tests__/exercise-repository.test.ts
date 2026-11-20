import { ExerciseRepository } from '@/src/repositories/exercise/exercise-repository';
import { TemplateRepository } from '@/src/repositories/template/template-repository';
import { WorkoutRepository } from '@/src/repositories/workout/workout-repository';
import { createTestDatabase, type TestDatabase } from '@/src/test-utils/test-database';

let mockDb: TestDatabase;
jest.mock('@/src/db/database', () => ({ getDatabase: () => mockDb }));

beforeEach(() => {
  mockDb = createTestDatabase();
});

afterEach(() => {
  mockDb.close();
});

// Bibliothèque par défaut : ids 1 à 183
const DEFAULT_EXERCISE_COUNT = 183;

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
    'Chest', 'Triceps', 'Biceps', 'Back', 'Shoulders', 'Quadriceps', 'Calves', 'Glutes', 'Hamstrings', 'Abs', 'Forearms', 'Cardio',
  ]);
});

it('create ajoute un exercice avec son matériel et ses muscles', () => {
  jest.spyOn(Date, 'now').mockReturnValue(1_760_000_000_000);
  const id = ExerciseRepository.create({ name: '  Tirage maison ', equipment: 'Autre', muscleIds: [4, 3] });

  expect(ExerciseRepository.getById(id)).toEqual({
    id,
    name: 'Tirage maison',
    equipment: 'Autre',
    tracking: 'weight_reps',
    description: null,
    deleted_at: null,
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

describe('modification et suppression', () => {
  const createCustom = () =>
    ExerciseRepository.create({ name: 'Tirage maison', equipment: 'Autre', muscleIds: [4], description: 'Ancienne' });

  // Séance terminée avec une série validée de l'exercice, dans un programme qui le contient
  const useInWorkoutAndTemplate = (exerciseId: number, name: string) => {
    const templateId = TemplateRepository.createTemplate({
      name: 'Dos',
      exercises: [
        { exercise_id: exerciseId, target_sets: 3, target_reps: 10, rest_seconds: null },
        { exercise_id: 2, target_sets: 3, target_reps: 10, rest_seconds: null },
      ],
    });
    const workoutId = WorkoutRepository.startWorkout({
      template_id: templateId,
      name: 'Dos',
      exercises: [{ exercise_id: exerciseId, name, sets: [{ weight: 50, reps: 10 }] }],
    });
    const set = WorkoutRepository.getWorkout(workoutId)!.exercises[0].sets[0];
    WorkoutRepository.setCompleted(set.id, true);
    WorkoutRepository.finishWorkout(workoutId);
    return { templateId, workoutId };
  };

  it('existsByName laisse un exercice garder son propre nom', () => {
    const id = createCustom();
    expect(ExerciseRepository.existsByName('tirage MAISON', id)).toBe(false);
    expect(ExerciseRepository.existsByName('Squat', id)).toBe(true);
  });

  it('getMuscleIds renvoie les ids des muscles', () => {
    expect(ExerciseRepository.getMuscleIds(1)).toEqual([1, 2]);
  });

  it('update modifie les champs, remplace les muscles et renomme la copie dans les séances', () => {
    const id = createCustom();
    const { workoutId } = useInWorkoutAndTemplate(id, 'Tirage maison');

    ExerciseRepository.update(id, {
      name: '  Tirage horizontal maison ',
      equipment: null,
      muscleIds: [4, 3],
      description: '   ',
      tracking: 'weight_reps',
    });

    expect(ExerciseRepository.getById(id)).toEqual({
      id,
      name: 'Tirage horizontal maison',
      equipment: null,
      tracking: 'weight_reps',
      description: null,
      deleted_at: null,
      muscles: ['Biceps', 'Back'],
    });
    expect(WorkoutRepository.getWorkout(workoutId)!.exercises[0].name).toBe('Tirage horizontal maison');
  });

  it('getUsage compte les séances et les programmes', () => {
    const id = createCustom();
    expect(ExerciseRepository.getUsage(id)).toEqual({ workoutCount: 0, templateCount: 0 });
    useInWorkoutAndTemplate(id, 'Tirage maison');
    expect(ExerciseRepository.getUsage(id)).toEqual({ workoutCount: 1, templateCount: 1 });
  });

  it('delete d’un exercice déjà fait : retiré de la bibliothèque et des programmes, progression gardée', () => {
    const id = createCustom();
    const { templateId, workoutId } = useInWorkoutAndTemplate(id, 'Tirage maison');
    jest.spyOn(Date, 'now').mockReturnValue(1_770_000_000_000);

    ExerciseRepository.delete(id);
    jest.restoreAllMocks();

    // Hors de la bibliothèque, du compteur et des noms pris
    expect(ExerciseRepository.getAll().some((exercise) => exercise.id === id)).toBe(false);
    expect(ExerciseRepository.count()).toBe(DEFAULT_EXERCISE_COUNT);
    expect(ExerciseRepository.existsByName('Tirage maison')).toBe(false);
    expect(TemplateRepository.getTemplate(templateId)!.exercises.map((exercise) => exercise.id)).toEqual([2]);
    // Fiche, séance et progression toujours là
    expect(ExerciseRepository.getById(id)).toMatchObject({ name: 'Tirage maison', deleted_at: 1_770_000_000, muscles: ['Back'] });
    expect(WorkoutRepository.getWorkout(workoutId)!.exercises[0]).toMatchObject({ exercise_id: id, name: 'Tirage maison' });
    expect(WorkoutRepository.getExerciseSessions(id)).toHaveLength(1);
    expect(WorkoutRepository.getTrainedExercises().map((exercise) => exercise.id)).toContain(id);
  });

  it('delete d’un exercice jamais fait : effacé, et retiré des programmes', () => {
    const id = createCustom();
    const templateId = TemplateRepository.createTemplate({
      name: 'Dos',
      exercises: [{ exercise_id: id, target_sets: 3, target_reps: 10, rest_seconds: null }],
    });

    ExerciseRepository.delete(id);

    expect(ExerciseRepository.getById(id)).toBeNull();
    expect(ExerciseRepository.getMuscleIds(id)).toEqual([]);
    expect(TemplateRepository.getTemplate(templateId)!.exercises).toEqual([]);
  });

  it('delete fonctionne aussi pour un exercice de la bibliothèque par défaut', () => {
    ExerciseRepository.delete(1);
    expect(ExerciseRepository.getById(1)).toBeNull();
    expect(ExerciseRepository.count()).toBe(DEFAULT_EXERCISE_COUNT - 1);
  });
});
