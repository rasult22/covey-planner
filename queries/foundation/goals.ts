// Principle Centered Planner - Goals Queries & Mutations
import { checkGoalCompletionAchievements } from '@/lib/achievements/achievementChecker';
import { storageService } from '@/lib/storage/AsyncStorageService';
import { Achievement, GoalStep, LongTermGoal, STORAGE_KEYS } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// ============================================================================
// QUERIES
// ============================================================================

export function useGoalsQuery() {
  return useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const data = await storageService.getItem<LongTermGoal[]>(STORAGE_KEYS.LONG_TERM_GOALS);
      return data || [];
    },
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

export function useAddGoalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goal: Omit<LongTermGoal, 'id' | 'createdAt' | 'progress'>) => {
      const currentGoals = queryClient.getQueryData<LongTermGoal[]>(['goals']) || [];
      
      const newGoal: LongTermGoal = {
        ...goal,
        id: `goal-${Date.now()}-${Math.random()}`,
        progress: 0,
        createdAt: new Date().toISOString(),
      };

      const updatedGoals = [...currentGoals, newGoal];
      await storageService.setItem(STORAGE_KEYS.LONG_TERM_GOALS, updatedGoals);

      // Unlock achievement for first goal
      if (updatedGoals.length === 1) {
        try {
          const achievements = await storageService.getItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS);
          if (achievements) {
            const updated = achievements.map(a =>
              a.key === 'first_goal'
                ? { ...a, isUnlocked: true, unlockedAt: new Date().toISOString() }
                : a
            );
            await storageService.setItem(STORAGE_KEYS.ACHIEVEMENTS, updated);
            queryClient.invalidateQueries({ queryKey: ['achievements'] });
          }
        } catch (err) {
          console.error('Error unlocking achievement:', err);
        }
      }

      return newGoal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

export function useUpdateGoalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<LongTermGoal> }) => {
      const currentGoals = queryClient.getQueryData<LongTermGoal[]>(['goals']) || [];
      const updatedGoals = currentGoals.map(g => (g.id === id ? { ...g, ...updates } : g));
      await storageService.setItem(STORAGE_KEYS.LONG_TERM_GOALS, updatedGoals);
      return updatedGoals;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

export function useDeleteGoalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const currentGoals = queryClient.getQueryData<LongTermGoal[]>(['goals']) || [];
      const updatedGoals = currentGoals.filter(g => g.id !== id);
      await storageService.setItem(STORAGE_KEYS.LONG_TERM_GOALS, updatedGoals);
      return updatedGoals;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

export function useToggleStepCompletionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ goalId, stepId }: { goalId: string; stepId: string }) => {
      const currentGoals = queryClient.getQueryData<LongTermGoal[]>(['goals']) || [];

      const updatedGoals = currentGoals.map(goal => {
        if (goal.id !== goalId) return goal;

        const updatedSteps = goal.steps.map(step => {
          if (step.id !== stepId) return step;
          return {
            ...step,
            completed: !step.completed,
            completedAt: !step.completed ? new Date().toISOString() : undefined,
          };
        });

        // Calculate progress
        const completedSteps = updatedSteps.filter(s => s.completed).length;
        const progress = updatedSteps.length > 0 ? Math.round((completedSteps / updatedSteps.length) * 100) : 0;

        // Check if goal is complete
        const completedAt = progress === 100 ? new Date().toISOString() : undefined;

        return {
          ...goal,
          steps: updatedSteps,
          progress,
          completedAt,
        };
      });

      await storageService.setItem(STORAGE_KEYS.LONG_TERM_GOALS, updatedGoals);
      return updatedGoals;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      const unlocked = await checkGoalCompletionAchievements();
      if (unlocked) {
        queryClient.invalidateQueries({ queryKey: ['achievements'] });
      }
    },
  });
}

export function useAddStepMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ goalId, step }: { goalId: string; step: Omit<GoalStep, 'id' | 'completed' | 'completedAt'> }) => {
      const currentGoals = queryClient.getQueryData<LongTermGoal[]>(['goals']) || [];

      const newStep: GoalStep = {
        ...step,
        id: `step-${Date.now()}-${Math.random()}`,
        completed: false,
      };

      const updatedGoals = currentGoals.map(goal => {
        if (goal.id !== goalId) return goal;
        const updatedSteps = [...goal.steps, newStep];
        // Recalculate progress when adding step
        const completedSteps = updatedSteps.filter(s => s.completed).length;
        const progress = updatedSteps.length > 0 ? Math.round((completedSteps / updatedSteps.length) * 100) : 0;
        return {
          ...goal,
          steps: updatedSteps,
          progress,
        };
      });

      await storageService.setItem(STORAGE_KEYS.LONG_TERM_GOALS, updatedGoals);
      return newStep;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

export function useDeleteStepMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ goalId, stepId }: { goalId: string; stepId: string }) => {
      const currentGoals = queryClient.getQueryData<LongTermGoal[]>(['goals']) || [];

      const updatedGoals = currentGoals.map(goal => {
        if (goal.id !== goalId) return goal;
        const updatedSteps = goal.steps.filter(s => s.id !== stepId);
        // Recalculate progress when removing step
        const completedSteps = updatedSteps.filter(s => s.completed).length;
        const progress = updatedSteps.length > 0 ? Math.round((completedSteps / updatedSteps.length) * 100) : 0;
        // Update completedAt based on new progress
        const completedAt = progress === 100 ? new Date().toISOString() : undefined;
        return {
          ...goal,
          steps: updatedSteps,
          progress,
          completedAt,
        };
      });

      await storageService.setItem(STORAGE_KEYS.LONG_TERM_GOALS, updatedGoals);
      return updatedGoals;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      const unlocked = await checkGoalCompletionAchievements();
      if (unlocked) {
        queryClient.invalidateQueries({ queryKey: ['achievements'] });
      }
    },
  });
}
