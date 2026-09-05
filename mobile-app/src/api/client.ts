import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/**
 * Base URL for the backend API.
 *
 * - Android emulator (AVD): the host machine's localhost is reachable at 10.0.2.2.
 * - Physical device: replace with your machine's LAN IP, e.g. http://192.168.1.20:5000/api.
 *
 * Override at build time by setting API_BASE_URL in a .env file if you add
 * react-native-config, or simply edit the fallback below.
 */
const DEFAULT_ANDROID_EMULATOR_URL = 'http://10.0.2.2:5000/api';
const DEFAULT_URL = 'http://localhost:5000/api';

export const API_BASE_URL = Platform.select({
  android: DEFAULT_ANDROID_EMULATOR_URL,
  default: DEFAULT_URL,
});

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the stored JWT (if any) to every outgoing request.
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@daybook/token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Extracts a readable message from an Axios/network error. */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string } | undefined)?.message ||
      error.message ||
      'Something went wrong. Please try again.'
    );
  }
  return 'Something went wrong. Please try again.';
};
