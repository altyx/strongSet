import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/src/components/themed-text';
import { Button } from '@/src/components/ui/button';
import { EQUIPMENT_OPTIONS } from '@/src/constants/equipment';
import { muscleLabel } from '@/src/constants/muscles';
import { radius, spacing, typography } from '@/src/constants/theme';
import { Tracking, TRACKING_OPTIONS } from '@/src/constants/tracking';
import { validateNewExercise } from '@/src/domain/exercise-library';
import { ExerciseRepository } from '@/src/repositories/exercise/exercise-repository';
import { makeStyles, useTheme } from '@/src/theme/theme-provider';

type ChipProps = { label: string; selected: boolean; onPress: () => void; role: 'checkbox' | 'radio'; disabled?: boolean };

function Chip({ label, selected, onPress, role, disabled = false }: ChipProps) {
  const styles = useStyles();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole={role}
      accessibilityState={{ checked: selected, disabled }}
      style={[styles.chip, selected && styles.chipSelected, disabled && styles.chipDisabled]}>
      <ThemedText type="defaultSemiBold" tone={selected ? 'onAccent' : 'secondary'} style={styles.chipText}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

// Exercice à modifier (ouvert avec `id`), lu une fois à l'ouverture
function loadExercise(id: number | null) {
  const exercise = id === null ? null : ExerciseRepository.getById(id);
  if (id === null || !exercise) {
    return null;
  }
  return { exercise, muscleIds: ExerciseRepository.getMuscleIds(id), usage: ExerciseRepository.getUsage(id) };
}

// Création d'un exercice de la bibliothèque (modale), ou modification quand l'écran est ouvert avec `id`
export default function CreateExerciseModal() {
  const styles = useStyles();
  const { colors: palette } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [editing] = useState(() => loadExercise(id === undefined ? null : Number(id)));
  const [muscles] = useState(() => ExerciseRepository.getMuscles());
  const [name, setName] = useState(editing?.exercise.name ?? '');
  const [muscleIds, setMuscleIds] = useState<number[]>(editing?.muscleIds ?? []);
  const [equipment, setEquipment] = useState<string | null>(editing?.exercise.equipment ?? null);
  const [tracking, setTracking] = useState<Tracking>(editing?.exercise.tracking ?? 'weight_reps');
  const [description, setDescription] = useState(editing?.exercise.description ?? '');
  const [error, setError] = useState<string | null>(null);
  // Les séries déjà faites sont en kg × reps ou en durée + distance : la saisie ne change plus après une séance
  const trackingLocked = (editing?.usage.workoutCount ?? 0) > 0;

  const toggleMuscle = (id: number) => {
    setMuscleIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
    setError(null);
  };

  const save = () => {
    const message = validateNewExercise(name, muscleIds, ExerciseRepository.existsByName(name, editing?.exercise.id));
    if (message) {
      setError(message);
      return;
    }
    const values = { name, equipment, muscleIds, description, tracking };
    if (editing) {
      ExerciseRepository.update(editing.exercise.id, values);
    } else {
      ExerciseRepository.create(values);
    }
    router.back();
  };


  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: editing ? "Modifier l'exercice" : 'Nouvel exercice' }} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets>
        <View style={styles.field}>
          <ThemedText type="label">Nom de l&apos;exercice</ThemedText>
          <TextInput
            value={name}
            onChangeText={(text) => {
              setName(text);
              setError(null);
            }}
            placeholder="Ex. Développé couché"
            placeholderTextColor={palette.textTertiary}
            autoFocus={!editing}
            accessibilityLabel="Nom de l'exercice"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <ThemedText type="label">Saisie des séries</ThemedText>
          <View style={styles.chips} accessibilityRole="radiogroup">
            {TRACKING_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                selected={tracking === option.value}
                onPress={() => setTracking(option.value)}
                role="radio"
                disabled={trackingLocked && tracking !== option.value}
              />
            ))}
          </View>
          {trackingLocked && (
            <ThemedText type="caption">
              Déjà utilisé en séance : la saisie des séries ne peut plus changer.
            </ThemedText>
          )}
        </View>

        <View style={styles.field}>
          <ThemedText type="label">Muscles travaillés</ThemedText>
          <View style={styles.chips}>
            {muscles.map((muscle) => (
              <Chip
                key={muscle.id}
                label={muscleLabel(muscle.name)}
                selected={muscleIds.includes(muscle.id)}
                onPress={() => toggleMuscle(muscle.id)}
                role="checkbox"
              />
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <ThemedText type="label">Matériel (facultatif)</ThemedText>
          <View style={styles.chips} accessibilityRole="radiogroup">
            {EQUIPMENT_OPTIONS.map((option) => (
              <Chip
                key={option}
                label={option}
                selected={equipment === option}
                // Un second appui désélectionne
                onPress={() => setEquipment((current) => (current === option ? null : option))}
                role="radio"
              />
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <ThemedText type="label">Description (facultatif)</ThemedText>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Installation, exécution, points d'attention…"
            placeholderTextColor={palette.textTertiary}
            multiline
            accessibilityLabel="Description de l'exercice"
            style={[styles.input, styles.multiline]}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        {error && (
          <ThemedText type="caption" tone="accent" style={styles.error} accessibilityRole="alert">
            {error}
          </ThemedText>
        )}
        <View style={styles.actions}>
          <Button title="Annuler" variant="secondary" onPress={() => router.back()} style={styles.action} />
          <Button title={editing ? 'Enregistrer' : 'Créer'} onPress={save} style={styles.action} />
        </View>
      </View>
    </View>
  );
}

const useStyles = makeStyles((palette) => ({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    gap: spacing.xxl,
    padding: spacing.xl,
  },
  field: {
    gap: spacing.md,
  },
  input: {
    ...typography.body,
    height: 52,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    color: palette.text,
  },
  multiline: {
    height: undefined,
    minHeight: 110,
    paddingTop: 14,
    paddingBottom: 14,
    textAlignVertical: 'top',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    height: 40,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  chipSelected: {
    borderColor: palette.accent,
    backgroundColor: palette.accent,
  },
  chipDisabled: {
    opacity: 0.4,
  },
  chipText: {
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    gap: spacing.sm,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: palette.surfaceRaised,
    backgroundColor: palette.background,
  },
  error: {
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  action: {
    flex: 1,
  },
}));
