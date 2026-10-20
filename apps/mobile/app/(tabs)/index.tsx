import { router, useFocusEffect } from 'expo-router';
import { Activity, Play, Plus } from 'lucide-react-native/icons';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WorkoutHistoryRow } from '@/src/components/history/workout-history-row';
import { ProgramRow } from '@/src/components/home/program-row';
import { WeekStrip, type WeekDay } from '@/src/components/home/week-strip';
import { ThemedText } from '@/src/components/themed-text';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { StatTile } from '@/src/components/ui/stat-tile';
import { ElapsedTime } from '@/src/components/workout/elapsed-time';
import { fontFamily, palette, radius, spacing } from '@/src/constants/theme';
import { buildWorkoutExercises } from '@/src/domain/workout-plan';
import { useUserSettings } from '@/src/hooks/user/use-user-settings';
import { ExerciseRepository } from '@/src/repositories/exercise/exercise-repository';
import { TemplateRepository } from '@/src/repositories/template/template-repository';
import { Template } from '@/src/repositories/template/template-type';
import { WorkoutRepository } from '@/src/repositories/workout/workout-repository';
import { Workout, WorkoutSummary } from '@/src/repositories/workout/workout-type';
import { formatLongDate, getWeekDays, isSameDay, startOfWeek, toTimestamp } from '@/src/utils/date';

type HomeData = {
  today: Date;
  weekDays: WeekDay[];
  templates: Template[];
  activeWorkout: Workout | null;
  recentWorkouts: WorkoutSummary[];
  workoutCount: number;
  exerciseCount: number;
};

function loadHomeData(): HomeData {
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 7);
  const workoutDates = WorkoutRepository.getWorkoutTimestampsBetween(toTimestamp(weekStart), toTimestamp(weekEnd)).map(
    (timestamp) => new Date(timestamp * 1000),
  );

  return {
    today,
    weekDays: getWeekDays(today).map((date) => ({
      date,
      isToday: isSameDay(date, today),
      hasWorkout: workoutDates.some((workoutDate) => isSameDay(workoutDate, date)),
    })),
    templates: TemplateRepository.getAllTemplates(),
    activeWorkout: WorkoutRepository.getActiveWorkout(),
    recentWorkouts: WorkoutRepository.getHistory(3),
    workoutCount: WorkoutRepository.count(),
    exerciseCount: ExerciseRepository.count(),
  };
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { getPreferences } = useUserSettings();
  const [data, setData] = useState<HomeData | null>(null);

  // Recharge à chaque retour sur l'onglet, pour refléter les séances et programmes ajoutés entre-temps
  useFocusEffect(
    useCallback(() => {
      setData(loadHomeData());
    }, []),
  );

  if (!data) {
    return null;
  }

  const preferences = getPreferences();
  const name = preferences?.name?.trim();
  // En attendant l'historique des séances, on propose le premier programme qui contient des exercices
  const nextTemplate = data.templates.find((template) => template.exercises.length > 0) ?? data.templates[0];
  const activeSets = data.activeWorkout?.exercises.flatMap((exercise) => exercise.sets) ?? [];

  const startWorkout = (template: Template) => {
    // Une seule séance à la fois : on propose de reprendre celle en cours
    if (data.activeWorkout) {
      Alert.alert('Une séance est déjà en cours', `Terminez ou abandonnez « ${data.activeWorkout.name ?? 'Séance'} » avant d'en démarrer une autre.`, [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Reprendre', onPress: () => router.push('/workout') },
      ]);
      return;
    }
    WorkoutRepository.startWorkout({
      template_id: template.id,
      name: template.name,
      exercises: buildWorkoutExercises(template, WorkoutRepository.getLastPerformance, preferences?.seriesPerExercise ?? 3),
    });
    router.push('/workout');
  };

  return (
    // La marge haute est sur le conteneur et non sur le contenu : le contenu ne défile pas sous la barre d'état
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <ThemedText type="label">{formatLongDate(data.today)}</ThemedText>
            <ThemedText type="title">{name ? `Bonjour ${name}` : 'Bonjour'}</ThemedText>
          </View>
          {name && (
            <View style={styles.avatar} accessible accessibilityLabel={`Profil de ${name}`}>
              <ThemedText style={styles.avatarText} tone="onAccent">
                {name.charAt(0).toUpperCase()}
              </ThemedText>
            </View>
          )}
        </View>

        <WeekStrip days={data.weekDays} />

        {data.activeWorkout ? (
          <Card variant="outlined" style={styles.hero}>
            <View style={styles.heroGlow} pointerEvents="none" />
            <Badge label="Séance en cours" />
            <View style={styles.heroTitle}>
              <ThemedText type="display">{data.activeWorkout.name ?? 'Séance'}</ThemedText>
              <ThemedText type="caption">
                {activeSets.filter((set) => set.completed_at !== null).length} / {activeSets.length} séries validées
              </ThemedText>
            </View>
            <ElapsedTime startedAt={data.activeWorkout.started_at} />
            <Button title="Reprendre la séance" icon={Play} iconFilled onPress={() => router.push('/workout')} />
          </Card>
        ) : nextTemplate ? (
          <Card variant="outlined" style={styles.hero}>
            <View style={styles.heroGlow} pointerEvents="none" />
            <Badge label="Prochaine séance" />
            <View style={styles.heroTitle}>
              <ThemedText type="display">{nextTemplate.name}</ThemedText>
              {nextTemplate.exercises.length > 0 && (
                <ThemedText type="caption" numberOfLines={2}>
                  {nextTemplate.exercises.map((exercise) => exercise.name).join(' · ')}
                </ThemedText>
              )}
            </View>
            {nextTemplate.exercises.length > 0 && (
              <View>
                <ThemedText type="metric">{nextTemplate.exercises.length}</ThemedText>
                <ThemedText type="caption">{nextTemplate.exercises.length > 1 ? 'exercices' : 'exercice'}</ThemedText>
              </View>
            )}
            <Button
              title="Démarrer la séance"
              icon={Play}
              iconFilled
              disabled={nextTemplate.exercises.length === 0}
              onPress={() => startWorkout(nextTemplate)}
            />
          </Card>
        ) : (
          <Card variant="outlined" style={styles.hero}>
            <ThemedText type="heading">Aucun programme</ThemedText>
            <ThemedText type="caption">Créez un programme pour démarrer votre première séance.</ThemedText>
            <Button title="Créer un programme" icon={Plus} onPress={() => router.push('/template/new')} />
          </Card>
        )}

        <View style={styles.stats}>
          <StatTile label="Séances" value={String(data.workoutCount)} />
          <StatTile label="Programmes" value={String(data.templates.length)} />
          <StatTile label="Exercices" value={String(data.exerciseCount)} />
        </View>

        {data.recentWorkouts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText type="heading">Dernières séances</ThemedText>
              <Pressable onPress={() => router.push('/history')} accessibilityRole="link" hitSlop={8}>
                <ThemedText type="link">Tout voir</ThemedText>
              </Pressable>
            </View>
            {data.recentWorkouts.map((workout) => (
              <WorkoutHistoryRow key={workout.id} workout={workout} />
            ))}
          </View>
        )}

        {data.templates.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText type="heading">Mes programmes</ThemedText>
              <Pressable onPress={() => router.push('/template/new')} accessibilityRole="button" hitSlop={8}>
                <ThemedText type="link">+ Nouveau</ThemedText>
              </Pressable>
            </View>
            {data.templates.map((template) => (
              <ProgramRow
                key={template.id}
                template={template}
                onPress={() => router.push({ pathname: '/template/[id]', params: { id: template.id } })}
                onStart={() => startWorkout(template)}
              />
            ))}
          </View>
        )}

        <View style={styles.teaser}>
          <View style={styles.teaserIcon}>
            <Activity size={22} color={palette.run} strokeWidth={2} />
          </View>
          <View style={styles.teaserText}>
            <ThemedText type="defaultSemiBold">Bientôt : la course</ThemedText>
            <ThemedText type="caption">Suivez vos sorties, allures et records</ThemedText>
          </View>
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
  content: {
    gap: spacing.xxl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.accent,
  },
  avatarText: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
  },
  hero: {
    gap: spacing.lg,
    padding: spacing.xl,
    borderRadius: radius.xl + 2,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: palette.accentSoft,
  },
  heroTitle: {
    gap: 6,
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  teaser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: spacing.lg,
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: palette.border,
  },
  teaserIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.runSoft,
  },
  teaserText: {
    flex: 1,
    gap: 2,
  },
});
