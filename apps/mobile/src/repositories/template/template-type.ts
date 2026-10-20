export interface TemplateExercise {
  id: number;
  name: string;
  primary_focus?: string;
  secondary_focus?: string;
  equipment?: string;
  note?: string;
  template_exercise_note?: string;
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
