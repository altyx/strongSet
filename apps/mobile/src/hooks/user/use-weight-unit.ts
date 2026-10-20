import { useUserSettings } from '@/src/hooks/user/use-user-settings';
import { WeightUnit } from '@/src/utils/weight';

// Unité de charge choisie dans les réglages (kg par défaut)
export function useWeightUnit(): WeightUnit {
  const { getPreferences } = useUserSettings();
  return getPreferences()?.weightUnit ?? 'kg';
}
