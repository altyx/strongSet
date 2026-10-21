import { buildSetsCsv, exportFileName, ExportedSet } from '@/src/domain/export';

// 20 oct. 2026, 18 h 05 en heure locale
const startedAt = new Date(2026, 9, 20, 18, 5).getTime() / 1000;

const set = (overrides: Partial<ExportedSet>): ExportedSet => ({
  started_at: startedAt,
  workout_name: 'Push',
  workout_note: null,
  exercise_name: 'Développé couché',
  set_number: 1,
  type: 'normal',
  weight: 62.5,
  reps: 8,
  ...overrides,
});

describe('buildSetsCsv', () => {
  it('écrit une ligne par série, séparateur « ; » et virgule décimale, précédé du BOM', () => {
    const csv = buildSetsCsv([set({}), set({ set_number: 2, type: 'warmup', weight: null, reps: 12 })]);

    expect(csv.split('\r\n')).toEqual([
      '﻿Date;Heure;Séance;Exercice;Série;Type;Charge (kg);Répétitions;Note de séance',
      '2026-10-20;18:05;Push;Développé couché;1;Normale;62,5;8;',
      '2026-10-20;18:05;Push;Développé couché;2;Échauffement;;12;',
      '',
    ]);
  });

  it('entoure de guillemets les cellules avec séparateur, guillemet ou retour à la ligne', () => {
    const csv = buildSetsCsv([set({ workout_name: null, workout_note: 'Dos; "un peu" serré\nà surveiller' })]);

    expect(csv.split('\r\n')[1]).toBe('2026-10-20;18:05;;Développé couché;1;Normale;62,5;8;"Dos; ""un peu"" serré\nà surveiller"');
  });

  it('ne contient que l’en-tête sans séance', () => {
    expect(buildSetsCsv([])).toBe('﻿Date;Heure;Séance;Exercice;Série;Type;Charge (kg);Répétitions;Note de séance\r\n');
  });
});

it('exportFileName date le fichier', () => {
  expect(exportFileName(new Date(2026, 0, 5), 'json')).toBe('my-fitness-2026-01-05.json');
});
