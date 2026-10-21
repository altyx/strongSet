import { getDatabase } from '@/src/db/database';
import { Backup, BACKUP_TABLES } from '@/src/repositories/export/export-repository';

type BackupTable = (typeof BACKUP_TABLES)[number];
type BackupValue = string | number | null;
type BackupRow = Record<string, BackupValue>;

// Sauvegarde refusée : le message s'affiche tel quel à l'utilisateur
export class InvalidBackupError extends Error {
  name = 'InvalidBackupError';
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isValue = (value: unknown): value is BackupValue =>
  value === null || typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value));

function schemaVersion(): number {
  return getDatabase().getFirstSync<{ user_version: number }>('PRAGMA user_version')?.user_version ?? 0;
}

interface ColumnInfo {
  name: string;
  notnull: number;
  dflt_value: string | null;
  pk: number;
}

// Colonnes réelles de la base : une sauvegarde plus ancienne peut ne pas avoir une colonne ajoutée depuis
function columnsOf(table: BackupTable) {
  const columns = getDatabase().getAllSync<ColumnInfo>(`PRAGMA table_info(${table})`);
  return {
    known: new Set(columns.map((column) => column.name)),
    // Obligatoires sans valeur par défaut : elles doivent figurer dans chaque ligne
    required: columns.filter((column) => column.notnull && column.dflt_value === null && !column.pk).map((column) => column.name),
  };
}

export const BackupRepository = {
  /**
   * Vérifie le contenu d'un fichier de sauvegarde sans rien modifier : format, version du schéma de la base,
   * présence de toutes les tables, colonnes connues de la base et colonnes obligatoires présentes (une colonne
   * absente qui a une valeur par défaut est acceptée, et la prend à la restauration). Lève une InvalidBackupError au message lisible sinon.
   */
  parse: (content: string): Backup => {
    let data: unknown;
    try {
      data = JSON.parse(content);
    } catch {
      throw new InvalidBackupError("Ce fichier n'est pas une sauvegarde : son contenu n'est pas du JSON valide.");
    }
    if (!isObject(data) || !('format_version' in data) || !isObject(data.tables)) {
      throw new InvalidBackupError("Ce fichier n'est pas une sauvegarde de l'app.");
    }
    if (data.format_version !== 1) {
      throw new InvalidBackupError(
        "Ce format de sauvegarde n'est pas pris en charge. Mettez l'app à jour avant de restaurer ce fichier.",
      );
    }
    const expectedVersion = schemaVersion();
    if (data.schema_version !== expectedVersion) {
      throw new InvalidBackupError(
        `Cette sauvegarde vient d'une autre version de l'app (schéma ${String(data.schema_version)}, ` +
          `attendu ${expectedVersion}) : elle ne peut pas être restaurée.`,
      );
    }
    if (typeof data.exported_at !== 'string') {
      throw new InvalidBackupError('Sauvegarde incomplète : sa date de création est absente.');
    }

    const tables = data.tables;
    const unknownTable = Object.keys(tables).find((table) => !(BACKUP_TABLES as readonly string[]).includes(table));
    if (unknownTable) {
      throw new InvalidBackupError(`Sauvegarde invalide : la table « ${unknownTable} » est inconnue.`);
    }
    for (const table of BACKUP_TABLES) {
      const rows = tables[table];
      if (!Array.isArray(rows)) {
        throw new InvalidBackupError(`Sauvegarde incomplète : la table « ${table} » est absente.`);
      }
      const { known, required } = columnsOf(table);
      rows.forEach((row, index) => {
        if (!isObject(row)) {
          throw new InvalidBackupError(`Sauvegarde invalide : la ligne ${index + 1} de « ${table} » est illisible.`);
        }
        const missing = required.find((column) => !(column in row));
        if (missing) {
          throw new InvalidBackupError(
            `Sauvegarde incomplète : la colonne « ${missing} » manque (ligne ${index + 1} de « ${table} »).`,
          );
        }
        for (const [column, value] of Object.entries(row)) {
          if (!known.has(column)) {
            throw new InvalidBackupError(`Sauvegarde invalide : la colonne « ${column} » de « ${table} » est inconnue.`);
          }
          if (!isValue(value)) {
            throw new InvalidBackupError(
              `Sauvegarde invalide : la valeur de « ${column} » (ligne ${index + 1} de « ${table} ») est illisible.`,
            );
          }
        }
      });
    }
    return data as unknown as Backup;
  },

  /**
   * Remplace toutes les données par celles de la sauvegarde (déjà vérifiée par parse), en gardant les ids.
   * Une seule transaction : si une ligne est refusée par la base (clé étrangère, champ obligatoire…), rien ne change.
   */
  restore: (backup: Backup) => {
    const db = getDatabase();
    try {
      db.withTransactionSync(() => {
        [...BACKUP_TABLES].reverse().forEach((table) => db.runSync(`DELETE FROM ${table}`));
        for (const table of BACKUP_TABLES) {
          for (const row of backup.tables[table] as BackupRow[]) {
            const columns = Object.keys(row);
            db.runSync(
              `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
              columns.map((column) => row[column]),
            );
          }
        }
      });
    } catch (error) {
      throw new InvalidBackupError(
        `Sauvegarde incohérente, rien n'a été modifié. (${error instanceof Error ? error.message : String(error)})`,
      );
    }
  },
};
