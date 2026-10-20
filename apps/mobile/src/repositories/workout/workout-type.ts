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

// Valeurs saisies pour une série (création ou mise à jour)
export interface SetValues {
  weight: number | null;
  reps: number | null;
}

export interface NewWorkoutExercise {
  exercise_id: number | null;
  name: string;
  // Séries créées d'emblée, ex. pré-remplies avec la dernière performance
  sets?: SetValues[];
}
