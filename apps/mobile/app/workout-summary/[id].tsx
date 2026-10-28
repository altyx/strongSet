import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Pencil, Trash2, Trophy } from 'lucide-react-native/icons';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/src/components/themed-text';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { StatTile } from '@/src/components/ui/stat-tile';
import { muscleLabel } from '@/src/constants/muscles';
import { SET_TYPE_INFO, setLabels } from '@/src/constants/set-types';
import { fontFamily, palette, radius, spacing, typography } from '@/src/constants/theme';
import { findWeightRecords, setsPerMuscle, summarizeWorkout, volumeChange } from '@/src/domain/workout-summary';
import { ExerciseRepository } from '@/src/repositories/exercise/exercise-repository';
import { WorkoutRepository } from '@/src/repositories/workout/workout-repository';
import { Workout } from '@/src/repositories/workout/workout-type';
import { formatLongDate } from '@/src/utils/date';
import { formatDuration } from '@/src/utils/duration';
import { useDistanceUnit } from '@/src/hooks/user/use-distance-unit';
import { useWeightUnit } from '@/src/hooks/user/use-weight-unit';
import { formatSetValues } from '@/src/utils/set-format';
import { formatWeight, formatWeightValue } from '@/src/utils/weight';

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
  const unit = useWeightUnit();
  const distanceUnit = useDistanceUnit();
  const [workout, setWorkout] = useState(() => WorkoutRepository.getWorkout(Number(id)));
  const [summary, setSummary] = useState(() => (workout ? loadSummary(workout) : null));
  const [note, setNote] = useState(workout?.note ?? '');

  // Recharge au retour de la modification de la séance ; si elle a été supprimée entre-temps, on quitte l'écran
  useFocusEffect(
    useCallback(() => {
      const updated = WorkoutRepository.getWorkout(Number(id));
      if (!updated) {
        router.back();
        return;
      }
      setWorkout(updated);
      setSummary(loadSummary(updated));
    }, [id]),
  );

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

  const editWorkout = () => {
    saveNote();
    router.push({ pathname: '/workout', params: { id: workout.id } });
  };

  const deleteWorkout = () => {
    Alert.alert('Supprimer la séance ?', 'Ses séries seront retirées de l’historique, des records et de la progression.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => {
          WorkoutRepository.discardWorkout(workout.id);
          router.back();
        },
      },
    ]);
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
            <StatTile label="Volume" value={formatWeightValue(stats.volume, unit)} suffix={unit} />
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
                    Charge max · {formatWeight(record.weight, unit)} × {record.reps}
                  </ThemedText>
                </View>
                <ThemedText type="metric" tone="accent" style={styles.recordDelta}>
                  +{formatWeight(record.weight - record.previousBest, unit)}
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
          {workout.exercises.map((exercise) => {
            const labels = setLabels(exercise.sets.map((set) => set.type));
            return (
              <Card key={exercise.id} style={styles.exercise}>
                <ThemedText type="defaultSemiBold">{exercise.name}</ThemedText>
                {exercise.sets.map((set, index) => (
                  <View key={set.id} style={styles.setLine}>
                    <ThemedText
                      type="caption"
                      style={[styles.setNumber, SET_TYPE_INFO[set.type].color !== null && { color: SET_TYPE_INFO[set.type].color! }]}
                      accessibilityLabel={set.type === 'normal' ? undefined : SET_TYPE_INFO[set.type].label}>
                      {labels[index]}
                    </ThemedText>
                    <ThemedText style={styles.setValue}>
                      {formatSetValues(set, unit, distanceUnit, true)}
                    </ThemedText>
                  </View>
                ))}
              </Card>
            );
          })}
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

        <View style={styles.actions}>
          <Button title="Modifier la séance" variant="secondary" icon={Pencil} onPress={editWorkout} />
          <Button title="Supprimer la séance" variant="ghost" icon={Trash2} onPress={deleteWorkout} />
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
  actions: {
    gap: spacing.sm,
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
