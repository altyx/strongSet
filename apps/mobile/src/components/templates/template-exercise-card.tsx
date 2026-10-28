import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react-native/icons';
import { StyleSheet, View } from 'react-native';

import { RestPicker } from '@/src/components/templates/rest-picker';
import { ThemedText } from '@/src/components/themed-text';
import { Card } from '@/src/components/ui/card';
import { IconButton } from '@/src/components/ui/icon-button';
import { Stepper } from '@/src/components/ui/stepper';
import { DraftExercise } from '@/src/domain/template-draft';

type TemplateExerciseCardProps = {
  exercise: DraftExercise;
  index: number;
  count: number;
  onChange: (exercise: DraftExercise) => void;
  onMove: (delta: number) => void;
  onRemove: () => void;
};

export function TemplateExerciseCard({ exercise, index, count, onChange, onMove, onRemove }: TemplateExerciseCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="heading" style={styles.title} numberOfLines={2}>
          {index + 1}. {exercise.name}
        </ThemedText>
        <View style={styles.actions}>
          {index > 0 && (
            <IconButton icon={ChevronUp} accessibilityLabel={`Monter ${exercise.name}`} onPress={() => onMove(-1)} />
          )}
          {index < count - 1 && (
            <IconButton icon={ChevronDown} accessibilityLabel={`Descendre ${exercise.name}`} onPress={() => onMove(1)} />
          )}
          <IconButton icon={Trash2} accessibilityLabel={`Retirer ${exercise.name}`} onPress={onRemove} />
        </View>
      </View>
      <View style={styles.steppers}>
        <Stepper
          label="Séries"
          value={exercise.target_sets}
          max={10}
          onChange={(target_sets) => onChange({ ...exercise, target_sets })}
        />
        {/* Cardio : la durée et la distance se saisissent en séance, pas de répétitions visées */}
        {exercise.tracking !== 'duration_distance' && (
          <Stepper
            label="Répétitions"
            value={exercise.target_reps}
            max={50}
            onChange={(target_reps) => onChange({ ...exercise, target_reps })}
          />
        )}
      </View>
      <RestPicker value={exercise.rest_seconds} onChange={(rest_seconds) => onChange({ ...exercise, rest_seconds })} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  steppers: {
    flexDirection: 'row',
    gap: 20,
  },
});
