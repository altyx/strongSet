import { Ellipsis, Plus } from 'lucide-react-native/icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/src/components/themed-text';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { SET_COLUMNS, SetRow } from '@/src/components/workout/set-row';
import { setLabels } from '@/src/constants/set-types';
import { palette } from '@/src/constants/theme';
import { SetValues, WorkoutExercise, WorkoutSet } from '@/src/repositories/workout/workout-type';
import { WeightUnit } from '@/src/utils/weight';

type ExerciseCardProps = {
  exercise: WorkoutExercise;
  // Séries validées de la dernière séance avec cet exercice, dans l'ordre
  previous: SetValues[];
  defaultReps: number;
  unit: WeightUnit;
  currentSetId: number | null;
  onChangeSet: (set: WorkoutSet, values: SetValues) => void;
  onToggleSet: (set: WorkoutSet, index: number, entered: SetValues) => void;
  // Type ou suppression d'une série
  onSetOptions: (set: WorkoutSet, label: string) => void;
  onAddSet: () => void;
  // Note, déplacement, remplacement, retrait
  onOptions: () => void;
};

export function ExerciseCard({
  exercise,
  previous,
  defaultReps,
  unit,
  currentSetId,
  onChangeSet,
  onToggleSet,
  onSetOptions,
  onAddSet,
  onOptions,
}: ExerciseCardProps) {
  const doneCount = exercise.sets.filter((set) => set.completed_at !== null).length;
  const allDone = exercise.sets.length > 0 && doneCount === exercise.sets.length;
  const labels = setLabels(exercise.sets.map((set) => set.type));

  return (
    <Card variant={allDone ? 'default' : 'outlined'} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <ThemedText type="heading" style={styles.title}>
            {exercise.name}
          </ThemedText>
          <ThemedText type="caption" tone={allDone ? 'accent' : 'secondary'}>
            {doneCount}/{exercise.sets.length} séries
          </ThemedText>
        </View>
        <Pressable
          onPress={onOptions}
          accessibilityRole="button"
          accessibilityLabel={`Options de ${exercise.name}`}
          accessibilityHint="Note, déplacer, remplacer ou retirer l'exercice"
          hitSlop={8}
          style={({ pressed }) => [styles.options, pressed && styles.pressed]}>
          <Ellipsis size={20} color={palette.textSecondary} strokeWidth={2} pointerEvents="none" />
        </Pressable>
      </View>

      {exercise.exercise_note && (
        <ThemedText type="caption" style={styles.note} accessibilityLabel={`Note : ${exercise.exercise_note}`}>
          {exercise.exercise_note}
        </ThemedText>
      )}

      <View style={styles.columns} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <ThemedText type="label" tone="tertiary" style={{ width: SET_COLUMNS.number }}>
          #
        </ThemedText>
        <ThemedText type="label" tone="tertiary" style={styles.previousColumn}>
          Précédent
        </ThemedText>
        <ThemedText type="label" tone="tertiary" style={[styles.center, { width: SET_COLUMNS.weight }]}>
          {unit}
        </ThemedText>
        <ThemedText type="label" tone="tertiary" style={[styles.center, { width: SET_COLUMNS.reps }]}>
          Reps
        </ThemedText>
        <View style={{ width: SET_COLUMNS.check }} />
      </View>

      <View style={styles.sets}>
        {exercise.sets.map((set, index) => (
          <SetRow
            // Remonte la ligne quand les valeurs enregistrées changent (ex. complétées à la validation)
            key={`${set.id}-${set.weight}-${set.reps}`}
            label={labels[index]}
            set={set}
            previous={previous[index]}
            defaultReps={defaultReps}
            unit={unit}
            isCurrent={set.id === currentSetId}
            onChange={(values) => onChangeSet(set, values)}
            onToggle={(entered) => onToggleSet(set, index, entered)}
            onOptions={() => onSetOptions(set, labels[index])}
          />
        ))}
      </View>

      <Button title="Ajouter une série" variant="ghost" icon={Plus} onPress={onAddSet} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 6,
  },
  headerText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
  },
  title: {
    flex: 1,
  },
  note: {
    marginTop: -4,
    paddingHorizontal: 6,
    fontStyle: 'italic',
  },
  options: {
    width: 32,
    height: 32,
    marginVertical: -6,
    marginRight: -4,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  columns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 6,
  },
  previousColumn: {
    flex: 1,
  },
  center: {
    textAlign: 'center',
  },
  sets: {
    gap: 6,
  },
});
