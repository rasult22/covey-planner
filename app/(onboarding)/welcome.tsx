// Covey Planner - Welcome Screen
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { COLORS } from '@/lib/constants/colors';
import { PADDING } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Covey Planner</Text>
        <Text style={styles.subtitle}>
          Transform your life with the power of principle-centered planning
        </Text>
      </View>

      <View style={styles.footer}>
        <Button onPress={() => router.push('/(onboarding)/philosophy')} fullWidth>
          Get Started
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: PADDING.lg,
    paddingVertical: PADDING.xl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: PADDING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.h1.fontSize,
    fontWeight: TYPOGRAPHY.h1.fontWeight,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.bodyLarge.fontSize,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  footer: {
    paddingBottom: PADDING.xl,
  },
});
