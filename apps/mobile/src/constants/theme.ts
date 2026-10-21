/**
 * Design tokens « Graphite & Ember ».
 * Référence visuelle : https://claude.ai/artifact/LePmEsCKMmAvHYzgbehzVt (planche « Système visuel »).
 * L'app est en thème sombre uniquement pour l'instant.
 */

import type { TextStyle } from 'react-native';

export const palette = {
  background: '#0B0C0E',
  surface: '#15171A',
  surfaceRaised: '#1E2125',
  border: '#2A2E33',
  text: '#F4F5F6',
  textSecondary: '#A3A9B1',
  textTertiary: '#7C838C',
  accent: '#FF5A1F',
  accentSoft: 'rgba(255, 90, 31, 0.14)',
  // Texte posé sur l'accent : foncé, le blanc ne passe pas le contraste 4.5:1
  onAccent: '#0B0C0E',
  // Actions destructives (supprimer, retirer) : rouge distinct de l'accent orange
  danger: '#FF6B6B',
  // Séries d'échauffement
  warmup: '#F5B83D',
  run: '#5AB8FF',
  runSoft: 'rgba(90, 184, 255, 0.14)',
} as const;

// Noms des polices chargées dans app/_layout.tsx (une famille par graisse)
export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  displayMedium: 'BarlowCondensed_500Medium',
  displaySemibold: 'BarlowCondensed_600SemiBold',
  displayBold: 'BarlowCondensed_700Bold',
} as const;

export const typography = {
  // Titre d'écran
  title: { fontFamily: fontFamily.bold, fontSize: 28, lineHeight: 34, letterSpacing: -0.5 },
  // Titre de section
  heading: { fontFamily: fontFamily.bold, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontFamily: fontFamily.semibold, fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 18 },
  // Petit libellé en capitales au-dessus d'un bloc
  label: { fontFamily: fontFamily.semibold, fontSize: 12, lineHeight: 16, letterSpacing: 1, textTransform: 'uppercase' },
  // Grands titres et chiffres : Barlow Condensed
  display: { fontFamily: fontFamily.displayBold, fontSize: 44, lineHeight: 46, textTransform: 'uppercase' },
  metric: { fontFamily: fontFamily.displaySemibold, fontSize: 28, lineHeight: 32, fontVariant: ['tabular-nums'] },
} satisfies Record<string, TextStyle>;

export const radius = { sm: 10, md: 14, lg: 16, xl: 22, pill: 999 } as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 } as const;

// Conservé pour useThemeColor et les écrans pas encore migrés : les deux modes pointent vers la palette sombre.
const themeColors = {
  text: palette.text,
  background: palette.background,
  tint: palette.accent,
  icon: palette.textSecondary,
  tabIconDefault: palette.textSecondary,
  tabIconSelected: palette.accent,
};

export const Colors = {
  light: themeColors,
  dark: themeColors,
};
