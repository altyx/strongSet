import { ExerciseSession, SetValues } from '@/src/repositories/workout/workout-type';
import { startOfWeek, toTimestamp } from '@/src/utils/date';

/**
 * 1RM estimé (formule d'Epley), arrondi au demi-kilo. Une série à 1 répétition vaut sa charge.
 * @returns null sans charge ni répétitions (ex. poids du corps)
 */
export function estimateOneRepMax(weight: number | null, reps: number | null): number | null {
  if (!weight || !reps || weight <= 0 || reps <= 0) {
    return null;
  }
  const estimate = reps === 1 ? weight : weight * (1 + reps / 30);
  return Math.round(estimate * 2) / 2;
}

export type SessionStats = {
  // Meilleur 1RM estimé de la séance, null sans série chargée
  bestOneRepMax: number | null;
  // Série la plus lourde (à charge égale, celle avec le plus de répétitions), null sans série chargée
  topSet: { weight: number; reps: number } | null;
  // Somme charge × répétitions, en kg
  volume: number;
  setCount: number;
  // Plus grand nombre de répétitions sur une série (utile au poids du corps)
  maxReps: number;
};

export function sessionStats(sets: SetValues[]): SessionStats {
  let bestOneRepMax: number | null = null;
  let topSet: SessionStats['topSet'] = null;
  let volume = 0;
  let maxReps = 0;

  sets.forEach(({ weight, reps }) => {
    const repCount = reps ?? 0;
    maxReps = Math.max(maxReps, repCount);
    if (weight === null || weight <= 0) {
      return;
    }
    volume += weight * repCount;
    const oneRepMax = estimateOneRepMax(weight, repCount);
    if (oneRepMax !== null && (bestOneRepMax === null || oneRepMax > bestOneRepMax)) {
      bestOneRepMax = oneRepMax;
    }
    if (!topSet || weight > topSet.weight || (weight === topSet.weight && repCount > topSet.reps)) {
      topSet = { weight, reps: repCount };
    }
  });

  return { bestOneRepMax, topSet, volume, setCount: sets.length, maxReps };
}

export type WeekPoint = {
  // Lundi 00:00 de la semaine, timestamp en secondes
  weekStart: number;
  // Meilleur 1RM estimé de la semaine, null si aucune série chargée
  oneRepMax: number | null;
  // Plus grand nombre de répétitions sur une série de la semaine, null sans séance
  maxReps: number | null;
  volume: number;
  setCount: number;
};

// Les `count` dernières semaines (lundi), de la plus ancienne à la semaine de `now`
export function lastWeeks(now: Date, count: number): Date[] {
  const current = startOfWeek(now);
  return Array.from(
    { length: count },
    (_, index) => new Date(current.getFullYear(), current.getMonth(), current.getDate() - 7 * (count - 1 - index)),
  );
}

/**
 * Libellé court d'une semaine pour un graphique, sur deux lignes : « Cette\nsem. » pour la semaine en cours,
 * sinon « sem.\n12/10 » (date du lundi), pour qu'on ne le lise pas comme la date d'une séance.
 */
export function weekLabel(weekStart: number, now: Date): string {
  return isCurrentWeek(weekStart, now) ? 'Cette\nsem.' : `sem.\n${mondayDate(weekStart)}`;
}

// Version lue par les lecteurs d'écran, ex. « semaine du 12/10 » ou « cette semaine »
export function weekSpokenLabel(weekStart: number, now: Date): string {
  return isCurrentWeek(weekStart, now) ? 'cette semaine' : `semaine du ${mondayDate(weekStart)}`;
}

const isCurrentWeek = (weekStart: number, now: Date) => weekStart === toTimestamp(startOfWeek(now));

// « 12/10 »
const mondayDate = (weekStart: number) => {
  const monday = new Date(weekStart * 1000);
  return `${monday.getDate()}/${monday.getMonth() + 1}`;
};

// Évolution semaine par semaine d'un exercice, sur les `count` dernières semaines
export function weeklyProgress(sessions: ExerciseSession[], now: Date, count = 8): WeekPoint[] {
  const weeks = lastWeeks(now, count).map(toTimestamp);
  return weeks.map((weekStart, index) => {
    const weekEnd = weeks[index + 1] ?? Number.POSITIVE_INFINITY;
    const stats = sessions
      .filter((session) => session.started_at >= weekStart && session.started_at < weekEnd)
      .map((session) => sessionStats(session.sets));
    const oneRepMaxes = stats.flatMap((stat) => (stat.bestOneRepMax === null ? [] : [stat.bestOneRepMax]));
    return {
      weekStart,
      oneRepMax: oneRepMaxes.length > 0 ? Math.max(...oneRepMaxes) : null,
      maxReps: stats.length > 0 ? Math.max(...stats.map((stat) => stat.maxReps)) : null,
      volume: stats.reduce((total, stat) => total + stat.volume, 0),
      setCount: stats.reduce((total, stat) => total + stat.setCount, 0),
    };
  });
}

// Somme d'une valeur par semaine (ex. volume de toutes les séances), sur les `count` dernières semaines
export function weeklyTotals(items: { timestamp: number; value: number }[], now: Date, count = 8) {
  const weeks = lastWeeks(now, count).map(toTimestamp);
  return weeks.map((weekStart, index) => {
    const weekEnd = weeks[index + 1] ?? Number.POSITIVE_INFINITY;
    return {
      weekStart,
      total: items
        .filter((item) => item.timestamp >= weekStart && item.timestamp < weekEnd)
        .reduce((sum, item) => sum + item.value, 0),
    };
  });
}

type Dated<T> = T & { at: number };

export type ExerciseRecords = {
  bestOneRepMax: Dated<{ value: number }> | null;
  heaviestSet: Dated<{ weight: number; reps: number }> | null;
  bestVolume: Dated<{ value: number }> | null;
  maxReps: Dated<{ reps: number }> | null;
};

/**
 * Records personnels d'un exercice sur toutes ses séances. En cas d'égalité, c'est la première fois qui compte.
 */
export function exerciseRecords(sessions: ExerciseSession[]): ExerciseRecords {
  const chronological = [...sessions].sort((a, b) => a.started_at - b.started_at);
  const records: ExerciseRecords = { bestOneRepMax: null, heaviestSet: null, bestVolume: null, maxReps: null };

  chronological.forEach((session) => {
    const stats = sessionStats(session.sets);
    const at = session.started_at;
    if (stats.bestOneRepMax !== null && (!records.bestOneRepMax || stats.bestOneRepMax > records.bestOneRepMax.value)) {
      records.bestOneRepMax = { value: stats.bestOneRepMax, at };
    }
    const top = stats.topSet;
    if (
      top &&
      (!records.heaviestSet ||
        top.weight > records.heaviestSet.weight ||
        (top.weight === records.heaviestSet.weight && top.reps > records.heaviestSet.reps))
    ) {
      records.heaviestSet = { ...top, at };
    }
    if (stats.volume > 0 && (!records.bestVolume || stats.volume > records.bestVolume.value)) {
      records.bestVolume = { value: stats.volume, at };
    }
    if (stats.maxReps > 0 && (!records.maxReps || stats.maxReps > records.maxReps.reps)) {
      records.maxReps = { reps: stats.maxReps, at };
    }
  });

  return records;
}

/**
 * Évolution du 1RM estimé entre la plus ancienne et la plus récente séance chargée depuis `since`.
 * @returns null s'il y a moins de deux séances chargées sur la période
 */
export function oneRepMaxChange(sessions: ExerciseSession[], since: number): number | null {
  const points = sessions
    .filter((session) => session.started_at >= since)
    .sort((a, b) => a.started_at - b.started_at)
    .flatMap((session) => {
      const value = sessionStats(session.sets).bestOneRepMax;
      return value === null ? [] : [value];
    });
  if (points.length < 2) {
    return null;
  }
  return Math.round((points[points.length - 1] - points[0]) * 2) / 2;
}
