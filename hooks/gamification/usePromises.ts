// Principle Centered Planner - usePromises Hook (30/10 Promise Tracking)
import { storageService } from '@/lib/storage/AsyncStorageService';
import { Promise3010, STORAGE_KEYS } from '@/types';
import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';

// Helper to get date key
function getDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function usePromises(dateKey?: string) {
  const [currentDateKey] = useState(dateKey || getDateKey(new Date()));
  const [promises, setPromises] = useState<Promise3010[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPromises = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await storageService.getItem<Promise3010[]>(STORAGE_KEYS.PROMISES_3010);
      const allPromises = stored || [];

      // Filter promises for the current date
      const filtered = allPromises.filter(promise => promise.date === currentDateKey);
      setPromises(filtered);
    } catch (err) {
      console.error('Error loading promises:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentDateKey]);

  useEffect(() => {
    loadPromises();
  }, [loadPromises]);

  const addPromise = async (description: string): Promise<boolean> => {
    try {
      const allPromises = await storageService.getItem<Promise3010[]>(STORAGE_KEYS.PROMISES_3010) || [];

      const newPromise: Promise3010 = {
        id: `promise_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        description: description.trim(),
        date: currentDateKey,
        kept: false,
        broken: false,
        createdAt: new Date().toISOString(),
      };

      const updated = [...allPromises, newPromise];
      const success = await storageService.setItem(STORAGE_KEYS.PROMISES_3010, updated);

      if (success) {
        await loadPromises();
      }

      return success;
    } catch (err) {
      console.error('Error adding promise:', err);
      return false;
    }
  };

  const keepPromise = async (id: string): Promise<boolean> => {
    try {
      const allPromises = await storageService.getItem<Promise3010[]>(STORAGE_KEYS.PROMISES_3010) || [];
      const updated = allPromises.map(promise =>
        promise.id === id
          ? {
              ...promise,
              kept: true,
              keptAt: new Date().toISOString(),
              broken: false,
              brokenAt: undefined,
            }
          : promise
      );

      const success = await storageService.setItem(STORAGE_KEYS.PROMISES_3010, updated);

      if (success) {
        await loadPromises();
      }

      return success;
    } catch (err) {
      console.error('Error keeping promise:', err);
      return false;
    }
  };

  const breakPromise = async (id: string): Promise<boolean> => {
    try {
      const allPromises = await storageService.getItem<Promise3010[]>(STORAGE_KEYS.PROMISES_3010) || [];
      const updated = allPromises.map(promise =>
        promise.id === id
          ? {
              ...promise,
              broken: true,
              brokenAt: new Date().toISOString(),
              kept: false,
              keptAt: undefined,
            }
          : promise
      );

      const success = await storageService.setItem(STORAGE_KEYS.PROMISES_3010, updated);

      if (success) {
        await loadPromises();
      }

      return success;
    } catch (err) {
      console.error('Error breaking promise:', err);
      return false;
    }
  };

  const deletePromise = async (id: string): Promise<boolean> => {
    try {
      const allPromises = await storageService.getItem<Promise3010[]>(STORAGE_KEYS.PROMISES_3010) || [];
      const updated = allPromises.filter(promise => promise.id !== id);

      const success = await storageService.setItem(STORAGE_KEYS.PROMISES_3010, updated);

      if (success) {
        await loadPromises();
      }

      return success;
    } catch (err) {
      console.error('Error deleting promise:', err);
      return false;
    }
  };

  const getKeptCount = (): number => {
    return promises.filter(p => p.kept).length;
  };

  const getBrokenCount = (): number => {
    return promises.filter(p => p.broken).length;
  };

  const getPendingCount = (): number => {
    return promises.filter(p => !p.kept && !p.broken).length;
  };

  const getSuccessRate = (): number => {
    const completed = promises.filter(p => p.kept || p.broken);
    if (completed.length === 0) return 0;
    const kept = promises.filter(p => p.kept).length;
    return Math.round((kept / completed.length) * 100);
  };

  const getAllTimeStats = async (): Promise<{
    total: number;
    kept: number;
    broken: number;
    successRate: number;
  }> => {
    try {
      const allPromises = await storageService.getItem<Promise3010[]>(STORAGE_KEYS.PROMISES_3010) || [];
      const completed = allPromises.filter(p => p.kept || p.broken);
      const kept = allPromises.filter(p => p.kept).length;

      return {
        total: allPromises.length,
        kept,
        broken: allPromises.filter(p => p.broken).length,
        successRate: completed.length > 0 ? Math.round((kept / completed.length) * 100) : 0,
      };
    } catch (err) {
      console.error('Error getting all-time stats:', err);
      return { total: 0, kept: 0, broken: 0, successRate: 0 };
    }
  };

  return {
    promises,
    isLoading,
    currentDateKey,
    addPromise,
    keepPromise,
    breakPromise,
    deletePromise,
    getKeptCount,
    getBrokenCount,
    getPendingCount,
    getSuccessRate,
    getAllTimeStats,
    reload: loadPromises,
  };
}
