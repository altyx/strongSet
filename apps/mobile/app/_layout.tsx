import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import {Stack, useRouter} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { initializeDatabase } from '@/src/db/database';
import {initializeMMKVStorage, STORAGE_KEYS, useMMKVStorage} from '@/src/hooks/use-mmkv-storage';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
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

export default function RootLayout() {
  const colorScheme = useColorScheme();
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
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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
        <StatusBar style="auto" />
    </ThemeProvider>
  );
}
