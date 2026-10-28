import * as Haptics from 'expo-haptics';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronDown, Plus } from 'lucide-react-native/icons';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExercisePicker } from '@/src/components/templates/exercise-picker';
import { ThemedText } from '@/src/components/themed-text';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { ElapsedTime } from '@/src/components/workout/elapsed-time';
import { ExerciseCard } from '@/src/components/workout/exercise-card';
import { ExerciseOptionsSheet } from '@/src/components/workout/exercise-options-sheet';
import { SetOptionsSheet } from '@/src/components/workout/set-options-sheet';
import { RestTimer } from '@/src/components/workout/rest-timer';
import { palette, radius, spacing } from '@/src/constants/theme';
import { buildWorkoutExercise, resolveSetValues } from '@/src/domain/workout-plan';
import { useUserSettings } from '@/src/hooks/user/use-user-settings';
import { useWeightUnit } from '@/src/hooks/user/use-weight-unit';
import { ExerciseListItem, ExerciseRepository } from '@/src/repositories/exercise/exercise-repository';
import { WorkoutRepository } from '@/src/repositories/workout/workout-repository';
import { SetType, SetValues, Workout, WorkoutExercise, WorkoutSet } from '@/src/repositories/workout/workout-type';
import { cancelRestEnd, scheduleRestEnd } from '@/src/services/rest-notification';
import { formatLongDate } from '@/src/utils/date';

const DEFAULT_REST_SECONDS = 90;
const DEFAULT_REPS = 10;
const DEFAULT_SET_COUNT = 3;

const KEEP_AWAKE_TAG = 'workout';

/**
 * Dernières performances par exercice de séance (id de workout_exercises), lues à l'ouverture.
 * En modification, seules les séances antérieures comptent.
 */
function loadPreviousSets(workout: Workout | null, editing: boolean) {
  const previous = new Map<number, SetValues[]>();
  workout?.exercises.forEach((exercise) => {
    previous.set(
      exercise.id,
      exercise.exercise_id === null
        ? []
        : WorkoutRepository.getLastPerformance(exercise.exercise_id, editing ? workout.started_at : undefined),
    );
  });
  return previous;
}

/**
 * Séance en cours, ou modification d'une séance terminée quand l'écran est ouvert avec `id`.
 * Les modifications sont enregistrées au fur et à mesure ; « Enregistrer » ne fait que le ménage final.
 */
export default function WorkoutScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const editing = id !== undefined;
  const insets = useSafeAreaInsets();
  const unit = useWeightUnit();
  const { getPreferences } = useUserSettings();
  const preferences = getPreferences();
  const restSeconds = preferences?.restBetweenSeries ?? DEFAULT_REST_SECONDS;
  const defaultReps = preferences?.repPerSeries ?? DEFAULT_REPS;
  const defaultSetCount = preferences?.seriesPerExercise ?? DEFAULT_SET_COUNT;

  const load = () => (editing ? WorkoutRepository.getWorkout(Number(id)) : WorkoutRepository.getActiveWorkout());
  const [workout, setWorkout] = useState(load);
  const [previousSets, setPreviousSets] = useState(() => loadPreviousSets(workout, editing));
  const [optionsFor, setOptionsFor] = useState<WorkoutExercise | null>(null);
  // Série dont on choisit le type (feuille ouverte en touchant son numéro)
  const [setSheet, setSetSheet] = useState<{ set: WorkoutSet; label: string } | null>(null);
  const [rest, setRest] = useState<{ endsAt: number; duration: number } | null>(null);
  // Choix d'un exercice : ajout en fin de séance, ou remplacement de `replacing`
  const [pickerVisible, setPickerVisible] = useState(false);
  const [replacing, setReplacing] = useState<WorkoutExercise | null>(null);
  const openPicker = (exercise: WorkoutExercise | null) => {
    setReplacing(exercise);
    setPickerVisible(true);
  };

  const reload = () => setWorkout(load());

  // Après ajout, remplacement ou retrait d'exercice : la colonne « Précédent » suit les nouveaux exercices
  const reloadExercises = () => {
    const updated = load();
    setWorkout(updated);
    setPreviousSets(loadPreviousSets(updated, editing));
  };

  // L'écran reste allumé pendant la séance : pas besoin de déverrouiller entre deux séries
  useEffect(() => {
    if (editing) {
      return;
    }
    activateKeepAwakeAsync(KEEP_AWAKE_TAG);
    return () => {
      deactivateKeepAwake(KEEP_AWAKE_TAG);
    };
  }, [editing]);

  // Notification de fin de repos, pour l'app en arrière-plan ou l'écran verrouillé ; suit les ajustements ±15 s
  const restEndsAt = rest?.endsAt ?? null;
  useEffect(() => {
    if (restEndsAt === null) {
      cancelRestEnd();
    } else {
      scheduleRestEnd(restEndsAt);
    }
  }, [restEndsAt]);
  useEffect(() => cancelRestEnd, []);

  // Pas de séance en cours (terminée ailleurs) ou séance introuvable : retour à l'écran précédent
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

  const toggleSet = (exercise: WorkoutExercise, set: WorkoutSet, entered: SetValues, previous: SetValues | undefined) => {
    if (set.completed_at !== null) {
      WorkoutRepository.setCompleted(set.id, false);
      reload();
      return;
    }

    const values = resolveSetValues(entered, previous, defaultReps, exercise.tracking);
    if (!values) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    WorkoutRepository.updateSet(set.id, values);
    WorkoutRepository.setCompleted(set.id, true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Pas de repos quand on corrige une séance passée, ni après du cardio ; sinon celui du programme ou des réglages
    if (!editing && exercise.tracking !== 'duration_distance') {
      const restDuration = exercise.rest_seconds ?? restSeconds;
      setRest({ endsAt: Date.now() + restDuration * 1000, duration: restDuration });
    }
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

  // La nouvelle série reprend les valeurs et le type de la dernière : souvent la même charge pour une série de plus
  const addSet = (exercise: WorkoutExercise) => {
    const last = exercise.sets[exercise.sets.length - 1];
    WorkoutRepository.addSet(
      exercise.id,
      {
        weight: last?.weight ?? null,
        reps: last?.reps ?? null,
        duration_seconds: last?.duration_seconds ?? null,
        distance_meters: last?.distance_meters ?? null,
      },
      last?.type,
    );
    reload();
  };

  const changeSetType = (set: WorkoutSet, type: SetType) => {
    if (type !== set.type) {
      WorkoutRepository.setType(set.id, type);
      reload();
    }
  };

  const pickExercise = (exercise: ExerciseListItem) => {
    setPickerVisible(false);
    const lastPerformance = WorkoutRepository.getLastPerformance(exercise.id, editing ? workout.started_at : undefined);

    if (!replacing) {
      WorkoutRepository.addExercise(workout.id, buildWorkoutExercise(exercise, lastPerformance, defaultSetCount));
    } else {
      // Le remplaçant reprend les séries restant à faire et le repos prévus pour l'exercice remplacé
      const pending = replacing.sets.filter((set) => set.completed_at === null).length;
      WorkoutRepository.replaceExercise(
        replacing.id,
        buildWorkoutExercise(
          { ...exercise, target_sets: pending || null, rest_seconds: replacing.rest_seconds },
          lastPerformance,
          defaultSetCount,
        ),
      );
    }
    reloadExercises();
  };

  const removeExercise = (exercise: WorkoutExercise) => {
    const done = exercise.sets.filter((set) => set.completed_at !== null).length;
    Alert.alert(
      `Retirer « ${exercise.name} » ?`,
      done > 0
        ? `${done > 1 ? `Les ${done} séries validées seront supprimées` : 'La série validée sera supprimée'}.`
        : undefined,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Retirer',
          style: 'destructive',
          onPress: () => {
            WorkoutRepository.removeExercise(exercise.id);
            reloadExercises();
          },
        },
      ],
    );
  };

  const closeOptions = (note?: string) => {
    if (note !== undefined && optionsFor?.exercise_id != null) {
      ExerciseRepository.updateNote(optionsFor.exercise_id, note);
      reload();
    }
    setOptionsFor(null);
  };

  const moveExercise = (exercise: WorkoutExercise, direction: -1 | 1) => {
    WorkoutRepository.moveExercise(exercise.id, direction);
    reload();
  };

  const pendingCount = allSets.length - doneCount;
  const pendingWarning =
    pendingCount > 0
      ? `${pendingCount} ${pendingCount > 1 ? 'séries non validées ne seront pas enregistrées' : 'série non validée ne sera pas enregistrée'}.`
      : undefined;

  const saveEdit = () => {
    if (doneCount === 0) {
      Alert.alert('Supprimer la séance ?', "Plus aucune série n'est validée : la séance sera supprimée de l'historique.", [
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
      return;
    }
    const save = () => {
      WorkoutRepository.saveEditedWorkout(workout.id);
      router.back();
    };
    if (pendingWarning) {
      Alert.alert('Enregistrer les modifications ?', pendingWarning, [
        { text: 'Continuer', style: 'cancel' },
        { text: 'Enregistrer', onPress: save },
      ]);
      return;
    }
    save();
  };

  const finish = () => {
    Alert.alert(
      'Terminer la séance ?',
      doneCount === 0 ? "Aucune série n'est validée : la séance ne sera pas enregistrée." : pendingWarning,
      [
        { text: 'Continuer', style: 'cancel' },
        {
          text: 'Abandonner',
          style: 'destructive',
          onPress: () => {
            cancelRestEnd();
            WorkoutRepository.discardWorkout(workout.id);
            router.back();
          },
        },
        {
          text: 'Terminer',
          onPress: () => {
            cancelRestEnd();
            const saved = WorkoutRepository.finishWorkout(workout.id);
            if (!saved) {
              router.back();
              Alert.alert('Séance non enregistrée', "Aucune série n'avait été validée.");
              return;
            }
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.replace({ pathname: '/workout-summary/[id]', params: { id: workout.id, finished: '1' } });
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        {editing ? (
          // Pas de bouton « réduire » en modification ; l'espace garde le titre au même endroit
          <View style={styles.headerButtonPlaceholder} />
        ) : (
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Réduire la séance"
            accessibilityHint="La séance continue, vous pourrez la reprendre depuis l'accueil"
            hitSlop={4}
            style={styles.headerButton}>
            <ChevronDown size={24} color={palette.text} strokeWidth={2} pointerEvents="none" />
          </Pressable>
        )}
        <View style={styles.headerTitle}>
          <ThemedText type="label" numberOfLines={1}>
            {editing ? 'Modifier la séance' : (workout.name ?? 'Séance')}
          </ThemedText>
          {editing ? (
            <ThemedText type="caption" numberOfLines={1}>
              {[workout.name, formatLongDate(new Date(workout.started_at * 1000))].filter(Boolean).join(' · ')}
            </ThemedText>
          ) : (
            <ElapsedTime startedAt={workout.started_at} />
          )}
        </View>
        <Pressable
          onPress={editing ? saveEdit : finish}
          accessibilityRole="button"
          style={({ pressed }) => [styles.finishButton, pressed && styles.pressed]}>
          <ThemedText type="defaultSemiBold" tone="onAccent">
            {editing ? 'Enregistrer' : 'Terminer'}
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
              unit={unit}
              currentSetId={currentSetId}
              onChangeSet={changeSet}
              onToggleSet={(set, index, entered) => toggleSet(exercise, set, entered, previous[index])}
              onSetOptions={(set, label) => setSetSheet({ set, label })}
              onAddSet={() => addSet(exercise)}
              onOptions={() => setOptionsFor(exercise)}
            />
          );
        })}

        {workout.exercises.length === 0 ? (
          <Card variant="outlined" style={styles.empty}>
            <ThemedText type="heading">{editing ? 'Aucun exercice' : 'Séance libre'}</ThemedText>
            <ThemedText type="caption">
              {editing ? 'Ajoutez un exercice pour garder cette séance.' : 'Ajoutez les exercices au fur et à mesure de votre séance.'}
            </ThemedText>
            <Button title="Ajouter un exercice" icon={Plus} onPress={() => openPicker(null)} />
          </Card>
        ) : (
          <Button
            title="Ajouter un exercice"
            variant="secondary"
            icon={Plus}
            onPress={() => openPicker(null)}
          />
        )}
      </ScrollView>

      <SetOptionsSheet
        set={setSheet?.set ?? null}
        label={setSheet?.label ?? ''}
        onClose={() => setSetSheet(null)}
        onSelectType={(type) => setSheet && changeSetType(setSheet.set, type)}
        onDelete={() => setSheet && deleteSet(setSheet.set)}
      />

      <ExerciseOptionsSheet
        exercise={optionsFor}
        canMoveUp={optionsFor !== null && workout.exercises[0]?.id !== optionsFor.id}
        canMoveDown={optionsFor !== null && workout.exercises[workout.exercises.length - 1]?.id !== optionsFor.id}
        onClose={closeOptions}
        onMove={(direction) => optionsFor && moveExercise(optionsFor, direction)}
        onReplace={() => optionsFor && openPicker(optionsFor)}
        onRemove={() => optionsFor && removeExercise(optionsFor)}
      />

      <ExercisePicker
        visible={pickerVisible}
        title={replacing ? `Remplacer ${replacing.name}` : 'Ajouter un exercice'}
        onSelect={pickExercise}
        onClose={() => setPickerVisible(false)}
      />

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
  headerButtonPlaceholder: {
    width: 44,
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
  empty: {
    gap: spacing.md,
    padding: spacing.xl,
  },
  restTimer: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    borderRadius: radius.xl,
  },
});
