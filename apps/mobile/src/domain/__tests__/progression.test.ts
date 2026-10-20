import {
  estimateOneRepMax,
  exerciseRecords,
  lastWeeks,
  oneRepMaxChange,
  sessionStats,
  weeklyProgress,
  weeklyTotals,
} from '@/src/domain/progression';
import { toTimestamp } from '@/src/utils/date';

// Mardi 20 octobre 2026, 18 h (heure locale)
const NOW = new Date(2026, 9, 20, 18);
const at = (month: number, day: number) => toTimestamp(new Date(2026, month, day, 18));

describe('estimateOneRepMax', () => {
  it('applique la formule d’Epley, arrondie au demi-kilo', () => {
    expect(estimateOneRepMax(80, 5)).toBe(93.5);
    expect(estimateOneRepMax(100, 10)).toBe(133.5);
  });

  it('une série à 1 répétition vaut sa charge', () => {
    expect(estimateOneRepMax(120, 1)).toBe(120);
  });

  it('renvoie null sans charge ou sans répétitions', () => {
    expect(estimateOneRepMax(null, 10)).toBeNull();
    expect(estimateOneRepMax(0, 10)).toBeNull();
    expect(estimateOneRepMax(80, null)).toBeNull();
  });
});

it('sessionStats calcule meilleur 1RM, série la plus lourde, volume et reps max', () => {
  expect(
    sessionStats([
      { weight: 75, reps: 6 },
      { weight: 80, reps: 3 },
      { weight: 80, reps: 5 },
      { weight: null, reps: 12 },
    ]),
  ).toEqual({
    bestOneRepMax: 93.5,
    topSet: { weight: 80, reps: 5 },
    volume: 450 + 240 + 400,
    setCount: 4,
    maxReps: 12,
  });
});

it('sessionStats au poids du corps : pas de 1RM ni de volume', () => {
  expect(sessionStats([{ weight: null, reps: 10 }, { weight: null, reps: 8 }])).toEqual({
    bestOneRepMax: null,
    topSet: null,
    volume: 0,
    setCount: 2,
    maxReps: 10,
  });
});

it('lastWeeks renvoie les lundis des dernières semaines, la semaine courante en dernier', () => {
  expect(lastWeeks(NOW, 3).map((date) => [date.getMonth(), date.getDate(), date.getDay()])).toEqual([
    [9, 5, 1],
    [9, 12, 1],
    [9, 19, 1],
  ]);
});

describe('weeklyProgress', () => {
  const sessions = [
    { workout_id: 1, started_at: at(9, 6), sets: [{ weight: 70, reps: 8 }] },
    { workout_id: 2, started_at: at(9, 8), sets: [{ weight: 75, reps: 5 }, { weight: 75, reps: 5 }] },
    { workout_id: 3, started_at: at(9, 20), sets: [{ weight: 80, reps: 5 }] },
    // Hors période
    { workout_id: 4, started_at: at(8, 1), sets: [{ weight: 200, reps: 1 }] },
  ];

  it('agrège par semaine : meilleur 1RM, reps max, volume et séries', () => {
    expect(weeklyProgress(sessions, NOW, 3)).toEqual([
      // 70×8 → 88,5 l'emporte sur 75×5 → 87,5
      { weekStart: toTimestamp(new Date(2026, 9, 5)), oneRepMax: 88.5, maxReps: 8, volume: 560 + 750, setCount: 3 },
      { weekStart: toTimestamp(new Date(2026, 9, 12)), oneRepMax: null, maxReps: null, volume: 0, setCount: 0 },
      { weekStart: toTimestamp(new Date(2026, 9, 19)), oneRepMax: 93.5, maxReps: 5, volume: 400, setCount: 1 },
    ]);
  });
});

it('weeklyTotals additionne une valeur par semaine', () => {
  expect(
    weeklyTotals(
      [
        { timestamp: at(9, 13), value: 1000 },
        { timestamp: at(9, 15), value: 500 },
        { timestamp: at(9, 20), value: 800 },
      ],
      NOW,
      2,
    ).map((week) => week.total),
  ).toEqual([1500, 800]);
});

describe('exerciseRecords', () => {
  it('garde le meilleur de chaque record avec sa date, la première fois en cas d’égalité', () => {
    const records = exerciseRecords([
      { workout_id: 3, started_at: at(9, 20), sets: [{ weight: 80, reps: 5 }] },
      { workout_id: 1, started_at: at(9, 6), sets: [{ weight: 70, reps: 12 }, { weight: 70, reps: 10 }] },
      { workout_id: 2, started_at: at(9, 13), sets: [{ weight: 80, reps: 5 }, { weight: 60, reps: 8 }] },
    ]);
    expect(records).toEqual({
      bestOneRepMax: { value: 98, at: at(9, 6) },
      heaviestSet: { weight: 80, reps: 5, at: at(9, 13) },
      bestVolume: { value: 1540, at: at(9, 6) },
      maxReps: { reps: 12, at: at(9, 6) },
    });
  });

  it('renvoie des records vides sans séance', () => {
    expect(exerciseRecords([])).toEqual({ bestOneRepMax: null, heaviestSet: null, bestVolume: null, maxReps: null });
  });
});

it('oneRepMaxChange compare la première et la dernière séance chargée de la période', () => {
  const sessions = [
    { workout_id: 1, started_at: at(8, 1), sets: [{ weight: 60, reps: 5 }] },
    { workout_id: 2, started_at: at(9, 6), sets: [{ weight: 70, reps: 5 }] },
    { workout_id: 3, started_at: at(9, 13), sets: [{ weight: null, reps: 10 }] },
    { workout_id: 4, started_at: at(9, 20), sets: [{ weight: 80, reps: 5 }] },
  ];
  // 70×5 → 81,5 ; 80×5 → 93,5
  expect(oneRepMaxChange(sessions, at(9, 1))).toBe(12);
  expect(oneRepMaxChange(sessions, at(9, 15))).toBeNull();
});
