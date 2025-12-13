// Covey Planner - useStreaks Hook
import { useState, useEffect, useCallback } from 'react';
import { StreakData, STORAGE_KEYS } from '@/types';
import { storageService } from '@/lib/storage/AsyncStorageService';
import { getWeek, getYear, parseISO, differenceInDays, subDays } from 'date-fns';

// Helper to get week ID
function getWeekId(date: Date): string {
  const year = getYear(date);
  const weekNumber = getWeek(date, { weekStartsOn: 0 });
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
}

// Helper to get date key
function getDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Helper to get previous week ID
function getPreviousWeekId(weekId: string): string {
  const [year, week] = weekId.split('-W').map(Number);
  if (week === 1) {
    return `${year - 1}-W52`;
  }
  return `${year}-W${(week - 1).toString().padStart(2, '0')}`;
}

const initialStreakData: StreakData = {
  weeklyPlanning: {
    currentStreak: 0,
    longestStreak: 0,
    history: {},
  },
  dailyPlanning: {
    currentStreak: 0,
    longestStreak: 0,
    history: {},
  },
};

export function useStreaks() {
  const [streakData, setStreakData] = useState<StreakData>(initialStreakData);
  const [isLoading, setIsLoading] = useState(true);

  const loadStreaks = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await storageService.getItem<StreakData>(STORAGE_KEYS.STREAKS);
      setStreakData(stored || initialStreakData);
    } catch (err) {
      console.error('Error loading streaks:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStreaks();
  }, [loadStreaks]);

  const saveStreaks = async (data: StreakData): Promise<boolean> => {
    try {
      const success = await storageService.setItem(STORAGE_KEYS.STREAKS, data);
      if (success) {
        setStreakData(data);
      }
      return success;
    } catch (err) {
      console.error('Error saving streaks:', err);
      return false;
    }
  };

  const recordWeeklyPlanning = async (weekId?: string): Promise<boolean> => {
    const currentWeekId = weekId || getWeekId(new Date());
    const now = new Date().toISOString();

    const updatedHistory = {
      ...streakData.weeklyPlanning.history,
      [currentWeekId]: {
        completed: true,
        completedAt: now,
      },
    };

    // Calculate streak
    let currentStreak = 1;
    let checkWeekId = getPreviousWeekId(currentWeekId);

    while (updatedHistory[checkWeekId]?.completed) {
      currentStreak++;
      checkWeekId = getPreviousWeekId(checkWeekId);

      // Safety limit to prevent infinite loops
      if (currentStreak > 1000) break;
    }

    const longestStreak = Math.max(
      streakData.weeklyPlanning.longestStreak,
      currentStreak
    );

    const updated: StreakData = {
      ...streakData,
      weeklyPlanning: {
        currentStreak,
        longestStreak,
        lastWeekId: currentWeekId,
        history: updatedHistory,
      },
    };

    return await saveStreaks(updated);
  };

  const recordDailyPlanning = async (dateKey?: string): Promise<boolean> => {
    const currentDateKey = dateKey || getDateKey(new Date());
    const now = new Date().toISOString();

    const updatedHistory = {
      ...streakData.dailyPlanning.history,
      [currentDateKey]: {
        completed: true,
        completedAt: now,
      },
    };

    // Calculate streak - check consecutive days
    let currentStreak = 1;
    const currentDate = parseISO(currentDateKey);
    let checkDate = subDays(currentDate, 1);

    while (updatedHistory[getDateKey(checkDate)]?.completed) {
      currentStreak++;
      checkDate = subDays(checkDate, 1);

      // Safety limit
      if (currentStreak > 1000) break;
    }

    const longestStreak = Math.max(
      streakData.dailyPlanning.longestStreak,
      currentStreak
    );

    const updated: StreakData = {
      ...streakData,
      dailyPlanning: {
        currentStreak,
        longestStreak,
        lastDateKey: currentDateKey,
        history: updatedHistory,
      },
    };

    return await saveStreaks(updated);
  };

  const getWeeklyStreak = (): number => {
    return streakData.weeklyPlanning.currentStreak;
  };

  const getDailyStreak = (): number => {
    return streakData.dailyPlanning.currentStreak;
  };

  const getLongestWeeklyStreak = (): number => {
    return streakData.weeklyPlanning.longestStreak;
  };

  const getLongestDailyStreak = (): number => {
    return streakData.dailyPlanning.longestStreak;
  };

  const hasPlannedWeek = (weekId: string): boolean => {
    return streakData.weeklyPlanning.history[weekId]?.completed || false;
  };

  const hasPlannedDay = (dateKey: string): boolean => {
    return streakData.dailyPlanning.history[dateKey]?.completed || false;
  };

  const getTotalWeeksPlanned = (): number => {
    return Object.keys(streakData.weeklyPlanning.history).filter(
      key => streakData.weeklyPlanning.history[key].completed
    ).length;
  };

  const getTotalDaysPlanned = (): number => {
    return Object.keys(streakData.dailyPlanning.history).filter(
      key => streakData.dailyPlanning.history[key].completed
    ).length;
  };

  return {
    streakData,
    isLoading,
    recordWeeklyPlanning,
    recordDailyPlanning,
    getWeeklyStreak,
    getDailyStreak,
    getLongestWeeklyStreak,
    getLongestDailyStreak,
    hasPlannedWeek,
    hasPlannedDay,
    getTotalWeeksPlanned,
    getTotalDaysPlanned,
    reload: loadStreaks,
  };
}
