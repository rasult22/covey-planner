// Principle Centered Planner - useWeeklyPlan Hook
import { storageService } from '@/lib/storage/AsyncStorageService';
import { STORAGE_KEYS, WeeklyPlan } from '@/types';
import { endOfWeek, getWeek, getYear, startOfWeek } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';

// Helper to get week ID in format "YYYY-WW" (US format: Sunday start)
export function getWeekId(date: Date): string {
  const year = getYear(date);
  const weekNumber = getWeek(date, { weekStartsOn: 0 }); // 0 = Sunday
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
}

// Helper to get current week ID
export function getCurrentWeekId(): string {
  return getWeekId(new Date());
}

// Helper to get week start/end dates (Sunday-Saturday in US format)
export function getWeekDates(weekId: string): { startDate: string; endDate: string } {
  try {
    // For current implementation, just use the current date's week
    // This is simpler and more reliable than parsing week numbers
    const now = new Date();
    const start = startOfWeek(now, { weekStartsOn: 0 });
    const end = endOfWeek(now, { weekStartsOn: 0 });

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  } catch (error) {
    console.error('Error getting week dates:', error);
    // Fallback to current week
    const now = new Date();
    return {
      startDate: now.toISOString(),
      endDate: now.toISOString(),
    };
  }
}

export function useWeeklyPlan(weekId?: string) {
  const [currentWeekId] = useState(weekId || getCurrentWeekId());
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWeeklyPlan = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stored = await storageService.getItem<WeeklyPlan[]>(STORAGE_KEYS.WEEKLY_PLAN);
      const allPlans = stored || [];

      const plan = allPlans.find(p => p.weekId === currentWeekId);
      setWeeklyPlan(plan || null);
    } catch (err) {
      setError('Failed to load weekly plan');
      console.error('Error loading weekly plan:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentWeekId]);

  useEffect(() => {
    loadWeeklyPlan();
  }, [loadWeeklyPlan]);

  const createWeeklyPlan = async (bigRockIds: string[], notes?: string): Promise<boolean> => {
    try {
      const allPlans = await storageService.getItem<WeeklyPlan[]>(STORAGE_KEYS.WEEKLY_PLAN) || [];

      const { startDate, endDate } = getWeekDates(currentWeekId);

      const newPlan: WeeklyPlan = {
        id: `plan_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        weekId: currentWeekId,
        startDate,
        endDate,
        bigRockIds,
        notes,
        createdAt: new Date().toISOString(),
      };

      const updated = [...allPlans, newPlan];
      const success = await storageService.setItem(STORAGE_KEYS.WEEKLY_PLAN, updated);

      if (success) {
        await loadWeeklyPlan();
      }

      return success;
    } catch (err) {
      console.error('Error creating weekly plan:', err);
      return false;
    }
  };

  const updateWeeklyPlan = async (
    updates: Partial<Omit<WeeklyPlan, 'id' | 'weekId' | 'createdAt'>>
  ): Promise<boolean> => {
    if (!weeklyPlan) return false;

    try {
      const allPlans = await storageService.getItem<WeeklyPlan[]>(STORAGE_KEYS.WEEKLY_PLAN) || [];
      const updated = allPlans.map(plan =>
        plan.id === weeklyPlan.id ? { ...plan, ...updates } : plan
      );

      const success = await storageService.setItem(STORAGE_KEYS.WEEKLY_PLAN, updated);

      if (success) {
        await loadWeeklyPlan();
      }

      return success;
    } catch (err) {
      console.error('Error updating weekly plan:', err);
      return false;
    }
  };

  const addBigRockToPlan = async (bigRockId: string): Promise<boolean> => {
    if (!weeklyPlan) return false;

    const updatedBigRockIds = [...weeklyPlan.bigRockIds, bigRockId];
    return await updateWeeklyPlan({ bigRockIds: updatedBigRockIds });
  };

  const removeBigRockFromPlan = async (bigRockId: string): Promise<boolean> => {
    if (!weeklyPlan) return false;

    const updatedBigRockIds = weeklyPlan.bigRockIds.filter(id => id !== bigRockId);
    return await updateWeeklyPlan({ bigRockIds: updatedBigRockIds });
  };

  const completeWeeklyPlan = async (): Promise<boolean> => {
    return await updateWeeklyPlan({
      completedAt: new Date().toISOString(),
    });
  };

  const reload = () => {
    loadWeeklyPlan();
  };

  return {
    weeklyPlan,
    currentWeekId,
    isLoading,
    error,
    createWeeklyPlan,
    updateWeeklyPlan,
    addBigRockToPlan,
    removeBigRockFromPlan,
    completeWeeklyPlan,
    reload,
  };
}
