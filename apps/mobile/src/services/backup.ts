import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';

import { BackupRepository } from '@/src/repositories/backup/backup-repository';
import { Backup } from '@/src/repositories/export/export-repository';

/**
 * Ouvre le sélecteur de fichiers et vérifie la sauvegarde choisie, sans rien modifier.
 * null si l'utilisateur annule ; InvalidBackupError si le fichier n'est pas restaurable.
 */
export async function pickBackup(): Promise<Backup | null> {
  const result = await DocumentPicker.getDocumentAsync({
    // Certains services de stockage livrent les .json en texte brut
    type: ['application/json', 'text/plain'],
    copyToCacheDirectory: true,
  });
  if (result.canceled) return null;
  const content = await new File(result.assets[0].uri).text();
  return BackupRepository.parse(content);
}
