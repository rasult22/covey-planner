// Covey Planner - Goals Setup Screen (Optional)
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { COLORS } from '@/lib/constants/colors';
import { PADDING, GAP } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';

export default function SetupGoalsScreen() {
  const handleSkip = () => {
    router.push('/(onboarding)/complete');
  };

  const handleSetGoals = () => {
    // For now, skip to completion
    // TODO: Implement goal setting in future iteration
    router.push('/(onboarding)/complete');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Long-term Goals</Text>
        <Text style={styles.subtitle}>
          You can set your long-term goals now or skip and do it later from the app.
        </Text>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>🎯 Goals in Covey Planner</Text>
          <Text style={styles.infoText}>
            Long-term goals connect your daily actions to your mission and values.
            {'\n\n'}
            Each goal will be broken down into actionable steps and linked to your roles.
            {'\n\n'}
            You can always add and manage goals from the Goals tab after onboarding.
          </Text>
        </Card>

        <Card variant="elevated" style={styles.tipCard}>
          <Text style={styles.tipText}>
            💡 Tip: It's often easier to define goals after you've started using the weekly planning process and understand your priorities better.
          </Text>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          onPress={handleSkip}
          variant="ghost"
          fullWidth
        >
          Skip for Now
        </Button>
        <Button
          onPress={handleSetGoals}
          fullWidth
        >
          Set Goals Later
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: PADDING.lg,
    paddingBottom: PADDING['2xl'],
  },
  title: {
    fontSize: TYPOGRAPHY.h2.fontSize,
    fontWeight: TYPOGRAPHY.h2.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.secondary,
    marginBottom: PADDING.lg,
  },
  infoCard: {
    marginBottom: PADDING.lg,
  },
  infoTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.sm,
  },
  infoText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.secondary,
    lineHeight: TYPOGRAPHY.body.lineHeight * TYPOGRAPHY.body.fontSize,
  },
  tipCard: {
    backgroundColor: COLORS.bg.tertiary,
  },
  tipText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.secondary,
    lineHeight: TYPOGRAPHY.body.lineHeight * TYPOGRAPHY.body.fontSize,
  },
  footer: {
    padding: PADDING.lg,
    gap: GAP.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
    backgroundColor: COLORS.background,
  },
});
