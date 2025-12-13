// Covey Planner - Goals Screen
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useGoals } from '@/hooks/foundation/useGoals';
import { useValues } from '@/hooks/foundation/useValues';
import { useRoles } from '@/hooks/foundation/useRoles';
import { LongTermGoal } from '@/types';
import { COLORS } from '@/lib/constants/colors';
import { PADDING, GAP } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';

export default function GoalsScreen() {
  const { goals, isLoading } = useGoals();
  const { values } = useValues();
  const { roles } = useRoles();

  const getLinkedValueNames = (goal: LongTermGoal) => {
    return goal.linkedValueIds
      .map(id => values.find(v => v.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const getLinkedRoleNames = (goal: LongTermGoal) => {
    return goal.linkedRoleIds
      .map(id => roles.find(r => r.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const getQuadrantColor = (quadrant: 'I' | 'II' | 'III' | 'IV') => {
    return COLORS.quadrant[quadrant];
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Long-term Goals</Text>
          <Text style={styles.subtitle}>
            Connect your goals to your values and roles
          </Text>
        </View>

        {goals.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No Goals Yet</Text>
            <Text style={styles.emptyText}>
              Create your first long-term goal to start building the life you envision.
            </Text>
            <Button
              onPress={() => router.push('/(modals)/goal/new')}
              style={styles.emptyButton}
            >
              Create First Goal
            </Button>
          </Card>
        ) : (
          <>
            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{goals.length}</Text>
                <Text style={styles.statLabel}>Total Goals</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {goals.filter(g => g.completedAt).length}
                </Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {Math.round(
                    goals.reduce((sum, g) => sum + g.progress, 0) / goals.length
                  )}%
                </Text>
                <Text style={styles.statLabel}>Avg Progress</Text>
              </View>
            </View>

            {goals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                onPress={() => router.push(`/(modals)/goal/${goal.id}`)}
                activeOpacity={0.7}
              >
                <Card style={styles.goalCard}>
                  <View style={styles.goalHeader}>
                    <View style={styles.goalTitleRow}>
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                      <View
                        style={[
                          styles.quadrantBadge,
                          { backgroundColor: getQuadrantColor(goal.quadrant) }
                        ]}
                      >
                        <Text style={styles.quadrantText}>{goal.quadrant}</Text>
                      </View>
                    </View>
                  </View>

                  {goal.description && (
                    <Text style={styles.goalDescription} numberOfLines={2}>
                      {goal.description}
                    </Text>
                  )}

                  <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>Progress</Text>
                      <Text style={styles.progressValue}>{goal.progress}%</Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${goal.progress}%` }
                        ]}
                      />
                    </View>
                  </View>

                  {goal.steps.length > 0 && (
                    <View style={styles.stepsSection}>
                      <Text style={styles.stepsLabel}>
                        {goal.steps.filter(s => s.completed).length} / {goal.steps.length} steps completed
                      </Text>
                    </View>
                  )}

                  <View style={styles.metaSection}>
                    {goal.deadline && (
                      <Text style={styles.metaText}>
                        📅 {formatDeadline(goal.deadline)}
                      </Text>
                    )}
                    {getLinkedValueNames(goal) && (
                      <Text style={styles.metaText} numberOfLines={1}>
                        💎 {getLinkedValueNames(goal)}
                      </Text>
                    )}
                    {getLinkedRoleNames(goal) && (
                      <Text style={styles.metaText} numberOfLines={1}>
                        👤 {getLinkedRoleNames(goal)}
                      </Text>
                    )}
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>

      {goals.length > 0 && (
        <View style={styles.footer}>
          <Button
            onPress={() => router.push('/(modals)/goal/new')}
            fullWidth
          >
            + Add New Goal
          </Button>
        </View>
      )}
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
  loadingText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: PADDING.xl,
  },
  header: {
    marginBottom: PADDING.lg,
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
  emptyCard: {
    alignItems: 'center',
    padding: PADDING.xl,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: TYPOGRAPHY.h3.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.sm,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: PADDING.lg,
  },
  emptyButton: {
    marginTop: PADDING.md,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray[100],
    borderRadius: 12,
    padding: PADDING.md,
    marginBottom: PADDING.lg,
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
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border.light,
    marginHorizontal: PADDING.sm,
  },
  goalCard: {
    marginBottom: PADDING.md,
  },
  goalHeader: {
    marginBottom: PADDING.sm,
  },
  goalTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  goalTitle: {
    flex: 1,
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
    marginRight: PADDING.sm,
  },
  quadrantBadge: {
    paddingHorizontal: PADDING.sm,
    paddingVertical: PADDING.xs,
    borderRadius: 6,
  },
  quadrantText: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    fontWeight: '600',
    color: COLORS.background,
  },
  goalDescription: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
    marginBottom: PADDING.sm,
    lineHeight: TYPOGRAPHY.bodySmall.lineHeight * TYPOGRAPHY.bodySmall.fontSize,
  },
  progressSection: {
    marginBottom: PADDING.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: PADDING.xs,
  },
  progressLabel: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.tertiary,
  },
  progressValue: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.gray[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  stepsSection: {
    marginBottom: PADDING.sm,
  },
  stepsLabel: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.tertiary,
  },
  metaSection: {
    gap: GAP.xs,
  },
  metaText: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.tertiary,
  },
  footer: {
    padding: PADDING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
});
