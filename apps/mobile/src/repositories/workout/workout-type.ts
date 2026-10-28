import { Tracking } from '@/src/constants/tracking';

// Échauffement : compte dans les séries faites mais pas dans le volume, les records ni la progression
export type SetType = 'normal' | 'warmup' | 'drop' | 'failure';

export interface WorkoutSet {
  id: number;
  position: number;
  type: SetType;
  // kg, null tant que la charge n'est pas saisie
  weight: number | null;
  reps: number | null;
  // Cardio : durée en secondes et distance en mètres, null sinon ou tant qu'elles ne sont pas saisies
  duration_seconds: number | null;
  distance_meters: number | null;
  // null tant que la série n'est pas validée
  completed_at: number | null;
}

export interface WorkoutExercise {
  id: number;
  // null si l'exercice a été supprimé de la bibliothèque depuis
  exercise_id: number | null;
  name: string;
  // Charge et répétitions par défaut ; garde cette valeur si l'exercice a été supprimé de la bibliothèque
  tracking: Tracking;
  position: number;
  // Repos entre les séries en secondes ; null = valeur par défaut des réglages
  rest_seconds: number | null;
  // Note personnelle de l'exercice dans la bibliothèque (réglage machine, prise…) ; null si aucune
  exercise_note: string | null;
  sets: WorkoutSet[];
}

export interface Workout {
  id: number;
  template_id: number | null;
  name: string | null;
  note: string | null;
  started_at: number;
  // null tant que la séance est en cours
  finished_at: number | null;
  exercises: WorkoutExercise[];
}

// Une ligne de l'historique
export interface WorkoutSummary {
  id: number;
  name: string | null;
  started_at: number;
  finished_at: number;
  exercise_count: number;
  completed_set_count: number;
  // Somme charge × répétitions des séries validées, en kg
  volume: number;
}

// Séries validées d'un exercice lors d'une séance terminée (progression)
export interface ExerciseSession {
  workout_id: number;
  started_at: number;
  sets: SetValues[];
}

// Valeurs saisies pour une série (création ou mise à jour) ; durée et distance absentes = null (exercice à charge)
export interface SetValues {
  weight: number | null;
  reps: number | null;
  duration_seconds?: number | null;
  distance_meters?: number | null;
}

// Série d'une séance passée (colonne « Précédent ») ; son type est repris par la série correspondante
export interface PreviousSet extends SetValues {
  type: SetType;
}

// Série à créer ; type absent = normal
export interface NewSet extends SetValues {
  type?: SetType;
}

export interface NewWorkoutExercise {
  exercise_id: number | null;
  name: string;
  // Repos entre les séries en secondes, repris du programme ; null ou absent = valeur par défaut des réglages
  rest_seconds?: number | null;
  // Séries créées d'emblée, ex. pré-remplies avec la dernière performance
  sets?: NewSet[];
}
