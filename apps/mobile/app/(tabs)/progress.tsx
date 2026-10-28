import { router, useFocusEffect } from 'expo-router';
import { ChevronRight } from 'lucide-react-native/icons';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/src/components/themed-text';
import { BarChart } from '@/src/components/ui/bar-chart';
import { Card } from '@/src/components/ui/card';
import { palette, radius, spacing } from '@/src/constants/theme';
import {
  cardioStats,
  lastWeeks,
  oneRepMaxChange,
  sessionStats,
  toCardioValues,
  weekLabel,
  weeklyTotals,
  weekSpokenLabel,
} from '@/src/domain/progression';
import { WorkoutRepository } from '@/src/repositories/workout/workout-repository';
import { formatShortDate, toTimestamp } from '@/src/utils/date';
import { useWeightUnit } from '@/src/hooks/user/use-weight-unit';
import { formatSetValues } from '@/src/utils/set-format';
import { formatWeight, spokenWeight, WeightUnit } from '@/src/utils/weight';

const WEEKS = 8;
const HISTORY_LIMIT = 500;

type TrainedExercise = {
  id: number;
  name: string;
  lastDone: number;
  // Meilleure série de la dernière séance, ex. « 80 × 5 »
  lastBest: string;
  // Évolution du 1RM estimé sur la période, en kg ; null si pas assez de séances chargées
  change: number | null;
};

function loadProgress(unit: WeightUnit) {
  const now = new Date();
  const since = toTimestamp(lastWeeks(now, WEEKS)[0]);
  const history = WorkoutRepository.getHistory(HISTORY_LIMIT);
  const weeks = weeklyTotals(
    history.map((workout) => ({ timestamp: workout.started_at, value: workout.volume })),
    now,
    WEEKS,
  );
  const exercises: TrainedExercise[] = WorkoutRepository.getTrainedExercises().map((exercise) => {
    const sessions = WorkoutRepository.getExerciseSessions(exercise.id);
    const lastSets = sessions[0]?.sets ?? [];
    const last = sessionStats(lastSets);
    const cardio = cardioStats(lastSets);
    return {
      id: exercise.id,
      name: exercise.name,
      lastDone: exercise.last_done,
      lastBest:
        cardio.durationSeconds > 0
          ? formatSetValues({ weight: null, reps: null, ...toCardioValues(cardio) }, unit)
          : last.topSet
            ? formatSetValues(last.topSet, unit)
            : `${last.maxReps} reps`,
      change: oneRepMaxChange(sessions, since),
    };
  });
  return {
    now,
    weeks,
    sessionsThisPeriod: history.filter((workout) => workout.started_at >= since).length,
    exercises,
  };
}

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const unit = useWeightUnit();
  const [data, setData] = useState<ReturnType<typeof loadProgress> | null>(null);

  // Recharge au retour sur l'onglet : une séance a pu être terminée, ou l'unité changée, entre-temps
  useFocusEffect(
    useCallback(() => {
      setData(loadProgress(unit));
    }, [unit]),
  );

  if (!data) {
    return null;
  }

  const current = data.weeks[data.weeks.length - 1].total;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">Progrès</ThemedText>

        {data.exercises.length === 0 ? (
          <Card style={styles.emptyCard}>
            <ThemedText type="heading">Pas encore de données</ThemedText>
            <ThemedText type="caption">
              Terminez une première séance : vos records et votre progression apparaîtront ici.
            </ThemedText>
          </Card>
        ) : (
          <>
            <Card style={styles.chartCard}>
              <View style={styles.metric}>
                <ThemedText type="caption">Volume cette semaine</ThemedText>
                {/* Valeur avec unité : pas de capitales */}
                <ThemedText type="display" style={styles.noUppercase}>{formatWeight(current, unit)}</ThemedText>
                <ThemedText type="caption">
                  {data.sessionsThisPeriod} {data.sessionsThisPeriod > 1 ? 'séances' : 'séance'} en {WEEKS} semaines
                </ThemedText>
              </View>
              <BarChart
                values={data.weeks.map((week) => week.total)}
                labels={data.weeks.map((week) => weekLabel(week.weekStart, data.now))}
                accessibilityLabel={`Volume par semaine : ${data.weeks
                  .map((week) => `${weekSpokenLabel(week.weekStart, data.now)}, ${spokenWeight(week.total, unit)}`)
                  .join(' ; ')}`}
              />
            </Card>

            <View style={styles.section}>
              <ThemedText type="heading">Par exercice</ThemedText>
              {data.exercises.map((exercise) => (
                <Pressable
                  key={exercise.id}
                  onPress={() => router.push({ pathname: '/exercise/[id]', params: { id: exercise.id } })}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
                  <View style={styles.flex}>
                    <ThemedText type="defaultSemiBold" numberOfLines={1}>
                      {exercise.name}
                    </ThemedText>
                    <ThemedText type="caption" numberOfLines={1}>
                      {formatShortDate(new Date(exercise.lastDone * 1000))} · {exercise.lastBest}
                    </ThemedText>
                  </View>
                  {exercise.change !== null && exercise.change !== 0 && (
                    <ThemedText
                      type="defaultSemiBold"
                      tone={exercise.change > 0 ? 'accent' : 'secondary'}
                      accessibilityLabel={`1RM estimé ${exercise.change > 0 ? 'en hausse' : 'en baisse'} de ${spokenWeight(Math.abs(exercise.change), unit)}`}>
                      {exercise.change > 0 ? '+' : ''}
                      {formatWeight(exercise.change, unit)}
                    </ThemedText>
                  )}
                  <ChevronRight size={20} color={palette.textTertiary} strokeWidth={2} pointerEvents="none" />
                </Pressable>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    gap: spacing.xxl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  emptyCard: {
    gap: spacing.sm,
    padding: spacing.xl,
  },
  chartCard: {
    gap: 18,
    padding: 18,
  },
  noUppercase: {
    textTransform: 'none',
  },
  metric: {
    gap: 4,
  },
  section: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: 14,
    paddingLeft: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
  },
  pressed: {
    opacity: 0.8,
  },
  flex: {
    flex: 1,
    gap: 2,
  },
});
