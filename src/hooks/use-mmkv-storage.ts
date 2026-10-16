import { createMMKV } from 'react-native-mmkv';
import * as SecureStore from 'expo-secure-store';
import { getRandomBytes } from 'expo-crypto';

const MMKV_KEY_NAME = 'mmkv_encryption_key';

export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  ONBOARDING_STATE: 'onboarding_state',
  LAST_SYNC: 'last_sync_timestamp',
  HAS_SEEN_TUTORIAL: 'has_seen_tutorial',
} as const;

let storage: ReturnType<typeof createMMKV> | null = null;
let initializationPromise: Promise<void> | null = null;

async function getOrCreateMMKVKey(): Promise<string> {
  let key = await SecureStore.getItemAsync(MMKV_KEY_NAME);

  if (!key) {
    const randomBytes = getRandomBytes(16);
    key = Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    await SecureStore.setItemAsync(MMKV_KEY_NAME, key, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  }
  console.log(key)
  return key;
}

export async function initializeMMKVStorage(): Promise<void> {
  if (storage) {
    return;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      const key = await getOrCreateMMKVKey();
      console.log('init with key')
      storage = createMMKV({
        id: 'my-fitness-storage',
        encryptionKey: key,
      });
    } catch (error) {
      console.error('Failed to initialize MMKV storage:', error);
      storage = createMMKV({
        id: 'my-fitness-storage',
      });
    }
  })();

  await initializationPromise;
}

function getStorage(): ReturnType<typeof createMMKV> | null {
  return storage;
}

export function useMMKVStorage() {
  return storageApi;
}

// Créées une seule fois : ces fonctions ne dépendent d'aucun état React, et une référence stable
// évite de relancer à chaque rendu les useEffect qui les ont en dépendance (ex. app/_layout.tsx).
function createStorageApi() {
  const read = <T = string>(key: string): T | undefined => {
    try {
      const store = getStorage();
      if (!store) return undefined;
      const value = store.getString(key);

      if (value === undefined) {
        return undefined;
      }

      try {
        return JSON.parse(value) as T;
      } catch {
        return value as T;
      }
    } catch (error) {
      console.error(`Error reading key "${key}" from MMKV:`, error);
      return undefined;
    }
  };

  const write = <T>(key: string, value: T): void => {
    try {
      const store = getStorage();
      if (!store) return;
      if (value === undefined || value === null) {
        store.remove(key);
        return;
      }

      const stringValue = typeof value === 'string'
        ? value
        : JSON.stringify(value);

      store.set(key, stringValue);
    } catch (error) {
      console.error(`Error writing key "${key}" to MMKV:`, error);
    }
  };

  const remove = (key: string): void => {
    try {
      const store = getStorage();
      if (!store) return;
      store.remove(key);
    } catch (error) {
      console.error(`Error deleting key "${key}" from MMKV:`, error);
    }
  };

  const contains = (key: string): boolean => {
    try {
      const store = getStorage();
      if (!store) return false;
      return store.contains(key);
    } catch (error) {
      console.error(`Error checking key "${key}" in MMKV:`, error);
      return false;
    }
  };

  const clearAll = (): void => {
    try {
      const store = getStorage();
      if (!store) return;
      store.clearAll();
    } catch (error) {
      console.error('Error clearing MMKV storage:', error);
    }
  };

  const getAllKeys = (): string[] => {
    try {
      const store = getStorage();
      if (!store) return [];
      return store.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys from MMKV:', error);
      return [];
    }
  };

  return {
    read,
    write,
    remove,
    contains,
    clearAll,
    getAllKeys,
  };
}

const storageApi = createStorageApi();

export function getMMKVInstance(): ReturnType<typeof createMMKV> | null {
  return getStorage();
}



