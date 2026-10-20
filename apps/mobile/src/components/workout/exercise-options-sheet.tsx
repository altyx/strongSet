import type { LucideIcon } from 'lucide-react-native';
import { ArrowDown, ArrowUp, Replace, Trash2 } from 'lucide-react-native/icons';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/src/components/themed-text';
import { palette, radius, spacing, typography } from '@/src/constants/theme';
import { WorkoutExercise } from '@/src/repositories/workout/workout-type';

type ExerciseOptionsSheetProps = {
  // Exercice dont on affiche les options ; null = feuille fermée
  exercise: WorkoutExercise | null;
  canMoveUp: boolean;
  canMoveDown: boolean;
  // Appelé à la fermeture, quelle que soit l'action, avec la note saisie si elle a changé
  onClose: (note?: string) => void;
  onMove: (direction: -1 | 1) => void;
  onReplace: () => void;
  onRemove: () => void;
};

type Action = { label: string; icon: LucideIcon; onPress: () => void; disabled?: boolean; destructive?: boolean };

// Feuille du bas ouverte par « ⋯ » sur un exercice de séance
export function ExerciseOptionsSheet({
  exercise,
  canMoveUp,
  canMoveDown,
  onClose,
  onMove,
  onReplace,
  onRemove,
}: ExerciseOptionsSheetProps) {
  const insets = useSafeAreaInsets();
  const [note, setNote] = useState('');
  // Garde le dernier exercice affiché pendant l'animation de fermeture
  const [shown, setShown] = useState<WorkoutExercise | null>(null);
  if (exercise && exercise !== shown) {
    setShown(exercise);
    setNote(exercise.exercise_note ?? '');
  }

  // Sur iOS, une alerte ou une autre modale ne s'ouvre pas tant que la feuille se ferme : l'action attend onDismiss
  const pendingAction = useRef<(() => void) | null>(null);

  const close = (then?: () => void) => {
    const changed = shown !== null && note.trim() !== (shown.exercise_note ?? '');
    onClose(changed ? note : undefined);
    if (Platform.OS === 'ios') {
      pendingAction.current = then ?? null;
    } else {
      then?.();
    }
  };

  const runPendingAction = () => {
    const action = pendingAction.current;
    pendingAction.current = null;
    action?.();
  };

  const actions: Action[] = [
    { label: 'Monter', icon: ArrowUp, onPress: () => close(() => onMove(-1)), disabled: !canMoveUp },
    { label: 'Descendre', icon: ArrowDown, onPress: () => close(() => onMove(1)), disabled: !canMoveDown },
    { label: 'Remplacer', icon: Replace, onPress: () => close(onReplace) },
    { label: 'Retirer', icon: Trash2, onPress: () => close(onRemove), destructive: true },
  ];

  return (
    <Modal
      visible={exercise !== null}
      transparent
      animationType="slide"
      onRequestClose={() => close()}
      onDismiss={runPendingAction}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={() => close()} accessibilityLabel="Fermer" />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
          <View style={styles.handle} />
          <ThemedText type="heading" numberOfLines={2}>
            {shown?.name}
          </ThemedText>

          {/* La note est celle de l'exercice de la bibliothèque : elle s'affiche à chaque séance */}
          {shown?.exercise_id !== null && (
            <View style={styles.noteField}>
              <ThemedText type="label">Note sur l&apos;exercice</ThemedText>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Réglage du siège, prise, sensations…"
                placeholderTextColor={palette.textTertiary}
                multiline
                accessibilityLabel="Note sur l'exercice"
                style={styles.noteInput}
              />
            </View>
          )}

          <View style={styles.actions}>
            {actions.map(({ label, icon: Icon, onPress, disabled, destructive }) => {
              const color = destructive ? palette.danger : palette.text;
              return (
                <Pressable
                  key={label}
                  onPress={onPress}
                  disabled={disabled}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !!disabled }}
                  style={({ pressed }) => [styles.action, pressed && styles.pressed, disabled && styles.disabled]}>
                  <Icon size={20} color={color} strokeWidth={2} pointerEvents="none" />
                  <ThemedText type="defaultSemiBold" style={{ color }}>
                    {label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  sheet: {
    gap: spacing.lg,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.xl,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    backgroundColor: palette.surface,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.border,
  },
  noteField: {
    gap: spacing.sm,
  },
  noteInput: {
    ...typography.body,
    minHeight: 64,
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.background,
    color: palette.text,
    textAlignVertical: 'top',
  },
  actions: {
    gap: spacing.xs,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: 52,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: palette.surfaceRaised,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.4,
  },
});
