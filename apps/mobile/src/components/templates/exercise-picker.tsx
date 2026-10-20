import { Search, X } from 'lucide-react-native/icons';
import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/src/components/themed-text';
import { IconButton } from '@/src/components/ui/icon-button';
import { muscleLabel } from '@/src/constants/muscles';
import { palette, radius, spacing, typography } from '@/src/constants/theme';
import { filterExercises } from '@/src/domain/exercise-library';
import { ExerciseListItem, ExerciseRepository } from '@/src/repositories/exercise/exercise-repository';

type ExercisePickerProps = {
  visible: boolean;
  title?: string;
  onSelect: (exercise: ExerciseListItem) => void;
  onClose: () => void;
};

// Feuille modale pour choisir un exercice de la bibliothèque
export function ExercisePicker({ visible, title = 'Ajouter un exercice', onSelect, onClose }: ExercisePickerProps) {
  const [query, setQuery] = useState('');
  const [exercises, setExercises] = useState<ExerciseListItem[]>([]);

  const filtered = filterExercises(exercises, query, null);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onShow={() => {
        setQuery('');
        setExercises(ExerciseRepository.getAll());
      }}
      onRequestClose={onClose}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <ThemedText type="heading">{title}</ThemedText>
          <IconButton icon={X} accessibilityLabel="Fermer" onPress={onClose} />
        </View>

        <View style={styles.search}>
          <Search size={18} color={palette.textSecondary} strokeWidth={2} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Rechercher un exercice"
            placeholderTextColor={palette.textTertiary}
            autoCorrect={false}
            accessibilityLabel="Rechercher un exercice"
            style={styles.searchInput}
          />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(exercise) => String(exercise.id)}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onSelect(item)}
              accessibilityRole="button"
              style={({ pressed }) => [styles.item, pressed && styles.pressed]}>
              <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
              {item.muscles.length > 0 && (
                <ThemedText type="caption">{item.muscles.map(muscleLabel).join(' · ')}</ThemedText>
              )}
            </Pressable>
          )}
          ListEmptyComponent={
            <ThemedText type="caption" style={styles.empty}>
              Aucun exercice ne correspond.
            </ThemedText>
          }
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    gap: spacing.lg,
    paddingTop: spacing.xl,
    backgroundColor: palette.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  separator: {
    height: spacing.sm,
  },
  item: {
    gap: 2,
    padding: 14,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
  },
  pressed: {
    opacity: 0.8,
  },
  empty: {
    textAlign: 'center',
    paddingTop: spacing.xl,
  },
});
