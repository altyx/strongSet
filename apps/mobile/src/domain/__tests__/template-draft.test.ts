import { draftFromTemplate, moveItem, newDraftExercise, toTemplateInput, validateDraft } from '@/src/domain/template-draft';

const defaults = { sets: 4, reps: 10, restSeconds: 90 };

it('newDraftExercise applique les valeurs par défaut', () => {
  expect(newDraftExercise({ id: 1, name: 'Bench Press' }, defaults)).toMatchObject({
    exercise_id: 1,
    name: 'Bench Press',
    target_sets: 4,
    target_reps: 10,
    rest_seconds: 90,
  });
});

it('draftFromTemplate garde les objectifs du programme et complète les manquants', () => {
  const draft = draftFromTemplate(
    {
      id: 1,
      name: 'Push',
      created_at: 0,
      exercises: [
        { id: 1, name: 'Bench Press', target_sets: 5, target_reps: 5, rest_seconds: 180 },
        { id: 1, name: 'Bench Press', target_sets: null, target_reps: null, rest_seconds: null },
      ],
    },
    defaults,
  );
  expect(draft.map(({ target_sets, target_reps, rest_seconds }) => [target_sets, target_reps, rest_seconds])).toEqual([
    [5, 5, 180],
    [4, 10, 90],
  ]);
  // Même exercice deux fois : des clés distinctes pour la liste
  expect(draft[0].key).not.toBe(draft[1].key);
});

it('validateDraft exige un nom et au moins un exercice', () => {
  const exercise = newDraftExercise({ id: 1, name: 'Bench Press' }, defaults);
  expect(validateDraft('  ', [exercise])).toBe('Donnez un nom au programme.');
  expect(validateDraft('Push', [])).toBe('Ajoutez au moins un exercice.');
  expect(validateDraft('Push', [exercise])).toBeNull();
});

it('toTemplateInput nettoie le nom et garde l’ordre des exercices', () => {
  const exercises = [newDraftExercise({ id: 2, name: 'Squat' }, defaults), newDraftExercise({ id: 1, name: 'Bench' }, defaults)];
  expect(toTemplateInput('  Legs ', exercises)).toEqual({
    name: 'Legs',
    exercises: [
      { exercise_id: 2, target_sets: 4, target_reps: 10, rest_seconds: 90 },
      { exercise_id: 1, target_sets: 4, target_reps: 10, rest_seconds: 90 },
    ],
  });
});

it('moveItem déplace un élément et ignore les déplacements hors de la liste', () => {
  expect(moveItem(['a', 'b', 'c'], 2, -1)).toEqual(['a', 'c', 'b']);
  expect(moveItem(['a', 'b', 'c'], 0, 1)).toEqual(['b', 'a', 'c']);
  expect(moveItem(['a', 'b', 'c'], 0, -1)).toEqual(['a', 'b', 'c']);
  expect(moveItem(['a', 'b', 'c'], 2, 1)).toEqual(['a', 'b', 'c']);
});
