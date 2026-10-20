import * as SQLite from 'expo-sqlite';
import { MIGRATIONS } from './migrations';

const DATABASE_NAME = 'my-fitness.db';

let db: SQLite.SQLiteDatabase | null = null;
let initializationPromise: Promise<void> | null = null;

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    db = SQLite.openDatabaseSync(DATABASE_NAME);
    // Les clés étrangères (et donc les ON DELETE CASCADE) sont désactivées par défaut dans SQLite,
    // il faut les activer à chaque ouverture de connexion.
    db.execSync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  }
  return db;
}

/**
 * Crée la base si besoin et applique les migrations manquantes. Sans effet si la base est déjà à jour.
 */
export function initializeDatabase(): Promise<void> {
  initializationPromise ??= runMigrations().catch((error) => {
    initializationPromise = null;
    throw error;
  });
  return initializationPromise;
}

async function runMigrations(): Promise<void> {
  const database = getDatabase();
  const row = await database.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const currentVersion = row?.user_version ?? 0;

  for (let version = currentVersion; version < MIGRATIONS.length; version++) {
    await database.withTransactionAsync(async () => {
      await database.execAsync(MIGRATIONS[version]);
      await database.execAsync(`PRAGMA user_version = ${version + 1}`);
    });
    console.log(`Database migrated to version ${version + 1}`);
  }
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
    initializationPromise = null;
  }
}
