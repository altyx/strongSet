import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/src/components/themed-text';
import { fontFamily, type Palette } from '@/src/constants/theme';
import { useTheme } from '@/src/theme/theme-provider';

type BadgeProps = {
  label: string;
  // accent : musculation, run : course
  tone?: 'accent' | 'run';
};

const tones = {
  accent: { background: 'accentSoft', color: 'accent' },
  run: { background: 'runSoft', color: 'run' },
} as const satisfies Record<string, { background: keyof Palette; color: keyof Palette }>;

export function Badge({ label, tone = 'accent' }: BadgeProps) {
  const { colors } = useTheme();
  const background = colors[tones[tone].background];
  const color = colors[tones[tone].color];

  return (
    <View style={[styles.badge, { backgroundColor: background }]}>
      <ThemedText type="label" style={[styles.text, { color }]}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  text: {
    fontFamily: fontFamily.bold,
  },
});
