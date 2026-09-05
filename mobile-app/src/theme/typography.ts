import { Platform } from 'react-native';

/**
 * Two-voice type system: a serif display face for headings (maps to the
 * platform's native serif — Noto Serif on Android) that gives the app a
 * "notebook" personality, and the system sans for everything functional
 * so body copy stays fast to read.
 */
export const fontFamily = {
  display: Platform.select({ android: 'serif', default: 'Georgia' }),
  body: Platform.select({ android: 'sans-serif', default: 'System' }),
  bodyMedium: Platform.select({ android: 'sans-serif-medium', default: 'System' }),
};

export const type = {
  display: { fontFamily: fontFamily.display, fontSize: 30, lineHeight: 36, letterSpacing: -0.3 },
  h1: { fontFamily: fontFamily.display, fontSize: 22, lineHeight: 28, letterSpacing: -0.2 },
  h2: { fontFamily: fontFamily.bodyMedium, fontSize: 17, lineHeight: 22 },
  body: { fontFamily: fontFamily.body, fontSize: 15, lineHeight: 21 },
  bodyMedium: { fontFamily: fontFamily.bodyMedium, fontSize: 15, lineHeight: 21 },
  small: { fontFamily: fontFamily.body, fontSize: 13, lineHeight: 18 },
  smallMedium: { fontFamily: fontFamily.bodyMedium, fontSize: 13, lineHeight: 18 },
  tiny: { fontFamily: fontFamily.bodyMedium, fontSize: 11, lineHeight: 14 },
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;
