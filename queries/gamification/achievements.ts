// Principle Centered Planner - Achievements Queries & Mutations
import { storageService } from '@/lib/storage/AsyncStorageService';
import { Achievement, AchievementKey, STORAGE_KEYS } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Achievement definitions (exported for use in components)
export const ACHIEVEMENT_DEFINITIONS: Record<AchievementKey, { title: string; description: string }> = {
  first_mission: { title: 'Mission Defined', description: 'Created your personal mission statement' },
  values_defined: { title: 'Values Clarified', description: 'Defined your core values' },
  roles_complete: { title: 'Roles Established', description: 'Identified your key life roles' },
  first_goal: { title: 'Goal Setter', description: 'Created your first long-term goal' },
  first_weekly_plan: { title: 'Weekly Planner', description: 'Completed your first weekly planning session' },
  first_big_rock: { title: 'Big Rock Starter', description: 'Created your first Big Rock' },
  ten_big_rocks: { title: 'Big Rock Builder', description: 'Completed 10 Big Rocks' },
  fifty_big_rocks: { title: 'Big Rock Master', description: 'Completed 50 Big Rocks' },
  balanced_week: { title: 'Balanced Life', description: 'Planned Big Rocks across all your roles in one week' },
  q2_master: { title: 'Quadrant II Master', description: 'Spent 60%+ of your time in Quadrant II for a week' },
  q2_champion: { title: 'Quadrant II Champion', description: 'Maintained 60%+ Quadrant II time for 4 consecutive weeks' },
  q4_eliminator: { title: 'Quadrant IV Eliminator', description: 'Spent less than 5% of your time in Quadrant IV for a week' },
  week_streak_4: { title: 'Monthly Planner', description: 'Completed weekly planning 4 weeks in a row' },
  week_streak_12: { title: 'Quarterly Planner', description: 'Completed weekly planning 12 weeks in a row' },
  week_streak_52: { title: 'Annual Planner', description: 'Completed weekly planning 52 weeks in a row' },
  day_streak_7: { title: 'Week Warrior', description: 'Completed daily planning 7 days in a row' },
  day_streak_30: { title: 'Month Master', description: 'Completed daily planning 30 days in a row' },
  day_streak_100: { title: 'Centurion', description: 'Completed daily planning 100 days in a row' },
  first_goal_complete: { title: 'Goal Achiever', description: 'Completed your first long-term goal' },
  ten_goals_complete: { title: 'Goal Master', description: 'Completed 10 long-term goals' },
  priority_a_master: { title: 'Priority Master', description: 'Completed 50 Priority A tasks' },
  task_finisher: { title: 'Task Finisher', description: 'Completed 100 daily tasks' },
  first_reflection: { title: 'Reflective Starter', description: 'Completed your first weekly reflection' },
  reflective_quarter: { title: 'Reflective Quarter', description: 'Completed weekly reflections for 12 consecutive weeks' },
};

function initializeAchievements(): Achievement[] {
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
}

// ============================================================================
// QUERIES
// ============================================================================

export function useAchievementsQuery() {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const stored = await storageService.getItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS);
      
      if (!stored) {
        const initialized = initializeAchievements();
        await storageService.setItem(STORAGE_KEYS.ACHIEVEMENTS, initialized);
        return initialized;
      }
      
      return stored;
    },
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

export function useUnlockAchievementMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (key: AchievementKey) => {
      const achievements = queryClient.getQueryData<Achievement[]>(['achievements']) || [];
      const achievement = achievements.find(a => a.key === key);

      if (!achievement || achievement.isUnlocked) {
        return null; // Already unlocked or doesn't exist
      }

      const updated = achievements.map(a =>
        a.key === key ? { ...a, isUnlocked: true, unlockedAt: new Date().toISOString() } : a
      );

      await storageService.setItem(STORAGE_KEYS.ACHIEVEMENTS, updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
  });
}
