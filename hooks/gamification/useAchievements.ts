// Principle Centered Planner - useAchievements Hook
import { storageService } from '@/lib/storage/AsyncStorageService';
import { Achievement, AchievementKey, STORAGE_KEYS } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

// Achievement definitions
const ACHIEVEMENT_DEFINITIONS: Record<AchievementKey, { title: string; description: string }> = {
  // Onboarding and Foundation
  first_mission: {
    title: 'Mission Defined',
    description: 'Created your personal mission statement',
  },
  values_defined: {
    title: 'Values Clarified',
    description: 'Defined your core values',
  },
  roles_complete: {
    title: 'Roles Established',
    description: 'Identified your key life roles',
  },
  first_goal: {
    title: 'Goal Setter',
    description: 'Created your first long-term goal',
  },

  // Planning
  first_weekly_plan: {
    title: 'Weekly Planner',
    description: 'Completed your first weekly planning session',
  },
  first_big_rock: {
    title: 'Big Rock Starter',
    description: 'Created your first Big Rock',
  },
  ten_big_rocks: {
    title: 'Big Rock Builder',
    description: 'Completed 10 Big Rocks',
  },
  fifty_big_rocks: {
    title: 'Big Rock Master',
    description: 'Completed 50 Big Rocks',
  },
  balanced_week: {
    title: 'Balanced Life',
    description: 'Planned Big Rocks across all your roles in one week',
  },

  // Quadrants
  q2_master: {
    title: 'Quadrant II Master',
    description: 'Spent 60%+ of your time in Quadrant II for a week',
  },
  q2_champion: {
    title: 'Quadrant II Champion',
    description: 'Maintained 60%+ Quadrant II time for 4 consecutive weeks',
  },
  q4_eliminator: {
    title: 'Quadrant IV Eliminator',
    description: 'Spent less than 5% of your time in Quadrant IV for a week',
  },

  // Planning Streaks
  week_streak_4: {
    title: 'Monthly Planner',
    description: 'Completed weekly planning 4 weeks in a row',
  },
  week_streak_12: {
    title: 'Quarterly Planner',
    description: 'Completed weekly planning 12 weeks in a row',
  },
  week_streak_52: {
    title: 'Annual Planner',
    description: 'Completed weekly planning 52 weeks in a row',
  },
  day_streak_7: {
    title: 'Week Warrior',
    description: 'Completed daily planning 7 days in a row',
  },
  day_streak_30: {
    title: 'Month Master',
    description: 'Completed daily planning 30 days in a row',
  },
  day_streak_100: {
    title: 'Centurion',
    description: 'Completed daily planning 100 days in a row',
  },

  // Goals and Tasks
  first_goal_complete: {
    title: 'Goal Achiever',
    description: 'Completed your first long-term goal',
  },
  ten_goals_complete: {
    title: 'Goal Master',
    description: 'Completed 10 long-term goals',
  },
  priority_a_master: {
    title: 'Priority Master',
    description: 'Completed 50 Priority A tasks',
  },
  task_finisher: {
    title: 'Task Finisher',
    description: 'Completed 100 daily tasks',
  },

  // Reflection
  first_reflection: {
    title: 'Reflective Starter',
    description: 'Completed your first weekly reflection',
  },
  reflective_quarter: {
    title: 'Reflective Quarter',
    description: 'Completed weekly reflections for 12 consecutive weeks',
  },
};

export function useAchievements() {
  const queryClient = useQueryClient();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const initializeAchievements = (): Achievement[] => {
    return Object.keys(ACHIEVEMENT_DEFINITIONS).map((key) => {
      const achievementKey = key as AchievementKey;
      return {
        id: achievementKey,
        key: achievementKey,
        title: ACHIEVEMENT_DEFINITIONS[achievementKey].title,
        description: ACHIEVEMENT_DEFINITIONS[achievementKey].description,
        isUnlocked: false,
      };
    });
  };

  const loadAchievements = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await storageService.getItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS);

      if (!stored) {
        // Initialize with all achievements locked
        const initialized = initializeAchievements();
        await storageService.setItem(STORAGE_KEYS.ACHIEVEMENTS, initialized);
        setAchievements(initialized);
      } else {
        setAchievements(stored);
      }
    } catch (err) {
      console.error('Error loading achievements:', err);
      setAchievements(initializeAchievements());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAchievements();
  }, [loadAchievements]);

  const unlockAchievement = async (key: AchievementKey): Promise<boolean> => {
    try {
      // Read from storage to avoid stale state when multiple unlocks happen in sequence
      const current = await storageService.getItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS) || achievements;
      const achievement = current.find(a => a.key === key);

      if (!achievement || achievement.isUnlocked) {
        return false; // Already unlocked or doesn't exist
      }

      const updated = current.map(a =>
        a.key === key
          ? { ...a, isUnlocked: true, unlockedAt: new Date().toISOString() }
          : a
      );

      const success = await storageService.setItem(STORAGE_KEYS.ACHIEVEMENTS, updated);

      if (success) {
        setAchievements(updated);
        queryClient.invalidateQueries({ queryKey: ['achievements'] });
      }

      return success;
    } catch (err) {
      console.error('Error unlocking achievement:', err);
      return false;
    }
  };

  const isUnlocked = (key: AchievementKey): boolean => {
    const achievement = achievements.find(a => a.key === key);
    return achievement?.isUnlocked || false;
  };

  const getUnlockedCount = (): number => {
    return achievements.filter(a => a.isUnlocked).length;
  };

  const getTotalCount = (): number => {
    return achievements.length;
  };

  const getProgress = (): number => {
    const total = getTotalCount();
    if (total === 0) return 0;
    return Math.round((getUnlockedCount() / total) * 100);
  };

  const getUnlockedAchievements = (): Achievement[] => {
    return achievements.filter(a => a.isUnlocked);
  };

  const getLockedAchievements = (): Achievement[] => {
    return achievements.filter(a => !a.isUnlocked);
  };

  const getRecentlyUnlocked = (limit: number = 5): Achievement[] => {
    return achievements
      .filter(a => a.isUnlocked && a.unlockedAt)
      .sort((a, b) => {
        if (!a.unlockedAt || !b.unlockedAt) return 0;
        return new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime();
      })
      .slice(0, limit);
  };

  return {
    achievements,
    isLoading,
    unlockAchievement,
    isUnlocked,
    getUnlockedCount,
    getTotalCount,
    getProgress,
    getUnlockedAchievements,
    getLockedAchievements,
    getRecentlyUnlocked,
    reload: loadAchievements,
  };
}
