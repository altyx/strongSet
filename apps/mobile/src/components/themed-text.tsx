import { Text, type TextProps } from 'react-native';

import { typography } from '@/src/constants/theme';
import { makeStyles } from '@/src/theme/theme-provider';

export type ThemedTextProps = TextProps & {
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
  tone?: Tone;
};

type Tone = 'primary' | 'secondary' | 'tertiary' | 'accent' | 'onAccent';

export function ThemedText({ style, type = 'default', tone, ...rest }: ThemedTextProps) {
  const styles = useStyles();
  const toneStyle = tone ? styles[`tone_${tone}`] : undefined;

  return <Text style={[styles.base, styles[type], toneStyle, style]} {...rest} />;
}

const useStyles = makeStyles((palette) => ({
  base: { color: palette.text },
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
  tone_primary: { color: palette.text },
  tone_secondary: { color: palette.textSecondary },
  tone_tertiary: { color: palette.textTertiary },
  tone_accent: { color: palette.accent },
  tone_onAccent: { color: palette.onAccent },
}));
