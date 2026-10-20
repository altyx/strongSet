import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/src/components/themed-text';
import { BarChart } from '@/src/components/ui/bar-chart';
import { ExerciseDescription } from '@/src/components/exercises/exercise-description';
import { Card } from '@/src/components/ui/card';
import { muscleLabel } from '@/src/constants/muscles';
import { palette, radius, spacing } from '@/src/constants/theme';
import {
  exerciseRecords,
  oneRepMaxChange,
  sessionStats,
  weekLabel,
  weeklyProgress,
  weekSpokenLabel,
} from '@/src/domain/progression';
import { ExerciseRepository } from '@/src/repositories/exercise/exercise-repository';
import { WorkoutRepository } from '@/src/repositories/workout/workout-repository';
import { formatShortDate } from '@/src/utils/date';
import { formatDecimal } from '@/src/utils/number';

const WEEKS = 8;

type Metric = 'force' | 'volume' | 'series';

function loadProgress(exerciseId: number) {
  const now = new Date();
  const sessions = WorkoutRepository.getExerciseSessions(exerciseId);
  const weeks = weeklyProgress(sessions, now, WEEKS);
  return {
    now,
    exercise: ExerciseRepository.getById(exerciseId),
    sessions,
    weeks,
    records: exerciseRecords(sessions),
    // Exercice sans charge (ex. tractions au poids du corps) : la force se suit en répétitions max
    bodyweight: sessions.every((session) => sessionStats(session.sets).bestOneRepMax === null),
    change: oneRepMaxChange(sessions, weeks[0].weekStart),
  };
}

const dateLabel = (timestamp: number) => formatShortDate(new Date(timestamp * 1000));
const formatSet = (weight: number | null, reps: number | null) =>
  weight === null ? `${reps} reps` : `${formatDecimal(weight)} × ${reps}`;

// Progression d'un exercice : courbe sur 8 semaines, records personnels et historique des séances
export default function ExerciseProgressScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [data] = useState(() => loadProgress(Number(id)));
  const [metric, setMetric] = useState<Metric>('force');

  const { now, exercise, sessions, weeks, records, bodyweight, change } = data;
  const title = exercise?.name ?? 'Exercice';

  const meta = exercise
    ? [exercise.equipment, exercise.muscles.map(muscleLabel).join(', ')].filter(Boolean).join(' · ')
    : '';
  const description = exercise?.description ? <ExerciseDescription description={exercise.description} /> : null;

  // Exercice jamais fait : la fiche montre seulement les consignes
  if (sessions.length === 0) {
    return (
      <View style={styles.screen}>
        <Stack.Screen options={{ title }} />
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}>
          {meta !== '' && <ThemedText type="caption">{meta}</ThemedText>}
          {description}
          <Card style={styles.emptyCard}>
            <ThemedText type="heading">Pas encore de séance</ThemedText>
            <ThemedText type="caption">
              La progression de cet exercice apparaîtra après votre première séance terminée.
            </ThemedText>
          </Card>
        </ScrollView>
      </View>
    );
  }

  const latest = weeks[weeks.length - 1];
  // Les séances sont de la plus récente à la plus ancienne : la première avec charge
  const lastOneRepMax =
    sessions.map((session) => sessionStats(session.sets).bestOneRepMax).find((value) => value !== null) ?? null;
  const chart = {
    force: bodyweight
      ? {
          label: 'Répétitions max',
          values: weeks.map((week) => week.maxReps),
          value: records.maxReps ? `${records.maxReps.reps} reps` : '—',
          delta: null as string | null,
        }
      : {
          label: '1RM estimé (dernière séance)',
          values: weeks.map((week) => week.oneRepMax),
          value: lastOneRepMax === null ? '—' : `${formatDecimal(lastOneRepMax)} kg`,
          delta: change === null ? null : `${change >= 0 ? '+' : ''}${formatDecimal(change)} kg en ${WEEKS} semaines`,
        },
    volume: {
      label: 'Volume cette semaine',
      values: weeks.map((week) => week.volume),
      value: `${formatDecimal(latest.volume)} kg`,
      delta: null,
    },
    series: {
      label: 'Séries cette semaine',
      values: weeks.map((week) => week.setCount),
      value: String(latest.setCount),
      delta: null,
    },
  }[metric];

  const tabs: { key: Metric; label: string }[] = [
    { key: 'force', label: bodyweight ? 'Reps' : 'Force' },
    ...(bodyweight ? [] : [{ key: 'volume' as const, label: 'Volume' }]),
    { key: 'series', label: 'Séries' },
  ];

  const recordTiles = [
    records.bestOneRepMax && { label: '1RM estimé', value: `${formatDecimal(records.bestOneRepMax.value)} kg`, at: records.bestOneRepMax.at },
    records.heaviestSet && { label: 'Charge max', value: `${formatSet(records.heaviestSet.weight, records.heaviestSet.reps)}`, at: records.heaviestSet.at },
    records.bestVolume && { label: 'Volume max (séance)', value: `${formatDecimal(records.bestVolume.value)} kg`, at: records.bestVolume.at },
    records.maxReps && { label: 'Répétitions max', value: `${records.maxReps.reps}`, at: records.maxReps.at },
  ].filter((tile): tile is { label: string; value: string; at: number } => Boolean(tile));

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title }} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}>
        {meta !== '' && <ThemedText type="caption">{meta}</ThemedText>}

        {tabs.length > 1 && (
          <View style={styles.tabs} accessibilityRole="tablist">
            {tabs.map((tab) => {
              const selected = tab.key === metric;
              return (
                <Pressable
                  key={tab.key}
                  onPress={() => setMetric(tab.key)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected }}
                  style={[styles.tab, selected && styles.tabSelected]}>
                  <ThemedText type="defaultSemiBold" tone={selected ? 'primary' : 'secondary'} style={styles.tabText}>
                    {tab.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        )}

        <Card style={styles.chartCard}>
          <View style={styles.metric}>
            <ThemedText type="caption">{chart.label}</ThemedText>
            {/* Valeur avec unité : pas de capitales (« kg », « reps ») */}
            <ThemedText type="display" style={styles.noUppercase}>{chart.value}</ThemedText>
            {chart.delta && (
              <ThemedText type="defaultSemiBold" tone="accent">
                {chart.delta}
              </ThemedText>
            )}
          </View>
          <BarChart
            values={chart.values}
            labels={weeks.map((week) => weekLabel(week.weekStart, now))}
            accessibilityLabel={`${chart.label} par semaine : ${chart.values
              .map(
                (value, index) =>
                  `${weekSpokenLabel(weeks[index].weekStart, now)}, ${value === null ? 'aucune séance' : formatDecimal(value)}`,
              )
              .join(' ; ')}`}
          />
        </Card>

        <View style={styles.section}>
          <ThemedText type="heading">Records personnels</ThemedText>
          <View style={styles.grid}>
            {recordTiles.map((tile) => (
              <View key={tile.label} style={styles.record}>
                <ThemedText type="caption">{tile.label}</ThemedText>
                <ThemedText type="metric">{tile.value}</ThemedText>
                <ThemedText type="caption" tone="tertiary">
                  {dateLabel(tile.at)}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        {description}

        <View style={styles.section}>
          <ThemedText type="heading">Historique</ThemedText>
          {sessions.map((session, index) => {
            const stats = sessionStats(session.sets);
            return (
              <View key={`${session.workout_id}-${index}`} style={styles.historyRow}>
                <View style={styles.flex}>
                  <ThemedText type="defaultSemiBold">{dateLabel(session.started_at)}</ThemedText>
                  <ThemedText type="caption" numberOfLines={1}>
                    {session.sets.map((set) => formatSet(set.weight, set.reps)).join(' · ')}
                  </ThemedText>
                </View>
                <ThemedText type="metric" style={styles.historyBest}>
                  {stats.topSet ? formatSet(stats.topSet.weight, stats.topSet.reps) : `${stats.maxReps} reps`}
                </ThemedText>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
  },
  emptyCard: {
    gap: spacing.sm,
    padding: spacing.xl,
  },
  content: {
    gap: spacing.xxl,
    padding: spacing.xl,
  },
  tabs: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    borderRadius: radius.md,
    backgroundColor: palette.surface,
  },
  tab: {
    flex: 1,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabSelected: {
    backgroundColor: palette.border,
  },
  tabText: {
    fontSize: 14,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  record: {
    flexBasis: '47%',
    flexGrow: 1,
    gap: 6,
    padding: 14,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
  },
  flex: {
    flex: 1,
    gap: 2,
  },
  historyBest: {
    fontSize: 20,
    lineHeight: 24,
  },
});
