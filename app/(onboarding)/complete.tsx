// Covey Planner - Onboarding Complete Screen
import { Button } from '@/components/ui/Button';
import { COLORS } from '@/lib/constants/colors';
import { PADDING } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';
import { storageService } from '@/lib/storage/AsyncStorageService';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CompleteScreen() {
  const handleGetStarted = async () => {
    try {
      await storageService.setOnboardingCompleted(true);
      router.replace('/(tabs)/today');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('Failed to complete onboarding. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>You're All Set!</Text>
        <Text style={styles.subtitle}>
          Your foundation is in place. Now it's time to start living by your principles.
        </Text>

        <View style={styles.stepsContainer}>
          <Text style={styles.stepsTitle}>What's Next:</Text>
          <Text style={styles.step}>
            1. Create your first weekly plan
          </Text>
          <Text style={styles.step}>
            2. Identify your "Big Rocks" for the week
          </Text>
          <Text style={styles.step}>
            3. Plan each day with intention
          </Text>
          <Text style={styles.step}>
            4. Review the Time Management Matrix
          </Text>
        </View>

        <Text style={styles.quote}>
          "The key is not to prioritize what's on your schedule, but to schedule your priorities."
          {'\n'}- Stephen R. Covey
        </Text>
      </View>

      <View style={styles.footer}>
        <Button onPress={handleGetStarted} fullWidth>
          Start Planning
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: PADDING.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: PADDING.lg,
  },
  emoji: {
    fontSize: 80,
    marginBottom: PADDING.md,
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
    paddingHorizontal: PADDING.md,
  },
  stepsContainer: {
    marginTop: PADDING.xl,
    width: '100%',
    paddingHorizontal: PADDING.md,
  },
  stepsTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.sm,
  },
  step: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.secondary,
    marginBottom: PADDING.xs,
    lineHeight: TYPOGRAPHY.body.lineHeight * TYPOGRAPHY.body.fontSize,
  },
  quote: {
    fontSize: TYPOGRAPHY.quote.fontSize,
    fontWeight: TYPOGRAPHY.quote.fontWeight,
    color: COLORS.text.tertiary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: PADDING.xl,
    paddingHorizontal: PADDING.lg,
    lineHeight: TYPOGRAPHY.quote.lineHeight * TYPOGRAPHY.quote.fontSize,
  },
  footer: {
    paddingBottom: PADDING.xl,
  },
});
