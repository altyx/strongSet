import {
  BarlowCondensed_500Medium,
  BarlowCondensed_600SemiBold,
  BarlowCondensed_700Bold,
} from '@expo-google-fonts/barlow-condensed';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as Font from 'expo-font';

// Les clés doivent correspondre aux noms utilisés dans fontFamily (theme.ts)
const APP_FONTS = {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  BarlowCondensed_500Medium,
  BarlowCondensed_600SemiBold,
  BarlowCondensed_700Bold,
};

/**
 * Charge les polices de l'app. Un échec ne bloque pas le démarrage : on retombe sur la police système.
 */
export async function loadAppFonts(): Promise<void> {
  try {
    await Font.loadAsync(APP_FONTS);
  } catch (error) {
    console.error('Failed to load fonts:', error);
  }
}
