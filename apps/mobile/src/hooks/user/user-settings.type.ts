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
  acceptedTerms?: boolean;
  termsAcceptedAt?: number;
  termsVersion?: number;
}
