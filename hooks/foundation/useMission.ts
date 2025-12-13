// Covey Planner - useMission Hook
import { useState, useEffect, useCallback } from 'react';
import { storageService } from '@/lib/storage/AsyncStorageService';
import { STORAGE_KEYS } from '@/types';

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
      await storageService.setString(STORAGE_KEYS.USER_MISSION, newMission);
      setMission(newMission);
      return true;
    } catch (err) {
      setError('Failed to save mission');
      console.error('Error saving mission:', err);
      return false;
    }
  }, []);

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
