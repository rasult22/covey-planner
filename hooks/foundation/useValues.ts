// Covey Planner - useValues Hook
import { useState, useEffect, useCallback } from 'react';
import { storageService } from '@/lib/storage/AsyncStorageService';
import { Value, STORAGE_KEYS } from '@/types';

export function useValues() {
  const [values, setValues] = useState<Value[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadValues = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await storageService.getItem<Value[]>(STORAGE_KEYS.USER_VALUES);
      setValues(data || []);
    } catch (err) {
      setError('Failed to load values');
      console.error('Error loading values:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addValue = useCallback(async (value: Omit<Value, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      const newValue: Value = {
        ...value,
        id: `value-${Date.now()}-${Math.random()}`,
        createdAt: new Date().toISOString(),
      };

      const updatedValues = [...values, newValue];
      await storageService.setItem(STORAGE_KEYS.USER_VALUES, updatedValues);
      setValues(updatedValues);
      return newValue;
    } catch (err) {
      setError('Failed to add value');
      console.error('Error adding value:', err);
      return null;
    }
  }, [values]);

  const updateValue = useCallback(async (id: string, updates: Partial<Value>) => {
    try {
      setError(null);
      const updatedValues = values.map(v =>
        v.id === id ? { ...v, ...updates } : v
      );
      await storageService.setItem(STORAGE_KEYS.USER_VALUES, updatedValues);
      setValues(updatedValues);
      return true;
    } catch (err) {
      setError('Failed to update value');
      console.error('Error updating value:', err);
      return false;
    }
  }, [values]);

  const deleteValue = useCallback(async (id: string) => {
    try {
      setError(null);
      const updatedValues = values.filter(v => v.id !== id);
      await storageService.setItem(STORAGE_KEYS.USER_VALUES, updatedValues);
      setValues(updatedValues);
      return true;
    } catch (err) {
      setError('Failed to delete value');
      console.error('Error deleting value:', err);
      return false;
    }
  }, [values]);

  useEffect(() => {
    loadValues();
  }, [loadValues]);

  return {
    values,
    isLoading,
    error,
    addValue,
    updateValue,
    deleteValue,
    reload: loadValues,
  };
}
