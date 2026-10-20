import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native/icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/src/components/themed-text';
import { fontFamily, palette, radius } from '@/src/constants/theme';
import { WorkoutSummary } from '@/src/repositories/workout/workout-type';
import { formatShortDate } from '@/src/utils/date';
import { formatMinutes } from '@/src/utils/duration';
import { formatDecimal } from '@/src/utils/number';

// Une séance terminée ; ouvre son récap
export function WorkoutHistoryRow({ workout }: { workout: WorkoutSummary }) {
  const date = new Date(workout.started_at * 1000);
  const details = [
    formatMinutes(workout.finished_at - workout.started_at),
    workout.volume > 0 && `${formatDecimal(workout.volume)} kg`,
    `${workout.completed_set_count} ${workout.completed_set_count > 1 ? 'séries' : 'série'}`,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/workout-summary/[id]', params: { id: workout.id } })}
      accessibilityRole="button"
      accessibilityLabel={`${workout.name ?? 'Séance'}, ${date.toLocaleDateString('fr-FR', { dateStyle: 'full' })}, ${details}`}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.date}>
        <ThemedText style={styles.day}>{date.getDate()}</ThemedText>
        <ThemedText type="caption">{formatShortDate(date).split(' ')[0]}</ThemedText>
      </View>
      <View style={styles.info}>
        <ThemedText type="defaultSemiBold" numberOfLines={1}>
          {workout.name ?? 'Séance'}
        </ThemedText>
        <ThemedText type="caption" numberOfLines={1}>
          {details}
        </ThemedText>
      </View>
      <ChevronRight size={20} color={palette.textTertiary} strokeWidth={2} pointerEvents="none" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 18,
    backgroundColor: palette.surface,
  },
  pressed: {
    opacity: 0.8,
  },
  date: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surfaceRaised,
  },
  day: {
    fontFamily: fontFamily.displayBold,
    fontSize: 20,
    lineHeight: 22,
  },
  info: {
    flex: 1,
    gap: 2,
  },
});
