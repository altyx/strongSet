import { buildWorkoutExercise, buildWorkoutExercises, resolveSetValues } from '@/src/domain/workout-plan';
import { Template } from '@/src/repositories/template/template-type';

const template: Template = {
  id: 1,
  name: 'Full Body',
  created_at: 0,
  exercises: [
    { id: 1, name: 'Bench Press', tracking: 'weight_reps' },
    { id: 2, name: 'Squat', tracking: 'weight_reps' },
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
    expect(exercises[0].sets).toEqual([
      { weight: null, reps: null, type: 'normal' },
      { weight: null, reps: null, type: 'normal' },
    ]);
  });

  it('applique les objectifs du programme : séries, répétitions sans historique, repos', () => {
    const programmed: Template = {
      ...template,
      exercises: [
        { id: 1, name: 'Bench Press', tracking: 'weight_reps', target_sets: 3, target_reps: 8, rest_seconds: 150 },
        { id: 2, name: 'Squat', tracking: 'weight_reps', target_sets: null, target_reps: null, rest_seconds: null },
      ],
    };
    const lastPerformance = (exerciseId: number) => (exerciseId === 1 ? [{ weight: 70, reps: 8 }] : []);

    const [bench, squat] = buildWorkoutExercises(programmed, lastPerformance, 4);

    expect(bench.rest_seconds).toBe(150);
    // 3 séries visées ; la 1re a un historique (indication), les suivantes reçoivent les reps visées
    expect(bench.sets).toEqual([
      { weight: null, reps: null, type: 'normal' },
      { weight: null, reps: 8, type: 'normal' },
      { weight: null, reps: 8, type: 'normal' },
    ]);
    expect(squat.rest_seconds).toBeNull();
    expect(squat.sets).toHaveLength(4);
  });

  it('reprend le type des séries de la dernière séance', () => {
    const lastPerformance = () => [
      { weight: 40, reps: 10, type: 'warmup' as const },
      { weight: 80, reps: 5, type: 'normal' as const },
      { weight: 60, reps: 8, type: 'drop' as const },
    ];

    const [bench] = buildWorkoutExercises(template, lastPerformance, 4);

    expect(bench.sets?.map((set) => set.type)).toEqual(['warmup', 'normal', 'drop']);
  });

  it('crée au moins une série', () => {
    expect(buildWorkoutExercises(template, () => [], 0)[0].sets).toHaveLength(1);
  });
});

describe('buildWorkoutExercise', () => {
  it('prépare un exercice de la bibliothèque ajouté en cours de séance, sans objectifs', () => {
    expect(buildWorkoutExercise({ id: 2, name: 'Squat', tracking: 'weight_reps' }, [{ weight: 100, reps: 5 }], 4)).toEqual({
      exercise_id: 2,
      name: 'Squat',
      rest_seconds: null,
      sets: [{ weight: null, reps: null, type: 'normal' }],
    });
    expect(buildWorkoutExercise({ id: 2, name: 'Squat', tracking: 'weight_reps' }, [], 3).sets).toHaveLength(3);
  });
});

describe('cardio', () => {
  const run = { id: 172, name: 'Tapis de course', tracking: 'duration_distance' as const };

  it('prépare une seule série sans répétitions, ou autant que la dernière fois', () => {
    expect(buildWorkoutExercise({ ...run, target_reps: 10 }, [], 4).sets).toEqual([{ weight: null, reps: null, type: 'normal' }]);
    expect(buildWorkoutExercise(run, [{ weight: null, reps: null }, { weight: null, reps: null }], 4).sets).toHaveLength(2);
  });

  it('exige une durée, reprise de la dernière séance si besoin ; la distance est facultative', () => {
    const empty = { weight: null, reps: null, duration_seconds: null, distance_meters: null };
    expect(resolveSetValues({ ...empty, duration_seconds: 1800, distance_meters: 5000 }, undefined, 12, 'duration_distance')).toEqual(
      { weight: null, reps: null, duration_seconds: 1800, distance_meters: 5000 },
    );
    expect(resolveSetValues(empty, { ...empty, duration_seconds: 1500, distance_meters: 4000 }, 12, 'duration_distance')).toEqual({
      weight: null,
      reps: null,
      duration_seconds: 1500,
      distance_meters: 4000,
    });
    expect(resolveSetValues({ ...empty, duration_seconds: 600 }, undefined, 12, 'duration_distance')).toEqual({
      weight: null,
      reps: null,
      duration_seconds: 600,
      distance_meters: null,
    });
    expect(resolveSetValues({ ...empty, distance_meters: 5000 }, undefined, 12, 'duration_distance')).toBeNull();
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
