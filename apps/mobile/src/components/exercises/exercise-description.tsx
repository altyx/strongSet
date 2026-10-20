import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/src/components/themed-text';
import { Card } from '@/src/components/ui/card';
import { spacing } from '@/src/constants/theme';

/**
 * Consignes d'exécution. Les lignes « Étape : texte » (descriptions par défaut) affichent l'étape en libellé ;
 * une description libre saisie par l'utilisateur s'affiche telle quelle.
 */
export function ExerciseDescription({ description }: { description: string }) {
  const lines = description
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = /^([^:]{3,20}) : (.+)$/.exec(line);
      return match ? { label: match[1], text: match[2] } : { label: null, text: line };
    });

  return (
    <Card style={styles.card}>
      <ThemedText type="heading">Comment le faire</ThemedText>
      {lines.map((line, index) => (
        <View key={index} style={styles.step}>
          {line.label && <ThemedText type="label">{line.label}</ThemedText>}
          <ThemedText>{line.text}</ThemedText>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
    padding: spacing.xl,
  },
  step: {
    gap: spacing.xs,
  },
});
