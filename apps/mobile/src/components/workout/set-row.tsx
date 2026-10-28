import { Check } from 'lucide-react-native/icons';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/src/components/themed-text';
import { SET_TYPE_INFO } from '@/src/constants/set-types';
import { fontFamily, palette, radius } from '@/src/constants/theme';
import { Tracking } from '@/src/constants/tracking';
import { SetValues, WorkoutSet } from '@/src/repositories/workout/workout-type';
import { distanceUnitName, DistanceUnit, formatDistanceValue, parseDistance } from '@/src/utils/distance';
import { formatDuration, parseDuration } from '@/src/utils/duration';
import { parseDecimal, parseInteger } from '@/src/utils/number';
import { formatSetValues } from '@/src/utils/set-format';
import { formatWeightValue, fromUnit, WeightUnit } from '@/src/utils/weight';

// Colonnes partagées avec l'en-tête du tableau (ExerciseCard)
export const SET_COLUMNS = { number: 28, weight: 68, reps: 56, check: 44 } as const;

type SetRowProps = {
  // « É » pour l'échauffement, sinon numéro parmi les séries de travail (voir setLabels)
  label: string;
  set: WorkoutSet;
  // Cardio : durée et distance à la place de la charge et des répétitions
  tracking: Tracking;
  // Série correspondante de la dernière séance : affichée en indication et en placeholder
  previous?: SetValues;
  defaultReps: number;
  // Unités de saisie et d'affichage ; les valeurs reçues et renvoyées restent en kg et en mètres
  unit: WeightUnit;
  distanceUnit: DistanceUnit;
  // Première série non validée de la séance : mise en avant
  isCurrent: boolean;
  onChange: (values: SetValues) => void;
  // Reçoit la saisie en cours, qui n'a pas forcément encore été enregistrée (le champ peut avoir encore le focus)
  onToggle: (entered: SetValues) => void;
  // Choix du type ou suppression de la série
  onOptions: () => void;
};

function formatPrevious(unit: WeightUnit, distanceUnit: DistanceUnit, previous?: SetValues) {
  if (!previous?.reps && !previous?.duration_seconds) {
    return '—';
  }
  return formatSetValues(previous, unit, distanceUnit);
}

// Texte d'un champ à partir de la valeur enregistrée, vide si elle n'est pas saisie
const toText = (value: number | null | undefined, format: (value: number) => string) =>
  value == null ? '' : format(value);

/**
 * Les champs gardent leur texte en local pendant la saisie et ne l'enregistrent qu'à la perte du focus.
 * Le parent remonte la ligne (via sa `key`) quand les valeurs enregistrées changent.
 */
export function SetRow({ label, set, tracking, previous, defaultReps, unit, distanceUnit, isCurrent, onChange, onToggle, onOptions }: SetRowProps) {
  const cardio = tracking === 'duration_distance';
  // Cardio : le premier champ est la durée, le second la distance ; sinon la charge et les répétitions
  const savedFirstText = cardio
    ? toText(set.duration_seconds, formatDuration)
    : toText(set.weight, (weight) => formatWeightValue(weight, unit));
  const savedSecondText = cardio ? toText(set.distance_meters, (meters) => formatDistanceValue(meters, distanceUnit)) : toText(set.reps, String);
  const [firstText, setFirstText] = useState(savedFirstText);
  const [secondText, setSecondText] = useState(savedSecondText);
  const done = set.completed_at !== null;
  const typeInfo = SET_TYPE_INFO[set.type];
  // Nom lu par le lecteur d'écran : « série 2 », « série 3, dégressive », « échauffement »
  const name =
    set.type === 'warmup' ? 'échauffement' : `série ${label}${set.type === 'normal' ? '' : `, ${typeInfo.label.toLowerCase()}`}`;

  // Champ non retouché : on garde la valeur enregistrée, que l'arrondi d'affichage (livres, km) ne doit pas modifier
  const entered = (): SetValues => {
    if (cardio) {
      return {
        weight: null,
        reps: null,
        duration_seconds: firstText === savedFirstText ? set.duration_seconds : parseDuration(firstText),
        distance_meters: secondText === savedSecondText ? set.distance_meters : parseDistance(secondText, distanceUnit),
      };
    }
    const weight = parseDecimal(firstText);
    return {
      weight: firstText === savedFirstText ? set.weight : weight === null ? null : fromUnit(weight, unit),
      reps: parseInteger(secondText),
    };
  };

  const save = () => {
    const values = entered();
    if (
      values.weight !== set.weight ||
      values.reps !== set.reps ||
      (values.duration_seconds ?? null) !== set.duration_seconds ||
      (values.distance_meters ?? null) !== set.distance_meters
    ) {
      onChange(values);
    }
  };

  const fields = cardio
    ? {
        firstPlaceholder: previous?.duration_seconds != null ? formatDuration(previous.duration_seconds) : 'min',
        firstKeyboard: 'numbers-and-punctuation' as const,
        firstLabel: `Durée, ${name}, en minutes ou minutes:secondes`,
        secondPlaceholder: previous?.distance_meters != null ? formatDistanceValue(previous.distance_meters, distanceUnit) : distanceUnit,
        secondKeyboard: 'decimal-pad' as const,
        secondLabel: `Distance, ${name}, en ${distanceUnitName(distanceUnit)}`,
      }
    : {
        firstPlaceholder: previous?.weight != null ? formatWeightValue(previous.weight, unit) : unit,
        firstKeyboard: 'decimal-pad' as const,
        firstLabel: `Charge, ${name}, en ${unit === 'lb' ? 'livres' : 'kilos'}`,
        secondPlaceholder: String(previous?.reps ?? defaultReps),
        secondKeyboard: 'number-pad' as const,
        secondLabel: `Répétitions, ${name}`,
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
        {formatPrevious(unit, distanceUnit, previous)}
      </ThemedText>
      <TextInput
        value={firstText}
        onChangeText={setFirstText}
        onEndEditing={save}
        placeholder={fields.firstPlaceholder}
        placeholderTextColor={palette.textTertiary}
        keyboardType={fields.firstKeyboard}
        selectTextOnFocus
        accessibilityLabel={fields.firstLabel}
        style={[inputStyle, { width: SET_COLUMNS.weight }]}
      />
      <TextInput
        value={secondText}
        onChangeText={setSecondText}
        onEndEditing={save}
        placeholder={fields.secondPlaceholder}
        placeholderTextColor={palette.textTertiary}
        keyboardType={fields.secondKeyboard}
        selectTextOnFocus
        accessibilityLabel={fields.secondLabel}
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
