import type { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { palette } from '@/src/constants/theme';

type IconButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  icon: LucideIcon;
  // Obligatoire : le bouton n'a pas de texte visible
  accessibilityLabel: string;
};

export function IconButton({ icon: Icon, ...rest }: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={4}
      style={({ pressed }) => [styles.base, pressed && styles.pressed]}
      {...rest}>
      {/* pointerEvents none : sinon le SVG capte le toucher et le Pressable ne reçoit rien */}
      <Icon size={20} color={palette.text} strokeWidth={2} pointerEvents="none" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  pressed: {
    opacity: 0.7,
  },
});
