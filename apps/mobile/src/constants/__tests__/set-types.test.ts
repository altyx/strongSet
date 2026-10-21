import { setLabels } from '@/src/constants/set-types';

it('setLabels numérote les séries de travail et marque l’échauffement', () => {
  expect(setLabels(['warmup', 'warmup', 'normal', 'normal', 'drop', 'failure'])).toEqual(['É', 'É', '1', '2', '3', '4']);
  expect(setLabels([])).toEqual([]);
});
