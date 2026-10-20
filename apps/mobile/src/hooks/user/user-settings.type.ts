export interface UserSettings {
  isOnboarded: boolean;
  name: string;
  lang?: string;
  notifications: boolean;
  seriesPerExercise: number;
  repPerSeries: number;
  restBetweenSeries: number;
  acceptedTerms?: boolean;
  termsAcceptedAt?: number;
  termsVersion?: number;
}
