// Covey Planner - Profile Screen
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { useMission } from '@/hooks/foundation/useMission';
import { useValues } from '@/hooks/foundation/useValues';
import { useRoles } from '@/hooks/foundation/useRoles';
import { useGoals } from '@/hooks/foundation/useGoals';
import { useAchievements } from '@/hooks/gamification/useAchievements';
import { useStreaks } from '@/hooks/gamification/useStreaks';
import { COLORS } from '@/lib/constants/colors';
import { PADDING, GAP } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';

export default function ProfileScreen() {
  const { mission } = useMission();
  const { values } = useValues();
  const { roles } = useRoles();
  const { goals } = useGoals();
  const { getUnlockedCount, getTotalCount, getProgress } = useAchievements();
  const { getWeeklyStreak, getDailyStreak } = useStreaks();

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

          <TouchableOpacity
            onPress={() => router.push('/(modals)/achievements')}
            activeOpacity={0.7}
          >
            <Card>
              <View style={styles.achievementsHeader}>
                <Text style={styles.achievementsTitle}>
                  {getUnlockedCount()} of {getTotalCount()} Unlocked
                </Text>
                <Text style={styles.cardArrow}>›</Text>
              </View>

              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${getProgress()}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressPercent}>{getProgress()}%</Text>
              </View>

              <View style={styles.streaksRow}>
                <View style={styles.streakMini}>
                  <Text style={styles.streakMiniValue}>{getWeeklyStreak()}</Text>
                  <Text style={styles.streakMiniLabel}>Week Streak</Text>
                </View>
                <View style={styles.streakMini}>
                  <Text style={styles.streakMiniValue}>{getDailyStreak()}</Text>
                  <Text style={styles.streakMiniLabel}>Day Streak</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analytics & Reflection</Text>

          <TouchableOpacity
            onPress={() => router.push('/(modals)/analytics')}
            activeOpacity={0.7}
          >
            <Card style={styles.settingsCard}>
              <View style={styles.cardContent}>
                <View style={styles.cardLeft}>
                  <Text style={styles.cardTitle}>Analytics</Text>
                  <Text style={styles.cardDescription}>
                    View quadrant time distribution and trends
                  </Text>
                </View>
                <View style={styles.cardRight}>
                  <Text style={styles.cardArrow}>›</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(modals)/reflection/weekly')}
            activeOpacity={0.7}
          >
            <Card style={styles.settingsCard}>
              <View style={styles.cardContent}>
                <View style={styles.cardLeft}>
                  <Text style={styles.cardTitle}>Weekly Reflection</Text>
                  <Text style={styles.cardDescription}>
                    Reflect on your week and plan improvements
                  </Text>
                </View>
                <View style={styles.cardRight}>
                  <Text style={styles.cardArrow}>›</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity
            onPress={() => router.push('/(modals)/settings/notifications')}
            activeOpacity={0.7}
          >
            <Card style={styles.settingsCard}>
              <View style={styles.cardContent}>
                <View style={styles.cardLeft}>
                  <Text style={styles.cardTitle}>Notifications</Text>
                  <Text style={styles.cardDescription}>
                    Configure planning and reflection reminders
                  </Text>
                </View>
                <View style={styles.cardRight}>
                  <Text style={styles.cardArrow}>›</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(modals)/settings/data')}
            activeOpacity={0.7}
          >
            <Card style={styles.settingsCard}>
              <View style={styles.cardContent}>
                <View style={styles.cardLeft}>
                  <Text style={styles.cardTitle}>Data Management</Text>
                  <Text style={styles.cardDescription}>
                    Export, import, and backup your data
                  </Text>
                </View>
                <View style={styles.cardRight}>
                  <Text style={styles.cardArrow}>›</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
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
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: PADDING.md,
  },
  achievementsTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP.md,
    marginBottom: PADDING.md,
  },
  progressBarBackground: {
    flex: 1,
    height: 20,
    backgroundColor: COLORS.border.light,
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  progressPercent: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    fontWeight: '600',
    color: COLORS.text.primary,
    minWidth: 40,
    textAlign: 'right',
  },
  streaksRow: {
    flexDirection: 'row',
    gap: GAP.lg,
  },
  streakMini: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: PADDING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
  },
  streakMiniValue: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  streakMiniLabel: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.tertiary,
  },
  settingsCard: {
    marginBottom: PADDING.sm,
  },
});
