import type { LucideIcon } from 'lucide-react-native';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/src/components/themed-text';
import { radius, typography, type Palette } from '@/src/constants/theme';
import { makeStyles, useTheme } from '@/src/theme/theme-provider';

type ButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  // Icône Lucide affichée avant le libellé, colorée selon la variante
  icon?: LucideIcon;
  // Remplit l'icône (ex. Play) au lieu de ne dessiner que son contour
  iconFilled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const labelColors = {
  primary: 'onAccent',
  secondary: 'text',
  ghost: 'textSecondary',
} as const satisfies Record<string, keyof Palette>;

export function Button({
  title,
  variant = 'primary',
  icon: Icon,
  iconFilled = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const styles = useStyles();
  const { colors } = useTheme();
  const color = colors[labelColors[variant]];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      {...rest}>
      {/* pointerEvents none : sinon le SVG capte le toucher et le Pressable ne reçoit rien */}
      {Icon && (
        <Icon size={18} color={color} strokeWidth={2.5} fill={iconFilled ? color : 'none'} pointerEvents="none" />
      )}
      <ThemedText style={[styles.label, variant === 'primary' && styles.labelPrimary, { color }]}>{title}</ThemedText>
    </Pressable>
  );
}

const useStyles = makeStyles((palette) => ({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 48,
    paddingHorizontal: 20,
    borderRadius: radius.md,
  },
  primary: {
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: palette.accent,
  },
  secondary: {
    backgroundColor: palette.surfaceRaised,
    borderWidth: 1,
    borderColor: palette.border,
  },
  ghost: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: palette.border,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    ...typography.bodyStrong,
  },
  labelPrimary: {
    fontFamily: typography.heading.fontFamily,
    fontSize: 17,
  },
}));
