import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/src/components/themed-text';
import { palette, radius } from '@/src/constants/theme';

type StatTileProps = {
  label: string;
  value: string;
  // Unité ou complément affiché en plus petit après la valeur (ex. « / 4 », « kg »)
  suffix?: string;
};

export function StatTile({ label, value, suffix }: StatTileProps) {
  return (
    <View style={styles.tile} accessible accessibilityLabel={`${label} : ${value}${suffix ? ` ${suffix}` : ''}`}>
      <ThemedText type="caption">{label}</ThemedText>
      <ThemedText type="metric">
        {value}
        {suffix && <ThemedText type="metric" tone="tertiary" style={styles.suffix}>{` ${suffix}`}</ThemedText>}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    gap: 4,
    padding: 14,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
  },
  suffix: {
    fontSize: 20,
  },
});
