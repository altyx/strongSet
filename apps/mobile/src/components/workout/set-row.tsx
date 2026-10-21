import { Check } from 'lucide-react-native/icons';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/src/components/themed-text';
import { SET_TYPE_INFO } from '@/src/constants/set-types';
import { fontFamily, palette, radius } from '@/src/constants/theme';
import { SetValues, WorkoutSet } from '@/src/repositories/workout/workout-type';
import { parseDecimal, parseInteger } from '@/src/utils/number';
import { formatWeightValue, fromUnit, WeightUnit } from '@/src/utils/weight';

// Colonnes partagées avec l'en-tête du tableau (ExerciseCard)
export const SET_COLUMNS = { number: 28, weight: 68, reps: 56, check: 44 } as const;

type SetRowProps = {
  // « É » pour l'échauffement, sinon numéro parmi les séries de travail (voir setLabels)
  label: string;
  set: WorkoutSet;
  // Série correspondante de la dernière séance : affichée en indication et en placeholder
  previous?: SetValues;
  defaultReps: number;
  // Unité de saisie et d'affichage ; les valeurs reçues et renvoyées restent en kg
  unit: WeightUnit;
  // Première série non validée de la séance : mise en avant
  isCurrent: boolean;
  onChange: (values: SetValues) => void;
  // Reçoit la saisie en cours, qui n'a pas forcément encore été enregistrée (le champ peut avoir encore le focus)
  onToggle: (entered: SetValues) => void;
  // Choix du type ou suppression de la série
  onOptions: () => void;
};

function formatPrevious(unit: WeightUnit, previous?: SetValues) {
  if (!previous?.reps) {
    return '—';
  }
  return previous.weight === null ? `${previous.reps} reps` : `${formatWeightValue(previous.weight, unit)} × ${previous.reps}`;
}

/**
 * Les champs gardent leur texte en local pendant la saisie et ne l'enregistrent qu'à la perte du focus.
 * Le parent remonte la ligne (via sa `key`) quand les valeurs enregistrées changent.
 */
export function SetRow({ label, set, previous, defaultReps, unit, isCurrent, onChange, onToggle, onOptions }: SetRowProps) {
  const savedWeightText = set.weight === null ? '' : formatWeightValue(set.weight, unit);
  const [weightText, setWeightText] = useState(savedWeightText);
  const [repsText, setRepsText] = useState(set.reps === null ? '' : String(set.reps));
  const done = set.completed_at !== null;
  const typeInfo = SET_TYPE_INFO[set.type];
  // Nom lu par le lecteur d'écran : « série 2 », « série 3, dégressive », « échauffement »
  const name =
    set.type === 'warmup' ? 'échauffement' : `série ${label}${set.type === 'normal' ? '' : `, ${typeInfo.label.toLowerCase()}`}`;

  // Charge non retouchée : on garde la valeur enregistrée, que l'arrondi d'affichage en livres ne doit pas modifier
  const enteredWeight = () => {
    if (weightText === savedWeightText) {
      return set.weight;
    }
    const value = parseDecimal(weightText);
    return value === null ? null : fromUnit(value, unit);
  };
  const entered = (): SetValues => ({ weight: enteredWeight(), reps: parseInteger(repsText) });

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
        onPress={onOptions}
        accessibilityRole="button"
        accessibilityLabel={name}
        accessibilityHint="Changer le type de série ou la supprimer"
        hitSlop={6}
        style={[styles.number, typeInfo.color !== null && { borderColor: typeInfo.color }]}>
        <ThemedText style={[styles.numberText, typeInfo.color !== null && { color: typeInfo.color }]}>{label}</ThemedText>
      </Pressable>
      <ThemedText type="caption" style={styles.previous} numberOfLines={1}>
        {formatPrevious(unit, previous)}
      </ThemedText>
      <TextInput
        value={weightText}
        onChangeText={setWeightText}
        onEndEditing={save}
        placeholder={previous?.weight != null ? formatWeightValue(previous.weight, unit) : unit}
        placeholderTextColor={palette.textTertiary}
        keyboardType="decimal-pad"
        selectTextOnFocus
        accessibilityLabel={`Charge, ${name}, en ${unit === 'lb' ? 'livres' : 'kilos'}`}
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
        accessibilityLabel={`Répétitions, ${name}`}
        style={[inputStyle, { width: SET_COLUMNS.reps }]}
      />
      <Pressable
        onPress={() => onToggle(entered())}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: done }}
        accessibilityLabel={done ? `Annuler la validation, ${name}` : `Valider, ${name}`}
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
    borderWidth: 1.5,
    borderColor: 'transparent',
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
