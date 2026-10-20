import { filterExercises, validateNewExercise } from '@/src/domain/exercise-library';
import { initials, normalizeSearch } from '@/src/utils/text';

const exercises = [
  { id: 1, name: 'Bench Press', equipment: 'Barre', muscles: ['Chest', 'Triceps'] },
  { id: 2, name: 'Développé incliné haltères', equipment: 'Haltères', muscles: ['Chest'] },
  { id: 3, name: 'Squat', equipment: 'Barre', muscles: ['Quadriceps', 'Glutes'] },
];

describe('filterExercises', () => {
  it('cherche sans tenir compte des accents ni de la casse', () => {
    expect(filterExercises(exercises, 'DEVELOPPE', null).map((exercise) => exercise.id)).toEqual([2]);
    expect(filterExercises(exercises, '  press ', null).map((exercise) => exercise.id)).toEqual([1]);
  });

  it('filtre par muscle, combiné avec la recherche', () => {
    expect(filterExercises(exercises, '', 'Chest').map((exercise) => exercise.id)).toEqual([1, 2]);
    expect(filterExercises(exercises, 'bench', 'Chest').map((exercise) => exercise.id)).toEqual([1]);
    expect(filterExercises(exercises, '', 'Glutes').map((exercise) => exercise.id)).toEqual([3]);
  });

  it('sans recherche ni muscle, renvoie tout', () => {
    expect(filterExercises(exercises, '', null)).toHaveLength(3);
  });
});

it('validateNewExercise exige un nom libre et au moins un muscle', () => {
  expect(validateNewExercise('  ', [1], false)).toBe("Donnez un nom à l'exercice.");
  expect(validateNewExercise('Bench Press', [1], true)).toBe('Un exercice porte déjà ce nom.');
  expect(validateNewExercise('Hip thrust', [], false)).toBe('Choisissez au moins un muscle travaillé.');
  expect(validateNewExercise('Hip thrust', [8], false)).toBeNull();
});

it('normalizeSearch retire accents, casse et espaces', () => {
  expect(normalizeSearch('  Élévations Latérales ')).toBe('elevations laterales');
});

it('initials prend la première lettre des deux premiers mots, ou les deux premières lettres', () => {
  expect(initials('Full Body')).toBe('FB');
  expect(initials('Chest')).toBe('CH');
  expect(initials('Développé incliné haltères')).toBe('DI');
  expect(initials('  ')).toBe('');
});
