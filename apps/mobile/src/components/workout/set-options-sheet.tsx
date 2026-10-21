import { Check, Trash2 } from 'lucide-react-native/icons';
import { useRef, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/src/components/themed-text';
import { SET_TYPE_INFO, SET_TYPES } from '@/src/constants/set-types';
import { fontFamily, palette, radius, spacing } from '@/src/constants/theme';
import { SetType, WorkoutSet } from '@/src/repositories/workout/workout-type';

type SetOptionsSheetProps = {
  // Série dont on choisit le type ; null = feuille fermée
  set: WorkoutSet | null;
  // Libellé de la série dans son exercice (« 2 », « É »), pour le titre
  label: string;
  onClose: () => void;
  onSelectType: (type: SetType) => void;
  onDelete: () => void;
};

// Feuille du bas ouverte en touchant le numéro d'une série
export function SetOptionsSheet({ set, label, onClose, onSelectType, onDelete }: SetOptionsSheetProps) {
  const insets = useSafeAreaInsets();
  // Garde la dernière série affichée pendant l'animation de fermeture
  const [shown, setShown] = useState<{ set: WorkoutSet; label: string } | null>(null);
  if (set && set !== shown?.set) {
    setShown({ set, label });
  }

  // Sur iOS, l'alerte de suppression ne s'ouvre pas tant que la feuille se ferme : elle attend onDismiss
  const pendingAction = useRef<(() => void) | null>(null);
  const close = (then?: () => void) => {
    onClose();
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

  const current = shown?.set.type;
  const title = current === 'warmup' ? 'Série d’échauffement' : `Série ${shown?.label ?? ''}`;

  return (
    <Modal
      visible={set !== null}
      transparent
      animationType="slide"
      onRequestClose={() => close()}
      onDismiss={runPendingAction}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={() => close()} accessibilityLabel="Fermer" />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
          <View style={styles.handle} />
          <ThemedText type="heading">{title}</ThemedText>

          <View style={styles.options} accessibilityRole="radiogroup" accessibilityLabel="Type de série">
            {SET_TYPES.map((type) => {
              const info = SET_TYPE_INFO[type];
              const selected = type === current;
              const color = info.color ?? palette.text;
              return (
                <Pressable
                  key={type}
                  onPress={() => close(() => onSelectType(type))}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  accessibilityLabel={`${info.label} : ${info.description}`}
                  style={({ pressed }) => [styles.option, selected && styles.optionSelected, pressed && styles.pressed]}>
                  <View style={[styles.badge, { borderColor: info.color ?? palette.border }]}>
                    <ThemedText style={[styles.badgeText, { color }]}>{info.letter ?? '1'}</ThemedText>
                  </View>
                  <View style={styles.optionText}>
                    <ThemedText type="defaultSemiBold">{info.label}</ThemedText>
                    <ThemedText type="caption">{info.description}</ThemedText>
                  </View>
                  {selected && <Check size={20} color={palette.accent} strokeWidth={2.5} pointerEvents="none" />}
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={() => close(onDelete)}
            accessibilityRole="button"
            style={({ pressed }) => [styles.delete, pressed && styles.pressed]}>
            <Trash2 size={20} color={palette.danger} strokeWidth={2} pointerEvents="none" />
            <ThemedText type="defaultSemiBold" style={{ color: palette.danger }}>
              Supprimer la série
            </ThemedText>
          </Pressable>
        </View>
      </View>
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
  options: {
    gap: spacing.xs,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 60,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    backgroundColor: palette.surfaceRaised,
  },
  optionSelected: {
    borderColor: palette.accent,
  },
  optionText: {
    flex: 1,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.background,
  },
  badgeText: {
    fontFamily: fontFamily.displaySemibold,
    fontSize: 17,
    lineHeight: 20,
  },
  delete: {
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
});
