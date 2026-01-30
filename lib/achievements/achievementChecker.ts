// Principle Centered Planner - Achievement Checker Service
// Standalone service for checking and unlocking achievements without React hooks
import { storageService } from '@/lib/storage/AsyncStorageService';
import { Achievement, AchievementKey, BigRock, DailyTask, LongTermGoal, QuadrantStats, Role, STORAGE_KEYS } from '@/types';
import { endOfWeek, format, getWeek, getYear, startOfWeek, subWeeks } from 'date-fns';

/**
 * Try to unlock a single achievement. Returns true if newly unlocked.
 */
export async function tryUnlockAchievement(key: AchievementKey): Promise<boolean> {
  try {
    const achievements = await storageService.getItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS);
    if (!achievements) return false;

    const achievement = achievements.find(a => a.key === key);
    if (!achievement || achievement.isUnlocked) return false;

    const updated = achievements.map(a =>
      a.key === key
        ? { ...a, isUnlocked: true, unlockedAt: new Date().toISOString() }
        : a
    );

    const success = await storageService.setItem(STORAGE_KEYS.ACHIEVEMENTS, updated);
    return success;
  } catch (err) {
    console.error(`Error unlocking achievement ${key}:`, err);
    return false;
  }
}

// ============================================================================
// GOAL COMPLETION ACHIEVEMENTS
// ============================================================================

/**
 * Check and unlock first_goal_complete and ten_goals_complete
 */
export async function checkGoalCompletionAchievements(): Promise<boolean> {
  try {
    const goals = await storageService.getItem<LongTermGoal[]>(STORAGE_KEYS.LONG_TERM_GOALS);
    if (!goals) return false;

    const completedCount = goals.filter(g => g.progress === 100 && g.completedAt).length;
    let unlocked = false;

    if (completedCount >= 1) {
      const result = await tryUnlockAchievement('first_goal_complete');
      if (result) unlocked = true;
    }
    if (completedCount >= 10) {
      const result = await tryUnlockAchievement('ten_goals_complete');
      if (result) unlocked = true;
    }

    return unlocked;
  } catch (err) {
    console.error('Error checking goal completion achievements:', err);
    return false;
  }
}

// ============================================================================
// TASK COMPLETION ACHIEVEMENTS
// ============================================================================

/**
 * Check and unlock task_finisher (100 tasks) and priority_a_master (50 A-priority tasks)
 */
export async function checkTaskAchievements(): Promise<boolean> {
  try {
    const tasks = await storageService.getItem<DailyTask[]>(STORAGE_KEYS.DAILY_TASKS);
    if (!tasks) return false;

    const completedTasks = tasks.filter(t => t.status === 'completed');
    const completedCount = completedTasks.length;
    const priorityACount = completedTasks.filter(t => t.priority === 'A').length;

    let unlocked = false;

    if (completedCount >= 100) {
      const result = await tryUnlockAchievement('task_finisher');
      if (result) unlocked = true;
    }
    if (priorityACount >= 50) {
      const result = await tryUnlockAchievement('priority_a_master');
      if (result) unlocked = true;
    }

    return unlocked;
  } catch (err) {
    console.error('Error checking task achievements:', err);
    return false;
  }
}

// ============================================================================
// STREAK ACHIEVEMENTS
// ============================================================================

/**
 * Check weekly planning streak achievements
 */
export async function checkWeeklyStreakAchievements(currentStreak: number): Promise<boolean> {
  let unlocked = false;

  if (currentStreak >= 4) {
    const result = await tryUnlockAchievement('week_streak_4');
    if (result) unlocked = true;
  }
  if (currentStreak >= 12) {
    const result = await tryUnlockAchievement('week_streak_12');
    if (result) unlocked = true;
  }
  if (currentStreak >= 52) {
    const result = await tryUnlockAchievement('week_streak_52');
    if (result) unlocked = true;
  }

  return unlocked;
}

/**
 * Check daily planning streak achievements
 */
export async function checkDailyStreakAchievements(currentStreak: number): Promise<boolean> {
  let unlocked = false;

  if (currentStreak >= 7) {
    const result = await tryUnlockAchievement('day_streak_7');
    if (result) unlocked = true;
  }
  if (currentStreak >= 30) {
    const result = await tryUnlockAchievement('day_streak_30');
    if (result) unlocked = true;
  }
  if (currentStreak >= 100) {
    const result = await tryUnlockAchievement('day_streak_100');
    if (result) unlocked = true;
  }

  return unlocked;
}

// ============================================================================
// BALANCED WEEK ACHIEVEMENT
// ============================================================================

/**
 * Check if big rocks cover all user roles in a given week
 */
export async function checkBalancedWeekAchievement(weekId: string): Promise<boolean> {
  try {
    const roles = await storageService.getItem<Role[]>(STORAGE_KEYS.USER_ROLES);
    if (!roles || roles.length === 0) return false;

    const bigRocks = await storageService.getItem<BigRock[]>(STORAGE_KEYS.BIG_ROCKS);
    if (!bigRocks) return false;

    const weekRocks = bigRocks.filter(r => r.weekId === weekId);
    const coveredRoleIds = new Set(
      weekRocks.filter(r => r.linkedRoleId).map(r => r.linkedRoleId)
    );

    if (coveredRoleIds.size >= roles.length) {
      return await tryUnlockAchievement('balanced_week');
    }

    return false;
  } catch (err) {
    console.error('Error checking balanced week achievement:', err);
    return false;
  }
}

// ============================================================================
// QUADRANT ACHIEVEMENTS
// ============================================================================

function getWeekIdForDate(date: Date): string {
  const year = getYear(date);
  const weekNumber = getWeek(date, { weekStartsOn: 0 });
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
}

function getDateRangeForWeek(weekId: string): { start: string; end: string } {
  // Parse weekId and get dates for the current week as approximation
  // We compare task dates to week boundaries
  const now = new Date();
  const currentWeekId = getWeekIdForDate(now);

  if (weekId === currentWeekId) {
    const start = startOfWeek(now, { weekStartsOn: 0 });
    const end = endOfWeek(now, { weekStartsOn: 0 });
    return { start: format(start, 'yyyy-MM-dd'), end: format(end, 'yyyy-MM-dd') };
  }

  // For other weeks, parse the weekId and reconstruct
  const [yearStr, weekStr] = weekId.split('-W');
  const year = parseInt(yearStr, 10);
  const week = parseInt(weekStr, 10);

  // Find a date in the target week by starting from Jan 1 and seeking
  const jan1 = new Date(year, 0, 1);
  const jan1Week = getWeek(jan1, { weekStartsOn: 0 });
  const weekDiff = week - jan1Week;
  const targetDate = new Date(jan1);
  targetDate.setDate(targetDate.getDate() + weekDiff * 7);

  const start = startOfWeek(targetDate, { weekStartsOn: 0 });
  const end = endOfWeek(targetDate, { weekStartsOn: 0 });
  return { start: format(start, 'yyyy-MM-dd'), end: format(end, 'yyyy-MM-dd') };
}

interface QuadrantMinutes {
  I: number;
  II: number;
  III: number;
  IV: number;
}

function calculateWeekQuadrantMinutes(
  tasks: DailyTask[],
  bigRocks: BigRock[],
  weekId: string
): QuadrantMinutes {
  const { start, end } = getDateRangeForWeek(weekId);

  const weekTasks = tasks.filter(
    t => t.status === 'completed' && t.date >= start && t.date <= end
  );

  const weekRocks = bigRocks.filter(
    r => r.weekId === weekId && r.completedAt
  );

  const minutes: QuadrantMinutes = { I: 0, II: 0, III: 0, IV: 0 };

  for (const task of weekTasks) {
    minutes[task.quadrant] += task.estimatedMinutes;
  }

  // Big rocks are always Quadrant II, convert hours to minutes
  for (const rock of weekRocks) {
    minutes.II += rock.estimatedHours * 60;
  }

  return minutes;
}

/**
 * Check q2_master (60%+ in Q2) and q4_eliminator (<5% in Q4) for a given week
 */
export async function checkQuadrantAchievements(weekId: string): Promise<boolean> {
  try {
    const tasks = await storageService.getItem<DailyTask[]>(STORAGE_KEYS.DAILY_TASKS) || [];
    const bigRocks = await storageService.getItem<BigRock[]>(STORAGE_KEYS.BIG_ROCKS) || [];

    const minutes = calculateWeekQuadrantMinutes(tasks, bigRocks, weekId);
    const total = minutes.I + minutes.II + minutes.III + minutes.IV;

    if (total === 0) return false;

    const q2Percent = (minutes.II / total) * 100;
    const q4Percent = (minutes.IV / total) * 100;

    let unlocked = false;

    if (q2Percent >= 60) {
      const result = await tryUnlockAchievement('q2_master');
      if (result) unlocked = true;
    }

    if (q4Percent < 5) {
      const result = await tryUnlockAchievement('q4_eliminator');
      if (result) unlocked = true;
    }

    return unlocked;
  } catch (err) {
    console.error('Error checking quadrant achievements:', err);
    return false;
  }
}

/**
 * Check q2_champion: 60%+ Q2 time for 4 consecutive weeks ending with weekId
 */
export async function checkQ2ChampionAchievement(weekId: string): Promise<boolean> {
  try {
    const tasks = await storageService.getItem<DailyTask[]>(STORAGE_KEYS.DAILY_TASKS) || [];
    const bigRocks = await storageService.getItem<BigRock[]>(STORAGE_KEYS.BIG_ROCKS) || [];

    // Check 4 consecutive weeks ending with current week
    const now = new Date();
    const weeksToCheck: string[] = [];

    for (let i = 0; i < 4; i++) {
      const weekDate = subWeeks(now, i);
      weeksToCheck.push(getWeekIdForDate(weekDate));
    }

    for (const wId of weeksToCheck) {
      const minutes = calculateWeekQuadrantMinutes(tasks, bigRocks, wId);
      const total = minutes.I + minutes.II + minutes.III + minutes.IV;

      if (total === 0) return false;

      const q2Percent = (minutes.II / total) * 100;
      if (q2Percent < 60) return false;
    }

    return await tryUnlockAchievement('q2_champion');
  } catch (err) {
    console.error('Error checking Q2 champion achievement:', err);
    return false;
  }
}

// ============================================================================
// QUADRANT STATS PERSISTENCE
// ============================================================================

/**
 * Recalculate and persist quadrant stats for a given week.
 * Call this whenever a task or big rock is completed/uncompleted.
 */
export async function updateQuadrantStatsForWeek(weekId: string): Promise<void> {
  try {
    const tasks = await storageService.getItem<DailyTask[]>(STORAGE_KEYS.DAILY_TASKS) || [];
    const bigRocks = await storageService.getItem<BigRock[]>(STORAGE_KEYS.BIG_ROCKS) || [];

    const minutes = calculateWeekQuadrantMinutes(tasks, bigRocks, weekId);

    const stats = await storageService.getItem<QuadrantStats>(STORAGE_KEYS.QUADRANT_STATS) || {};
    const total = minutes.I + minutes.II + minutes.III + minutes.IV;

    if (total > 0) {
      stats[weekId] = {
        quadrant_I: minutes.I,
        quadrant_II: minutes.II,
        quadrant_III: minutes.III,
        quadrant_IV: minutes.IV,
      };
    } else {
      delete stats[weekId];
    }

    await storageService.setItem(STORAGE_KEYS.QUADRANT_STATS, stats);
  } catch (err) {
    console.error('Error updating quadrant stats:', err);
  }
}
