// Ce que l'on saisit pour une série d'un exercice : charge et répétitions, ou durée et distance (cardio)
export type Tracking = 'weight_reps' | 'duration_distance';

export const TRACKING_OPTIONS: { value: Tracking; label: string }[] = [
  { value: 'weight_reps', label: 'Charge et répétitions' },
  { value: 'duration_distance', label: 'Durée et distance' },
];
