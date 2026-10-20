import { router } from 'expo-router';
import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { ThemedText } from '@/src/components/themed-text';
import { ThemedView } from '@/src/components/themed-view';
import { useThemeColor } from '@/src/hooks/use-theme-color';

const MUSCLE_GROUPS = [
  'Poitrine',
  'Dos',
  'Épaules',
  'Biceps',
  'Triceps',
  'Jambes',
  'Abdominaux',
  'Fessiers',
  'Mollets',
  'Avant-bras',
  'Cardio',
];

export default function CreateExerciseModal() {
  const [name, setName] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');

  const handleCreate = () => {
    if (!name.trim()) {
      setError('Le nom de l\'exercice est requis');
      return;
    }

    try {

      router.back();
    } catch (e) {
      setError('Erreur lors de la création de l\'exercice');
      console.error(e);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            Nouvel exercice
          </ThemedText>

          {error && (
            <ThemedView style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </ThemedView>
          )}

          <ThemedView style={styles.inputContainer}>
            <ThemedText type="defaultSemiBold">Nom de l&apos;exercice</ThemedText>
            <TextInput
              style={[
                styles.input,
                { color: textColor, borderColor: textColor, backgroundColor },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Ex: Développé couché"
              placeholderTextColor="#888"
            />
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <ThemedText type="defaultSemiBold">Groupe musculaire</ThemedText>
            <ThemedView style={styles.muscleGroupsContainer}>
              {MUSCLE_GROUPS.map((group) => (
                <TouchableOpacity
                  key={group}
                  style={[
                    styles.muscleGroupButton,
                    {
                      backgroundColor:
                        selectedMuscleGroup === group ? tintColor : 'transparent',
                      borderColor: tintColor,
                    },
                  ]}
                  onPress={() =>
                    setSelectedMuscleGroup(
                      selectedMuscleGroup === group ? null : group
                    )
                  }
                >
                  <ThemedText
                    style={[
                      styles.muscleGroupText,
                      {
                        color: selectedMuscleGroup === group ? '#fff' : textColor,
                      },
                    ]}
                  >
                    {group}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => router.back()}
            >
              <ThemedText>Annuler</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.createButton, { backgroundColor: tintColor }]}
              onPress={handleCreate}
            >
              <ThemedText style={styles.createButtonText}>Créer</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#c62828',
  },
  inputContainer: {
    marginBottom: 20,
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  muscleGroupsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscleGroupButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  muscleGroupText: {
    fontSize: 14,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
    paddingTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#888',
  },
  createButton: {},
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

