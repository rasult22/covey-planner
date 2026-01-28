// Principle Centered Planner - Goal Detail Modal
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { COLORS } from '@/lib/constants/colors';
import { GAP, PADDING } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';
import { useAddStepMutation, useDeleteGoalMutation, useGoalsQuery, useToggleStepCompletionMutation, useUpdateGoalMutation } from '@/queries/foundation/goals';
import { useRolesQuery } from '@/queries/foundation/roles';
import { useValuesQuery } from '@/queries/foundation/values';
import { LongTermGoal } from '@/types';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GoalDetailModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: goals = [] } = useGoalsQuery();
  const { data: values = [] } = useValuesQuery();
  const { data: roles = [] } = useRolesQuery();
  const { mutate: updateGoal } = useUpdateGoalMutation();
  const { mutate: deleteGoal } = useDeleteGoalMutation();
  const { mutate: toggleStepCompletion } = useToggleStepCompletionMutation();
  const { mutate: addStep } = useAddStepMutation();

  const [goal, setGoal] = useState<LongTermGoal | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [newStepTitle, setNewStepTitle] = useState('');
  const [showAddStep, setShowAddStep] = useState(false);

  useEffect(() => {
    const foundGoal = goals.find(g => g.id === id);
    if (foundGoal) {
      setGoal(foundGoal);
      setEditedTitle(foundGoal.title);
      setEditedDescription(foundGoal.description);
    } else {
      router.back();
    }
  }, [id, goals]);

  if (!goal) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const getLinkedValueNames = () => {
    return goal.linkedValueIds
      .map(valueId => values.find(v => v.id === valueId)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const getLinkedRoleNames = () => {
    return goal.linkedRoleIds
      .map(roleId => roles.find(r => r.id === roleId)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const getQuadrantColor = () => {
    return COLORS.quadrant[goal.quadrant];
  };

  const formatDeadline = () => {
    const date = new Date(goal.deadline);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleSaveEdit = () => {
    updateGoal(
      { id: goal.id, updates: { title: editedTitle.trim(), description: editedDescription.trim() } },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const handleAddStep = () => {
    if (!newStepTitle.trim()) return;

    addStep(
      { goalId: goal.id, step: { title: newStepTitle.trim() } },
      {
        onSuccess: () => {
          setNewStepTitle('');
          setShowAddStep(false);
        },
      }
    );
  };

  const handleToggleStep = (stepId: string) => {
    toggleStepCompletion({ goalId: goal.id, stepId });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Goal',
      `Are you sure you want to delete "${goal.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteGoal(goal.id, {
              onSuccess: () => router.back(),
            });
          },
        },
      ]
    );
  };

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
        <Card>
          {isEditing ? (
            <>
              <Input
                value={editedTitle}
                onChangeText={setEditedTitle}
                placeholder="Goal title..."
                style={styles.input}
              />
              <Input
                value={editedDescription}
                onChangeText={setEditedDescription}
                placeholder="Describe your goal..."
                multiline
                numberOfLines={3}
                style={styles.input}
              />
              <View style={styles.editActions}>
                <Button
                  onPress={() => {
                    setIsEditing(false);
                    setEditedTitle(goal.title);
                    setEditedDescription(goal.description);
                  }}
                  variant="ghost"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  onPress={handleSaveEdit}
                  size="sm"
                >
                  Save
                </Button>
              </View>
            </>
          ) : (
            <>
              <View style={styles.header}>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>{goal.title}</Text>
                  <View
                    style={[
                      styles.quadrantBadge,
                      { backgroundColor: getQuadrantColor() }
                    ]}
                  >
                    <Text style={styles.quadrantText}>{goal.quadrant}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Text style={styles.editLink}>Edit</Text>
                </TouchableOpacity>
              </View>

              {goal.description && (
                <Text style={styles.description}>{goal.description}</Text>
              )}

              <View style={styles.metaSection}>
                <Text style={styles.metaText}>📅 {formatDeadline()}</Text>
                {getLinkedValueNames() && (
                  <Text style={styles.metaText}>💎 {getLinkedValueNames()}</Text>
                )}
                {getLinkedRoleNames() && (
                  <Text style={styles.metaText}>👤 {getLinkedRoleNames()}</Text>
                )}
              </View>
            </>
          )}
        </Card>

        <Card>
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.sectionTitle}>Progress</Text>
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
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Steps</Text>
          <Text style={styles.helperText}>
            Break down your goal into actionable steps
          </Text>

          {goal.steps.length === 0 ? (
            <Text style={styles.emptyText}>No steps yet</Text>
          ) : (
            <View style={styles.stepsList}>
              {goal.steps.map((step) => (
                <TouchableOpacity
                  key={step.id}
                  onPress={() => handleToggleStep(step.id)}
                  style={styles.stepItem}
                >
                  <View style={styles.checkbox}>
                    {step.completed && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepTitle,
                      step.completed && styles.stepTitleCompleted,
                    ]}
                  >
                    {step.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {!showAddStep ? (
            <Button
              onPress={() => setShowAddStep(true)}
              variant="ghost"
              size="sm"
            >
              + Add Step
            </Button>
          ) : (
            <View style={styles.addStepForm}>
              <Input
                value={newStepTitle}
                onChangeText={setNewStepTitle}
                placeholder="Step title..."
                style={styles.stepInput}
              />
              <View style={styles.stepActions}>
                <Button
                  onPress={() => {
                    setShowAddStep(false);
                    setNewStepTitle('');
                  }}
                  variant="ghost"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  onPress={handleAddStep}
                  disabled={!newStepTitle.trim()}
                  size="sm"
                >
                  Add
                </Button>
              </View>
            </View>
          )}
        </Card>

        <Button
          onPress={handleDelete}
          variant="danger"
          fullWidth
        >
          Delete Goal
        </Button>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <Button
          onPress={() => router.back()}
          variant="secondary"
          fullWidth
        >
          Close
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
  keyboardAvoid: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: PADDING.lg,
    paddingBottom: PADDING['2xl'],
    gap: GAP.md,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: PADDING.xl,
  },
  header: {
    marginBottom: PADDING.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: PADDING.xs,
  },
  title: {
    flex: 1,
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: TYPOGRAPHY.h3.fontWeight,
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
  editLink: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  description: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.secondary,
    marginBottom: PADDING.sm,
    lineHeight: TYPOGRAPHY.body.lineHeight * TYPOGRAPHY.body.fontSize,
  },
  metaSection: {
    gap: GAP.xs,
  },
  metaText: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.tertiary,
  },
  input: {
    marginBottom: PADDING.md,
  },
  editActions: {
    flexDirection: 'row',
    gap: GAP.sm,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.sm,
  },
  helperText: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.tertiary,
    marginBottom: PADDING.md,
  },
  progressSection: {
    marginBottom: PADDING.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: PADDING.sm,
  },
  progressValue: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.gray[700],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.tertiary,
    marginBottom: PADDING.md,
  },
  stepsList: {
    gap: GAP.sm,
    marginBottom: PADDING.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: PADDING.sm,
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
  },
  checkmark: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  stepTitle: {
    flex: 1,
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.primary,
  },
  stepTitleCompleted: {
    color: COLORS.text.tertiary,
    textDecorationLine: 'line-through',
  },
  addStepForm: {
    gap: GAP.sm,
  },
  stepInput: {
    marginBottom: 0,
  },
  stepActions: {
    flexDirection: 'row',
    gap: GAP.sm,
  },
  footer: {
    padding: PADDING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
});
