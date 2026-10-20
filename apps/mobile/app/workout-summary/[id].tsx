import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Trophy } from 'lucide-react-native/icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/src/components/themed-text';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { StatTile } from '@/src/components/ui/stat-tile';
import { muscleLabel } from '@/src/constants/muscles';
import { fontFamily, palette, radius, spacing, typography } from '@/src/constants/theme';
import { findWeightRecords, setsPerMuscle, summarizeWorkout, volumeChange } from '@/src/domain/workout-summary';
import { ExerciseRepository } from '@/src/repositories/exercise/exercise-repository';
import { WorkoutRepository } from '@/src/repositories/workout/workout-repository';
import { Workout } from '@/src/repositories/workout/workout-type';
import { formatLongDate } from '@/src/utils/date';
import { formatDuration } from '@/src/utils/duration';
import { formatDecimal } from '@/src/utils/number';

function loadSummary(workout: Workout) {
  const exerciseIds = workout.exercises.flatMap((exercise) => (exercise.exercise_id === null ? [] : [exercise.exercise_id]));
  const previous =
    workout.template_id === null ? null : WorkoutRepository.getPreviousOfTemplate(workout.template_id, workout.started_at);
  const stats = summarizeWorkout(workout);
  return {
    stats,
    change: volumeChange(stats.volume, previous?.volume),
    records: findWeightRecords(workout, WorkoutRepository.getBestWeightsBefore(exerciseIds, workout.started_at)),
    muscles: setsPerMuscle(workout, ExerciseRepository.getMusclesByExercise(exerciseIds)),
  };
}

/**
 * Récap d'une séance terminée. Ouvert avec `finished=1` juste après « Terminer » (écran de fin, sans en-tête),
 * sinon depuis l'historique (en-tête de navigation avec retour).
 */
export default function WorkoutSummaryScreen() {
  const { id, finished } = useLocalSearchParams<{ id: string; finished?: string }>();
  const justFinished = finished === '1';
  const insets = useSafeAreaInsets();
  const [workout] = useState(() => WorkoutRepository.getWorkout(Number(id)));
  const [summary] = useState(() => (workout ? loadSummary(workout) : null));
  const [note, setNote] = useState(workout?.note ?? '');

  if (!workout || !summary) {
    return (
      <View style={[styles.screen, styles.empty]}>
        <Stack.Screen options={{ headerShown: true, title: '' }} />
        <ThemedText type="caption">Séance introuvable.</ThemedText>
      </View>
    );
  }

  const { stats, change, records, muscles } = summary;
  const maxMuscleSets = Math.max(1, ...muscles.map((muscle) => muscle.sets));
  const date = formatLongDate(new Date(workout.started_at * 1000));
  const saveNote = () => {
    const trimmed = note.trim();
    WorkoutRepository.updateNote(workout.id, trimmed === '' ? null : trimmed);
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: !justFinished, title: '', headerBackTitle: 'Retour' }} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: justFinished ? insets.top + spacing.xxl : spacing.lg, paddingBottom: insets.bottom + 120 },
        ]}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets>
        {justFinished ? (
          <View style={styles.hero}>
            <View style={styles.trophy}>
              <Trophy size={34} color={palette.accent} strokeWidth={2} />
            </View>
            <ThemedText type="display" style={styles.center}>
              Séance terminée
            </ThemedText>
            <ThemedText type="caption" style={styles.center}>
              {[workout.name, date, records.length > 0 && `${records.length} ${records.length > 1 ? 'records battus' : 'record battu'}`]
                .filter(Boolean)
                .join(' · ')}
            </ThemedText>
          </View>
        ) : (
          <View style={styles.heading}>
            <ThemedText type="label">{date}</ThemedText>
            <ThemedText type="display">{workout.name ?? 'Séance'}</ThemedText>
          </View>
        )}

        <View style={styles.grid}>
          <View style={styles.row}>
            <StatTile label="Durée" value={formatDuration(stats.durationSeconds)} />
            <StatTile label="Volume" value={formatDecimal(stats.volume)} suffix="kg" />
          </View>
          <View style={styles.row}>
            <StatTile label="Séries" value={String(stats.completedSetCount)} />
            {change === null ? (
              <StatTile label="Exercices" value={String(stats.exerciseCount)} />
            ) : (
              <StatTile label="Volume vs dernière fois" value={`${change > 0 ? '+' : ''}${change} %`} />
            )}
          </View>
        </View>

        {records.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="heading">Records battus</ThemedText>
            {records.map((record) => (
              <View key={record.exerciseName} style={styles.record}>
                <View style={styles.recordBadge}>
                  <ThemedText style={styles.recordBadgeText} tone="onAccent">
                    PR
                  </ThemedText>
                </View>
                <View style={styles.flex}>
                  <ThemedText type="defaultSemiBold">{record.exerciseName}</ThemedText>
                  <ThemedText type="caption">
                    Charge max · {formatDecimal(record.weight)} kg × {record.reps}
                  </ThemedText>
                </View>
                <ThemedText type="metric" tone="accent" style={styles.recordDelta}>
                  +{formatDecimal(record.weight - record.previousBest)} kg
                </ThemedText>
              </View>
            ))}
          </View>
        )}

        {muscles.length > 0 && (
          <Card style={styles.section}>
            <ThemedText type="heading">Muscles travaillés</ThemedText>
            {muscles.map((muscle) => (
              <View key={muscle.muscle} style={styles.muscle}>
                <View style={styles.muscleLabels}>
                  <ThemedText type="defaultSemiBold">{muscleLabel(muscle.muscle)}</ThemedText>
                  <ThemedText type="caption">
                    {muscle.sets} {muscle.sets > 1 ? 'séries' : 'série'}
                  </ThemedText>
                </View>
                <View style={styles.track}>
                  <View style={[styles.bar, { width: `${(muscle.sets / maxMuscleSets) * 100}%` }]} />
                </View>
              </View>
            ))}
          </Card>
        )}

        <View style={styles.section}>
          <ThemedText type="heading">Détail</ThemedText>
          {workout.exercises.map((exercise) => (
            <Card key={exercise.id} style={styles.exercise}>
              <ThemedText type="defaultSemiBold">{exercise.name}</ThemedText>
              {exercise.sets.map((set, index) => (
                <View key={set.id} style={styles.setLine}>
                  <ThemedText type="caption" style={styles.setNumber}>
                    {index + 1}
                  </ThemedText>
                  <ThemedText style={styles.setValue}>
                    {set.weight === null ? `${set.reps} reps` : `${formatDecimal(set.weight)} kg × ${set.reps}`}
                  </ThemedText>
                </View>
              ))}
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText type="label">Note sur la séance</ThemedText>
          <TextInput
            value={note}
            onChangeText={setNote}
            onEndEditing={saveNote}
            placeholder="Sensations, douleurs, réglages à retenir…"
            placeholderTextColor={palette.textTertiary}
            multiline
            accessibilityLabel="Note sur la séance"
            style={styles.note}
          />
        </View>
      </ScrollView>

      {justFinished && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <Button
            title="Fermer"
            onPress={() => {
              saveNote();
              router.back();
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    gap: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.md,
  },
  trophy: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.accentSoft,
  },
  center: {
    textAlign: 'center',
  },
  heading: {
    gap: spacing.xs,
  },
  grid: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  section: {
    gap: spacing.md,
  },
  record: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 90, 31, 0.35)',
    backgroundColor: palette.surface,
  },
  recordBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.accent,
  },
  recordBadgeText: {
    fontFamily: fontFamily.displayBold,
    fontSize: 15,
  },
  recordDelta: {
    fontSize: 20,
    lineHeight: 24,
  },
  flex: {
    flex: 1,
    gap: 2,
  },
  muscle: {
    gap: 6,
  },
  muscleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: palette.surfaceRaised,
  },
  bar: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: palette.accent,
  },
  exercise: {
    gap: spacing.sm,
  },
  setLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  setNumber: {
    width: 20,
  },
  setValue: {
    fontFamily: fontFamily.displaySemibold,
    fontSize: 18,
    fontVariant: ['tabular-nums'],
  },
  note: {
    ...typography.body,
    minHeight: 88,
    padding: spacing.lg,
    paddingTop: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    color: palette.text,
    textAlignVertical: 'top',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: palette.surfaceRaised,
    backgroundColor: palette.background,
  },
});
