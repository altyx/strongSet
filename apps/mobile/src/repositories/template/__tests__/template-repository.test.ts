import { TemplateRepository } from '@/src/repositories/template/template-repository';
import { WorkoutRepository } from '@/src/repositories/workout/workout-repository';
import { createTestDatabase, type TestDatabase } from '@/src/test-utils/test-database';

let mockDb: TestDatabase;
jest.mock('@/src/db/database', () => ({ getDatabase: () => mockDb }));

beforeEach(() => {
  mockDb = createTestDatabase();
  jest.spyOn(Date, 'now').mockReturnValue(1_760_000_000_000);
});

afterEach(() => {
  mockDb.close();
  jest.restoreAllMocks();
});

it('lit les programmes par défaut avec leurs exercices dans l’ordre', () => {
  const fullBody = TemplateRepository.getAllTemplates().find((template) => template.name === 'Full Body')!;
  expect(fullBody.exercises.map((exercise) => exercise.name)).toEqual(['Développé couché', 'Squat', 'Deadlift', 'Shoulder Press']);
  expect(fullBody.exercises[0]).toMatchObject({ target_sets: null, target_reps: null, rest_seconds: null });
});

it('crée un programme avec ses objectifs, le plus récent en premier', () => {
  const id = TemplateRepository.createTemplate({
    name: 'Legs',
    exercises: [
      { exercise_id: 2, target_sets: 5, target_reps: 5, rest_seconds: 180 },
      { exercise_id: 3, target_sets: 3, target_reps: 8, rest_seconds: 120 },
    ],
  });

  expect(TemplateRepository.getAllTemplates()[0].id).toBe(id);
  expect(TemplateRepository.getTemplate(id)).toMatchObject({
    name: 'Legs',
    exercises: [
      { id: 2, name: 'Squat', target_sets: 5, target_reps: 5, rest_seconds: 180 },
      { id: 3, name: 'Deadlift', target_sets: 3, target_reps: 8, rest_seconds: 120 },
    ],
  });
});

it('met à jour le nom, l’ordre et les objectifs', () => {
  TemplateRepository.updateTemplate(1, {
    name: 'Full Body A',
    exercises: [
      { exercise_id: 2, target_sets: 4, target_reps: 6, rest_seconds: 150 },
      { exercise_id: 1, target_sets: 4, target_reps: 8, rest_seconds: 120 },
    ],
  });

  const template = TemplateRepository.getTemplate(1)!;
  expect(template.name).toBe('Full Body A');
  expect(template.exercises.map((exercise) => [exercise.name, exercise.target_reps])).toEqual([
    ['Squat', 6],
    ['Développé couché', 8],
  ]);
});

it('supprime un programme en gardant les séances faites avec', () => {
  const workoutId = WorkoutRepository.startWorkout({ template_id: 1, name: 'Full Body', exercises: [] });

  TemplateRepository.deleteTemplate(1);

  expect(TemplateRepository.getTemplate(1)).toBeNull();
  expect(WorkoutRepository.getWorkout(workoutId)).toMatchObject({ template_id: null, name: 'Full Body' });
});
