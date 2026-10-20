import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/src/components/themed-text';
import { Button } from '@/src/components/ui/button';
import { EQUIPMENT_OPTIONS } from '@/src/constants/equipment';
import { muscleLabel } from '@/src/constants/muscles';
import { palette, radius, spacing, typography } from '@/src/constants/theme';
import { validateNewExercise } from '@/src/domain/exercise-library';
import { ExerciseRepository } from '@/src/repositories/exercise/exercise-repository';

type ChipProps = { label: string; selected: boolean; onPress: () => void; role: 'checkbox' | 'radio' };

function Chip({ label, selected, onPress, role }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={role}
      accessibilityState={{ checked: selected }}
      style={[styles.chip, selected && styles.chipSelected]}>
      <ThemedText type="defaultSemiBold" tone={selected ? 'onAccent' : 'secondary'} style={styles.chipText}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

// Création d'un exercice de la bibliothèque (modale)
export default function CreateExerciseModal() {
  const insets = useSafeAreaInsets();
  const [muscles] = useState(() => ExerciseRepository.getMuscles());
  const [name, setName] = useState('');
  const [muscleIds, setMuscleIds] = useState<number[]>([]);
  const [equipment, setEquipment] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const toggleMuscle = (id: number) => {
    setMuscleIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
    setError(null);
  };

  const create = () => {
    const message = validateNewExercise(name, muscleIds, ExerciseRepository.existsByName(name));
    if (message) {
      setError(message);
      return;
    }
    ExerciseRepository.create({ name, equipment, muscleIds, description });
    router.back();
  };

  return (
    <View style={styles.screen}>
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
            autoFocus
            accessibilityLabel="Nom de l'exercice"
            style={styles.input}
          />
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
          <Button title="Créer" onPress={create} style={styles.action} />
        </View>
      </View>
    </View>
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
});
