import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/src/components/themed-text';
import { palette, radius } from '@/src/constants/theme';
import { formatDuration } from '@/src/utils/duration';

const REST_OPTIONS = [60, 90, 120, 150, 180];

// 60 -> « 1 min », 90 -> « 1:30 »
function restLabel(seconds: number) {
  return seconds % 60 === 0 ? `${seconds / 60} min` : formatDuration(seconds);
}

export function RestPicker({ value, onChange }: { value: number; onChange: (seconds: number) => void }) {
  return (
    <View style={styles.container}>
      <ThemedText type="caption">Repos entre les séries</ThemedText>
      <View style={styles.options} accessibilityRole="radiogroup" accessibilityLabel="Repos entre les séries">
        {REST_OPTIONS.map((seconds) => {
          const selected = seconds === value;
          return (
            <Pressable
              key={seconds}
              onPress={() => onChange(seconds)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              style={[styles.option, selected && styles.selected]}>
              <ThemedText type="defaultSemiBold" tone={selected ? 'onAccent' : 'secondary'} style={styles.optionText}>
                {restLabel(seconds)}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  options: {
    flexDirection: 'row',
    gap: 6,
  },
  option: {
    flex: 1,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surfaceRaised,
  },
  selected: {
    backgroundColor: palette.accent,
  },
  optionText: {
    fontSize: 13,
  },
});
