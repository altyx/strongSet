import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/src/components/themed-text';
import { fontFamily, palette } from '@/src/constants/theme';

type BadgeProps = {
  label: string;
  // accent : musculation, run : course
  tone?: 'accent' | 'run';
};

const tones = {
  accent: { background: palette.accentSoft, color: palette.accent },
  run: { background: palette.runSoft, color: palette.run },
};

export function Badge({ label, tone = 'accent' }: BadgeProps) {
  const { background, color } = tones[tone];

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
