import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/src/components/themed-text';
import { muscleLabel } from '@/src/constants/muscles';
import { fontFamily, palette, radius } from '@/src/constants/theme';
import { ExerciseListItem } from '@/src/repositories/exercise/exercise-repository';
import { useWeightUnit } from '@/src/hooks/user/use-weight-unit';
import { initials } from '@/src/utils/text';
import { formatWeight, spokenWeight } from '@/src/utils/weight';

type ExerciseRowProps = {
  exercise: ExerciseListItem;
  // Charge maximale validée en séance, en kg ; absente si l'exercice n'a jamais été fait avec charge
  bestWeight?: number;
};

export function ExerciseRow({ exercise, bestWeight }: ExerciseRowProps) {
  const unit = useWeightUnit();
  const meta = [exercise.equipment, exercise.muscles.map(muscleLabel).join(', ')].filter(Boolean).join(' · ');

  return (
    <View style={styles.row}>
      <View style={styles.badge}>
        <ThemedText style={styles.badgeText} tone="accent">
          {initials(exercise.name)}
        </ThemedText>
      </View>
      <View style={styles.info}>
        <ThemedText type="defaultSemiBold" numberOfLines={1}>
          {exercise.name}
        </ThemedText>
        {meta !== '' && (
          <ThemedText type="caption" numberOfLines={1}>
            {meta}
          </ThemedText>
        )}
      </View>
      {bestWeight !== undefined && (
        <View style={styles.record} accessible accessibilityLabel={`Record : ${spokenWeight(bestWeight, unit)}`}>
          <ThemedText style={styles.recordValue}>{formatWeight(bestWeight, unit)}</ThemedText>
          <ThemedText type="caption" tone="tertiary" style={styles.recordLabel}>
            record
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.accentSoft,
  },
  badgeText: {
    fontFamily: fontFamily.displayBold,
    fontSize: 18,
    lineHeight: 22,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  record: {
    alignItems: 'flex-end',
  },
  recordValue: {
    fontFamily: fontFamily.displaySemibold,
    fontSize: 18,
    lineHeight: 22,
  },
  recordLabel: {
    fontSize: 11,
    lineHeight: 14,
  },
});
