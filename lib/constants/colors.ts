// Covey Planner - Dark Theme Color Palette
// Monochrome theme with white/light-gray text on black/dark-gray background

export const COLORS = {
  // Base colors
  background: '#000000', // Pure black background
  primary: '#FFFFFF', // Pure white for primary elements

  // Gray scale (light to dark)
  gray: {
    50: '#FAFAFA', // Lightest
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717', // Darkest
  },

  // Text colors
  text: {
    primary: '#FFFFFF', // White
    secondary: '#E5E5E5', // Light gray
    tertiary: '#A3A3A3', // Medium gray
    disabled: '#525252', // Dark gray
  },

  // Background variants
  bg: {
    primary: '#000000', // Black
    secondary: '#171717', // Very dark gray
    tertiary: '#262626', // Dark gray
    elevated: '#404040', // Elevated surfaces
  },

  // Border colors
  border: {
    light: '#404040',
    default: '#525252',
    dark: '#737373',
  },

  // Priority colors (A, B, C) - using gray shades
  priority: {
    A: '#FFFFFF', // White - Highest priority
    B: '#A3A3A3', // Medium gray - Medium priority
    C: '#525252', // Dark gray - Lowest priority
  },

  // Quadrant colors (I, II, III, IV) - using gray shades
  quadrant: {
    I: '#FFFFFF', // White - Urgent & Important
    II: '#D4D4D4', // Light gray - Not urgent but Important (FOCUS)
    III: '#737373', // Medium gray - Urgent but not Important
    IV: '#404040', // Dark gray - Neither urgent nor important
  },

  // Status colors
  status: {
    success: '#FFFFFF', // White
    warning: '#A3A3A3', // Medium gray
    error: '#E5E5E5', // Light gray
    info: '#737373', // Medium-dark gray
  },

  // Interactive element states
  interactive: {
    default: '#FFFFFF',
    hover: '#E5E5E5',
    active: '#D4D4D4',
    disabled: '#404040',
  },

  // Semantic colors for task statuses
  taskStatus: {
    pending: '#A3A3A3',
    completed: '#FFFFFF',
    in_progress: '#D4D4D4',
    forwarded: '#737373',
    cancelled: '#525252',
    delegated: '#737373',
  },

  // Achievement badge colors
  achievement: {
    locked: '#404040',
    unlocked: '#FFFFFF',
    glow: '#E5E5E5',
  },

  // Chart/Graph colors (varying grays for different segments)
  chart: {
    quadrant1: '#FFFFFF',
    quadrant2: '#D4D4D4',
    quadrant3: '#A3A3A3',
    quadrant4: '#737373',
    streak: '#E5E5E5',
    progress: '#FFFFFF',
  },
} as const;

// Export individual color for convenience
export const BG_PRIMARY = COLORS.background;
export const BG_SECONDARY = COLORS.bg.secondary;
export const BG_TERTIARY = COLORS.bg.tertiary;
export const BG_ELEVATED = COLORS.bg.elevated;

export const TEXT_PRIMARY = COLORS.text.primary;
export const TEXT_SECONDARY = COLORS.text.secondary;
export const TEXT_TERTIARY = COLORS.text.tertiary;
export const TEXT_DISABLED = COLORS.text.disabled;

export const BORDER_DEFAULT = COLORS.border.default;
export const BORDER_LIGHT = COLORS.border.light;
export const BORDER_DARK = COLORS.border.dark;

export type ColorKey = keyof typeof COLORS;
