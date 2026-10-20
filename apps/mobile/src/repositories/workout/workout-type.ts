export interface WorkoutSet {
  id: number;
  position: number;
  // kg, null tant que la charge n'est pas saisie
  weight: number | null;
  reps: number | null;
  // null tant que la série n'est pas validée
  completed_at: number | null;
}

export interface WorkoutExercise {
  id: number;
  // null si l'exercice a été supprimé de la bibliothèque depuis
  exercise_id: number | null;
  name: string;
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

// Valeurs saisies pour une série (création ou mise à jour)
export interface SetValues {
  weight: number | null;
  reps: number | null;
}

export interface NewWorkoutExercise {
  exercise_id: number | null;
  name: string;
  // Repos entre les séries en secondes, repris du programme ; null ou absent = valeur par défaut des réglages
  rest_seconds?: number | null;
  // Séries créées d'emblée, ex. pré-remplies avec la dernière performance
  sets?: SetValues[];
}
