import { Plus } from 'lucide-react-native/icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/src/components/themed-text';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { SET_COLUMNS, SetRow } from '@/src/components/workout/set-row';
import { SetValues, WorkoutExercise, WorkoutSet } from '@/src/repositories/workout/workout-type';

type ExerciseCardProps = {
  exercise: WorkoutExercise;
  // Séries validées de la dernière séance avec cet exercice, dans l'ordre
  previous: SetValues[];
  defaultReps: number;
  currentSetId: number | null;
  onChangeSet: (set: WorkoutSet, values: SetValues) => void;
  onToggleSet: (set: WorkoutSet, index: number, entered: SetValues) => void;
  onDeleteSet: (set: WorkoutSet) => void;
  onAddSet: () => void;
};

export function ExerciseCard({
  exercise,
  previous,
  defaultReps,
  currentSetId,
  onChangeSet,
  onToggleSet,
  onDeleteSet,
  onAddSet,
}: ExerciseCardProps) {
  const doneCount = exercise.sets.filter((set) => set.completed_at !== null).length;
  const allDone = exercise.sets.length > 0 && doneCount === exercise.sets.length;

  return (
    <Card variant={allDone ? 'default' : 'outlined'} style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="heading" style={styles.title}>
          {exercise.name}
        </ThemedText>
        <ThemedText type="caption" tone={allDone ? 'accent' : 'secondary'}>
          {doneCount}/{exercise.sets.length} séries
        </ThemedText>
      </View>

      <View style={styles.columns} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <ThemedText type="label" tone="tertiary" style={{ width: SET_COLUMNS.number }}>
          #
        </ThemedText>
        <ThemedText type="label" tone="tertiary" style={styles.previousColumn}>
          Précédent
        </ThemedText>
        <ThemedText type="label" tone="tertiary" style={[styles.center, { width: SET_COLUMNS.weight }]}>
          kg
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
            index={index}
            set={set}
            previous={previous[index]}
            defaultReps={defaultReps}
            isCurrent={set.id === currentSetId}
            onChange={(values) => onChangeSet(set, values)}
            onToggle={(entered) => onToggleSet(set, index, entered)}
            onDelete={() => onDeleteSet(set)}
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
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 6,
  },
  title: {
    flex: 1,
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
