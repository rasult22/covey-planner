// Covey Planner - useWeeklyReflection Hook
import { useState, useEffect, useCallback } from 'react';
import { WeeklyReflection, STORAGE_KEYS } from '@/types';
import { storageService } from '@/lib/storage/AsyncStorageService';
import { startOfWeek, format } from 'date-fns';

// Helper to get week start date
function getWeekStartDate(date: Date): string {
  const start = startOfWeek(date, { weekStartsOn: 0 }); // Sunday
  return format(start, 'yyyy-MM-dd');
}

export function useWeeklyReflection(weekStartDate?: string) {
  const [currentWeekStart] = useState(
    weekStartDate || getWeekStartDate(new Date())
  );
  const [reflection, setReflection] = useState<WeeklyReflection | null>(null);
  const [allReflections, setAllReflections] = useState<WeeklyReflection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadReflections = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await storageService.getItem<WeeklyReflection[]>(
        STORAGE_KEYS.WEEKLY_REFLECTIONS
      );
      const reflections = stored || [];

      setAllReflections(reflections);

      // Find reflection for current week
      const current = reflections.find(r => r.weekStart === currentWeekStart);
      setReflection(current || null);
    } catch (err) {
      console.error('Error loading weekly reflections:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentWeekStart]);

  useEffect(() => {
    loadReflections();
  }, [loadReflections]);

  const createReflection = async (
    questions: WeeklyReflection['questions']
  ): Promise<boolean> => {
    try {
      const newReflection: WeeklyReflection = {
        id: `reflection_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        weekStart: currentWeekStart,
        questions,
        completedAt: new Date().toISOString(),
      };

      const updated = [...allReflections, newReflection];
      const success = await storageService.setItem(
        STORAGE_KEYS.WEEKLY_REFLECTIONS,
        updated
      );

      if (success) {
        await loadReflections();
      }

      return success;
    } catch (err) {
      console.error('Error creating weekly reflection:', err);
      return false;
    }
  };

  const updateReflection = async (
    questions: Partial<WeeklyReflection['questions']>
  ): Promise<boolean> => {
    if (!reflection) return false;

    try {
      const updated = allReflections.map(r =>
        r.id === reflection.id
          ? {
              ...r,
              questions: { ...r.questions, ...questions },
              completedAt: new Date().toISOString(),
            }
          : r
      );

      const success = await storageService.setItem(
        STORAGE_KEYS.WEEKLY_REFLECTIONS,
        updated
      );

      if (success) {
        await loadReflections();
      }

      return success;
    } catch (err) {
      console.error('Error updating weekly reflection:', err);
      return false;
    }
  };

  const deleteReflection = async (id: string): Promise<boolean> => {
    try {
      const updated = allReflections.filter(r => r.id !== id);
      const success = await storageService.setItem(
        STORAGE_KEYS.WEEKLY_REFLECTIONS,
        updated
      );

      if (success) {
        await loadReflections();
      }

      return success;
    } catch (err) {
      console.error('Error deleting weekly reflection:', err);
      return false;
    }
  };

  const hasReflectionForWeek = (weekStart: string): boolean => {
    return allReflections.some(r => r.weekStart === weekStart);
  };

  const getReflectionByWeek = (weekStart: string): WeeklyReflection | null => {
    return allReflections.find(r => r.weekStart === weekStart) || null;
  };

  const getTotalCount = (): number => {
    return allReflections.length;
  };

  const getRecentReflections = (limit: number = 10): WeeklyReflection[] => {
    return allReflections
      .sort((a, b) => {
        return (
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        );
      })
      .slice(0, limit);
  };

  const getCurrentStreak = (): number => {
    if (allReflections.length === 0) return 0;

    // Sort reflections by week start date in descending order
    const sorted = [...allReflections].sort((a, b) => {
      return new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime();
    });

    let streak = 0;
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

    for (let i = 0; i < sorted.length; i++) {
      if (i === 0) {
        streak = 1;
        continue;
      }

      const currentWeekTime = new Date(sorted[i].weekStart).getTime();
      const previousWeekTime = new Date(sorted[i - 1].weekStart).getTime();
      const difference = previousWeekTime - currentWeekTime;

      // Check if weeks are consecutive (within 8 days to account for variations)
      if (difference >= oneWeekMs - 86400000 && difference <= oneWeekMs + 86400000) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  return {
    reflection,
    allReflections,
    isLoading,
    currentWeekStart,
    createReflection,
    updateReflection,
    deleteReflection,
    hasReflectionForWeek,
    getReflectionByWeek,
    getTotalCount,
    getRecentReflections,
    getCurrentStreak,
    reload: loadReflections,
  };
}
