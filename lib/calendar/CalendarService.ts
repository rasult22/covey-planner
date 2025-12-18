// Covey Planner - Calendar Service
// Integrates with device calendar for scheduling Big Rocks and tasks

import { storageService } from '@/lib/storage/AsyncStorageService';
import { BigRock, DailyTask } from '@/types';
import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';

const CALENDAR_SETTINGS_KEY = '@covey_planner:calendar_settings';

interface CalendarSettings {
  calendarId: string | null;
  syncEnabled: boolean;
}

export class CalendarService {
  private static settings: CalendarSettings | null = null;

  /**
   * Request calendar permissions from user
   */
  static async requestPermissions(): Promise<boolean> {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    return status === 'granted';
  }

  /**
   * Check if calendar permissions are granted
   */
  static async hasPermissions(): Promise<boolean> {
    const { status } = await Calendar.getCalendarPermissionsAsync();
    return status === 'granted';
  }

  /**
   * Get or create the Covey Planner calendar
   */
  static async getOrCreateCalendar(): Promise<string | null> {
    try {
      const hasPerms = await this.hasPermissions();
      if (!hasPerms) {
        const granted = await this.requestPermissions();
        if (!granted) return null;
      }

      // Check if we already have a calendar ID stored
      const settings = await this.getSettings();
      if (settings.calendarId) {
        // Verify the calendar still exists
        try {
          const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
          const exists = calendars.some(c => c.id === settings.calendarId);
          if (exists) return settings.calendarId;
        } catch {
          // Calendar no longer exists, create new one
        }
      }

      // Create new calendar
      const calendarId = await this.createCalendar();
      if (calendarId) {
        await this.updateSettings({ ...settings, calendarId });
      }
      return calendarId;
    } catch (error) {
      console.error('Error getting/creating calendar:', error);
      return null;
    }
  }

  /**
   * Create a new Covey Planner calendar
   */
  private static async createCalendar(): Promise<string | null> {
    try {
      let defaultCalendarSource: Calendar.Source;

      if (Platform.OS === 'ios') {
        const defaultCalendar = await Calendar.getDefaultCalendarAsync();
        defaultCalendarSource = defaultCalendar.source;
      } else {
        // Android
        defaultCalendarSource = {
          isLocalAccount: true,
          name: 'Covey Planner',
          type: Calendar.SourceType.LOCAL,
        } as Calendar.Source;
      }

      const newCalendarId = await Calendar.createCalendarAsync({
        title: 'Covey Planner',
        color: '#007AFF', // iOS blue
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultCalendarSource.id,
        source: defaultCalendarSource,
        name: 'coveyplanner',
        ownerAccount: 'personal',
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });

      return newCalendarId;
    } catch (error) {
      console.error('Error creating calendar:', error);
      return null;
    }
  }

  /**
   * Create calendar event for a Big Rock
   */
  static async createBigRockEvent(
    bigRock: BigRock,
    startDate: Date,
    endDate: Date
  ): Promise<string | null> {
    try {
      const calendarId = await this.getOrCreateCalendar();
      if (!calendarId) return null;

      const eventId = await Calendar.createEventAsync(calendarId, {
        title: `🪨 ${bigRock.title}`,
        startDate,
        endDate,
        notes: `Big Rock - Quadrant II Priority\n\nEstimated: ${bigRock.estimatedHours} hours`,
        alarms: [{ relativeOffset: -30 }], // 30 min reminder
      });

      return eventId;
    } catch (error) {
      console.error('Error creating Big Rock event:', error);
      return null;
    }
  }

  /**
   * Create calendar event for a Daily Task
   */
  static async createTaskEvent(
    task: DailyTask,
    startDate: Date,
    endDate: Date
  ): Promise<string | null> {
    try {
      const calendarId = await this.getOrCreateCalendar();
      if (!calendarId) return null;

      const priorityEmoji = task.priority === 'A' ? '🔴' : task.priority === 'B' ? '🟡' : '🟢';

      const eventId = await Calendar.createEventAsync(calendarId, {
        title: `${priorityEmoji} ${task.title}`,
        startDate,
        endDate,
        notes: `Priority ${task.priority} Task - Quadrant ${task.quadrant}\n\nEstimated: ${task.estimatedMinutes} minutes`,
        alarms: [{ relativeOffset: -15 }], // 15 min reminder
      });

      return eventId;
    } catch (error) {
      console.error('Error creating task event:', error);
      return null;
    }
  }

  /**
   * Update an existing calendar event
   */
  static async updateEvent(
    eventId: string,
    updates: {
      title?: string;
      startDate?: Date;
      endDate?: Date;
      notes?: string;
    }
  ): Promise<boolean> {
    try {
      await Calendar.updateEventAsync(eventId, updates);
      return true;
    } catch (error) {
      console.error('Error updating event:', error);
      return false;
    }
  }

  /**
   * Delete a calendar event
   */
  static async deleteEvent(eventId: string): Promise<boolean> {
    try {
      await Calendar.deleteEventAsync(eventId);
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  }

  /**
   * Get calendar settings from storage
   */
  private static async getSettings(): Promise<CalendarSettings> {
    if (this.settings) return this.settings;

    const stored = await storageService.getItem<CalendarSettings>(CALENDAR_SETTINGS_KEY);
    this.settings = stored ?? { calendarId: null, syncEnabled: true };
    return this.settings;
  }

  /**
   * Update calendar settings in storage
   */
  private static async updateSettings(settings: CalendarSettings): Promise<void> {
    this.settings = settings;
    await storageService.setItem(CALENDAR_SETTINGS_KEY, settings);
  }

  /**
   * Check if sync is enabled
   */
  static async isSyncEnabled(): Promise<boolean> {
    const settings = await this.getSettings();
    return settings.syncEnabled;
  }

  /**
   * Enable or disable calendar sync
   */
  static async setSyncEnabled(enabled: boolean): Promise<void> {
    const settings = await this.getSettings();
    await this.updateSettings({ ...settings, syncEnabled: enabled });
  }

  /**
   * Get all calendars on the device
   */
  static async getAvailableCalendars(): Promise<Calendar.Calendar[]> {
    try {
      const hasPerms = await this.hasPermissions();
      if (!hasPerms) return [];
      
      return await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    } catch (error) {
      console.error('Error getting calendars:', error);
      return [];
    }
  }
}

export const calendarService = new CalendarService();
