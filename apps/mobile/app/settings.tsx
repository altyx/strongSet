import { router } from 'expo-router';
import { ArchiveRestore, Database, FileSpreadsheet } from 'lucide-react-native/icons';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RestPicker } from '@/src/components/templates/rest-picker';
import { ThemedText } from '@/src/components/themed-text';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { Stepper } from '@/src/components/ui/stepper';
import { palette, radius, spacing, typography } from '@/src/constants/theme';
import { useUserSettings } from '@/src/hooks/user/use-user-settings';
import { UserSettings } from '@/src/hooks/user/user-settings.type';
import { BackupRepository } from '@/src/repositories/backup/backup-repository';
import { Backup } from '@/src/repositories/export/export-repository';
import { pickBackup } from '@/src/services/backup';
import { shareBackupJson, shareSetsCsv } from '@/src/services/export';
import { cancelRestEnd } from '@/src/services/rest-notification';
import { WeightUnit } from '@/src/utils/weight';

// Valeurs de l'onboarding, si les préférences n'ont jamais été enregistrées
const DEFAULT_SETTINGS: UserSettings = {
  isOnboarded: true,
  name: '',
  notifications: false,
  seriesPerExercise: 4,
  repPerSeries: 12,
  restBetweenSeries: 90,
};

const UNITS: { value: WeightUnit; label: string }[] = [
  { value: 'kg', label: 'Kilos (kg)' },
  { value: 'lb', label: 'Livres (lb)' },
];

// Réglages enregistrés à chaque changement, sans bouton de validation
export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { getPreferences, savePreferences } = useUserSettings();
  const [settings, setSettings] = useState<UserSettings>(() => ({ ...DEFAULT_SETTINGS, ...getPreferences() }));
  const [name, setName] = useState(settings.name);
  const [exporting, setExporting] = useState(false);

  const update = (changes: Partial<UserSettings>) => {
    const next = { ...settings, ...changes };
    setSettings(next);
    savePreferences(next);
  };

  const share = async (exportFile: () => Promise<void>) => {
    setExporting(true);
    try {
      await exportFile();
    } catch (error) {
      Alert.alert("L'export a échoué", error instanceof Error ? error.message : String(error));
    } finally {
      setExporting(false);
    }
  };

  const restore = (backup: Backup) => {
    try {
      BackupRepository.restore(backup);
    } catch (error) {
      Alert.alert('La restauration a échoué', error instanceof Error ? error.message : String(error));
      return;
    }
    // Le minuteur de repos éventuel concernait la séance remplacée
    cancelRestEnd();
    // Les écrans rechargent leurs données au retour sur l'accueil
    router.dismissTo('/');
  };

  const confirmRestore = async () => {
    setExporting(true);
    let backup: Backup | null;
    try {
      backup = await pickBackup();
    } catch (error) {
      Alert.alert('Sauvegarde refusée', error instanceof Error ? error.message : String(error));
      return;
    } finally {
      setExporting(false);
    }
    if (!backup) return;

    const date = new Date(backup.exported_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const workouts = backup.tables.workouts.length;
    const templates = backup.tables.templates.length;
    Alert.alert(
      'Restaurer cette sauvegarde ?',
      `Sauvegarde du ${date} : ${workouts} séance${workouts > 1 ? 's' : ''}, ${templates} programme${templates > 1 ? 's' : ''}.\n\n` +
        'Vos données actuelles seront remplacées, séance en cours comprise. Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Remplacer mes données', style: 'destructive', onPress: () => restore(backup) },
      ],
    );
  };

  const unit = settings.weightUnit ?? 'kg';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets>
      <View style={styles.section}>
        <ThemedText type="label">Profil</ThemedText>
        <Card style={styles.card}>
          <ThemedText type="caption">Prénom</ThemedText>
          <TextInput
            value={name}
            onChangeText={setName}
            onEndEditing={() => update({ name: name.trim() })}
            placeholder="Votre prénom"
            placeholderTextColor={palette.textTertiary}
            autoCapitalize="words"
            returnKeyType="done"
            accessibilityLabel="Prénom"
            style={styles.input}
          />
        </Card>
      </View>

      <View style={styles.section}>
        <ThemedText type="label">Valeurs par défaut</ThemedText>
        <Card style={styles.card}>
          <ThemedText type="caption">
            Utilisées quand un programme ne précise pas ses objectifs, et pour les exercices ajoutés en séance.
          </ThemedText>
          <View style={styles.steppers}>
            <Stepper
              label="Séries par exercice"
              value={settings.seriesPerExercise}
              min={1}
              max={10}
              onChange={(seriesPerExercise) => update({ seriesPerExercise })}
            />
            <Stepper
              label="Répétitions"
              value={settings.repPerSeries}
              min={1}
              max={50}
              onChange={(repPerSeries) => update({ repPerSeries })}
            />
          </View>
          <RestPicker value={settings.restBetweenSeries} onChange={(restBetweenSeries) => update({ restBetweenSeries })} />
        </Card>
      </View>

      <View style={styles.section}>
        <ThemedText type="label">Unité de charge</ThemedText>
        <View style={styles.units} accessibilityRole="radiogroup" accessibilityLabel="Unité de charge">
          {UNITS.map((option) => {
            const selected = option.value === unit;
            return (
              <Pressable
                key={option.value}
                onPress={() => update({ weightUnit: option.value })}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                style={[styles.unit, selected && styles.unitSelected]}>
                <ThemedText type="defaultSemiBold" tone={selected ? 'onAccent' : 'secondary'}>
                  {option.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
        <ThemedText type="caption">Les charges restent enregistrées en kilos : changer d&apos;unité ne perd rien.</ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText type="label">Mes données</ThemedText>
        <Card style={styles.card}>
          <ThemedText type="caption">
            Vos données ne sont enregistrées que sur ce téléphone. Exportez-les régulièrement pour ne rien perdre.
          </ThemedText>
          <Button
            title="Exporter les séances (CSV)"
            variant="secondary"
            icon={FileSpreadsheet}
            disabled={exporting}
            onPress={() => share(shareSetsCsv)}
          />
          <Button
            title="Sauvegarde complète (JSON)"
            variant="secondary"
            icon={Database}
            disabled={exporting}
            onPress={() => share(shareBackupJson)}
          />
          <Button
            title="Restaurer une sauvegarde"
            variant="ghost"
            icon={ArchiveRestore}
            disabled={exporting}
            onPress={confirmRestore}
          />
          <ThemedText type="caption" tone="tertiary">
            Le CSV s&apos;ouvre dans un tableur (une ligne par série). La sauvegarde JSON contient aussi les programmes et
            les exercices créés,
            et peut être restaurée ici sur un nouveau téléphone.
          </ThemedText>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    gap: spacing.xxl,
    padding: spacing.xl,
  },
  section: {
    gap: spacing.sm,
  },
  card: {
    gap: spacing.md,
  },
  input: {
    ...typography.body,
    height: 48,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.background,
    color: palette.text,
  },
  steppers: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  units: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  unit: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: palette.surface,
  },
  unitSelected: {
    backgroundColor: palette.accent,
  },
});
