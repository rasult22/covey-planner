// Principle Centered Planner - Achievements Screen
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAchievements } from '@/hooks/gamification/useAchievements';
import { useStreaks } from '@/hooks/gamification/useStreaks';
import { COLORS } from '@/lib/constants/colors';
import { GAP, PADDING } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';
import { Achievement } from '@/types';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AchievementsScreen() {
  const {
    achievements,
    getUnlockedCount,
    getTotalCount,
    getProgress,
    getUnlockedAchievements,
    getLockedAchievements,
  } = useAchievements();

  const {
    getWeeklyStreak,
    getDailyStreak,
    getLongestWeeklyStreak,
    getLongestDailyStreak,
  } = useStreaks();

  const renderAchievement = (achievement: Achievement) => {
    const isUnlocked = achievement.isUnlocked;

    return (
      <Card
        key={achievement.id}
        style={[
          styles.achievementCard,
          !isUnlocked && styles.achievementCardLocked,
        ]}
      >
        <View style={styles.achievementHeader}>
          <View style={[
            styles.achievementIcon,
            isUnlocked && styles.achievementIconUnlocked,
          ]}>
            <Text style={styles.achievementIconText}>
              {isUnlocked ? '🏆' : '🔒'}
            </Text>
          </View>
          <View style={styles.achievementContent}>
            <Text style={[
              styles.achievementTitle,
              !isUnlocked && styles.achievementTitleLocked,
            ]}>
              {achievement.title}
            </Text>
            <Text style={[
              styles.achievementDescription,
              !isUnlocked && styles.achievementDescriptionLocked,
            ]}>
              {achievement.description}
            </Text>
            {isUnlocked && achievement.unlockedAt && (
              <Text style={styles.achievementDate}>
                Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>
      </Card>
    );
  };

  const unlockedAchievements = getUnlockedAchievements();
  const lockedAchievements = getLockedAchievements();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Achievements</Text>
        <Button
          onPress={() => router.back()}
          variant="ghost"
        >
          Close
        </Button>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Your Progress</Text>
            <Text style={styles.progressCount}>
              {getUnlockedCount()} / {getTotalCount()}
            </Text>
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
        </Card>

        <Card style={styles.streaksCard}>
          <Text style={styles.streaksTitle}>Current Streaks</Text>
          <View style={styles.streaksGrid}>
            <View style={styles.streakItem}>
              <Text style={styles.streakValue}>{getWeeklyStreak()}</Text>
              <Text style={styles.streakLabel}>Week Streak</Text>
              <Text style={styles.streakBest}>Best: {getLongestWeeklyStreak()}</Text>
            </View>
            <View style={styles.streakDivider} />
            <View style={styles.streakItem}>
              <Text style={styles.streakValue}>{getDailyStreak()}</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
              <Text style={styles.streakBest}>Best: {getLongestDailyStreak()}</Text>
            </View>
          </View>
        </Card>

        {unlockedAchievements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Unlocked ({unlockedAchievements.length})
            </Text>
            {unlockedAchievements.map(renderAchievement)}
          </View>
        )}

        {lockedAchievements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Locked ({lockedAchievements.length})
            </Text>
            {lockedAchievements.map(renderAchievement)}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: PADDING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  title: {
    fontSize: TYPOGRAPHY.h2.fontSize,
    fontWeight: TYPOGRAPHY.h2.fontWeight,
    color: COLORS.text.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: PADDING.lg,
    paddingBottom: PADDING['2xl'],
  },
  progressCard: {
    marginBottom: PADDING.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: PADDING.md,
  },
  progressTitle: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: TYPOGRAPHY.h3.fontWeight,
    color: COLORS.text.primary,
  },
  progressCount: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: TYPOGRAPHY.h3.fontWeight,
    color: COLORS.text.secondary,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP.md,
  },
  progressBarBackground: {
    flex: 1,
    height: 24,
    backgroundColor: COLORS.border.light,
    borderRadius: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  progressPercent: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    color: COLORS.text.primary,
    minWidth: 45,
    textAlign: 'right',
  },
  streaksCard: {
    marginBottom: PADDING.lg,
  },
  streaksTitle: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: TYPOGRAPHY.h3.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.md,
  },
  streaksGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakItem: {
    flex: 1,
    alignItems: 'center',
  },
  streakDivider: {
    width: 1,
    height: 60,
    backgroundColor: COLORS.border.light,
    marginHorizontal: PADDING.md,
  },
  streakValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: PADDING.xs,
  },
  streakLabel: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  streakBest: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.tertiary,
  },
  section: {
    marginBottom: PADDING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.md,
  },
  achievementCard: {
    marginBottom: PADDING.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  achievementCardLocked: {
    borderColor: COLORS.border.light,
    opacity: 0.6,
  },
  achievementHeader: {
    flexDirection: 'row',
    gap: GAP.md,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.border.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementIconUnlocked: {
    backgroundColor: COLORS.primary,
  },
  achievementIconText: {
    fontSize: 24,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: PADDING.xs,
  },
  achievementTitleLocked: {
    color: COLORS.text.secondary,
  },
  achievementDescription: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  achievementDescriptionLocked: {
    color: COLORS.text.tertiary,
  },
  achievementDate: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.tertiary,
    fontStyle: 'italic',
  },
});
