// Principle Centered Planner - Streaks Queries & Mutations
import { storageService } from '@/lib/storage/AsyncStorageService';
import { STORAGE_KEYS, StreakData } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getWeek, getYear, parseISO, subDays } from 'date-fns';

// Helpers
export function getWeekId(date: Date): string {
  const year = getYear(date);
  const weekNumber = getWeek(date, { weekStartsOn: 0 });
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
}

function getDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getPreviousWeekId(weekId: string): string {
  const [year, week] = weekId.split('-W').map(Number);
  if (week === 1) return `${year - 1}-W52`;
  return `${year}-W${(week - 1).toString().padStart(2, '0')}`;
}

const initialStreakData: StreakData = {
  weeklyPlanning: { currentStreak: 0, longestStreak: 0, history: {} },
  dailyPlanning: { currentStreak: 0, longestStreak: 0, history: {} },
};

// ============================================================================
// QUERIES
// ============================================================================

export function useStreaksQuery() {
  return useQuery({
    queryKey: ['streaks'],
    queryFn: async () => {
      const stored = await storageService.getItem<StreakData>(STORAGE_KEYS.STREAKS);
      return stored || initialStreakData;
    },
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

export function useRecordWeeklyPlanningMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (weekId?: string) => {
      const streakData = queryClient.getQueryData<StreakData>(['streaks']) || initialStreakData;
      const currentWeekId = weekId || getWeekId(new Date());
      const now = new Date().toISOString();

      const updatedHistory = {
        ...streakData.weeklyPlanning.history,
        [currentWeekId]: { completed: true, completedAt: now },
      };

      let currentStreak = 1;
      let checkWeekId = getPreviousWeekId(currentWeekId);
      while (updatedHistory[checkWeekId]?.completed && currentStreak < 1000) {
        currentStreak++;
        checkWeekId = getPreviousWeekId(checkWeekId);
      }

      const longestStreak = Math.max(streakData.weeklyPlanning.longestStreak, currentStreak);

      const updated: StreakData = {
        ...streakData,
        weeklyPlanning: { currentStreak, longestStreak, lastWeekId: currentWeekId, history: updatedHistory },
      };

      await storageService.setItem(STORAGE_KEYS.STREAKS, updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streaks'] });
    },
  });
}

export function useRecordDailyPlanningMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dateKey?: string) => {
      const streakData = queryClient.getQueryData<StreakData>(['streaks']) || initialStreakData;
      const currentDateKey = dateKey || getDateKey(new Date());
      const now = new Date().toISOString();

      const updatedHistory = {
        ...streakData.dailyPlanning.history,
        [currentDateKey]: { completed: true, completedAt: now },
      };

      let currentStreak = 1;
      const currentDate = parseISO(currentDateKey);
      let checkDate = subDays(currentDate, 1);
      while (updatedHistory[getDateKey(checkDate)]?.completed && currentStreak < 1000) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
      }

      const longestStreak = Math.max(streakData.dailyPlanning.longestStreak, currentStreak);

      const updated: StreakData = {
        ...streakData,
        dailyPlanning: { currentStreak, longestStreak, lastDateKey: currentDateKey, history: updatedHistory },
      };

      await storageService.setItem(STORAGE_KEYS.STREAKS, updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streaks'] });
    },
  });
}
