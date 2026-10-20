import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { buildSetsCsv, exportFileName } from '@/src/domain/export';
import { ExportRepository } from '@/src/repositories/export/export-repository';

// Écrit le fichier dans le cache (remplacé à chaque export) et ouvre la feuille de partage du système
async function shareFile(name: string, content: string, mimeType: string, UTI: string, dialogTitle: string) {
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error("Le partage de fichiers n'est pas disponible sur cet appareil.");
  }
  const file = new File(Paths.cache, name);
  file.create({ overwrite: true });
  file.write(content);
  await Sharing.shareAsync(file.uri, { mimeType, UTI, dialogTitle });
}

// Historique des séries au format tableur
export async function shareSetsCsv() {
  const now = new Date();
  await shareFile(
    exportFileName(now, 'csv'),
    buildSetsCsv(ExportRepository.getCompletedSets()),
    'text/csv',
    'public.comma-separated-values-text',
    'Exporter mes séances',
  );
}

// Copie complète de la base (programmes, exercices, séances), pour la garder hors du téléphone
export async function shareBackupJson() {
  const now = new Date();
  await shareFile(
    exportFileName(now, 'json'),
    JSON.stringify(ExportRepository.getBackup(now)),
    'application/json',
    'public.json',
    'Sauvegarder mes données',
  );
}
