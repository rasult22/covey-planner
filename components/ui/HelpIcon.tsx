// Principle Centered Planner - Help Icon Component
// Contextual help button that links to wiki pages
import { COLORS } from '@/lib/constants/colors';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface HelpIconProps {
  conceptId: string;
  size?: 'small' | 'medium';
}

/**
 * Displays a ? button that opens the wiki page for the given concept
 * @param conceptId - The wiki concept ID (e.g., 'mission', 'big-rocks', 'quadrants')
 * @param size - 'small' (20px) or 'medium' (28px, default)
 */
export function HelpIcon({ conceptId, size = 'medium' }: HelpIconProps) {
  const isSmall = size === 'small';
  
  return (
    <TouchableOpacity
      onPress={() => router.push(`/(modals)/wiki/${conceptId}` as any)}
      style={[
        styles.button,
        isSmall ? styles.buttonSmall : styles.buttonMedium,
      ]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Text style={[styles.text, isSmall && styles.textSmall]}>?</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 100,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonMedium: {
    width: 28,
    height: 28,
  },
  buttonSmall: {
    width: 20,
    height: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  textSmall: {
    fontSize: 12,
  },
});
