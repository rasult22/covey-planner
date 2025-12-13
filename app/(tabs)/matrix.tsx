// Covey Planner - Matrix Screen
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/lib/constants/colors';
import { PADDING } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';

export default function MatrixScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Time Management Matrix</Text>
      <Text style={styles.subtitle}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: PADDING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: TYPOGRAPHY.h2.fontSize,
    fontWeight: TYPOGRAPHY.h2.fontWeight,
    color: COLORS.text.primary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.secondary,
    marginTop: PADDING.md,
  },
});
