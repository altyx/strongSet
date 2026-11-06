/**
 * Design tokens « Graphite & Ember ».
 * Référence visuelle : https://claude.ai/artifact/LePmEsCKMmAvHYzgbehzVt (planche « Système visuel »).
 * Deux palettes aux mêmes clés : sombre (référence) et claire. Les écrans lisent la palette active
 * via useTheme() ou makeStyles() (src/theme/theme-provider.tsx), jamais une palette en dur.
 */

import type { TextStyle } from 'react-native';

export const darkPalette = {
  background: '#0B0C0E',
  surface: '#15171A',
  surfaceRaised: '#1E2125',
  border: '#2A2E33',
  text: '#F4F5F6',
  textSecondary: '#A3A9B1',
  textTertiary: '#7C838C',
  accent: '#FF5A1F',
  accentSoft: 'rgba(255, 90, 31, 0.14)',
  accentBorder: 'rgba(255, 90, 31, 0.35)',
  // Texte posé sur l'accent : foncé, le blanc ne passe pas le contraste 4.5:1
  onAccent: '#0B0C0E',
  // Actions destructives (supprimer, retirer) : rouge distinct de l'accent orange
  danger: '#FF6B6B',
  // Séries d'échauffement
  warmup: '#F5B83D',
  run: '#5AB8FF',
  runSoft: 'rgba(90, 184, 255, 0.14)',
  // Voile derrière les feuilles modales
  scrim: 'rgba(0, 0, 0, 0.6)',
  // Couleur des ombres portées (boxShadow)
  shadow: 'rgba(0, 0, 0, 0.45)',
};

export type Palette = typeof darkPalette;

// Mêmes rôles que la palette sombre ; accent et couleurs d'état assombris pour garder 4.5:1 sur fond clair
export const lightPalette: Palette = {
  background: '#F3F4F6',
  surface: '#FFFFFF',
  surfaceRaised: '#E9EBEE',
  border: '#D9DCE1',
  text: '#121417',
  textSecondary: '#4F5661',
  textTertiary: '#656C76',
  accent: '#C2410C',
  accentSoft: 'rgba(194, 65, 12, 0.10)',
  accentBorder: 'rgba(194, 65, 12, 0.35)',
  // Sur l'orange foncé du thème clair, c'est le blanc qui passe 4.5:1
  onAccent: '#FFFFFF',
  danger: '#C62828',
  warmup: '#9A6200',
  run: '#0B6BB8',
  runSoft: 'rgba(11, 107, 184, 0.10)',
  scrim: 'rgba(0, 0, 0, 0.4)',
  shadow: 'rgba(16, 24, 40, 0.16)',
};

export type ColorScheme = 'light' | 'dark';

export const palettes: Record<ColorScheme, Palette> = { light: lightPalette, dark: darkPalette };

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
