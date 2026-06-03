// src/features/auth/storage.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

function isWebStorageAvailable() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export async function setStorageItem(key: string, value: string) {
  if (Platform.OS === "web" && isWebStorageAvailable()) {
    window.localStorage.setItem(key, value);
    return;
  }

  await AsyncStorage.setItem(key, value);
}

export async function getStorageItem(key: string) {
  if (Platform.OS === "web" && isWebStorageAvailable()) {
    return window.localStorage.getItem(key);
  }

  return AsyncStorage.getItem(key);
}

export async function removeStorageItem(key: string) {
  if (Platform.OS === "web" && isWebStorageAvailable()) {
    window.localStorage.removeItem(key);
    return;
  }

  await AsyncStorage.removeItem(key);
}