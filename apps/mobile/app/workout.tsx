import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ChevronDown } from 'lucide-react-native/icons';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/src/components/themed-text';
import { ElapsedTime } from '@/src/components/workout/elapsed-time';
import { ExerciseCard } from '@/src/components/workout/exercise-card';
import { RestTimer } from '@/src/components/workout/rest-timer';
import { palette, radius, spacing } from '@/src/constants/theme';
import { resolveSetValues } from '@/src/domain/workout-plan';
import { useUserSettings } from '@/src/hooks/user/use-user-settings';
import { WorkoutRepository } from '@/src/repositories/workout/workout-repository';
import { SetValues, Workout, WorkoutSet } from '@/src/repositories/workout/workout-type';

const DEFAULT_REST_SECONDS = 90;
const DEFAULT_REPS = 10;

// Dernières performances par exercice de séance (id de workout_exercises), lues une fois à l'ouverture
function loadPreviousSets(workout: Workout | null) {
  const previous = new Map<number, SetValues[]>();
  workout?.exercises.forEach((exercise) => {
    previous.set(exercise.id, exercise.exercise_id === null ? [] : WorkoutRepository.getLastPerformance(exercise.exercise_id));
  });
  return previous;
}

export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  const { getPreferences } = useUserSettings();
  const preferences = getPreferences();
  const restSeconds = preferences?.restBetweenSeries ?? DEFAULT_REST_SECONDS;
  const defaultReps = preferences?.repPerSeries ?? DEFAULT_REPS;

  const [workout, setWorkout] = useState(() => WorkoutRepository.getActiveWorkout());
  const [previousSets] = useState(() => loadPreviousSets(workout));
  const [rest, setRest] = useState<{ endsAt: number; duration: number } | null>(null);

  const reload = () => setWorkout(WorkoutRepository.getActiveWorkout());

  // Pas de séance en cours (terminée ailleurs) : retour à l'accueil
  useEffect(() => {
    if (!workout) {
      router.back();
    }
  }, [workout]);

  const endRest = useCallback(() => setRest(null), []);

  if (!workout) {
    return null;
  }

  const allSets = workout.exercises.flatMap((exercise) => exercise.sets);
  const doneCount = allSets.filter((set) => set.completed_at !== null).length;
  const currentSetId = allSets.find((set) => set.completed_at === null)?.id ?? null;

  const changeSet = (set: WorkoutSet, values: SetValues) => {
    WorkoutRepository.updateSet(set.id, values);
    reload();
  };

  const toggleSet = (set: WorkoutSet, entered: SetValues, previous: SetValues | undefined) => {
    if (set.completed_at !== null) {
      WorkoutRepository.setCompleted(set.id, false);
      reload();
      return;
    }

    const values = resolveSetValues(entered, previous, defaultReps);    if (!values) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    WorkoutRepository.updateSet(set.id, values);
    WorkoutRepository.setCompleted(set.id, true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRest({ endsAt: Date.now() + restSeconds * 1000, duration: restSeconds });
    reload();
  };

  const deleteSet = (set: WorkoutSet) => {
    Alert.alert('Supprimer la série ?', undefined, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => {
          WorkoutRepository.deleteSet(set.id);
          reload();
        },
      },
    ]);
  };

  const addSet = (workoutExerciseId: number) => {
    WorkoutRepository.addSet(workoutExerciseId, { weight: null, reps: null });
    reload();
  };

  const finish = () => {
    const pending = allSets.length - doneCount;
    Alert.alert(
      'Terminer la séance ?',
      doneCount === 0
        ? "Aucune série n'est validée : la séance ne sera pas enregistrée."
        : pending > 0
          ? `${pending} ${pending > 1 ? 'séries non validées ne seront pas enregistrées' : 'série non validée ne sera pas enregistrée'}.`
          : undefined,
      [
        { text: 'Continuer', style: 'cancel' },
        {
          text: 'Abandonner',
          style: 'destructive',
          onPress: () => {
            WorkoutRepository.discardWorkout(workout.id);
            router.back();
          },
        },
        {
          text: 'Terminer',
          onPress: () => {
            const saved = WorkoutRepository.finishWorkout(workout.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            // TODO: ouvrir le récap de séance (étape 3 du plan) au lieu de revenir à l'accueil
            router.back();
            if (!saved) {
              Alert.alert('Séance non enregistrée', "Aucune série n'avait été validée.");
            }
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Réduire la séance"
          accessibilityHint="La séance continue, vous pourrez la reprendre depuis l'accueil"
          hitSlop={4}
          style={styles.headerButton}>
          <ChevronDown size={24} color={palette.text} strokeWidth={2} pointerEvents="none" />
        </Pressable>
        <View style={styles.headerTitle}>
          <ThemedText type="label" numberOfLines={1}>
            {workout.name ?? 'Séance'}
          </ThemedText>
          <ElapsedTime startedAt={workout.started_at} />
        </View>
        <Pressable
          onPress={finish}
          accessibilityRole="button"
          style={({ pressed }) => [styles.finishButton, pressed && styles.pressed]}>
          <ThemedText type="defaultSemiBold" tone="onAccent">
            Terminer
          </ThemedText>
        </Pressable>
      </View>

      <View style={styles.progress}>
        <View style={styles.progressLabels}>
          <ThemedText type="caption">
            {workout.exercises.length} {workout.exercises.length > 1 ? 'exercices' : 'exercice'}
          </ThemedText>
          <ThemedText type="caption">
            {doneCount} / {allSets.length} séries
          </ThemedText>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressBar, { width: `${allSets.length ? (doneCount / allSets.length) * 100 : 0}%` }]}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: (rest ? 140 : spacing.xxl) + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets>
        {workout.exercises.map((exercise) => {
          const previous = previousSets.get(exercise.id) ?? [];
          return (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              previous={previous}
              defaultReps={defaultReps}
              currentSetId={currentSetId}
              onChangeSet={changeSet}
              onToggleSet={(set, index, entered) => toggleSet(set, entered, previous[index])}
              onDeleteSet={deleteSet}
              onAddSet={() => addSet(exercise.id)}
            />
          );
        })}
      </ScrollView>

      {rest && (
        <View style={[styles.restTimer, { bottom: insets.bottom + spacing.md }]}>
          <RestTimer
            endsAt={rest.endsAt}
            duration={rest.duration}
            onAdjust={(delta) =>
              setRest((current) => current && { endsAt: current.endsAt + delta * 1000, duration: Math.max(current.duration + delta, 1) })
            }
            onEnd={endRest}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  finishButton: {
    height: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: 22,
    justifyContent: 'center',
    backgroundColor: palette.accent,
  },
  pressed: {
    opacity: 0.85,
  },
  progress: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: palette.surfaceRaised,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: palette.accent,
  },
  content: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  restTimer: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    borderRadius: radius.xl,
  },
});
