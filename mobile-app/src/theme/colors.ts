/**
 * Daybook color tokens.
 *
 * Concept: a calm "morning notebook" palette — a pale sage-grey paper
 * background with deep teal ink for structure, and warm, distinct hues
 * per task priority so a list is scannable at a glance without reading
 * every label.
 */
export const colors = {
  // Surfaces
  bg: '#EEF3F1',
  surface: '#FFFFFF',
  surfaceRaised: '#FFFFFF',
  sheetHandle: '#D7E0DC',

  // Ink / brand
  ink: '#14232B',
  inkMuted: '#5B6B70',
  inkFaint: '#8FA0A0',
  brand: '#1B6E71',
  brandDark: '#123F41',
  brandSoft: '#DCEDEA',

  // Priority
  priorityHigh: '#D8572A',
  priorityHighSoft: '#FBE4DA',
  priorityMedium: '#E3A23C',
  priorityMediumSoft: '#FBEBD3',
  priorityLow: '#3F8F6B',
  priorityLowSoft: '#DCF0E6',

  // Feedback
  danger: '#C1442E',
  dangerSoft: '#F7E1DC',
  success: '#3F8F6B',

  // Structure
  border: '#DFE6E3',
  divider: '#E7ECEA',
  overlay: 'rgba(13, 22, 25, 0.55)',
  white: '#FFFFFF',
} as const;

export type ColorToken = keyof typeof colors;
