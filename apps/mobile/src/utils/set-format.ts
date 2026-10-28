import { SetValues } from '@/src/repositories/workout/workout-type';
import { DistanceUnit, formatDistance } from '@/src/utils/distance';
import { formatDuration } from '@/src/utils/duration';
import { formatWeight, formatWeightValue, WeightUnit } from '@/src/utils/weight';

/**
 * Une série en texte : « 80 × 5 » (ou « 80 kg × 5 » avec `withUnit`), « 12 reps » au poids du corps,
 * « 30:00 · 8,5 km » en cardio (série avec une durée).
 */
export function formatSetValues(set: SetValues, unit: WeightUnit, distanceUnit: DistanceUnit, withUnit = false): string {
  if (set.duration_seconds != null) {
    return [
      formatDuration(set.duration_seconds),
      set.distance_meters ? formatDistance(set.distance_meters, distanceUnit) : null,
    ]
      .filter(Boolean)
      .join(' · ');
  }
  if (set.weight === null) {
    return `${set.reps} reps`;
  }
  return `${withUnit ? formatWeight(set.weight, unit) : formatWeightValue(set.weight, unit)} × ${set.reps}`;
}
