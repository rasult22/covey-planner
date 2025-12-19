// Principle Centered Planner - useDailyTasks Hook
import { storageService } from '@/lib/storage/AsyncStorageService';
import { DailyTask, Priority, Quadrant, STORAGE_KEYS } from '@/types';
import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';

// Helper to get date string in YYYY-MM-DD format
export function getDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

// Helper to get today's date key
export function getTodayKey(): string {
  return getDateKey(new Date());
}

export function useDailyTasks(dateKey?: string) {
  const [currentDateKey] = useState(dateKey || getTodayKey());
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stored = await storageService.getItem<DailyTask[]>(STORAGE_KEYS.DAILY_TASKS);
      const allTasks = stored || [];

      // Filter tasks for the current date
      const filtered = allTasks.filter(task => task.date === currentDateKey);
      setTasks(filtered);
    } catch (err) {
      setError('Failed to load daily tasks');
      console.error('Error loading daily tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentDateKey]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = async (
    data: Omit<DailyTask, 'id' | 'createdAt' | 'date' | 'status'>
  ): Promise<boolean> => {
    try {
      const allTasks = await storageService.getItem<DailyTask[]>(STORAGE_KEYS.DAILY_TASKS) || [];

      const newTask: DailyTask = {
        ...data,
        id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        date: currentDateKey,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const updated = [...allTasks, newTask];
      const success = await storageService.setItem(STORAGE_KEYS.DAILY_TASKS, updated);

      if (success) {
        await loadTasks();
      }

      return success;
    } catch (err) {
      console.error('Error adding task:', err);
      return false;
    }
  };

  const updateTask = async (
    id: string,
    updates: Partial<Omit<DailyTask, 'id' | 'createdAt' | 'date'>>
  ): Promise<boolean> => {
    try {
      const allTasks = await storageService.getItem<DailyTask[]>(STORAGE_KEYS.DAILY_TASKS) || [];
      const updated = allTasks.map(task =>
        task.id === id ? { ...task, ...updates } : task
      );

      const success = await storageService.setItem(STORAGE_KEYS.DAILY_TASKS, updated);

      if (success) {
        await loadTasks();
      }

      return success;
    } catch (err) {
      console.error('Error updating task:', err);
      return false;
    }
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      const allTasks = await storageService.getItem<DailyTask[]>(STORAGE_KEYS.DAILY_TASKS) || [];
      const updated = allTasks.filter(task => task.id !== id);

      const success = await storageService.setItem(STORAGE_KEYS.DAILY_TASKS, updated);

      if (success) {
        await loadTasks();
      }

      return success;
    } catch (err) {
      console.error('Error deleting task:', err);
      return false;
    }
  };

  const completeTask = async (id: string): Promise<boolean> => {
    return await updateTask(id, {
      status: 'completed',
      completedAt: new Date().toISOString(),
    });
  };

  const uncompleteTask = async (id: string): Promise<boolean> => {
    return await updateTask(id, {
      status: 'pending',
      completedAt: undefined,
    });
  };

  const startTimer = async (id: string): Promise<boolean> => {
    return await updateTask(id, {
      timerStartedAt: new Date().toISOString(),
      status: 'in_progress',
    });
  };

  const stopTimer = async (id: string): Promise<boolean> => {
    const task = tasks.find(t => t.id === id);
    if (!task || !task.timerStartedAt) return false;

    const startTime = new Date(task.timerStartedAt).getTime();
    const endTime = Date.now();
    const elapsedMinutes = Math.round((endTime - startTime) / 60000);

    const currentActual = task.actualMinutes || 0;
    const newActual = currentActual + elapsedMinutes;

    return await updateTask(id, {
      timerStartedAt: undefined,
      actualMinutes: newActual,
      status: 'pending',
    });
  };

  const setPriority = async (id: string, priority: Priority): Promise<boolean> => {
    return await updateTask(id, { priority });
  };

  const setQuadrant = async (id: string, quadrant: Quadrant): Promise<boolean> => {
    return await updateTask(id, { quadrant });
  };

  const getTasksByPriority = (priority: Priority): DailyTask[] => {
    return tasks.filter(task => task.priority === priority);
  };

  const getTasksByQuadrant = (quadrant: Quadrant): DailyTask[] => {
    return tasks.filter(task => task.quadrant === quadrant);
  };

  const getCompletedCount = (): number => {
    return tasks.filter(task => task.status === 'completed').length;
  };

  const getTotalEstimatedMinutes = (): number => {
    return tasks.reduce((sum, task) => sum + task.estimatedMinutes, 0);
  };

  const getTotalActualMinutes = (): number => {
    return tasks.reduce((sum, task) => sum + (task.actualMinutes || 0), 0);
  };

  const getActiveTimer = (): DailyTask | null => {
    return tasks.find(task => task.timerStartedAt) || null;
  };

  const reload = () => {
    loadTasks();
  };

  return {
    tasks,
    isLoading,
    error,
    currentDateKey,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    uncompleteTask,
    startTimer,
    stopTimer,
    setPriority,
    setQuadrant,
    getTasksByPriority,
    getTasksByQuadrant,
    getCompletedCount,
    getTotalEstimatedMinutes,
    getTotalActualMinutes,
    getActiveTimer,
    reload,
  };
}
