import { useUserSettings } from '@/src/hooks/user/use-user-settings';
import { DistanceUnit } from '@/src/utils/distance';

// Unité de distance choisie dans les réglages (km par défaut)
export function useDistanceUnit(): DistanceUnit {
  const { getPreferences } = useUserSettings();
  return getPreferences()?.distanceUnit ?? 'km';
}
