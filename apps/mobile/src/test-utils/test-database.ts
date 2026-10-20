import { DatabaseSync, type SQLInputValue } from 'node:sqlite';

import { MIGRATIONS } from '@/src/db/migrations';

/**
 * Base SQLite en mémoire (node:sqlite) avec le vrai schéma et les données par défaut, exposant le sous-ensemble
 * de l'API synchrone d'expo-sqlite utilisé par les repositories. À brancher via jest.mock('@/src/db/database').
 */
export function createTestDatabase() {
  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA foreign_keys = ON;');
  MIGRATIONS.forEach((migration) => db.exec(migration));

  return {
    execSync: (sql: string) => db.exec(sql),
    runSync: (sql: string, params: SQLInputValue[] = []) => {
      const result = db.prepare(sql).run(...params);
      return { lastInsertRowId: Number(result.lastInsertRowid), changes: Number(result.changes) };
    },
    getAllSync: <T>(sql: string, params: SQLInputValue[] = []) => db.prepare(sql).all(...params) as T[],
    getFirstSync: <T>(sql: string, params: SQLInputValue[] = []) => (db.prepare(sql).get(...params) ?? null) as T | null,
    withTransactionSync: (task: () => void) => {
      db.exec('BEGIN');
      try {
        task();
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
    },
    close: () => db.close(),
  };
}

export type TestDatabase = ReturnType<typeof createTestDatabase>;
