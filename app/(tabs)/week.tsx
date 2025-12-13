// Covey Planner - Week Screen
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useBigRocks } from '@/hooks/planning/useBigRocks';
import { useWeeklyPlan, getCurrentWeekId, getWeekDates } from '@/hooks/planning/useWeeklyPlan';
import { useGoals } from '@/hooks/foundation/useGoals';
import { useRoles } from '@/hooks/foundation/useRoles';
import { COLORS } from '@/lib/constants/colors';
import { PADDING, GAP } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';

export default function WeekScreen() {
  const currentWeekId = getCurrentWeekId();
  const { bigRocks, completeBigRock, uncompleteBigRock, addBigRock, deleteBigRock, getCompletedCount, getTotalEstimatedHours } = useBigRocks(currentWeekId);
  const { weeklyPlan, isLoading } = useWeeklyPlan(currentWeekId);
  const { goals } = useGoals();
  const { roles } = useRoles();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newRockTitle, setNewRockTitle] = useState('');
  const [newRockHours, setNewRockHours] = useState('');

  const { startDate, endDate } = getWeekDates(currentWeekId);

  const formatWeekRange = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  };

  const handleToggleBigRock = async (id: string, isCompleted: boolean) => {
    if (isCompleted) {
      await uncompleteBigRock(id);
    } else {
      await completeBigRock(id);
    }
  };

  const handleAddBigRock = async () => {
    if (!newRockTitle.trim()) {
      Alert.alert('Missing Information', 'Please enter a title for your Big Rock.');
      return;
    }

    const hours = parseFloat(newRockHours) || 0;
    if (hours <= 0) {
      Alert.alert('Invalid Hours', 'Please enter a valid number of hours.');
      return;
    }

    const success = await addBigRock({
      title: newRockTitle.trim(),
      estimatedHours: hours,
      weekId: currentWeekId,
    });

    if (success) {
      setNewRockTitle('');
      setNewRockHours('');
      setShowAddForm(false);
    }
  };

  const handleDeleteBigRock = (id: string, title: string) => {
    Alert.alert(
      'Delete Big Rock',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteBigRock(id),
        },
      ]
    );
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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.weekTitle}>Week of {formatWeekRange()}</Text>
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
            <Text style={styles.emptyTitle}>No Big Rocks Yet</Text>
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
              <Text style={styles.sectionTitle}>Your Big Rocks</Text>
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
  rocksSection: {
    marginTop: PADDING.md,
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
    marginLeft: PADDING.sm,
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
