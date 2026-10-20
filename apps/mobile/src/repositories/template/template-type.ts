export interface TemplateExercise {
  // id de l'exercice dans la bibliothèque (table exercises)
  id: number;
  name: string;
  primary_focus?: string;
  secondary_focus?: string;
  equipment?: string;
  note?: string;
  template_exercise_note?: string;
  // Objectifs dans ce programme ; null = valeurs par défaut des réglages
  target_sets?: number | null;
  target_reps?: number | null;
  rest_seconds?: number | null;
}

export interface Template {
  id: number;
  name: string;
  created_at: number;
  updated_at?: number;
  sync_status?: 'local' | 'synced' | 'deleted';
  version?: number;
  note?: string;
  exercises: TemplateExercise[];
}

// Exercice d'un programme à enregistrer (création ou modification), dans l'ordre voulu
export interface TemplateExerciseInput {
  exercise_id: number;
  target_sets: number | null;
  target_reps: number | null;
  rest_seconds: number | null;
}

export interface TemplateInput {
  name: string;
  exercises: TemplateExerciseInput[];
}
