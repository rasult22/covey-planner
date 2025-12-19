// Principle Centered Planner - Notification Service
import { NotificationSettings } from '@/types';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications are handled when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  /**
   * Request notification permissions from the user
   */
  static async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.log('Notifications only work on physical devices');
      return false;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get notification permissions');
        return false;
      }

      // Configure notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Principle Centered Planner Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FFFFFF',
        });
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Schedule weekly planning reminder
   */
  static async scheduleWeeklyPlanning(
    settings: NotificationSettings
  ): Promise<string | null> {
    try {
      if (!settings.weeklyPlanningEnabled) {
        return null;
      }

      // Cancel existing weekly planning notification
      await this.cancelWeeklyPlanning();

      // Parse time
      const [hours, minutes] = settings.weeklyPlanningTime.split(':').map(Number);

      // Schedule repeating notification
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Time to Plan Your Week',
          body: 'Take 30 minutes to identify your Big Rocks for the week ahead.',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: settings.weeklyPlanningDay + 1, // expo uses 1-7, our settings use 0-6
          hour: hours,
          minute: minutes,
        },
      });

      return id;
    } catch (error) {
      console.error('Error scheduling weekly planning notification:', error);
      return null;
    }
  }

  /**
   * Schedule daily planning reminder
   */
  static async scheduleDailyPlanning(
    settings: NotificationSettings
  ): Promise<string | null> {
    try {
      if (!settings.dailyPlanningEnabled) {
        return null;
      }

      // Cancel existing daily planning notification
      await this.cancelDailyPlanning();

      // Parse time
      const [hours, minutes] = settings.dailyPlanningTime.split(':').map(Number);

      // Schedule repeating notification
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Plan Your Day',
          body: 'Take 10 minutes to organize your most important tasks for today.',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: hours,
          minute: minutes,
        },
      });

      return id;
    } catch (error) {
      console.error('Error scheduling daily planning notification:', error);
      return null;
    }
  }

  /**
   * Schedule weekly compass reminder (Sunday morning)
   */
  static async scheduleWeeklyCompass(
    settings: NotificationSettings
  ): Promise<string | null> {
    try {
      if (!settings.weeklyCompassEnabled) {
        return null;
      }

      // Cancel existing weekly compass notification
      await this.cancelWeeklyCompass();

      // Parse time
      const [hours, minutes] = settings.weeklyCompassTime.split(':').map(Number);

      // Schedule for Sunday (weekday 1 in expo-notifications)
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Weekly Compass',
          body: 'Review your mission, values, and roles to stay aligned with your principles.',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.DEFAULT,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: 1, // Sunday
          hour: hours,
          minute: minutes,
        },
      });

      return id;
    } catch (error) {
      console.error('Error scheduling weekly compass notification:', error);
      return null;
    }
  }

  /**
   * Schedule weekly reflection reminder
   */
  static async scheduleWeeklyReflection(
    settings: NotificationSettings
  ): Promise<string | null> {
    try {
      if (!settings.weeklyReflectionEnabled) {
        return null;
      }

      // Cancel existing weekly reflection notification
      await this.cancelWeeklyReflection();

      // Parse time
      const [hours, minutes] = settings.weeklyReflectionTime.split(':').map(Number);

      // Schedule repeating notification
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Weekly Reflection',
          body: 'Take time to reflect on your week. What worked well? What can improve?',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.DEFAULT,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: settings.weeklyReflectionDay + 1,
          hour: hours,
          minute: minutes,
        },
      });

      return id;
    } catch (error) {
      console.error('Error scheduling weekly reflection notification:', error);
      return null;
    }
  }

  /**
   * Cancel all notifications
   */
  static async cancelAll(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  /**
   * Cancel specific notification types
   */
  static async cancelWeeklyPlanning(): Promise<void> {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      const weeklyPlanningNotifs = notifications.filter(
        n => n.content.title === 'Time to Plan Your Week'
      );
      for (const notif of weeklyPlanningNotifs) {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier);
      }
    } catch (error) {
      console.error('Error canceling weekly planning notifications:', error);
    }
  }

  static async cancelDailyPlanning(): Promise<void> {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      const dailyPlanningNotifs = notifications.filter(
        n => n.content.title === 'Plan Your Day'
      );
      for (const notif of dailyPlanningNotifs) {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier);
      }
    } catch (error) {
      console.error('Error canceling daily planning notifications:', error);
    }
  }

  static async cancelWeeklyCompass(): Promise<void> {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      const compassNotifs = notifications.filter(
        n => n.content.title === 'Weekly Compass'
      );
      for (const notif of compassNotifs) {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier);
      }
    } catch (error) {
      console.error('Error canceling weekly compass notifications:', error);
    }
  }

  static async cancelWeeklyReflection(): Promise<void> {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      const reflectionNotifs = notifications.filter(
        n => n.content.title === 'Weekly Reflection'
      );
      for (const notif of reflectionNotifs) {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier);
      }
    } catch (error) {
      console.error('Error canceling weekly reflection notifications:', error);
    }
  }

  /**
   * Get all scheduled notifications for debugging
   */
  static async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }
}
