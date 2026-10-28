import { SetType } from '@/src/repositories/workout/workout-type';
import { formatDuration } from '@/src/utils/duration';

// Une série validée d'une séance terminée, à plat (export CSV)
export interface ExportedSet {
  started_at: number;
  workout_name: string | null;
  workout_note: string | null;
  exercise_name: string | null;
  set_number: number;
  type: SetType;
  // kg ; null pour une série au poids du corps sans charge saisie
  weight: number | null;
  reps: number | null;
  // Cardio : secondes et mètres, null sinon
  duration_seconds: number | null;
  distance_meters: number | null;
}

// Séparateur « ; » et virgule décimale : le fichier s'ouvre directement en colonnes dans un tableur réglé en français
const SEPARATOR = ';';
const HEADER = ['Date', 'Heure', 'Séance', 'Exercice', 'Série', 'Type', 'Charge (kg)', 'Répétitions', 'Durée', 'Distance (km)', 'Note de séance'];

const TYPE_LABELS: Record<SetType, string> = {
  normal: 'Normale',
  warmup: 'Échauffement',
  drop: 'Dégressive',
  failure: 'Échec',
};

function escapeCell(value: string) {
  return /[;"\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

const decimal = (value: number) => String(value).replace('.', ',');

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * Séries au format CSV, une ligne par série, dans l'ordre donné. Dates en heure locale (AAAA-MM-JJ, HH:MM).
 * Commence par un BOM UTF-8, sans quoi Excel affiche mal les accents.
 */
export function buildSetsCsv(sets: ExportedSet[]): string {
  const lines = sets.map((set) => {
    const date = new Date(set.started_at * 1000);
    return [
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
      `${pad(date.getHours())}:${pad(date.getMinutes())}`,
      set.workout_name ?? '',
      set.exercise_name ?? '',
      String(set.set_number),
      TYPE_LABELS[set.type],
      set.weight === null ? '' : decimal(set.weight),
      set.reps === null ? '' : String(set.reps),
      set.duration_seconds == null ? '' : formatDuration(set.duration_seconds),
      set.distance_meters == null ? '' : decimal(set.distance_meters / 1000),
      set.workout_note ?? '',
    ]
      .map(escapeCell)
      .join(SEPARATOR);
  });
  return `﻿${[HEADER.join(SEPARATOR), ...lines].join('\r\n')}\r\n`;
}

// « my-fitness-2026-10-20.csv »
export function exportFileName(date: Date, extension: 'csv' | 'json') {
  return `my-fitness-${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}.${extension}`;
}
