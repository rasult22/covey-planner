// Covey Planner - useGoals Hook
import { useState, useEffect, useCallback } from 'react';
import { storageService } from '@/lib/storage/AsyncStorageService';
import { LongTermGoal, GoalStep, STORAGE_KEYS } from '@/types';

export function useGoals() {
  const [goals, setGoals] = useState<LongTermGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGoals = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await storageService.getItem<LongTermGoal[]>(STORAGE_KEYS.LONG_TERM_GOALS);
      setGoals(data || []);
    } catch (err) {
      setError('Failed to load goals');
      console.error('Error loading goals:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addGoal = useCallback(async (goal: Omit<LongTermGoal, 'id' | 'createdAt' | 'progress'>) => {
    try {
      setError(null);
      const newGoal: LongTermGoal = {
        ...goal,
        id: `goal-${Date.now()}-${Math.random()}`,
        progress: 0,
        createdAt: new Date().toISOString(),
      };

      const updatedGoals = [...goals, newGoal];
      await storageService.setItem(STORAGE_KEYS.LONG_TERM_GOALS, updatedGoals);
      setGoals(updatedGoals);
      return newGoal;
    } catch (err) {
      setError('Failed to add goal');
      console.error('Error adding goal:', err);
      return null;
    }
  }, [goals]);

  const updateGoal = useCallback(async (id: string, updates: Partial<LongTermGoal>) => {
    try {
      setError(null);
      const updatedGoals = goals.map(g =>
        g.id === id ? { ...g, ...updates } : g
      );
      await storageService.setItem(STORAGE_KEYS.LONG_TERM_GOALS, updatedGoals);
      setGoals(updatedGoals);
      return true;
    } catch (err) {
      setError('Failed to update goal');
      console.error('Error updating goal:', err);
      return false;
    }
  }, [goals]);

  const deleteGoal = useCallback(async (id: string) => {
    try {
      setError(null);
      const updatedGoals = goals.filter(g => g.id !== id);
      await storageService.setItem(STORAGE_KEYS.LONG_TERM_GOALS, updatedGoals);
      setGoals(updatedGoals);
      return true;
    } catch (err) {
      setError('Failed to delete goal');
      console.error('Error deleting goal:', err);
      return false;
    }
  }, [goals]);

  const toggleStepCompletion = useCallback(async (goalId: string, stepId: string) => {
    try {
      setError(null);
      const updatedGoals = goals.map(goal => {
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
        const progress = updatedSteps.length > 0
          ? Math.round((completedSteps / updatedSteps.length) * 100)
          : 0;

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
      setGoals(updatedGoals);
      return true;
    } catch (err) {
      setError('Failed to toggle step');
      console.error('Error toggling step:', err);
      return false;
    }
  }, [goals]);

  const addStep = useCallback(async (goalId: string, step: Omit<GoalStep, 'id' | 'completed' | 'completedAt'>) => {
    try {
      setError(null);
      const newStep: GoalStep = {
        ...step,
        id: `step-${Date.now()}-${Math.random()}`,
        completed: false,
      };

      const updatedGoals = goals.map(goal => {
        if (goal.id !== goalId) return goal;
        return {
          ...goal,
          steps: [...goal.steps, newStep],
        };
      });

      await storageService.setItem(STORAGE_KEYS.LONG_TERM_GOALS, updatedGoals);
      setGoals(updatedGoals);
      return newStep;
    } catch (err) {
      setError('Failed to add step');
      console.error('Error adding step:', err);
      return null;
    }
  }, [goals]);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  return {
    goals,
    isLoading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleStepCompletion,
    addStep,
    reload: loadGoals,
  };
}
