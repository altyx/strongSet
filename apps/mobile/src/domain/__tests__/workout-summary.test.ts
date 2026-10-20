import { findWeightRecords, setsPerMuscle, summarizeWorkout, volumeChange } from '@/src/domain/workout-summary';
import { Workout } from '@/src/repositories/workout/workout-type';

let nextId = 1;
const set = (weight: number | null, reps: number | null, completed = true) => ({
  id: nextId++,
  position: 0,
  weight,
  reps,
  completed_at: completed ? 1 : null,
});

const workout: Workout = {
  id: 1,
  template_id: 1,
  name: 'Push',
  note: null,
  started_at: 1000,
  finished_at: 1000 + 54 * 60,
  exercises: [
    { id: 1, exercise_id: 1, name: 'Bench Press', position: 0, rest_seconds: null, sets: [set(75, 6), set(80, 5), set(80, 3), set(85, 1, false)] },
    { id: 2, exercise_id: 4, name: 'Pull-ups', position: 1, rest_seconds: null, sets: [set(null, 10), set(null, 8)] },
    { id: 3, exercise_id: 5, name: 'Shoulder Press', position: 2, rest_seconds: null, sets: [set(40, 8, false)] },
    { id: 4, exercise_id: null, name: 'Exercice supprimé', position: 3, rest_seconds: null, sets: [set(20, 10)] },
  ],
};

it('summarizeWorkout calcule durée, volume, séries et exercices faits', () => {
  expect(summarizeWorkout(workout)).toEqual({
    durationSeconds: 54 * 60,
    // 75×6 + 80×5 + 80×3 + 20×10 ; poids du corps et séries non validées exclus
    volume: 450 + 400 + 240 + 200,
    completedSetCount: 6,
    exerciseCount: 3,
  });
});

it('summarizeWorkout mesure une séance en cours jusqu’à maintenant', () => {
  expect(summarizeWorkout({ ...workout, finished_at: null }, 1600).durationSeconds).toBe(600);
});

describe('findWeightRecords', () => {
  it('signale la série la plus lourde validée quand elle bat le record précédent', () => {
    expect(findWeightRecords(workout, { 1: 77.5, 5: 30 })).toEqual([
      { exerciseName: 'Bench Press', weight: 80, reps: 5, previousBest: 77.5 },
    ]);
  });

  it('ne compte ni l’égalité, ni un premier passage, ni une série non validée', () => {
    expect(findWeightRecords(workout, { 1: 80 })).toEqual([]);
    expect(findWeightRecords(workout, {})).toEqual([]);
    // Shoulder Press : 40 kg non validé, record précédent 30 kg
    expect(findWeightRecords(workout, { 5: 30 })).toEqual([]);
  });
});

it('volumeChange donne l’évolution en %, ou null sans séance de comparaison', () => {
  expect(volumeChange(1060, 1000)).toBe(6);
  expect(volumeChange(900, 1000)).toBe(-10);
  expect(volumeChange(1000, null)).toBeNull();
  expect(volumeChange(1000, 0)).toBeNull();
});

it('setsPerMuscle compte les séries validées par muscle, du plus au moins travaillé', () => {
  expect(setsPerMuscle(workout, { 1: ['Chest', 'Triceps'], 4: ['Back', 'Biceps'], 5: ['Shoulders'] })).toEqual([
    { muscle: 'Chest', sets: 3 },
    { muscle: 'Triceps', sets: 3 },
    { muscle: 'Back', sets: 2 },
    { muscle: 'Biceps', sets: 2 },
  ]);
});
