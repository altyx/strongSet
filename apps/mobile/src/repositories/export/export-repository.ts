import { getDatabase } from '@/src/db/database';
import { ExportedSet } from '@/src/domain/export';

// Tables sauvegardées, dans un ordre compatible avec les clés étrangères (la restauration les réinsère dans cet ordre)
export const BACKUP_TABLES = [
  'muscles',
  'exercises',
  'exercise_muscles',
  'templates',
  'template_exercises',
  'workouts',
  'workout_exercises',
  'sets',
] as const;

export interface Backup {
  format_version: 1;
  // PRAGMA user_version de la base exportée
  schema_version: number;
  exported_at: string;
  tables: Record<(typeof BACKUP_TABLES)[number], unknown[]>;
}

export const ExportRepository = {
  // Séries validées des séances terminées, de la plus ancienne séance à la plus récente
  getCompletedSets: (): ExportedSet[] => {
    return getDatabase().getAllSync<ExportedSet>(
      `SELECT w.started_at, w.name AS workout_name, w.note AS workout_note, we.exercise_name,
              ROW_NUMBER() OVER (PARTITION BY we.id ORDER BY s.position, s.id) AS set_number,
              s.type, s.weight, s.reps, s.duration_seconds, s.distance_meters
       FROM sets s
       JOIN workout_exercises we ON we.id = s.workout_exercise_id
       JOIN workouts w ON w.id = we.workout_id
       WHERE w.finished_at IS NOT NULL AND s.completed_at IS NOT NULL
       ORDER BY w.started_at, w.id, we.position, we.id, s.position, s.id`,
    );
  },

  // Copie brute de toutes les tables, séance en cours comprise
  getBackup: (exportedAt: Date): Backup => {
    const db = getDatabase();
    const tables = Object.fromEntries(
      BACKUP_TABLES.map((table) => [table, db.getAllSync(`SELECT * FROM ${table} ORDER BY rowid`)]),
    ) as Backup['tables'];
    return {
      format_version: 1,
      schema_version: db.getFirstSync<{ user_version: number }>('PRAGMA user_version')?.user_version ?? 0,
      exported_at: exportedAt.toISOString(),
      tables,
    };
  },
};
