import { router, useFocusEffect } from 'expo-router';
import { Plus, Search } from 'lucide-react-native/icons';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExerciseRow } from '@/src/components/exercises/exercise-row';
import { ThemedText } from '@/src/components/themed-text';
import { muscleLabel } from '@/src/constants/muscles';
import { palette, radius, spacing, typography } from '@/src/constants/theme';
import { filterExercises } from '@/src/domain/exercise-library';
import { ExerciseListItem, ExerciseRepository, Muscle } from '@/src/repositories/exercise/exercise-repository';
import { WorkoutRepository } from '@/src/repositories/workout/workout-repository';

type LibraryData = {
  exercises: ExerciseListItem[];
  muscles: Muscle[];
  bestWeights: Record<number, number>;
};

function loadLibrary(): LibraryData {
  const exercises = ExerciseRepository.getAll();
  const usedMuscles = new Set(exercises.flatMap((exercise) => exercise.muscles));
  return {
    exercises,
    // Seuls les muscles qui ont au moins un exercice servent de filtre
    muscles: ExerciseRepository.getMuscles().filter((muscle) => usedMuscles.has(muscle.name)),
    bestWeights: WorkoutRepository.getBestWeightsBefore(
      exercises.map((exercise) => exercise.id),
      Math.floor(Date.now() / 1000) + 1,
    ),
  };
}

export default function ExercisesScreen() {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<LibraryData | null>(null);
  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState<string | null>(null);

  // Recharge au retour sur l'onglet (exercice créé, record battu entre-temps)
  useFocusEffect(
    useCallback(() => {
      setData(loadLibrary());
    }, []),
  );

  if (!data) {
    return null;
  }

  const visible = filterExercises(data.exercises, query, muscle);
  const filters = [{ key: 'all', label: 'Tous', value: null }, ...data.muscles.map((item) => ({ key: String(item.id), label: muscleLabel(item.name), value: item.name }))];

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText type="title">Exercices</ThemedText>
        <ThemedText type="caption">
          {data.exercises.length} {data.exercises.length > 1 ? 'exercices' : 'exercice'}
        </ThemedText>
      </View>

      <View style={styles.search}>
        <Search size={18} color={palette.textSecondary} strokeWidth={2} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Rechercher un exercice"
          placeholderTextColor={palette.textTertiary}
          autoCorrect={false}
          clearButtonMode="while-editing"
          accessibilityLabel="Rechercher un exercice"
          style={styles.searchInput}
        />
      </View>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {filters.map((filter) => {
            const selected = filter.value === muscle;
            return (
              <Pressable
                key={filter.key}
                onPress={() => setMuscle(filter.value)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                style={[styles.chip, selected && styles.chipSelected]}>
                <ThemedText type="defaultSemiBold" tone={selected ? 'onAccent' : 'secondary'} style={styles.chipText}>
                  {filter.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={visible}
        keyExtractor={(exercise) => String(exercise.id)}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push({ pathname: '/exercise/[id]', params: { id: item.id } })}
            accessibilityRole="button"
            accessibilityHint="Voir la progression"
            style={({ pressed }) => pressed && styles.pressed}>
            <ExerciseRow exercise={item} bestWeight={data.bestWeights[item.id]} />
          </Pressable>
        )}
        ListEmptyComponent={
          <ThemedText type="caption" style={styles.empty}>
            Aucun exercice ne correspond.
          </ThemedText>
        }
      />

      <Pressable
        onPress={() => router.push('/create-exercise')}
        accessibilityRole="button"
        style={({ pressed }) => [styles.fab, pressed && styles.pressed]}>
        <Plus size={18} color={palette.onAccent} strokeWidth={2.5} pointerEvents="none" />
        <ThemedText type="defaultSemiBold" tone="onAccent">
          Créer un exercice
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: spacing.lg,
    backgroundColor: palette.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
    marginHorizontal: spacing.xl,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.surfaceRaised,
    backgroundColor: palette.surface,
  },
  searchInput: {
    ...typography.body,
    flex: 1,
    height: '100%',
    color: palette.text,
  },
  filters: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  chip: {
    height: 40,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  chipSelected: {
    borderColor: palette.accent,
    backgroundColor: palette.accent,
  },
  chipText: {
    fontSize: 14,
  },
  list: {
    paddingHorizontal: spacing.xl,
    // Laisse la place au bouton flottant sous le dernier exercice
    paddingBottom: 96,
  },
  separator: {
    height: spacing.sm,
  },
  empty: {
    textAlign: 'center',
    paddingTop: spacing.xl,
  },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xl,
    height: 52,
    paddingHorizontal: spacing.xl,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: palette.accent,
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.45)',
  },
  pressed: {
    opacity: 0.85,
  },
});
