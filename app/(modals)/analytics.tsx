// Covey Planner - Analytics Screen
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useQuadrantStats } from '@/hooks/analytics/useQuadrantStats';
import { useWeeklyReflection } from '@/hooks/reflection/useWeeklyReflection';
import { Quadrant } from '@/types';
import { COLORS } from '@/lib/constants/colors';
import { PADDING, GAP } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';

export default function AnalyticsScreen() {
  const {
    getAverageQuadrantPercentage,
    getRecentWeeks,
    getStatsForWeek,
    getTotalMinutesForWeek,
    getQuadrantPercentageForWeek,
    getQuadrant2Weeks,
    getQuadrant4LowWeeks,
  } = useQuadrantStats();

  const { getTotalCount: getReflectionCount } = useWeeklyReflection();

  const formatMinutes = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getQuadrantColor = (quadrant: Quadrant): string => {
    return COLORS.quadrant[quadrant];
  };

  const renderQuadrantBar = (
    quadrant: Quadrant,
    title: string,
    percentage: number
  ) => (
    <View key={quadrant} style={styles.quadrantBarContainer}>
      <View style={styles.quadrantBarHeader}>
        <View style={styles.quadrantBarTitleRow}>
          <View
            style={[
              styles.quadrantDot,
              { backgroundColor: getQuadrantColor(quadrant) },
            ]}
          />
          <Text style={styles.quadrantBarTitle}>{title}</Text>
        </View>
        <Text style={styles.quadrantBarPercent}>{percentage}%</Text>
      </View>
      <View style={styles.quadrantBarBackground}>
        <View
          style={[
            styles.quadrantBarFill,
            {
              width: `${percentage}%`,
              backgroundColor: getQuadrantColor(quadrant),
            },
          ]}
        />
      </View>
    </View>
  );

  const recentWeeks = getRecentWeeks(8);
  const hasData = recentWeeks.length > 0;

  const averageQ1 = getAverageQuadrantPercentage('I');
  const averageQ2 = getAverageQuadrantPercentage('II');
  const averageQ3 = getAverageQuadrantPercentage('III');
  const averageQ4 = getAverageQuadrantPercentage('IV');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Button onPress={() => router.back()} variant="ghost">
          Close
        </Button>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!hasData ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No Data Yet</Text>
            <Text style={styles.emptyText}>
              Start tracking your time in daily tasks to see analytics about how you spend your time across the quadrants.
            </Text>
          </Card>
        ) : (
          <>
            <Card style={styles.insightCard}>
              <Text style={styles.insightTitle}>Quadrant II Focus</Text>
              <Text style={styles.insightText}>
                Your goal is to maximize time in Quadrant II (Important, Not Urgent). This is where long-term success and personal growth happen.
              </Text>
            </Card>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Time Distribution</Text>
              <Text style={styles.sectionDescription}>
                Average across last {recentWeeks.length} weeks
              </Text>

              <Card>
                {renderQuadrantBar('II', 'Quadrant II - Focus Zone', averageQ2)}
                {renderQuadrantBar('I', 'Quadrant I - Urgent & Important', averageQ1)}
                {renderQuadrantBar('III', 'Quadrant III - Urgent Only', averageQ3)}
                {renderQuadrantBar('IV', 'Quadrant IV - Time Wasters', averageQ4)}
              </Card>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Metrics</Text>

              <Card>
                <View style={styles.metricsGrid}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricValue}>{getQuadrant2Weeks()}</Text>
                    <Text style={styles.metricLabel}>Weeks with 60%+ Q2</Text>
                  </View>
                  <View style={styles.metricDivider} />
                  <View style={styles.metricItem}>
                    <Text style={styles.metricValue}>{getQuadrant4LowWeeks()}</Text>
                    <Text style={styles.metricLabel}>Weeks with &lt;5% Q4</Text>
                  </View>
                </View>
              </Card>

              <Card style={styles.metricCard}>
                <View style={styles.metricsGrid}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricValue}>{recentWeeks.length}</Text>
                    <Text style={styles.metricLabel}>Weeks Tracked</Text>
                  </View>
                  <View style={styles.metricDivider} />
                  <View style={styles.metricItem}>
                    <Text style={styles.metricValue}>{getReflectionCount()}</Text>
                    <Text style={styles.metricLabel}>Reflections</Text>
                  </View>
                </View>
              </Card>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Weeks</Text>

              {recentWeeks.map(weekId => {
                const stats = getStatsForWeek(weekId);
                const total = getTotalMinutesForWeek(weekId);
                const q2Percent = getQuadrantPercentageForWeek(weekId, 'II');

                return (
                  <Card key={weekId} style={styles.weekCard}>
                    <View style={styles.weekHeader}>
                      <Text style={styles.weekTitle}>Week {weekId.split('-W')[1]}</Text>
                      <Text style={styles.weekTotal}>
                        {formatMinutes(total)} total
                      </Text>
                    </View>

                    <View style={styles.weekQuadrants}>
                      {(['I', 'II', 'III', 'IV'] as Quadrant[]).map(q => {
                        const percent = getQuadrantPercentageForWeek(weekId, q);
                        if (percent === 0) return null;

                        return (
                          <View key={q} style={styles.weekQuadrant}>
                            <View
                              style={[
                                styles.weekQuadrantDot,
                                { backgroundColor: getQuadrantColor(q) },
                              ]}
                            />
                            <Text style={styles.weekQuadrantText}>
                              Q{q}: {percent}%
                            </Text>
                          </View>
                        );
                      })}
                    </View>

                    {q2Percent >= 60 && (
                      <View style={styles.weekBadge}>
                        <Text style={styles.weekBadgeText}>Great Q2 Focus!</Text>
                      </View>
                    )}
                  </Card>
                );
              })}
            </View>

            <Button
              onPress={() => router.push('/(modals)/reflection/weekly')}
              variant="ghost"
              fullWidth
            >
              Complete Weekly Reflection
            </Button>
          </>
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
    lineHeight: 22,
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
  quadrantBarContainer: {
    marginBottom: PADDING.md,
  },
  quadrantBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: PADDING.xs,
  },
  quadrantBarTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP.xs,
  },
  quadrantDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  quadrantBarTitle: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.primary,
  },
  quadrantBarPercent: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  quadrantBarBackground: {
    height: 24,
    backgroundColor: COLORS.border.light,
    borderRadius: 12,
    overflow: 'hidden',
  },
  quadrantBarFill: {
    height: '100%',
  },
  metricsGrid: {
    flexDirection: 'row',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: TYPOGRAPHY.h3.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.xs,
  },
  metricLabel: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.tertiary,
    textAlign: 'center',
  },
  metricDivider: {
    width: 1,
    backgroundColor: COLORS.border.light,
    marginHorizontal: PADDING.md,
  },
  metricCard: {
    marginTop: PADDING.md,
  },
  weekCard: {
    marginBottom: PADDING.md,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: PADDING.sm,
  },
  weekTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
  },
  weekTotal: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
  },
  weekQuadrants: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP.md,
  },
  weekQuadrant: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP.xs,
  },
  weekQuadrantDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  weekQuadrantText: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
  },
  weekBadge: {
    marginTop: PADDING.sm,
    paddingVertical: PADDING.xs,
    paddingHorizontal: PADDING.sm,
    backgroundColor: COLORS.quadrant.II,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  weekBadgeText: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    fontWeight: '600',
    color: COLORS.background,
  },
});
