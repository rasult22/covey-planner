// Covey Planner - Philosophy Screen
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { COLORS } from '@/lib/constants/colors';
import { PADDING, GAP } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';

const QUADRANTS = [
  {
    number: 'I',
    title: 'Urgent & Important',
    description: 'Crises, deadlines, firefighting',
    color: COLORS.quadrant.I,
    example: 'Medical emergency, project deadline today',
  },
  {
    number: 'II',
    title: 'Not Urgent but Important',
    description: 'Planning, prevention, growth, relationships',
    color: COLORS.quadrant.II,
    example: 'Exercise, learning, strategic planning',
    isHighlighted: true,
  },
  {
    number: 'III',
    title: 'Urgent but Not Important',
    description: 'Interruptions, distractions, other people\'s priorities',
    color: COLORS.quadrant.III,
    example: 'Most emails, some calls, trivial requests',
  },
  {
    number: 'IV',
    title: 'Not Urgent & Not Important',
    description: 'Time wasters, busy work, mindless activities',
    color: COLORS.quadrant.IV,
    example: 'Endless social media, excessive TV',
  },
];

export default function PhilosophyScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>The Time Management Matrix</Text>
        <Text style={styles.subtitle}>
          Stephen Covey's framework for prioritizing what truly matters
        </Text>

        <View style={styles.quadrantsContainer}>
          {QUADRANTS.map((quadrant) => (
            <Card
              key={quadrant.number}
              variant={quadrant.isHighlighted ? 'elevated' : 'default'}
              style={[
                styles.quadrantCard,
                quadrant.isHighlighted && styles.highlightedCard,
              ]}
            >
              <View style={styles.quadrantHeader}>
                <Text
                  style={[
                    styles.quadrantNumber,
                    { color: quadrant.color },
                  ]}
                >
                  {quadrant.number}
                </Text>
                <Text style={styles.quadrantTitle}>{quadrant.title}</Text>
              </View>
              <Text style={styles.quadrantDescription}>
                {quadrant.description}
              </Text>
              <Text style={styles.quadrantExample}>
                Example: {quadrant.example}
              </Text>
              {quadrant.isHighlighted && (
                <View style={styles.focusBadge}>
                  <Text style={styles.focusText}>🎯 FOCUS HERE</Text>
                </View>
              )}
            </Card>
          ))}
        </View>

        <Card style={styles.insightCard}>
          <Text style={styles.insightTitle}>The Key Insight</Text>
          <Text style={styles.insightText}>
            Most people spend too much time in Quadrants I and III (reacting to urgency).
            {'\n\n'}
            Effective people focus on Quadrant II - important but not urgent tasks that prevent crises and build capacity.
            {'\n\n'}
            This app helps you shift from urgency addiction to importance-driven planning.
          </Text>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          onPress={() => router.back()}
          variant="ghost"
          fullWidth
        >
          Back
        </Button>
        <Button
          onPress={() => router.push('/(onboarding)/setup-mission')}
          fullWidth
        >
          Continue
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
    marginBottom: PADDING.xl,
  },
  quadrantsContainer: {
    gap: GAP.lg,
    marginBottom: PADDING.xl,
  },
  quadrantCard: {
    position: 'relative',
  },
  highlightedCard: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  quadrantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP.md,
    marginBottom: PADDING.sm,
  },
  quadrantNumber: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  quadrantTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
    flex: 1,
  },
  quadrantDescription: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.secondary,
    marginBottom: PADDING.sm,
  },
  quadrantExample: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.tertiary,
    fontStyle: 'italic',
  },
  focusBadge: {
    position: 'absolute',
    top: PADDING.sm,
    right: PADDING.sm,
    backgroundColor: COLORS.primary,
    paddingHorizontal: PADDING.sm,
    paddingVertical: PADDING.xs,
    borderRadius: 4,
  },
  focusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  insightCard: {
    backgroundColor: COLORS.bg.elevated,
  },
  insightTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.sm,
  },
  insightText: {
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
