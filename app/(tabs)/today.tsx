// Covey Planner - Today Screen
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { COLORS } from '@/lib/constants/colors';
import { GAP, PADDING } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';
import { getTodayKey, useAddDailyTaskMutation, useCompleteDailyTaskMutation, useDailyTasksQuery, useDeleteDailyTaskMutation, useStartTimerMutation, useStopTimerMutation, useUncompleteDailyTaskMutation } from '@/queries/planning/dailyTasks';
import { DailyTask, Priority, Quadrant } from '@/types';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PRIORITIES: Priority[] = ['A', 'B', 'C'];
const QUADRANTS: Quadrant[] = ['I', 'II', 'III', 'IV'];

export default function TodayScreen() {
  const currentDateKey = getTodayKey();
  const { data: tasks = [], isLoading } = useDailyTasksQuery(currentDateKey);
  const { mutate: addTask } = useAddDailyTaskMutation();
  const { mutate: deleteTask } = useDeleteDailyTaskMutation();
  const { mutate: completeTask } = useCompleteDailyTaskMutation();
  const { mutate: uncompleteTask } = useUncompleteDailyTaskMutation();
  const { mutate: startTimer } = useStartTimerMutation();
  const { mutate: stopTimer } = useStopTimerMutation();


  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('B');
  const [newTaskQuadrant, setNewTaskQuadrant] = useState<Quadrant>('II');
  const [newTaskMinutes, setNewTaskMinutes] = useState('');
  const [timerTask, setTimerTask] = useState<DailyTask | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Helper functions
  const getCompletedCount = () => tasks.filter(t => t.status === 'completed').length;
  const getTotalEstimatedMinutes = () => tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
  const getTotalActualMinutes = () => tasks.reduce((sum, t) => sum + (t.actualMinutes || 0), 0);
  const getActiveTimer = () => tasks.find(t => t.timerStartedAt) || null;

  // Update timer every second
  useEffect(() => {
    const activeTimer = getActiveTimer();
    setTimerTask(activeTimer);

    if (activeTimer && activeTimer.timerStartedAt) {
      const interval = setInterval(() => {
        const startTime = new Date(activeTimer.timerStartedAt!).getTime();
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(elapsed);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [tasks]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

 const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      Alert.alert('Missing Information', 'Please enter a task title.');
      return;
    }

    const minutes = parseInt(newTaskMinutes) || 30;

    addTask(
      {
        dateKey: currentDateKey,
        data: {
          title: newTaskTitle.trim(),
          priority: newTaskPriority,
          quadrant: newTaskQuadrant,
          estimatedMinutes: minutes,
        },
      },
      {
        onSuccess: () => {
          setNewTaskTitle('');
          setNewTaskMinutes('');
          setNewTaskPriority('B');
          setNewTaskQuadrant('II');
          setShowAddForm(false);
        },
      }
    );
  };

  const handleToggleTask = (task: DailyTask) => {
    if (task.status === 'completed') {
      uncompleteTask({ id: task.id, dateKey: currentDateKey });
    } else {
      completeTask({ id: task.id, dateKey: currentDateKey });
    }
  };

  const handleToggleTimer = (task: DailyTask) => {
    if (task.timerStartedAt) {
      const startTime = new Date(task.timerStartedAt).getTime();
      const elapsedMinutes = Math.round((Date.now() - startTime) / 60000);
      stopTimer({ id: task.id, dateKey: currentDateKey, elapsedMinutes });
    } else {
      const activeTimer = getActiveTimer();
      if (activeTimer) {
        const startTime = new Date(activeTimer.timerStartedAt!).getTime();
        const elapsedMinutes = Math.round((Date.now() - startTime) / 60000);
        stopTimer(
          { id: activeTimer.id, dateKey: currentDateKey, elapsedMinutes },
          { onSuccess: () => startTimer({ id: task.id, dateKey: currentDateKey }) }
        );
      } else {
        startTimer({ id: task.id, dateKey: currentDateKey });
      }
    }
  };

  const handleDeleteTask = (id: string, title: string) => {
    Alert.alert('Delete Task', `Are you sure you want to delete "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteTask({ id, dateKey: currentDateKey }),
      },
    ]);
  };

  const getPriorityColor = (priority: Priority): string => {
    return COLORS.priority[priority];
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    // Sort by priority first (A > B > C)
    if (a.priority !== b.priority) {
      return a.priority.localeCompare(b.priority);
    }
    // Then by completion status (incomplete first)
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    return 0;
  });

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
          <Text style={styles.dateText}>{format(new Date(), 'EEEE, MMMM d')}</Text>
          <Text style={styles.subtitle}>Plan your day, win your day</Text>
        </View>

        <Card>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{tasks.length}</Text>
              <Text style={styles.statLabel}>Tasks</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{getCompletedCount()}</Text>
              <Text style={styles.statLabel}>Done</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{getTotalEstimatedMinutes()}m</Text>
              <Text style={styles.statLabel}>Planned</Text>
            </View>
          </View>
        </Card>

        {timerTask && (
          <Card style={styles.timerCard}>
            <View style={styles.timerHeader}>
              <Text style={styles.timerTitle}>Active Timer</Text>
              <TouchableOpacity onPress={() => handleToggleTimer(timerTask)}>
                <Text style={styles.timerStop}>Stop</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.timerTaskTitle}>{timerTask.title}</Text>
            <Text style={styles.timerTime}>{formatTime(elapsedTime)}</Text>
          </Card>
        )}

        {tasks.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No Tasks Yet</Text>
            <Text style={styles.emptyText}>
              Add your daily tasks with A-B-C priorities. Focus on A-priority tasks first!
            </Text>
            <Button
              onPress={() => setShowAddForm(true)}
              style={styles.emptyButton}
            >
              Add First Task
            </Button>
          </Card>
        ) : (
          <>
            <View style={styles.tasksSection}>
              {sortedTasks.map((task) => (
                <Card key={task.id} style={styles.taskCard}>
                  <View style={styles.taskHeader}>
                    <TouchableOpacity
                      onPress={() => handleToggleTask(task)}
                      style={styles.checkbox}
                    >
                      {task.status === 'completed' && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>

                    <View style={styles.taskContent}>
                      <View style={styles.taskTitleRow}>
                        <View
                          style={[
                            styles.priorityBadge,
                            { borderColor: getPriorityColor(task.priority) }
                          ]}
                        >
                          <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                            {task.priority}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.taskTitle,
                            task.status === 'completed' && styles.taskTitleCompleted,
                          ]}
                        >
                          {task.title}
                        </Text>
                      </View>

                      <View style={styles.taskMeta}>
                        <Text style={styles.taskMetaText}>
                          ⏱ {task.estimatedMinutes}m est
                          {task.actualMinutes ? ` · ${task.actualMinutes}m actual` : ''}
                        </Text>
                        <Text style={styles.taskMetaText}>
                          Q{task.quadrant}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.taskActions}>
                      <TouchableOpacity
                        onPress={() => handleToggleTimer(task)}
                        style={[
                          styles.timerButton,
                          task.timerStartedAt && styles.timerButtonActive
                        ]}
                      >
                        <Text style={[
                          styles.timerButtonText,
                          task.timerStartedAt && styles.timerButtonTextActive
                        ]}>
                          {task.timerStartedAt ? '⏸' : '▶'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteTask(task.id, task.title)}
                        style={styles.deleteButton}
                      >
                        <Text style={styles.deleteButtonText}>✕</Text>
                      </TouchableOpacity>
                    </View>
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
            + Add Task
          </Button>
        ) : (
          <Card style={styles.addForm}>
            <Text style={styles.addFormTitle}>Add New Task</Text>

            <Input
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              placeholder="Task title..."
            />

            <View style={styles.formRow}>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Priority</Text>
                <View style={styles.prioritySelector}>
                  {PRIORITIES.map((p) => (
                    <TouchableOpacity
                      key={p}
                      onPress={() => setNewTaskPriority(p)}
                      style={[
                        styles.priorityOption,
                        newTaskPriority === p && styles.priorityOptionSelected,
                        { 
                          borderColor: getPriorityColor(p),
                          backgroundColor: newTaskPriority === p ? getPriorityColor(p) : COLORS.background
                        }
                      ]}
                    >
                      <Text
                        style={[
                          styles.priorityOptionText,
                          { color: getPriorityColor(p) },
                          newTaskPriority === p && styles.priorityOptionTextSelected
                        ]}
                      >
                        {p}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Quadrant</Text>
                <View style={styles.quadrantSelector}>
                  {QUADRANTS.map((q) => (
                    <TouchableOpacity
                      key={q}
                      onPress={() => setNewTaskQuadrant(q)}
                      style={[
                        styles.quadrantOption,
                        newTaskQuadrant === q && styles.quadrantOptionSelected
                      ]}
                    >
                      <Text
                        style={[
                          styles.quadrantOptionText,
                          newTaskQuadrant === q && styles.quadrantOptionTextSelected
                        ]}
                      >
                        {q}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <Input
              value={newTaskMinutes}
              onChangeText={setNewTaskMinutes}
              placeholder="Estimated minutes (default: 30)"
              keyboardType="numeric"
            />

            <View style={styles.addFormActions}>
              <Button
                onPress={() => {
                  setShowAddForm(false);
                  setNewTaskTitle('');
                  setNewTaskMinutes('');
                  setNewTaskPriority('B');
                  setNewTaskQuadrant('II');
                }}
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                onPress={handleAddTask}
                disabled={!newTaskTitle.trim()}
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
  dateText: {
    fontSize: TYPOGRAPHY.h2.fontSize,
    fontWeight: TYPOGRAPHY.h2.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.xs,
  },
  subtitle: {
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
  timerCard: {
    marginTop: PADDING.md,
    backgroundColor: COLORS.bg.tertiary,
  },
  timerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: PADDING.xs,
  },
  timerTitle: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
    textTransform: 'uppercase',
  },
  timerStop: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.primary,
    fontWeight: '600',
  },
  timerTaskTitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.primary,
    marginBottom: PADDING.xs,
  },
  timerTime: {
    fontSize: TYPOGRAPHY.h2.fontSize,
    fontWeight: TYPOGRAPHY.h2.fontWeight,
    color: COLORS.text.primary,
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
  tasksSection: {
    marginTop: PADDING.md,
    gap: GAP.md,
  },
  taskCard: {
    marginBottom: 0,
  },
  taskHeader: {
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
  taskContent: {
    flex: 1,
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: PADDING.xs,
  },
  priorityBadge: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: PADDING.sm,
  },
  priorityText: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    fontWeight: 'bold',
  },
  taskTitle: {
    flex: 1,
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  taskTitleCompleted: {
    color: COLORS.text.tertiary,
    textDecorationLine: 'line-through',
  },
  taskMeta: {
    flexDirection: 'row',
    gap: GAP.md,
  },
  taskMetaText: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.tertiary,
  },
  taskActions: {
    flexDirection: 'row',
    gap: GAP.sm,
    marginLeft: PADDING.sm,
  },
  timerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timerButtonText: {
    fontSize: 14,
    color: COLORS.text.primary,
  },
  timerButtonTextActive: {
    color: COLORS.background,
  },
  deleteButton: {
    padding: PADDING.xs,
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
  formRow: {
    flexDirection: 'row',
    gap: GAP.md,
  },
  formField: {
    flex: 1,
  },
  formLabel: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
    marginBottom: PADDING.xs,
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: GAP.xs,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: PADDING.sm,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  priorityOptionSelected: {
    // Background color set by borderColor (priority color)
  },
  priorityOptionText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: 'bold',
  },
  priorityOptionTextSelected: {
    color: COLORS.background,
  },
  quadrantSelector: {
    flexDirection: 'row',
    gap: GAP.xs,
  },
  quadrantOption: {
    flex: 1,
    paddingVertical: PADDING.sm,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  quadrantOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  quadrantOptionText: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  quadrantOptionTextSelected: {
    color: COLORS.background,
  },
  addFormActions: {
    flexDirection: 'row',
    gap: GAP.md,
  },
});
