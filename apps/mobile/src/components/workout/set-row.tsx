import { Check } from 'lucide-react-native/icons';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/src/components/themed-text';
import { fontFamily, palette, radius } from '@/src/constants/theme';
import { SetValues, WorkoutSet } from '@/src/repositories/workout/workout-type';
import { formatDecimal, parseDecimal, parseInteger } from '@/src/utils/number';

// Colonnes partagées avec l'en-tête du tableau (ExerciseCard)
export const SET_COLUMNS = { number: 28, weight: 68, reps: 56, check: 44 } as const;

type SetRowProps = {
  index: number;
  set: WorkoutSet;
  // Série correspondante de la dernière séance : affichée en indication et en placeholder
  previous?: SetValues;
  defaultReps: number;
  // Première série non validée de la séance : mise en avant
  isCurrent: boolean;
  onChange: (values: SetValues) => void;
  // Reçoit la saisie en cours, qui n'a pas forcément encore été enregistrée (le champ peut avoir encore le focus)
  onToggle: (entered: SetValues) => void;
  onDelete: () => void;
};

function formatPrevious(previous?: SetValues) {
  if (!previous?.reps) {
    return '—';
  }
  return previous.weight === null ? `${previous.reps} reps` : `${formatDecimal(previous.weight)} × ${previous.reps}`;
}

/**
 * Les champs gardent leur texte en local pendant la saisie et ne l'enregistrent qu'à la perte du focus.
 * Le parent remonte la ligne (via sa `key`) quand les valeurs enregistrées changent.
 */
export function SetRow({ index, set, previous, defaultReps, isCurrent, onChange, onToggle, onDelete }: SetRowProps) {
  const [weightText, setWeightText] = useState(set.weight === null ? '' : formatDecimal(set.weight));
  const [repsText, setRepsText] = useState(set.reps === null ? '' : String(set.reps));
  const done = set.completed_at !== null;
  const number = index + 1;

  const entered = (): SetValues => ({ weight: parseDecimal(weightText), reps: parseInteger(repsText) });

  const save = () => {
    const values = entered();
    if (values.weight !== set.weight || values.reps !== set.reps) {
      onChange(values);
    }
  };

  const inputStyle = [styles.input, done ? styles.inputDone : isCurrent && styles.inputCurrent];

  return (
    <View style={[styles.row, done && styles.rowDone]}>
      <Pressable
        onLongPress={onDelete}
        accessibilityRole="button"
        accessibilityLabel={`Série ${number}`}
        accessibilityHint="Appui long pour supprimer la série"
        style={styles.number}>
        <ThemedText style={styles.numberText}>{number}</ThemedText>
      </Pressable>
      <ThemedText type="caption" style={styles.previous} numberOfLines={1}>
        {formatPrevious(previous)}
      </ThemedText>
      <TextInput
        value={weightText}
        onChangeText={setWeightText}
        onEndEditing={save}
        placeholder={previous?.weight != null ? formatDecimal(previous.weight) : 'kg'}
        placeholderTextColor={palette.textTertiary}
        keyboardType="decimal-pad"
        selectTextOnFocus
        accessibilityLabel={`Charge de la série ${number}, en kilos`}
        style={[inputStyle, { width: SET_COLUMNS.weight }]}
      />
      <TextInput
        value={repsText}
        onChangeText={setRepsText}
        onEndEditing={save}
        placeholder={String(previous?.reps ?? defaultReps)}
        placeholderTextColor={palette.textTertiary}
        keyboardType="number-pad"
        selectTextOnFocus
        accessibilityLabel={`Répétitions de la série ${number}`}
        style={[inputStyle, { width: SET_COLUMNS.reps }]}
      />
      <Pressable
        onPress={() => onToggle(entered())}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: done }}
        accessibilityLabel={done ? `Annuler la validation de la série ${number}` : `Valider la série ${number}`}
        hitSlop={4}
        style={[styles.check, done && styles.checkDone]}>
        {/* pointerEvents none : sinon le SVG capte le toucher et le Pressable ne reçoit rien */}
        <Check size={18} strokeWidth={3} color={done ? palette.onAccent : palette.textTertiary} pointerEvents="none" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 6,
    borderRadius: radius.md,
  },
  rowDone: {
    backgroundColor: palette.accentSoft,
  },
  number: {
    width: SET_COLUMNS.number,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surfaceRaised,
  },
  numberText: {
    fontFamily: fontFamily.displaySemibold,
    fontSize: 17,
    lineHeight: 20,
  },
  previous: {
    flex: 1,
    fontVariant: ['tabular-nums'],
  },
  input: {
    height: 40,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: palette.background,
    backgroundColor: palette.background,
    color: palette.text,
    textAlign: 'center',
    fontFamily: fontFamily.displaySemibold,
    fontSize: 20,
    fontVariant: ['tabular-nums'],
    padding: 0,
  },
  inputCurrent: {
    borderColor: palette.accent,
  },
  inputDone: {
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  check: {
    width: 40,
    height: 40,
    marginLeft: SET_COLUMNS.check - 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: palette.border,
    backgroundColor: palette.surfaceRaised,
  },
  checkDone: {
    borderColor: palette.accent,
    backgroundColor: palette.accent,
  },
});
