// Principle Centered Planner - Week Screen
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { HelpIcon } from '@/components/ui/HelpIcon';
import { Input } from '@/components/ui/Input';
import { COLORS } from '@/lib/constants/colors';
import { GAP, PADDING } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';
import { useGoalsQuery } from '@/queries/foundation/goals';
import { useRolesQuery } from '@/queries/foundation/roles';
import { useAddBigRockMutation, useBigRocksQuery, useCompleteBigRockMutation, useDeleteBigRockMutation, useUncompleteBigRockMutation } from '@/queries/planning/bigRocks';
import { getCurrentWeekId, getWeekDates, useWeeklyPlanQuery } from '@/queries/planning/weeklyPlan';
import { format } from 'date-fns';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WeekScreen() {
  const currentWeekId = getCurrentWeekId();
  const { data: bigRocks = [] } = useBigRocksQuery(currentWeekId);
  const { data: weeklyPlan = null, isLoading } = useWeeklyPlanQuery(currentWeekId);
  const { data: goals = [] } = useGoalsQuery();
  const { data: roles = [] } = useRolesQuery();
  const { mutate: completeBigRock } = useCompleteBigRockMutation();
  const { mutate: uncompleteBigRock } = useUncompleteBigRockMutation();
  const { mutate: addBigRock } = useAddBigRockMutation();
  const { mutate: deleteBigRock } = useDeleteBigRockMutation();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newRockTitle, setNewRockTitle] = useState('');
  const [newRockHours, setNewRockHours] = useState('');

  // Helper functions
  const getCompletedCount = () => bigRocks.filter(r => r.completedAt).length;
  const getTotalEstimatedHours = () => bigRocks.reduce((sum, r) => sum + r.estimatedHours, 0);

  const { startDate, endDate } = getWeekDates(currentWeekId);

  const formatWeekRange = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
  };

  const handleToggleBigRock = (id: string, isCompleted: boolean) => {
    if (isCompleted) {
      uncompleteBigRock(id);
    } else {
      completeBigRock(id);
    }
  };

  const handleAddBigRock = () => {
    if (!newRockTitle.trim()) {
      Alert.alert('Missing Information', 'Please enter a title for your Big Rock.');
      return;
    }

    const hours = parseFloat(newRockHours) || 0;
    if (hours <= 0) {
      Alert.alert('Invalid Hours', 'Please enter a valid number of hours.');
      return;
    }

    addBigRock(
      {
        title: newRockTitle.trim(),
        estimatedHours: hours,
        weekId: currentWeekId,
      },
      {
        onSuccess: () => {
          setNewRockTitle('');
          setNewRockHours('');
          setShowAddForm(false);
        },
      }
    );
  };

  const handleDeleteBigRock = (id: string, title: string) => {
    Alert.alert('Delete Big Rock', `Are you sure you want to delete "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteBigRock(id) },
    ]);
  };

  const getLinkedGoalTitle = (goalId?: string) => {
    if (!goalId) return null;
    return goals.find(g => g.id === goalId)?.title;
  };

  const getLinkedRoleName = (roleId?: string) => {
    if (!roleId) return null;
    return roles.find(r => r.id === roleId)?.name;
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.weekTitle}>Week of {formatWeekRange()}</Text>
            <HelpIcon conceptId="weekly-planning" size="small" />
          </View>
          <Text style={styles.weekSubtitle}>
            Focus on your most important priorities
          </Text>
        </View>

        <Card>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{bigRocks.length}</Text>
              <Text style={styles.statLabel}>Big Rocks</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{getCompletedCount()}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{getTotalEstimatedHours()}h</Text>
              <Text style={styles.statLabel}>Estimated</Text>
            </View>
          </View>
        </Card>

        {bigRocks.length === 0 ? (
          <Card style={styles.emptyCard}>
            <View style={styles.emptyTitleRow}>
              <Text style={styles.emptyTitle}>No Big Rocks Yet</Text>
              <HelpIcon conceptId="big-rocks" size="small" />
            </View>
            <Text style={styles.emptyText}>
              Big Rocks are your most important priorities for the week. They should align with your Quadrant II activities.
            </Text>
            <Button
              onPress={() => setShowAddForm(true)}
              style={styles.emptyButton}
            >
              Add First Big Rock
            </Button>
          </Card>
        ) : (
          <>
            <View style={styles.rocksSection}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>Your Big Rocks</Text>
                <HelpIcon conceptId="big-rocks" size="small" />
              </View>
              <Text style={styles.sectionDescription}>
                Quadrant II - Important, Not Urgent
              </Text>

              {bigRocks.map((rock) => (
                <Card key={rock.id} style={styles.rockCard}>
                  <View style={styles.rockHeader}>
                    <TouchableOpacity
                      onPress={() => handleToggleBigRock(rock.id, !!rock.completedAt)}
                      style={styles.checkbox}
                    >
                      {rock.completedAt && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>

                    <View style={styles.rockContent}>
                      <Text
                        style={[
                          styles.rockTitle,
                          rock.completedAt && styles.rockTitleCompleted,
                        ]}
                      >
                        {rock.title}
                      </Text>

                      <View style={styles.rockMeta}>
                        <Text style={styles.rockHours}>
                          ⏱ {rock.estimatedHours}h estimated
                        </Text>
                        {getLinkedGoalTitle(rock.linkedGoalId) && (
                          <Text style={styles.rockLinked}>
                            🎯 {getLinkedGoalTitle(rock.linkedGoalId)}
                          </Text>
                        )}
                        {getLinkedRoleName(rock.linkedRoleId) && (
                          <Text style={styles.rockLinked}>
                            👤 {getLinkedRoleName(rock.linkedRoleId)}
                          </Text>
                        )}
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleDeleteBigRock(rock.id, rock.title)}
                      style={styles.deleteButton}
                    >
                      <Text style={styles.deleteButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              ))}
            </View>
          </>
        )}

        {!showAddForm ? (
          <Button
            onPress={() => setShowAddForm(true)}
            variant="ghost"
            fullWidth
            style={{ marginTop: PADDING.lg }}
          >
            + Add Big Rock
          </Button>
        ) : (
          <Card style={styles.addForm}>
            <Text style={styles.addFormTitle}>Add Big Rock</Text>
            <Input
              value={newRockTitle}
              onChangeText={setNewRockTitle}
              placeholder="What is your most important priority?"
            />
            <Input
              value={newRockHours}
              onChangeText={setNewRockHours}
              placeholder="Estimated hours"
              keyboardType="numeric"
            />
            <View style={styles.addFormActions}>
              <Button
                onPress={() => {
                  setShowAddForm(false);
                  setNewRockTitle('');
                  setNewRockHours('');
                }}
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                onPress={handleAddBigRock}
                disabled={!newRockTitle.trim() || !newRockHours.trim()}
              >
                Add
              </Button>
            </View>
          </Card>
        )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoid: {
    flex: 1,
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
    weekTitle: {
    fontSize: TYPOGRAPHY.h2.fontSize,
    fontWeight: TYPOGRAPHY.h2.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.xs,
  },
  weekSubtitle: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
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
  emptyCard: {
    alignItems: 'center',
    padding: PADDING.xl,
    marginTop: PADDING.md,
  },
  emptyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP.sm,
    marginBottom: PADDING.sm,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: TYPOGRAPHY.h3.fontWeight,
    color: COLORS.text.primary,
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
  rocksSection: {
    marginTop: PADDING.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: PADDING.xs,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: TYPOGRAPHY.h3.fontWeight,
    color: COLORS.text.primary,
  },
  sectionDescription: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.tertiary,
    marginBottom: PADDING.md,
  },
  rockCard: {
    marginBottom: PADDING.md,
  },
  rockHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.border.light,
    marginRight: PADDING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkmark: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  rockContent: {
    flex: 1,
  },
  rockTitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: PADDING.xs,
  },
  rockTitleCompleted: {
    color: COLORS.text.tertiary,
    textDecorationLine: 'line-through',
  },
  rockMeta: {
    gap: GAP.xs,
  },
  rockHours: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
  },
  rockLinked: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.tertiary,
  },
  deleteButton: {
    padding: PADDING.xs,
    marginLeft: PADDING.xs,
  },
  deleteButtonText: {
    fontSize: 20,
    color: COLORS.text.tertiary,
  },
  addForm: {
    marginTop: PADDING.lg,
    gap: GAP.md,
  },
  addFormTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
  },
  addFormActions: {
    flexDirection: 'row',
    gap: GAP.md,
  },
});
