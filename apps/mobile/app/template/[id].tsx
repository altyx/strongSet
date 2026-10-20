import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Plus, Trash2 } from 'lucide-react-native/icons';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExercisePicker } from '@/src/components/templates/exercise-picker';
import { TemplateExerciseCard } from '@/src/components/templates/template-exercise-card';
import { ThemedText } from '@/src/components/themed-text';
import { Button } from '@/src/components/ui/button';
import { palette, radius, spacing, typography } from '@/src/constants/theme';
import {
  DraftDefaults,
  DraftExercise,
  draftFromTemplate,
  moveItem,
  newDraftExercise,
  toTemplateInput,
  validateDraft,
} from '@/src/domain/template-draft';
import { useUserSettings } from '@/src/hooks/user/use-user-settings';
import { TemplateRepository } from '@/src/repositories/template/template-repository';

/**
 * Création (`/template/new`) ou modification (`/template/<id>`) d'un programme.
 * Rien n'est enregistré avant « Enregistrer » : quitter l'écran abandonne les changements.
 */
export default function TemplateEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';
  const insets = useSafeAreaInsets();
  const { getPreferences } = useUserSettings();
  const preferences = getPreferences();
  const defaults: DraftDefaults = {
    sets: preferences?.seriesPerExercise ?? 3,
    reps: preferences?.repPerSeries ?? 10,
    restSeconds: preferences?.restBetweenSeries ?? 90,
  };

  const [template] = useState(() => (isNew ? null : TemplateRepository.getTemplate(Number(id))));
  const [name, setName] = useState(template?.name ?? '');
  const [exercises, setExercises] = useState<DraftExercise[]>(() =>
    template ? draftFromTemplate(template, defaults) : [],
  );
  const [pickerVisible, setPickerVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isNew && !template) {
    return (
      <View style={[styles.screen, styles.empty]}>
        <ThemedText type="caption">Programme introuvable.</ThemedText>
      </View>
    );
  }

  const save = () => {
    const message = validateDraft(name, exercises);
    if (message) {
      setError(message);
      return;
    }
    const input = toTemplateInput(name, exercises);
    if (template) {
      TemplateRepository.updateTemplate(template.id, input);
    } else {
      TemplateRepository.createTemplate(input);
    }
    router.back();
  };

  const remove = () => {
    if (!template) {
      return;
    }
    Alert.alert(
      'Supprimer le programme ?',
      'Les séances déjà faites avec ce programme restent dans votre historique.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            TemplateRepository.deleteTemplate(template.id);
            router.back();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: isNew ? 'Nouveau programme' : 'Modifier le programme' }} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets>
        <View style={styles.field}>
          <ThemedText type="label">Nom du programme</ThemedText>
          <TextInput
            value={name}
            onChangeText={(text) => {
              setName(text);
              setError(null);
            }}
            placeholder="Ex. Push, Haut du corps…"
            placeholderTextColor={palette.textTertiary}
            accessibilityLabel="Nom du programme"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <ThemedText type="label">
            {exercises.length} {exercises.length > 1 ? 'exercices' : 'exercice'}
          </ThemedText>
          {exercises.map((exercise, index) => (
            <TemplateExerciseCard
              key={exercise.key}
              exercise={exercise}
              index={index}
              count={exercises.length}
              onChange={(updated) => setExercises((current) => current.map((item) => (item.key === updated.key ? updated : item)))}
              onMove={(delta) => setExercises((current) => moveItem(current, index, delta))}
              onRemove={() => setExercises((current) => current.filter((item) => item.key !== exercise.key))}
            />
          ))}
          <Button title="Ajouter un exercice" variant="ghost" icon={Plus} onPress={() => setPickerVisible(true)} />
        </View>

        {template && <Button title="Supprimer le programme" variant="ghost" icon={Trash2} onPress={remove} />}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        {error && (
          <ThemedText type="caption" tone="accent" style={styles.error} accessibilityRole="alert">
            {error}
          </ThemedText>
        )}
        <Button title="Enregistrer" onPress={save} />
      </View>

      <ExercisePicker
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelect={(exercise) => {
          setExercises((current) => [...current, newDraftExercise(exercise, defaults)]);
          setError(null);
          setPickerVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
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
});
