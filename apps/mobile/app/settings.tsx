import Constants from 'expo-constants';
import { router } from 'expo-router';
import { ArchiveRestore, ChevronRight, Database, FileSpreadsheet } from 'lucide-react-native/icons';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NotificationSetting } from '@/src/components/settings/notification-setting';
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
import { clearRest } from '@/src/services/rest-notification';
import { DistanceUnit } from '@/src/utils/distance';
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

const LEGAL_LINKS = [
  { document: 'cgu', label: "Conditions générales d'utilisation" },
  { document: 'confidentialite', label: 'Politique de confidentialité' },
] as const;

const WEIGHT_UNITS: { value: WeightUnit; label: string }[] = [
  { value: 'kg', label: 'Kilos (kg)' },
  { value: 'lb', label: 'Livres (lb)' },
];

const DISTANCE_UNITS: { value: DistanceUnit; label: string }[] = [
  { value: 'km', label: 'Kilomètres (km)' },
  { value: 'mi', label: 'Miles (mi)' },
];

type UnitChoiceProps<T extends string> = {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

// Choix d'une unité, deux boutons côte à côte
function UnitChoice<T extends string>({ label, options, value, onChange }: UnitChoiceProps<T>) {
  return (
    <View style={styles.units} accessibilityRole="radiogroup" accessibilityLabel={label}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
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
  );
}

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
    clearRest();
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
        <ThemedText type="label">Notifications</ThemedText>
        <NotificationSetting />
      </View>

      <View style={styles.section}>
        <ThemedText type="label">Unité de charge</ThemedText>
        <UnitChoice
          label="Unité de charge"
          options={WEIGHT_UNITS}
          value={settings.weightUnit ?? 'kg'}
          onChange={(weightUnit) => update({ weightUnit })}
        />
        <ThemedText type="caption">Les charges restent enregistrées en kilos : changer d&apos;unité ne perd rien.</ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText type="label">Unité de distance</ThemedText>
        <UnitChoice
          label="Unité de distance"
          options={DISTANCE_UNITS}
          value={settings.distanceUnit ?? 'km'}
          onChange={(distanceUnit) => update({ distanceUnit })}
        />
        <ThemedText type="caption">Pour le cardio. Les distances restent enregistrées en mètres.</ThemedText>
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

      <View style={styles.section}>
        <ThemedText type="label">À propos</ThemedText>
        <Card style={styles.links}>
          {LEGAL_LINKS.map((link, index) => (
            <Pressable
              key={link.document}
              onPress={() => router.push({ pathname: '/legal/[document]', params: { document: link.document } })}
              accessibilityRole="link"
              style={({ pressed }) => [styles.link, index > 0 && styles.linkSeparator, pressed && styles.pressed]}>
              <ThemedText>{link.label}</ThemedText>
              <ChevronRight size={20} color={palette.textTertiary} strokeWidth={2} pointerEvents="none" />
            </Pressable>
          ))}
        </Card>
        <ThemedText type="caption" tone="tertiary">
          StrongSet {Constants.expoConfig?.version ?? ''}
        </ThemedText>
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
  links: {
    paddingVertical: 0,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
  },
  linkSeparator: {
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  pressed: {
    opacity: 0.7,
  },
  unitSelected: {
    backgroundColor: palette.accent,
  },
});
