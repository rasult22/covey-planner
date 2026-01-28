// Principle Centered Planner - Time Management Matrix Screen
import { Card } from '@/components/ui/Card';
import { HelpIcon } from '@/components/ui/HelpIcon';
import { COLORS } from '@/lib/constants/colors';
import { GAP, PADDING } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';
import { useBigRocksQuery } from '@/queries/planning/bigRocks';
import { getTodayKey, useDailyTasksQuery } from '@/queries/planning/dailyTasks';
import { getCurrentWeekId } from '@/queries/planning/weeklyPlan';
import { Quadrant } from '@/types';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MatrixScreen() {
  const { data: tasks = [] } = useDailyTasksQuery(getTodayKey());
  const { data: bigRocks = [] } = useBigRocksQuery(getCurrentWeekId());
  const [selectedQuadrant, setSelectedQuadrant] = useState<Quadrant | null>(null);

  const getQuadrantTitle = (quadrant: Quadrant): string => {
    const titles = {
      'I': 'Urgent & Important',
      'II': 'Not Urgent & Important',
      'III': 'Urgent & Not Important',
      'IV': 'Not Urgent & Not Important',
    };
    return titles[quadrant];
  };

  const getQuadrantDescription = (quadrant: Quadrant): string => {
    const descriptions = {
      'I': 'Crises, Deadlines, Emergencies',
      'II': 'Planning, Prevention, Growth',
      'III': 'Interruptions, Some Calls',
      'IV': 'Time Wasters, Busy Work',
    };
    return descriptions[quadrant];
  };

  const getQuadrantItems = (quadrant: Quadrant) => {
    const quadrantTasks = tasks.filter(task => task.quadrant === quadrant);
    const quadrantRocks = bigRocks.filter(rock => rock.quadrant === quadrant);
    return { tasks: quadrantTasks, rocks: quadrantRocks };
  };

  const getQuadrantTime = (quadrant: Quadrant): number => {
    const completedTasks = tasks.filter(task => task.quadrant === quadrant && task.status === 'completed');
    return completedTasks.reduce((sum, task) => sum + task.estimatedMinutes, 0);
  };

  const getTotalTime = (): number => {
    const completedTasks = tasks.filter(task => task.status === 'completed');
    return completedTasks.reduce((sum, task) => sum + task.estimatedMinutes, 0);
  };

  const getQuadrantPercentage = (quadrant: Quadrant): number => {
    const totalTime = getTotalTime();
    if (totalTime === 0) return 0;
    return Math.round((getQuadrantTime(quadrant) / totalTime) * 100);
  };

  const formatMinutes = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getQuadrantColor = (quadrant: Quadrant): string => {
    return COLORS.quadrant[quadrant];
  };

  const renderQuadrant = (quadrant: Quadrant) => {
    const { tasks: quadrantTasks, rocks: quadrantRocks } = getQuadrantItems(quadrant);
    const totalItems = quadrantTasks.length + quadrantRocks.length;
    const timeSpent = getQuadrantTime(quadrant);
    const percentage = getQuadrantPercentage(quadrant);
    const isQ2 = quadrant === 'II';

    return (
      <TouchableOpacity
        key={quadrant}
        style={[
          styles.quadrantCard,
          isQ2 && styles.quadrantCardHighlight,
        ]}
        onPress={() => setSelectedQuadrant(quadrant)}
        activeOpacity={0.7}
      >
        <View style={styles.quadrantHeader}>
          <View style={styles.quadrantTitleRow}>
            <View style={[styles.quadrantBadge, { backgroundColor: getQuadrantColor(quadrant) }]}>
              <Text style={styles.quadrantBadgeText}>{quadrant}</Text>
            </View>
            <Text style={styles.quadrantNumber}>{totalItems}</Text>
          </View>
          <Text style={styles.quadrantTitle}>{getQuadrantTitle(quadrant)}</Text>
          <Text style={styles.quadrantDescription}>{getQuadrantDescription(quadrant)}</Text>
        </View>

        <View style={styles.quadrantStats}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Time Spent:</Text>
            <Text style={styles.statValue}>{formatMinutes(timeSpent)}</Text>
          </View>
          {totalItems > 0 && (
            <>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Tasks:</Text>
                <Text style={styles.statValue}>{quadrantTasks.length}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Big Rocks:</Text>
                <Text style={styles.statValue}>{quadrantRocks.length}</Text>
              </View>
            </>
          )}
          {percentage > 0 && (
            <View style={styles.percentageBar}>
              <View style={[styles.percentageFill, { width: `${percentage}%` }]} />
              <Text style={styles.percentageText}>{percentage}%</Text>
            </View>
          )}
        </View>

        {isQ2 && (
          <View style={styles.q2Badge}>
            <Text style={styles.q2BadgeText}>Focus Zone</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderDetailView = () => {
    if (!selectedQuadrant) return null;

    const { tasks: quadrantTasks, rocks: quadrantRocks } = getQuadrantItems(selectedQuadrant);

    return (
      <View style={styles.detailView}>
        <View style={styles.detailHeader}>
          <View style={styles.detailTitleRow}>
            <View style={[styles.quadrantBadge, { backgroundColor: getQuadrantColor(selectedQuadrant) }]}>
              <Text style={styles.quadrantBadgeText}>{selectedQuadrant}</Text>
            </View>
            <Text style={styles.detailTitle}>{getQuadrantTitle(selectedQuadrant)}</Text>
          </View>
          <TouchableOpacity onPress={() => setSelectedQuadrant(null)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
          {quadrantRocks.length > 0 && (
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Big Rocks</Text>
              {quadrantRocks.map(rock => (
                <Card key={rock.id} style={styles.detailItem}>
                  <View style={styles.detailItemHeader}>
                    <Text style={styles.detailItemTitle}>{rock.title}</Text>
                    {rock.completedAt && (
                      <Text style={styles.detailItemComplete}>✓</Text>
                    )}
                  </View>
                  <Text style={styles.detailItemMetaText}>
                    {rock.estimatedHours}h estimated
                  </Text>
                </Card>
              ))}
            </View>
          )}

          {quadrantTasks.length > 0 && (
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Today's Tasks</Text>
              {quadrantTasks.map(task => (
                <Card key={task.id} style={styles.detailItem}>
                  <View style={styles.detailItemHeader}>
                    <View style={styles.detailItemTitleRow}>
                      <View style={[styles.priorityBadge, { backgroundColor: COLORS.priority[task.priority] }]}>
                        <Text style={styles.priorityBadgeText}>{task.priority}</Text>
                      </View>
                      <Text style={[
                        styles.detailItemTitle,
                        task.status === 'completed' && styles.detailItemTitleCompleted,
                      ]}>
                        {task.title}
                      </Text>
                    </View>
                    {task.status === 'completed' && (
                      <Text style={styles.detailItemComplete}>✓</Text>
                    )}
                  </View>
                  <Text style={styles.detailItemMetaText}>
                    {task.estimatedMinutes}m
                  </Text>
                </Card>
              ))}
            </View>
          )}

          {quadrantTasks.length === 0 && quadrantRocks.length === 0 && (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>No items in this quadrant</Text>
            </Card>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Time Management Matrix</Text>
            <HelpIcon conceptId="quadrants" />
          </View>
          <Text style={styles.subtitle}>
            Organize your life by urgency and importance
          </Text>
        </View>

        <Card style={styles.insightCard}>
          <Text style={styles.insightTitle}>Key Insight</Text>
          <Text style={styles.insightText}>
            Effective people stay out of Quadrants III and IV because, urgent or not, they aren't important.
            They also shrink Quadrant I by spending more time in Quadrant II - the "Focus Zone."
          </Text>
        </Card>

        <View style={styles.matrixGrid}>
          <View style={styles.matrixRow}>
            {renderQuadrant('I')}
            {renderQuadrant('II')}
          </View>
          <View style={styles.matrixRow}>
            {renderQuadrant('III')}
            {renderQuadrant('IV')}
          </View>
        </View>

        {getTotalTime() > 0 && (
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Time Distribution</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Time Tracked:</Text>
              <Text style={styles.summaryValue}>{formatMinutes(getTotalTime())}</Text>
            </View>
            <View style={styles.summaryGrid}>
              {(['I', 'II', 'III', 'IV'] as Quadrant[]).map(q => {
                const percentage = getQuadrantPercentage(q);
                if (percentage === 0) return null;
                return (
                  <View key={q} style={styles.summaryItem}>
                    <View style={[styles.summaryBadge, { backgroundColor: getQuadrantColor(q) }]}>
                      <Text style={styles.summaryBadgeText}>{q}</Text>
                    </View>
                    <Text style={styles.summaryPercent}>{percentage}%</Text>
                  </View>
                );
              })}
            </View>
          </Card>
        )}
      </ScrollView>

      {selectedQuadrant && renderDetailView()}
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
    marginBottom: PADDING.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  insightCard: {
    backgroundColor: COLORS.surface,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.quadrant.II,
    marginBottom: PADDING.lg,
  },
  insightTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.sm,
  },
  insightText: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  matrixGrid: {
    gap: GAP.md,
  },
  matrixRow: {
    flexDirection: 'row',
    gap: GAP.md,
  },
  quadrantCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: PADDING.md,
    borderWidth: 2,
    borderColor: COLORS.border.light,
    minHeight: 160,
  },
  quadrantCardHighlight: {
    borderColor: COLORS.quadrant.II,
    borderWidth: 3,
  },
  quadrantHeader: {
    marginBottom: PADDING.sm,
  },
  quadrantTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: PADDING.xs,
  },
  quadrantBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quadrantBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  quadrantNumber: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: TYPOGRAPHY.h3.fontWeight,
    color: COLORS.text.primary,
  },
  quadrantTitle: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  quadrantDescription: {
    fontSize: 11,
    color: COLORS.text.tertiary,
  },
  quadrantStats: {
    gap: GAP.xs,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.tertiary,
  },
  statValue: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  percentageBar: {
    height: 20,
    backgroundColor: COLORS.border.light,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: PADDING.xs,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    opacity: 0.3,
  },
  percentageText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    zIndex: 1,
  },
  q2Badge: {
    position: 'absolute',
    top: PADDING.xs,
    right: PADDING.xs,
    backgroundColor: COLORS.quadrant.II,
    paddingHorizontal: PADDING.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  q2BadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  summaryCard: {
    marginTop: PADDING.lg,
  },
  summaryTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: PADDING.md,
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.secondary,
  },
  summaryValue: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: GAP.md,
    flexWrap: 'wrap',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP.xs,
  },
  summaryBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  summaryPercent: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  detailView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.background,
    zIndex: 10,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: PADDING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  detailTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP.sm,
  },
  detailTitle: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: TYPOGRAPHY.h3.fontWeight,
    color: COLORS.text.primary,
  },
  closeButton: {
    padding: PADDING.xs,
  },
  closeButtonText: {
    fontSize: 24,
    color: COLORS.text.tertiary,
  },
  detailScroll: {
    flex: 1,
  },
  detailSection: {
    padding: PADDING.lg,
  },
  detailSectionTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.md,
  },
  detailItem: {
    marginBottom: PADDING.md,
  },
  detailItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: PADDING.xs,
  },
  detailItemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP.xs,
    flex: 1,
  },
  detailItemTitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    color: COLORS.text.primary,
    flex: 1,
  },
  detailItemTitleCompleted: {
    color: COLORS.text.tertiary,
    textDecorationLine: 'line-through',
  },
  detailItemComplete: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  detailItemMetaText: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
  },
  priorityBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  emptyCard: {
    padding: PADDING.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.tertiary,
  },
});
