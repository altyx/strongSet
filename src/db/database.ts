import * as SQLite from 'expo-sqlite';
import { DATABASE_SCHEMA } from './schema';
import {DEFAULT_VALUES_DATABASE} from "@/src/db/default-values";

const DATABASE_NAME = 'my-fitness.db';

let db: SQLite.SQLiteDatabase | null = null;

export function getDatabase(): SQLite.SQLiteDatabase {
  db ??= SQLite.openDatabaseSync(DATABASE_NAME);
  return db;
}

export async function initializeDatabase(): Promise<void> {
  const database = getDatabase();

  await database.execAsync(DATABASE_SCHEMA);
  await database.execAsync(DEFAULT_VALUES_DATABASE);

  console.log('Database initialized successfully');
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}
