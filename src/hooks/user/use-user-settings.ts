import {STORAGE_KEYS, useMMKVStorage} from "@/src/hooks/use-mmkv-storage";
import {UserSettings} from "@/src/hooks/user/user-settings.type";

export function useUserSettings() {
  const { read, write } = useMMKVStorage();

  const getPreferences = (): UserSettings | undefined => {
    return read<UserSettings>(STORAGE_KEYS.USER_PREFERENCES);
  };

  const savePreferences = (preferences: UserSettings): void => {
    write(STORAGE_KEYS.USER_PREFERENCES, preferences);
  };
  return {
    getPreferences,
    savePreferences,
  }
}
