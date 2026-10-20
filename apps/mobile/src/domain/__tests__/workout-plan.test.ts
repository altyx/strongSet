import { buildWorkoutExercises, resolveSetValues } from '@/src/domain/workout-plan';
import { Template } from '@/src/repositories/template/template-type';

const template: Template = {
  id: 1,
  name: 'Full Body',
  created_at: 0,
  exercises: [
    { id: 1, name: 'Bench Press' },
    { id: 2, name: 'Squat' },
  ],
};

describe('buildWorkoutExercises', () => {
  it('reprend le nombre de séries de la dernière séance, sinon le nombre par défaut', () => {
    const lastPerformance = (exerciseId: number) =>
      exerciseId === 1 ? [{ weight: 70, reps: 8 }, { weight: 75, reps: 6 }] : [];

    const exercises = buildWorkoutExercises(template, lastPerformance, 4);

    expect(exercises.map((exercise) => [exercise.exercise_id, exercise.name, exercise.sets?.length])).toEqual([
      [1, 'Bench Press', 2],
      [2, 'Squat', 4],
    ]);
    // Les séries sont vides : la dernière performance ne sert que d'indication
    expect(exercises[0].sets).toEqual([{ weight: null, reps: null }, { weight: null, reps: null }]);
  });

  it('applique les objectifs du programme : séries, répétitions sans historique, repos', () => {
    const programmed: Template = {
      ...template,
      exercises: [
        { id: 1, name: 'Bench Press', target_sets: 3, target_reps: 8, rest_seconds: 150 },
        { id: 2, name: 'Squat', target_sets: null, target_reps: null, rest_seconds: null },
      ],
    };
    const lastPerformance = (exerciseId: number) => (exerciseId === 1 ? [{ weight: 70, reps: 8 }] : []);

    const [bench, squat] = buildWorkoutExercises(programmed, lastPerformance, 4);

    expect(bench.rest_seconds).toBe(150);
    // 3 séries visées ; la 1re a un historique (indication), les suivantes reçoivent les reps visées
    expect(bench.sets).toEqual([
      { weight: null, reps: null },
      { weight: null, reps: 8 },
      { weight: null, reps: 8 },
    ]);
    expect(squat.rest_seconds).toBeNull();
    expect(squat.sets).toHaveLength(4);
  });

  it('crée au moins une série', () => {
    expect(buildWorkoutExercises(template, () => [], 0)[0].sets).toHaveLength(1);
  });
});

describe('resolveSetValues', () => {
  it('garde la saisie quand elle est complète', () => {
    expect(resolveSetValues({ weight: 80, reps: 5 }, { weight: 75, reps: 6 }, 12)).toEqual({ weight: 80, reps: 5 });
  });

  it('complète une saisie vide avec la dernière séance', () => {
    expect(resolveSetValues({ weight: null, reps: null }, { weight: 75, reps: 6 }, 12)).toEqual({ weight: 75, reps: 6 });
    expect(resolveSetValues({ weight: 80, reps: null }, { weight: 75, reps: 6 }, 12)).toEqual({ weight: 80, reps: 6 });
  });

  it('utilise les répétitions par défaut sans historique, sans inventer de charge', () => {
    expect(resolveSetValues({ weight: null, reps: null }, undefined, 12)).toEqual({ weight: null, reps: 12 });
  });

  it('refuse une série sans répétitions', () => {
    expect(resolveSetValues({ weight: 60, reps: 0 }, undefined, 12)).toBeNull();
  });
});
