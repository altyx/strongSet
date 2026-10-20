import { DarkTheme, ThemeProvider, type Theme } from '@react-navigation/native';
import {Stack, useRouter} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { loadAppFonts } from '@/src/constants/fonts';
import { fontFamily, palette } from '@/src/constants/theme';
import { initializeDatabase } from '@/src/db/database';
import {initializeMMKVStorage, STORAGE_KEYS, useMMKVStorage} from '@/src/hooks/use-mmkv-storage';
import {UserSettings} from "@/src/hooks/user/user-settings.type";

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
})
// Empêche le splash screen de se cacher automatiquement
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

// Thème sombre de navigation (en-têtes, fonds des écrans) aligné sur la palette
const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: palette.accent,
    background: palette.background,
    card: palette.background,
    text: palette.text,
    border: palette.surfaceRaised,
  },
  fonts: {
    ...DarkTheme.fonts,
    regular: { fontFamily: fontFamily.regular, fontWeight: '400' },
    medium: { fontFamily: fontFamily.medium, fontWeight: '500' },
    bold: { fontFamily: fontFamily.semibold, fontWeight: '600' },
    heavy: { fontFamily: fontFamily.bold, fontWeight: '700' },
  },
};

export default function RootLayout() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const { read } = useMMKVStorage();

  useEffect(() => {
    async function prepare() {
      try {
        // Initialiser MMKV en premier (nécessaire pour le chiffrement)
        await initializeMMKVStorage();
        // Crée la base locale et applique les migrations avant d'afficher le moindre écran
        await initializeDatabase();
        await loadAppFonts();

        const user = read<UserSettings>(STORAGE_KEYS.USER_PREFERENCES);
        console.log(user);

        setIsReady(true);

        if (user?.isOnboarded !== true) {
          const timer = setTimeout(() => {
            router.replace('/onboarding');
          }, 0);
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsReady(true);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [read, router]);

  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider value={navigationTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="onboarding" options={{ headerShown: true, title: 'My fitness App' }} />
          <Stack.Screen name="CGU" options={{ presentation: 'modal'  }} />
          <Stack.Screen
            name="create-exercise"
            options={{ presentation: 'modal', title: 'Nouvel exercice' }}
          />
        </Stack>
        <StatusBar style="light" />
    </ThemeProvider>
  );
}
