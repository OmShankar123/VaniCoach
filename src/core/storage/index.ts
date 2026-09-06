import { createMMKV } from 'react-native-mmkv';

export const appStorage = createMMKV({ id: 'vani-app-storage' });

export const mmkvAdapter = {
  getItem: (key: string): string | null => appStorage.getString(key) ?? null,
  setItem: (key: string, value: string): void => {
    appStorage.set(key, value);
  },
  removeItem: (key: string): void => {
    appStorage.remove(key);
  },
};

export function getStorageItem<T>(key: string): T | null {
  const value = appStorage.getString(key);
  return value ? (JSON.parse(value) as T) : null;
}

export function setStorageItem<T>(key: string, value: T): void {
  appStorage.set(key, JSON.stringify(value));
}

export function removeStorageItem(key: string): void {
  appStorage.remove(key);
}

export function clearAllStorage(): void {
  appStorage.clearAll();
}