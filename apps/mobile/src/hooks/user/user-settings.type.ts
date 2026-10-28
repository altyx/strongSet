import { DistanceUnit } from '@/src/utils/distance';
import { WeightUnit } from '@/src/utils/weight';

export interface UserSettings {
  isOnboarded: boolean;
  name: string;
  lang?: string;
  notifications: boolean;
  seriesPerExercise: number;
  repPerSeries: number;
  restBetweenSeries: number;
  // Unité d'affichage et de saisie des charges ; absent = kg
  weightUnit?: WeightUnit;
  // Unité d'affichage et de saisie des distances (cardio) ; absent = km
  distanceUnit?: DistanceUnit;
  acceptedTerms?: boolean;
  termsAcceptedAt?: number;
  termsVersion?: number;
}
