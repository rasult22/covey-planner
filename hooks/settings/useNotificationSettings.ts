// Covey Planner - useNotificationSettings Hook
import { useState, useEffect, useCallback } from 'react';
import { NotificationSettings, STORAGE_KEYS } from '@/types';
import { storageService } from '@/lib/storage/AsyncStorageService';
import { NotificationService } from '@/lib/notifications/NotificationService';

const DEFAULT_SETTINGS: NotificationSettings = {
  weeklyPlanningEnabled: true,
  weeklyPlanningDay: 0, // Sunday
  weeklyPlanningTime: '18:00',
  dailyPlanningEnabled: true,
  dailyPlanningTime: '08:00',
  weeklyCompassEnabled: true,
  weeklyCompassTime: '09:00',
  weeklyReflectionEnabled: true,
  weeklyReflectionDay: 0, // Sunday
  weeklyReflectionTime: '20:00',
};

export function useNotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await storageService.getItem<NotificationSettings>(
        STORAGE_KEYS.NOTIFICATION_SETTINGS
      );
      setSettings(stored || DEFAULT_SETTINGS);
    } catch (err) {
      console.error('Error loading notification settings:', err);
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
    checkPermissions();
  }, [loadSettings]);

  const checkPermissions = async () => {
    try {
      const granted = await NotificationService.requestPermissions();
      setPermissionGranted(granted);
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      setPermissionGranted(false);
    }
  };

  const saveSettings = async (newSettings: NotificationSettings): Promise<boolean> => {
    try {
      const success = await storageService.setItem(
        STORAGE_KEYS.NOTIFICATION_SETTINGS,
        newSettings
      );

      if (success) {
        setSettings(newSettings);
        await applyNotificationSchedules(newSettings);
      }

      return success;
    } catch (err) {
      console.error('Error saving notification settings:', err);
      return false;
    }
  };

  const applyNotificationSchedules = async (
    settingsToApply: NotificationSettings
  ): Promise<void> => {
    try {
      // Schedule or cancel notifications based on settings
      await NotificationService.scheduleWeeklyPlanning(settingsToApply);
      await NotificationService.scheduleDailyPlanning(settingsToApply);
      await NotificationService.scheduleWeeklyCompass(settingsToApply);
      await NotificationService.scheduleWeeklyReflection(settingsToApply);
    } catch (error) {
      console.error('Error applying notification schedules:', error);
    }
  };

  const toggleWeeklyPlanning = async (enabled: boolean): Promise<boolean> => {
    return await saveSettings({ ...settings, weeklyPlanningEnabled: enabled });
  };

  const setWeeklyPlanningDay = async (day: number): Promise<boolean> => {
    return await saveSettings({ ...settings, weeklyPlanningDay: day });
  };

  const setWeeklyPlanningTime = async (time: string): Promise<boolean> => {
    return await saveSettings({ ...settings, weeklyPlanningTime: time });
  };

  const toggleDailyPlanning = async (enabled: boolean): Promise<boolean> => {
    return await saveSettings({ ...settings, dailyPlanningEnabled: enabled });
  };

  const setDailyPlanningTime = async (time: string): Promise<boolean> => {
    return await saveSettings({ ...settings, dailyPlanningTime: time });
  };

  const toggleWeeklyCompass = async (enabled: boolean): Promise<boolean> => {
    return await saveSettings({ ...settings, weeklyCompassEnabled: enabled });
  };

  const setWeeklyCompassTime = async (time: string): Promise<boolean> => {
    return await saveSettings({ ...settings, weeklyCompassTime: time });
  };

  const toggleWeeklyReflection = async (enabled: boolean): Promise<boolean> => {
    return await saveSettings({ ...settings, weeklyReflectionEnabled: enabled });
  };

  const setWeeklyReflectionDay = async (day: number): Promise<boolean> => {
    return await saveSettings({ ...settings, weeklyReflectionDay: day });
  };

  const setWeeklyReflectionTime = async (time: string): Promise<boolean> => {
    return await saveSettings({ ...settings, weeklyReflectionTime: time });
  };

  const resetToDefaults = async (): Promise<boolean> => {
    return await saveSettings(DEFAULT_SETTINGS);
  };

  const requestPermissions = async (): Promise<boolean> => {
    const granted = await NotificationService.requestPermissions();
    setPermissionGranted(granted);
    return granted;
  };

  const getScheduledNotifications = async () => {
    return await NotificationService.getScheduledNotifications();
  };

  return {
    settings,
    isLoading,
    permissionGranted,
    saveSettings,
    toggleWeeklyPlanning,
    setWeeklyPlanningDay,
    setWeeklyPlanningTime,
    toggleDailyPlanning,
    setDailyPlanningTime,
    toggleWeeklyCompass,
    setWeeklyCompassTime,
    toggleWeeklyReflection,
    setWeeklyReflectionDay,
    setWeeklyReflectionTime,
    resetToDefaults,
    requestPermissions,
    getScheduledNotifications,
    reload: loadSettings,
  };
}
