// Covey Planner - useBigRocks Hook
import { useState, useEffect, useCallback } from 'react';
import { BigRock, STORAGE_KEYS } from '@/types';
import { storageService } from '@/lib/storage/AsyncStorageService';

export function useBigRocks(weekId?: string) {
  const [bigRocks, setBigRocks] = useState<BigRock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBigRocks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stored = await storageService.getItem<BigRock[]>(STORAGE_KEYS.BIG_ROCKS);
      const allRocks = stored || [];

      // Filter by week if weekId is provided
      const filtered = weekId
        ? allRocks.filter(rock => rock.weekId === weekId)
        : allRocks;

      setBigRocks(filtered);
    } catch (err) {
      setError('Failed to load Big Rocks');
      console.error('Error loading Big Rocks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [weekId]);

  useEffect(() => {
    loadBigRocks();
  }, [loadBigRocks]);

  const addBigRock = async (
    data: Omit<BigRock, 'id' | 'createdAt' | 'quadrant'>
  ): Promise<boolean> => {
    try {
      const allRocks = await storageService.getItem<BigRock[]>(STORAGE_KEYS.BIG_ROCKS) || [];

      const newBigRock: BigRock = {
        ...data,
        id: `bigrock_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        createdAt: new Date().toISOString(),
        quadrant: 'II', // Big Rocks are always Quadrant II
      };

      const updated = [...allRocks, newBigRock];
      const success = await storageService.setItem(STORAGE_KEYS.BIG_ROCKS, updated);

      if (success) {
        await loadBigRocks();
      }

      return success;
    } catch (err) {
      console.error('Error adding Big Rock:', err);
      return false;
    }
  };

  const updateBigRock = async (
    id: string,
    updates: Partial<Omit<BigRock, 'id' | 'createdAt' | 'quadrant'>>
  ): Promise<boolean> => {
    try {
      const allRocks = await storageService.getItem<BigRock[]>(STORAGE_KEYS.BIG_ROCKS) || [];
      const updated = allRocks.map(rock =>
        rock.id === id ? { ...rock, ...updates } : rock
      );

      const success = await storageService.setItem(STORAGE_KEYS.BIG_ROCKS, updated);

      if (success) {
        await loadBigRocks();
      }

      return success;
    } catch (err) {
      console.error('Error updating Big Rock:', err);
      return false;
    }
  };

  const completeBigRock = async (id: string): Promise<boolean> => {
    return await updateBigRock(id, {
      completedAt: new Date().toISOString(),
    });
  };

  const uncompleteBigRock = async (id: string): Promise<boolean> => {
    return await updateBigRock(id, {
      completedAt: undefined,
    });
  };

  const deleteBigRock = async (id: string): Promise<boolean> => {
    try {
      const allRocks = await storageService.getItem<BigRock[]>(STORAGE_KEYS.BIG_ROCKS) || [];
      const updated = allRocks.filter(rock => rock.id !== id);

      const success = await storageService.setItem(STORAGE_KEYS.BIG_ROCKS, updated);

      if (success) {
        await loadBigRocks();
      }

      return success;
    } catch (err) {
      console.error('Error deleting Big Rock:', err);
      return false;
    }
  };

  const getCompletedCount = (): number => {
    return bigRocks.filter(rock => rock.completedAt).length;
  };

  const getTotalEstimatedHours = (): number => {
    return bigRocks.reduce((sum, rock) => sum + rock.estimatedHours, 0);
  };

  const reload = () => {
    loadBigRocks();
  };

  return {
    bigRocks,
    isLoading,
    error,
    addBigRock,
    updateBigRock,
    completeBigRock,
    uncompleteBigRock,
    deleteBigRock,
    getCompletedCount,
    getTotalEstimatedHours,
    reload,
  };
}
