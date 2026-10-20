import type { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/src/components/themed-text';
import { palette, radius, typography } from '@/src/constants/theme';

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
  primary: palette.onAccent,
  secondary: palette.text,
  ghost: palette.textSecondary,
};

export function Button({
  title,
  variant = 'primary',
  icon: Icon,
  iconFilled = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const color = labelColors[variant];

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
      {Icon && <Icon size={18} color={color} strokeWidth={2.5} fill={iconFilled ? color : 'none'} />}
      <ThemedText style={[styles.label, variant === 'primary' && styles.labelPrimary, { color }]}>{title}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
});
