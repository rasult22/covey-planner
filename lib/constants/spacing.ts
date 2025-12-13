// Covey Planner - Spacing System

// Base spacing unit (4px)
const BASE_UNIT = 4;

export const SPACING = {
  0: 0,
  1: BASE_UNIT, // 4px
  2: BASE_UNIT * 2, // 8px
  3: BASE_UNIT * 3, // 12px
  4: BASE_UNIT * 4, // 16px
  5: BASE_UNIT * 5, // 20px
  6: BASE_UNIT * 6, // 24px
  8: BASE_UNIT * 8, // 32px
  10: BASE_UNIT * 10, // 40px
  12: BASE_UNIT * 12, // 48px
  16: BASE_UNIT * 16, // 64px
  20: BASE_UNIT * 20, // 80px
  24: BASE_UNIT * 24, // 96px
} as const;

// Common spacing presets
export const PADDING = {
  xs: SPACING[1], // 4px
  sm: SPACING[2], // 8px
  md: SPACING[4], // 16px
  lg: SPACING[6], // 24px
  xl: SPACING[8], // 32px
  '2xl': SPACING[12], // 48px
} as const;

export const MARGIN = {
  xs: SPACING[1], // 4px
  sm: SPACING[2], // 8px
  md: SPACING[4], // 16px
  lg: SPACING[6], // 24px
  xl: SPACING[8], // 32px
  '2xl': SPACING[12], // 48px
} as const;

export const GAP = {
  xs: SPACING[1], // 4px
  sm: SPACING[2], // 8px
  md: SPACING[3], // 12px
  lg: SPACING[4], // 16px
  xl: SPACING[6], // 24px
} as const;

// Border radius
export const RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// Icon sizes
export const ICON_SIZES = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
} as const;

// Screen padding/margins
export const SCREEN_PADDING = PADDING.md; // 16px
export const SCREEN_MARGIN = MARGIN.md; // 16px

// Card padding
export const CARD_PADDING = PADDING.md; // 16px

// Button padding
export const BUTTON_PADDING_VERTICAL = PADDING.sm; // 8px
export const BUTTON_PADDING_HORIZONTAL = PADDING.md; // 16px

export type SpacingKey = keyof typeof SPACING;
export type RadiusKey = keyof typeof RADIUS;
