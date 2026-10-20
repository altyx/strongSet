import { Minus, Plus } from 'lucide-react-native/icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/src/components/themed-text';
import { palette, radius } from '@/src/constants/theme';

type StepperProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

// Valeur entière ajustée avec − / +, bornée entre min et max
export function Stepper({ label, value, onChange, min = 1, max = 99 }: StepperProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="caption">{label}</ThemedText>
      <View
        style={styles.row}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{ min, max, now: value }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(event) =>
          onChange(Math.min(max, Math.max(min, value + (event.nativeEvent.actionName === 'increment' ? 1 : -1))))
        }>
        <Pressable
          onPress={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          hitSlop={4}
          style={({ pressed }) => [styles.button, (pressed || value <= min) && styles.dimmed]}>
          <Minus size={18} color={palette.text} strokeWidth={2.5} pointerEvents="none" />
        </Pressable>
        <ThemedText type="metric" style={styles.value}>
          {value}
        </ThemedText>
        <Pressable
          onPress={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          hitSlop={4}
          style={({ pressed }) => [styles.button, (pressed || value >= max) && styles.dimmed]}>
          <Plus size={18} color={palette.text} strokeWidth={2.5} pointerEvents="none" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surfaceRaised,
  },
  dimmed: {
    opacity: 0.5,
  },
  value: {
    minWidth: 40,
    textAlign: 'center',
  },
});
