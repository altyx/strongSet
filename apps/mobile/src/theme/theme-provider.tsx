import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Appearance, StyleSheet, useColorScheme } from 'react-native';

import { palettes, type ColorScheme, type Palette } from '@/src/constants/theme';
import { mmkvStorage, STORAGE_KEYS } from '@/src/hooks/use-mmkv-storage';

// « system » suit le réglage clair/sombre du téléphone
export type ThemePreference = 'system' | 'light' | 'dark';

type ThemeContextValue = {
  colors: Palette;
  scheme: ColorScheme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readPreference(): ThemePreference {
  const stored = mmkvStorage.read<ThemePreference>(STORAGE_KEYS.THEME_PREFERENCE);
  return stored === 'light' || stored === 'dark' ? stored : 'system';
}

// À monter après initializeMMKVStorage, pour lire la préférence enregistrée dès le premier rendu
export function AppThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>(readPreference);

  // Forcer l'apparence native aligne aussi le clavier, les alertes et les sélecteurs système
  useEffect(() => {
    Appearance.setColorScheme(preference === 'system' ? null : preference);
  }, [preference]);

  const scheme: ColorScheme = preference === 'system' ? (systemScheme === 'light' ? 'light' : 'dark') : preference;

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: palettes[scheme],
      scheme,
      preference,
      setPreference: (next) => {
        mmkvStorage.write(STORAGE_KEYS.THEME_PREFERENCE, next);
        setPreferenceState(next);
      },
    }),
    [scheme, preference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme doit être utilisé sous AppThemeProvider');
  return context;
}

/**
 * Feuille de styles dépendant de la palette : renvoie un hook qui donne les styles du thème actif.
 * Chaque variante est créée une seule fois puis réutilisée.
 */
export function makeStyles<T extends StyleSheet.NamedStyles<T>>(factory: (palette: Palette) => T) {
  const cache: Partial<Record<ColorScheme, T>> = {};
  return function useStyles(): T {
    const { colors, scheme } = useTheme();
    return (cache[scheme] ??= StyleSheet.create(factory(colors)));
  };
}
