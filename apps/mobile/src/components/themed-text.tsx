import { StyleSheet, Text, type TextProps } from 'react-native';

import { palette, typography } from '@/src/constants/theme';
import { useThemeColor } from '@/src/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | 'default'
    | 'defaultSemiBold'
    | 'title'
    | 'subtitle'
    | 'heading'
    | 'caption'
    | 'label'
    | 'link'
    | 'display'
    | 'metric';
  // Couleur du texte dans la palette ; prime sur la couleur par défaut de la variante
  tone?: keyof typeof tones;
};

const tones = {
  primary: palette.text,
  secondary: palette.textSecondary,
  tertiary: palette.textTertiary,
  accent: palette.accent,
  onAccent: palette.onAccent,
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  tone,
  ...rest
}: ThemedTextProps) {
  const themeColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const color = tone ? tones[tone] : themeColor;

  return <Text style={[{ color }, styles[type], tone && { color }, style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: typography.body,
  defaultSemiBold: typography.bodyStrong,
  title: typography.title,
  // Ancien nom de heading, gardé pour les écrans pas encore migrés
  subtitle: typography.heading,
  heading: typography.heading,
  caption: { ...typography.caption, color: palette.textSecondary },
  label: { ...typography.label, color: palette.textSecondary },
  link: { ...typography.bodyStrong, color: palette.accent },
  display: typography.display,
  metric: typography.metric,
});
