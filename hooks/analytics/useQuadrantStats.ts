// Principle Centered Planner - useQuadrantStats Hook
import { storageService } from '@/lib/storage/AsyncStorageService';
import { Quadrant, QuadrantStats, STORAGE_KEYS } from '@/types';
import { getWeek, getYear } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';

// Helper to get week ID
function getWeekId(date: Date): string {
  const year = getYear(date);
  const weekNumber = getWeek(date, { weekStartsOn: 0 });
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
}

export function useQuadrantStats() {
  const [stats, setStats] = useState<QuadrantStats>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await storageService.getItem<QuadrantStats>(
        STORAGE_KEYS.QUADRANT_STATS
      );
      setStats(stored || {});
    } catch (err) {
      console.error('Error loading quadrant stats:', err);
      setStats({});
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const updateStatsForWeek = async (
    weekId: string,
    quadrantMinutes: {
      quadrant_I: number;
      quadrant_II: number;
      quadrant_III: number;
      quadrant_IV: number;
    }
  ): Promise<boolean> => {
    try {
      const updated = {
        ...stats,
        [weekId]: quadrantMinutes,
      };

      const success = await storageService.setItem(STORAGE_KEYS.QUADRANT_STATS, updated);

      if (success) {
        await loadStats();
      }

      return success;
    } catch (err) {
      console.error('Error updating quadrant stats:', err);
      return false;
    }
  };

  const calculateWeekStats = (tasks: any[]): {
    quadrant_I: number;
    quadrant_II: number;
    quadrant_III: number;
    quadrant_IV: number;
  } => {
    const quadrantMinutes = {
      quadrant_I: 0,
      quadrant_II: 0,
      quadrant_III: 0,
      quadrant_IV: 0,
    };

    // Only count completed tasks, using estimatedMinutes as "time spent"
    tasks
      .filter(task => task.status === 'completed')
      .forEach(task => {
        const key = `quadrant_${task.quadrant}` as keyof typeof quadrantMinutes;
        quadrantMinutes[key] += task.estimatedMinutes || 0;
      });

    return quadrantMinutes;
  };

  const getStatsForWeek = (weekId: string) => {
    return stats[weekId] || {
      quadrant_I: 0,
      quadrant_II: 0,
      quadrant_III: 0,
      quadrant_IV: 0,
    };
  };

  const getTotalMinutesForWeek = (weekId: string): number => {
    const weekStats = getStatsForWeek(weekId);
    return (
      weekStats.quadrant_I +
      weekStats.quadrant_II +
      weekStats.quadrant_III +
      weekStats.quadrant_IV
    );
  };

  const getQuadrantPercentageForWeek = (
    weekId: string,
    quadrant: Quadrant
  ): number => {
    const weekStats = getStatsForWeek(weekId);
    const total = getTotalMinutesForWeek(weekId);

    if (total === 0) return 0;

    const key = `quadrant_${quadrant}` as keyof typeof weekStats;
    return Math.round((weekStats[key] / total) * 100);
  };

  const getAverageQuadrantPercentage = (quadrant: Quadrant): number => {
    const weeks = Object.keys(stats);

    if (weeks.length === 0) return 0;

    const totalPercentage = weeks.reduce((sum, weekId) => {
      return sum + getQuadrantPercentageForWeek(weekId, quadrant);
    }, 0);

    return Math.round(totalPercentage / weeks.length);
  };

  const getRecentWeeks = (count: number = 12): string[] => {
    const weeks = Object.keys(stats).sort().reverse();
    return weeks.slice(0, count);
  };

  const getQuadrant2Weeks = (): number => {
    return Object.keys(stats).filter(weekId => {
      return getQuadrantPercentageForWeek(weekId, 'II') >= 60;
    }).length;
  };

  const hasConsecutiveQuadrant2Weeks = (count: number): boolean => {
    const weeks = Object.keys(stats).sort().reverse();

    if (weeks.length < count) return false;

    for (let i = 0; i <= weeks.length - count; i++) {
      let consecutive = true;

      for (let j = 0; j < count; j++) {
        const weekId = weeks[i + j];
        if (getQuadrantPercentageForWeek(weekId, 'II') < 60) {
          consecutive = false;
          break;
        }
      }

      if (consecutive) return true;
    }

    return false;
  };

  const getQuadrant4LowWeeks = (): number => {
    return Object.keys(stats).filter(weekId => {
      return getQuadrantPercentageForWeek(weekId, 'IV') < 5;
    }).length;
  };

  return {
    stats,
    isLoading,
    updateStatsForWeek,
    calculateWeekStats,
    getStatsForWeek,
    getTotalMinutesForWeek,
    getQuadrantPercentageForWeek,
    getAverageQuadrantPercentage,
    getRecentWeeks,
    getQuadrant2Weeks,
    hasConsecutiveQuadrant2Weeks,
    getQuadrant4LowWeeks,
    reload: loadStats,
  };
}
