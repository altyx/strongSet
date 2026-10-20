import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/src/components/themed-text';
import { palette } from '@/src/constants/theme';

type BarChartProps = {
  // Une valeur par barre ; null = pas de donnée (barre vide)
  values: (number | null)[];
  labels: string[];
  // Résumé lu par les lecteurs d'écran à la place des barres
  accessibilityLabel: string;
  height?: number;
};

/**
 * Barres verticales simples, la dernière en couleur d'accent. L'échelle part du minimum non nul (moins un peu de marge)
 * pour rendre visibles de petites variations, comme un 1RM qui passe de 85 à 92,5 kg.
 */
export function BarChart({ values, labels, accessibilityLabel, height = 150 }: BarChartProps) {
  const present = values.filter((value): value is number => value !== null && value > 0);
  const max = present.length > 0 ? Math.max(...present) : 0;
  const min = present.length > 0 ? Math.min(...present) : 0;
  // Barre la plus basse à 20 % de la hauteur, la plus haute à 100 %
  const floor = min - (max - min) * 0.25;
  const lastIndex = values.length - 1;

  return (
    <View style={[styles.chart, { height }]} accessible accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      {values.map((value, index) => {
        const ratio = value === null || value <= 0 || max === 0 ? 0 : max === floor ? 1 : (value - floor) / (max - floor);
        return (
          <View key={labels[index] ?? index} style={styles.column}>
            <View style={styles.track}>
              {ratio > 0 && (
                <View
                  style={[
                    styles.bar,
                    { height: `${Math.max(ratio, 0.2) * 100}%` },
                    index === lastIndex && styles.barCurrent,
                  ]}
                />
              )}
            </View>
            <ThemedText type="caption" tone="tertiary" style={styles.label} numberOfLines={1}>
              {labels[index]}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    flexDirection: 'row',
    gap: 8,
  },
  column: {
    flex: 1,
    gap: 8,
  },
  track: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: palette.border,
  },
  barCurrent: {
    backgroundColor: palette.accent,
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
  },
});
