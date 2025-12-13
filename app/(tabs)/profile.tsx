// Covey Planner - Profile Screen
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { useMission } from '@/hooks/foundation/useMission';
import { useValues } from '@/hooks/foundation/useValues';
import { useRoles } from '@/hooks/foundation/useRoles';
import { useGoals } from '@/hooks/foundation/useGoals';
import { COLORS } from '@/lib/constants/colors';
import { PADDING, GAP } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';

export default function ProfileScreen() {
  const { mission } = useMission();
  const { values } = useValues();
  const { roles } = useRoles();
  const { goals } = useGoals();

  const foundationItems = [
    {
      title: 'Personal Mission',
      description: mission ? 'View or edit your personal mission statement' : 'Define your personal mission',
      count: mission ? '✓' : '−',
      route: '/(modals)/mission',
    },
    {
      title: 'Core Values',
      description: `${values.length} values defined`,
      count: values.length.toString(),
      route: '/(modals)/values',
    },
    {
      title: 'Life Roles',
      description: `${roles.length} of 7 roles defined`,
      count: `${roles.length}/7`,
      route: '/(modals)/roles',
    },
  ];

  const completedGoals = goals.filter(g => g.completedAt).length;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>
            Your foundation and achievements
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Foundation</Text>
          <Text style={styles.sectionDescription}>
            Build your life on solid principles
          </Text>

          {foundationItems.map((item) => (
            <TouchableOpacity
              key={item.title}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <Card style={styles.foundationCard}>
                <View style={styles.cardContent}>
                  <View style={styles.cardLeft}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDescription}>{item.description}</Text>
                  </View>
                  <View style={styles.cardRight}>
                    <Text style={styles.cardCount}>{item.count}</Text>
                    <Text style={styles.cardArrow}>›</Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goals Progress</Text>

          <Card>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{goals.length}</Text>
                <Text style={styles.statLabel}>Active Goals</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{completedGoals}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {goals.length > 0
                    ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
                    : 0}%
                </Text>
                <Text style={styles.statLabel}>Avg Progress</Text>
              </View>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <Card style={styles.comingSoonCard}>
            <Text style={styles.comingSoonText}>Coming soon...</Text>
            <Text style={styles.comingSoonDescription}>
              Track your progress with achievements and streaks
            </Text>
          </Card>
        </View>
      </ScrollView>
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
  header: {
    marginBottom: PADDING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.h2.fontSize,
    fontWeight: TYPOGRAPHY.h2.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
  },
  section: {
    marginBottom: PADDING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: TYPOGRAPHY.h3.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.xs,
  },
  sectionDescription: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.tertiary,
    marginBottom: PADDING.md,
  },
  foundationCard: {
    marginBottom: PADDING.sm,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: {
    flex: 1,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: PADDING.xs,
  },
  cardDescription: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP.sm,
  },
  cardCount: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
  },
  cardArrow: {
    fontSize: 24,
    color: COLORS.text.tertiary,
  },
  statsGrid: {
    flexDirection: 'row',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: TYPOGRAPHY.h3.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.xs,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.tertiary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border.light,
    marginHorizontal: PADDING.sm,
  },
  comingSoonCard: {
    alignItems: 'center',
    padding: PADDING.xl,
  },
  comingSoonText: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.xs,
  },
  comingSoonDescription: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});
