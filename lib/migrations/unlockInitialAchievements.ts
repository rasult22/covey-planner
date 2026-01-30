// Principle Centered Planner - Achievement Migration Utility
import {
  checkBalancedWeekAchievement,
  checkGoalCompletionAchievements,
  checkQ2ChampionAchievement,
  checkQuadrantAchievements,
  checkTaskAchievements,
  tryUnlockAchievement,
} from '@/lib/achievements/achievementChecker';
import { storageService } from '@/lib/storage/AsyncStorageService';
import { Achievement, BigRock, DailyTask, LongTermGoal, Role, STORAGE_KEYS, StreakData, Value, WeeklyReflection } from '@/types';
import { getWeek } from 'date-fns';

/**
 * Checks existing user data and unlocks appropriate achievements
 * This is needed for users who already have data before achievement system was implemented
 */
export async function unlockInitialAchievements(): Promise<void> {
  try {
    // Get current achievements
    const achievements = await storageService.getItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS);
    if (!achievements) {
      console.log('No achievements found, skipping migration');
      return;
    }

    // ================================================================
    // FOUNDATION ACHIEVEMENTS (original migration)
    // ================================================================

    // Check mission
    const mission = await storageService.getString(STORAGE_KEYS.USER_MISSION);
    if (mission && mission.trim()) {
      await tryUnlockAchievement('first_mission');
    }

    // Check values
    const values = await storageService.getItem<Value[]>(STORAGE_KEYS.USER_VALUES);
    if (values && values.length > 0) {
      await tryUnlockAchievement('values_defined');
    }

    // Check roles
    const roles = await storageService.getItem<Role[]>(STORAGE_KEYS.USER_ROLES);
    if (roles && roles.length > 0) {
      await tryUnlockAchievement('roles_complete');
    }

    // Check goals
    const goals = await storageService.getItem<LongTermGoal[]>(STORAGE_KEYS.LONG_TERM_GOALS);
    if (goals && goals.length > 0) {
      await tryUnlockAchievement('first_goal');
    }

    // ================================================================
    // BIG ROCK ACHIEVEMENTS
    // ================================================================

    const bigRocks = await storageService.getItem<BigRock[]>(STORAGE_KEYS.BIG_ROCKS);
    if (bigRocks && bigRocks.length > 0) {
      await tryUnlockAchievement('first_big_rock');
      await tryUnlockAchievement('first_weekly_plan');

      const completedRocks = bigRocks.filter(r => r.completedAt).length;
      if (completedRocks >= 10) {
        await tryUnlockAchievement('ten_big_rocks');
      }
      if (completedRocks >= 50) {
        await tryUnlockAchievement('fifty_big_rocks');
      }

      // Check balanced week for weeks that have big rocks
      const weekIds = [...new Set(bigRocks.map(r => r.weekId))];
      for (const weekId of weekIds) {
        await checkBalancedWeekAchievement(weekId);
      }
    }

    // ================================================================
    // GOAL COMPLETION ACHIEVEMENTS
    // ================================================================

    await checkGoalCompletionAchievements();

    // ================================================================
    // TASK ACHIEVEMENTS
    // ================================================================

    await checkTaskAchievements();

    // ================================================================
    // STREAK ACHIEVEMENTS
    // ================================================================

    const streaks = await storageService.getItem<StreakData>(STORAGE_KEYS.STREAKS);
    if (streaks) {
      const weeklyStreak = streaks.weeklyPlanning.longestStreak;
      if (weeklyStreak >= 4) await tryUnlockAchievement('week_streak_4');
      if (weeklyStreak >= 12) await tryUnlockAchievement('week_streak_12');
      if (weeklyStreak >= 52) await tryUnlockAchievement('week_streak_52');

      const dailyStreak = streaks.dailyPlanning.longestStreak;
      if (dailyStreak >= 7) await tryUnlockAchievement('day_streak_7');
      if (dailyStreak >= 30) await tryUnlockAchievement('day_streak_30');
      if (dailyStreak >= 100) await tryUnlockAchievement('day_streak_100');
    }

    // ================================================================
    // QUADRANT ACHIEVEMENTS
    // ================================================================

    // Check quadrant achievements for weeks that have completed tasks
    const tasks = await storageService.getItem<DailyTask[]>(STORAGE_KEYS.DAILY_TASKS);
    if (tasks && tasks.length > 0) {
      const completedTasks = tasks.filter(t => t.status === 'completed');
      const weekIds = [...new Set(completedTasks.map(t => {
        const date = new Date(t.date);
        const year = date.getFullYear();
        const week = getWeek(date, { weekStartsOn: 0 });
        return `${year}-W${week.toString().padStart(2, '0')}`;
      }))];

      for (const weekId of weekIds) {
        await checkQuadrantAchievements(weekId);
      }
      // Check Q2 champion for recent weeks
      if (weekIds.length > 0) {
        await checkQ2ChampionAchievement(weekIds[weekIds.length - 1]);
      }
    }

    // ================================================================
    // REFLECTION ACHIEVEMENTS
    // ================================================================

    const reflections = await storageService.getItem<WeeklyReflection[]>(STORAGE_KEYS.WEEKLY_REFLECTIONS);
    if (reflections && reflections.length > 0) {
      await tryUnlockAchievement('first_reflection');

      // Check reflection streak (consecutive weeks)
      if (reflections.length >= 12) {
        await tryUnlockAchievement('reflective_quarter');
      }
    }

    console.log('Achievement migration completed');
  } catch (error) {
    console.error('Error during achievement migration:', error);
  }
}
