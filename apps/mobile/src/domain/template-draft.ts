import { Template, TemplateInput } from '@/src/repositories/template/template-type';

// Exercice d'un programme en cours d'édition
export type DraftExercise = {
  // Identifiant stable pour les listes React : un même exercice peut figurer deux fois dans un programme
  key: string;
  exercise_id: number;
  name: string;
  target_sets: number;
  target_reps: number;
  rest_seconds: number;
};

export type DraftDefaults = { sets: number; reps: number; restSeconds: number };

let keyCounter = 0;
const nextKey = () => `draft-${++keyCounter}`;

export function newDraftExercise(exercise: { id: number; name: string }, defaults: DraftDefaults): DraftExercise {
  return {
    key: nextKey(),
    exercise_id: exercise.id,
    name: exercise.name,
    target_sets: defaults.sets,
    target_reps: defaults.reps,
    rest_seconds: defaults.restSeconds,
  };
}

// Brouillon d'un programme existant : les objectifs non renseignés prennent les valeurs par défaut
export function draftFromTemplate(template: Template, defaults: DraftDefaults): DraftExercise[] {
  return template.exercises.map((exercise) => ({
    key: nextKey(),
    exercise_id: exercise.id,
    name: exercise.name,
    target_sets: exercise.target_sets ?? defaults.sets,
    target_reps: exercise.target_reps ?? defaults.reps,
    rest_seconds: exercise.rest_seconds ?? defaults.restSeconds,
  }));
}

// @returns le message à afficher, ou null si le programme peut être enregistré
export function validateDraft(name: string, exercises: DraftExercise[]): string | null {
  if (name.trim() === '') {
    return 'Donnez un nom au programme.';
  }
  if (exercises.length === 0) {
    return 'Ajoutez au moins un exercice.';
  }
  return null;
}

export function toTemplateInput(name: string, exercises: DraftExercise[]): TemplateInput {
  return {
    name: name.trim(),
    exercises: exercises.map(({ exercise_id, target_sets, target_reps, rest_seconds }) => ({
      exercise_id,
      target_sets,
      target_reps,
      rest_seconds,
    })),
  };
}

// Déplace l'élément d'index `index` de `delta` places (-1 : vers le haut) ; inchangé s'il sort de la liste
export function moveItem<T>(list: T[], index: number, delta: number): T[] {
  const target = index + delta;
  if (index < 0 || index >= list.length || target < 0 || target >= list.length) {
    return list;
  }
  const copy = [...list];
  const [item] = copy.splice(index, 1);
  copy.splice(target, 0, item);
  return copy;
}
