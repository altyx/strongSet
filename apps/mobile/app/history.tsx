import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WorkoutHistoryRow } from '@/src/components/history/workout-history-row';
import { ThemedText } from '@/src/components/themed-text';
import { palette, spacing } from '@/src/constants/theme';
import { WorkoutRepository } from '@/src/repositories/workout/workout-repository';
import { WorkoutSummary } from '@/src/repositories/workout/workout-type';

const HISTORY_LIMIT = 200;

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [workouts, setWorkouts] = useState<WorkoutSummary[]>([]);

  useFocusEffect(
    useCallback(() => {
      setWorkouts(WorkoutRepository.getHistory(HISTORY_LIMIT));
    }, []),
  );

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}
      data={workouts}
      keyExtractor={(workout) => String(workout.id)}
      renderItem={({ item }) => <WorkoutHistoryRow workout={item} />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        <View style={styles.empty}>
          <ThemedText type="heading">Aucune séance</ThemedText>
          <ThemedText type="caption">Vos séances terminées apparaîtront ici.</ThemedText>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    padding: spacing.xl,
  },
  separator: {
    height: spacing.sm,
  },
  empty: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.xxl * 2,
  },
});
