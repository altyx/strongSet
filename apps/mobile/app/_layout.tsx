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
import { configureNotifications } from '@/src/services/rest-notification';

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
})
// Empêche le splash screen de se cacher automatiquement
SplashScreen.preventAutoHideAsync();
configureNotifications();

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
          {/* Pas de retour possible : l'onboarding remplace l'accueil tant qu'il n'est pas terminé */}
          <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="legal/[document]" options={{ presentation: 'modal', title: '' }} />
          {/* Plein écran sans geste de fermeture : une séance ne doit pas se perdre par un balayage accidentel */}
          <Stack.Screen
            name="workout"
            options={{ presentation: 'fullScreenModal', headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen name="workout-summary/[id]" options={{ headerBackTitle: 'Retour' }} />
          <Stack.Screen name="history" options={{ title: 'Historique', headerBackTitle: 'Accueil' }} />
          <Stack.Screen name="settings" options={{ title: 'Réglages', headerBackTitle: 'Accueil' }} />
          <Stack.Screen name="template/[id]" options={{ headerBackTitle: 'Retour' }} />
          <Stack.Screen name="exercise/[id]" options={{ headerBackTitle: 'Retour' }} />
          <Stack.Screen
            name="create-exercise"
            options={{ presentation: 'modal', title: 'Nouvel exercice' }}
          />
        </Stack>
        <StatusBar style="light" />
    </ThemeProvider>
  );
}
