// Covey Planner - useMission Hook
import { useState, useEffect, useCallback } from 'react';
import { storageService } from '@/lib/storage/AsyncStorageService';
import { STORAGE_KEYS, Achievement } from '@/types';

export function useMission() {
  const [mission, setMission] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMission = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await storageService.getString(STORAGE_KEYS.USER_MISSION);
      setMission(data || '');
    } catch (err) {
      setError('Failed to load mission');
      console.error('Error loading mission:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveMission = useCallback(async (newMission: string) => {
    try {
      setError(null);
      const hadMission = !!mission;
      await storageService.setString(STORAGE_KEYS.USER_MISSION, newMission);
      setMission(newMission);

      // Unlock achievement for first mission (if this is the first time)
      if (!hadMission && newMission.trim()) {
        try {
          const achievements = await storageService.getItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS);
          if (achievements) {
            const updated = achievements.map(a =>
              a.key === 'first_mission'
                ? { ...a, isUnlocked: true, unlockedAt: new Date().toISOString() }
                : a
            );
            await storageService.setItem(STORAGE_KEYS.ACHIEVEMENTS, updated);
          }
        } catch (achievementErr) {
          console.error('Error unlocking achievement:', achievementErr);
        }
      }

      return true;
    } catch (err) {
      setError('Failed to save mission');
      console.error('Error saving mission:', err);
      return false;
    }
  }, [mission]);

  const clearMission = useCallback(async () => {
    try {
      setError(null);
      await storageService.removeItem(STORAGE_KEYS.USER_MISSION);
      setMission('');
      return true;
    } catch (err) {
      setError('Failed to clear mission');
      console.error('Error clearing mission:', err);
      return false;
    }
  }, []);

  useEffect(() => {
    loadMission();
  }, [loadMission]);

  return {
    mission,
    isLoading,
    error,
    saveMission,
    clearMission,
    reload: loadMission,
  };
}
