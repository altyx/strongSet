import { DATABASE_SCHEMA } from './schema';
import { DEFAULT_VALUES_DATABASE } from './default-values';

/**
 * Migrations SQL appliquées dans l'ordre. La migration d'index i fait passer `PRAGMA user_version` à i + 1.
 * Ne jamais modifier une migration déjà livrée : en ajouter une nouvelle à la fin du tableau.
 */
export const MIGRATIONS: string[] = [
  // v1 : schéma initial + données par défaut
  DATABASE_SCHEMA + DEFAULT_VALUES_DATABASE,
];
