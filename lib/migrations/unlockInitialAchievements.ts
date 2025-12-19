// Principle Centered Planner - Achievement Migration Utility
import { storageService } from '@/lib/storage/AsyncStorageService';
import { Achievement, LongTermGoal, Role, STORAGE_KEYS, Value } from '@/types';

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

    let updated = [...achievements];
    let hasChanges = false;

    // Check mission
    const mission = await storageService.getString(STORAGE_KEYS.USER_MISSION);
    if (mission && mission.trim()) {
      const achievement = updated.find(a => a.key === 'first_mission');
      if (achievement && !achievement.isUnlocked) {
        updated = updated.map(a =>
          a.key === 'first_mission'
            ? { ...a, isUnlocked: true, unlockedAt: new Date().toISOString() }
            : a
        );
        hasChanges = true;
        console.log('Unlocked first_mission achievement');
      }
    }

    // Check values
    const values = await storageService.getItem<Value[]>(STORAGE_KEYS.USER_VALUES);
    if (values && values.length > 0) {
      const achievement = updated.find(a => a.key === 'values_defined');
      if (achievement && !achievement.isUnlocked) {
        updated = updated.map(a =>
          a.key === 'values_defined'
            ? { ...a, isUnlocked: true, unlockedAt: new Date().toISOString() }
            : a
        );
        hasChanges = true;
        console.log('Unlocked values_defined achievement');
      }
    }

    // Check roles
    const roles = await storageService.getItem<Role[]>(STORAGE_KEYS.USER_ROLES);
    if (roles && roles.length > 0) {
      const achievement = updated.find(a => a.key === 'roles_complete');
      if (achievement && !achievement.isUnlocked) {
        updated = updated.map(a =>
          a.key === 'roles_complete'
            ? { ...a, isUnlocked: true, unlockedAt: new Date().toISOString() }
            : a
        );
        hasChanges = true;
        console.log('Unlocked roles_complete achievement');
      }
    }

    // Check goals
    const goals = await storageService.getItem<LongTermGoal[]>(STORAGE_KEYS.LONG_TERM_GOALS);
    if (goals && goals.length > 0) {
      const achievement = updated.find(a => a.key === 'first_goal');
      if (achievement && !achievement.isUnlocked) {
        updated = updated.map(a =>
          a.key === 'first_goal'
            ? { ...a, isUnlocked: true, unlockedAt: new Date().toISOString() }
            : a
        );
        hasChanges = true;
        console.log('Unlocked first_goal achievement');
      }
    }

    // Save if there are changes
    if (hasChanges) {
      await storageService.setItem(STORAGE_KEYS.ACHIEVEMENTS, updated);
      console.log('Achievement migration completed successfully');
    } else {
      console.log('No achievement migration needed');
    }
  } catch (error) {
    console.error('Error during achievement migration:', error);
  }
}
