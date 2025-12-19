// Principle Centered Planner - Data Import/Export Service
//
// NOTE: To enable file import/export functionality, install these packages:
// npm install expo-file-system expo-sharing expo-document-picker
//
// Then uncomment the imports below:
// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';
// import * as DocumentPicker from 'expo-document-picker';

// Type declarations for optional dependencies (uncomment imports above when packages are installed)
declare const FileSystem: {
  documentDirectory: string;
  writeAsStringAsync: (fileUri: string, contents: string, options?: any) => Promise<void>;
  readAsStringAsync: (fileUri: string, options?: any) => Promise<string>;
  EncodingType: { UTF8: string };
};
declare const Sharing: {
  isAvailableAsync: () => Promise<boolean>;
  shareAsync: (url: string, options?: any) => Promise<void>;
};
declare const DocumentPicker: {
  getDocumentAsync: (options?: any) => Promise<{ canceled: boolean; assets: Array<{ uri: string }> }>;
};

import { storageService } from '@/lib/storage/AsyncStorageService';
import { STORAGE_KEYS } from '@/types';

export interface ExportData {
  version: string;
  exportedAt: string;
  data: {
    // Foundation
    mission?: string;
    values?: any[];
    roles?: any[];
    goals?: any[];

    // Planning
    weeklyPlans?: any[];
    bigRocks?: any[];
    dailyTasks?: any[];

    // Gamification
    streaks?: any;
    achievements?: any[];
    promises?: any[];

    // Analytics
    quadrantStats?: any;
    weeklyReflections?: any[];

    // Settings
    notificationSettings?: any;
    appSettings?: any;
  };
}

export class DataService {
  private static readonly VERSION = '1.0.0';

  /**
   * Export all data to JSON
   */
  static async exportAllData(): Promise<ExportData> {
    try {
      const data: ExportData['data'] = {};

      // Foundation
      data.mission = (await storageService.getString(STORAGE_KEYS.USER_MISSION)) ?? undefined;
      data.values = (await storageService.getItem(STORAGE_KEYS.USER_VALUES)) ?? undefined;
      data.roles = (await storageService.getItem(STORAGE_KEYS.USER_ROLES)) ?? undefined;
      data.goals = (await storageService.getItem(STORAGE_KEYS.LONG_TERM_GOALS)) ?? undefined;

      // Planning
      data.weeklyPlans = (await storageService.getItem(STORAGE_KEYS.WEEKLY_PLAN)) ?? undefined;
      data.bigRocks = (await storageService.getItem(STORAGE_KEYS.BIG_ROCKS)) ?? undefined;
      data.dailyTasks = (await storageService.getItem(STORAGE_KEYS.DAILY_TASKS)) ?? undefined;

      // Gamification
      data.streaks = (await storageService.getItem(STORAGE_KEYS.STREAKS)) ?? undefined;
      data.achievements = (await storageService.getItem(STORAGE_KEYS.ACHIEVEMENTS)) ?? undefined;
      data.promises = (await storageService.getItem(STORAGE_KEYS.PROMISES_3010)) ?? undefined;

      // Analytics
      data.quadrantStats = (await storageService.getItem(STORAGE_KEYS.QUADRANT_STATS)) ?? undefined;
      data.weeklyReflections = (await storageService.getItem(STORAGE_KEYS.WEEKLY_REFLECTIONS)) ?? undefined;

      // Settings
      data.notificationSettings = (await storageService.getItem(STORAGE_KEYS.NOTIFICATION_SETTINGS)) ?? undefined;
      data.appSettings = (await storageService.getItem(STORAGE_KEYS.APP_SETTINGS)) ?? undefined;

      const exportData: ExportData = {
        version: this.VERSION,
        exportedAt: new Date().toISOString(),
        data,
      };

      return exportData;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Failed to export data');
    }
  }

  /**
   * Export data to JSON file and share
   */
  static async exportToFile(): Promise<boolean> {
    try {
      const exportData = await this.exportAllData();
      const jsonString = JSON.stringify(exportData, null, 2);

      const fileName = `covey-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, jsonString, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export Principle Centered Planner Data',
        });
      }

      return true;
    } catch (error) {
      console.error('Error exporting to file:', error);
      return false;
    }
  }

  /**
   * Import data from JSON file
   */
  static async importFromFile(): Promise<boolean> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return false;
      }

      const fileUri = result.assets[0].uri;
      const fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const importData: ExportData = JSON.parse(fileContent);

      return await this.importData(importData);
    } catch (error) {
      console.error('Error importing from file:', error);
      throw new Error('Failed to import data. Please ensure the file is valid.');
    }
  }

  /**
   * Import data from ExportData object
   */
  static async importData(importData: ExportData, merge: boolean = false): Promise<boolean> {
    try {
      // Validate version compatibility
      if (!this.isVersionCompatible(importData.version)) {
        throw new Error('Incompatible data version');
      }

      const { data } = importData;

      // Import foundation data
      if (data.mission !== undefined) {
        await storageService.setString(STORAGE_KEYS.USER_MISSION, data.mission);
      }

      if (data.values) {
        if (merge) {
          const existing = (await storageService.getItem<any[]>(STORAGE_KEYS.USER_VALUES)) ?? [];
          const merged = this.mergeArrays(existing, data.values, 'id');
          await storageService.setItem(STORAGE_KEYS.USER_VALUES, merged);
        } else {
          await storageService.setItem(STORAGE_KEYS.USER_VALUES, data.values);
        }
      }

      if (data.roles) {
        if (merge) {
          const existing = (await storageService.getItem<any[]>(STORAGE_KEYS.USER_ROLES)) ?? [];
          const merged = this.mergeArrays(existing, data.roles, 'id');
          await storageService.setItem(STORAGE_KEYS.USER_ROLES, merged);
        } else {
          await storageService.setItem(STORAGE_KEYS.USER_ROLES, data.roles);
        }
      }

      if (data.goals) {
        if (merge) {
          const existing = (await storageService.getItem<any[]>(STORAGE_KEYS.LONG_TERM_GOALS)) ?? [];
          const merged = this.mergeArrays(existing, data.goals, 'id');
          await storageService.setItem(STORAGE_KEYS.LONG_TERM_GOALS, merged);
        } else {
          await storageService.setItem(STORAGE_KEYS.LONG_TERM_GOALS, data.goals);
        }
      }

      // Import planning data
      if (data.weeklyPlans) {
        if (merge) {
          const existing = (await storageService.getItem<any[]>(STORAGE_KEYS.WEEKLY_PLAN)) ?? [];
          const merged = this.mergeArrays(existing, data.weeklyPlans, 'id');
          await storageService.setItem(STORAGE_KEYS.WEEKLY_PLAN, merged);
        } else {
          await storageService.setItem(STORAGE_KEYS.WEEKLY_PLAN, data.weeklyPlans);
        }
      }

      if (data.bigRocks) {
        if (merge) {
          const existing = (await storageService.getItem<any[]>(STORAGE_KEYS.BIG_ROCKS)) ?? [];
          const merged = this.mergeArrays(existing, data.bigRocks, 'id');
          await storageService.setItem(STORAGE_KEYS.BIG_ROCKS, merged);
        } else {
          await storageService.setItem(STORAGE_KEYS.BIG_ROCKS, data.bigRocks);
        }
      }

      if (data.dailyTasks) {
        if (merge) {
          const existing = (await storageService.getItem<any[]>(STORAGE_KEYS.DAILY_TASKS)) ?? [];
          const merged = this.mergeArrays(existing, data.dailyTasks, 'id');
          await storageService.setItem(STORAGE_KEYS.DAILY_TASKS, merged);
        } else {
          await storageService.setItem(STORAGE_KEYS.DAILY_TASKS, data.dailyTasks);
        }
      }

      // Import gamification data
      if (data.streaks) {
        await storageService.setItem(STORAGE_KEYS.STREAKS, data.streaks);
      }

      if (data.achievements) {
        await storageService.setItem(STORAGE_KEYS.ACHIEVEMENTS, data.achievements);
      }

      if (data.promises) {
        if (merge) {
          const existing = (await storageService.getItem<any[]>(STORAGE_KEYS.PROMISES_3010)) ?? [];
          const merged = this.mergeArrays(existing, data.promises, 'id');
          await storageService.setItem(STORAGE_KEYS.PROMISES_3010, merged);
        } else {
          await storageService.setItem(STORAGE_KEYS.PROMISES_3010, data.promises);
        }
      }

      // Import analytics data
      if (data.quadrantStats) {
        await storageService.setItem(STORAGE_KEYS.QUADRANT_STATS, data.quadrantStats);
      }

      if (data.weeklyReflections) {
        if (merge) {
          const existing = (await storageService.getItem<any[]>(STORAGE_KEYS.WEEKLY_REFLECTIONS)) ?? [];
          const merged = this.mergeArrays(existing, data.weeklyReflections, 'id');
          await storageService.setItem(STORAGE_KEYS.WEEKLY_REFLECTIONS, merged);
        } else {
          await storageService.setItem(STORAGE_KEYS.WEEKLY_REFLECTIONS, data.weeklyReflections);
        }
      }

      // Import settings (only if not merging)
      if (!merge) {
        if (data.notificationSettings) {
          await storageService.setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, data.notificationSettings);
        }

        if (data.appSettings) {
          await storageService.setItem(STORAGE_KEYS.APP_SETTINGS, data.appSettings);
        }
      }

      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }

  /**
   * Clear all app data
   */
  static async clearAllData(): Promise<boolean> {
    try {
      await storageService.clearAll();
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }

  /**
   * Get data size estimate
   */
  static async getDataSize(): Promise<{ sizeKB: number; itemCount: number }> {
    try {
      const exportData = await this.exportAllData();
      const jsonString = JSON.stringify(exportData);
      const sizeKB = Math.round((jsonString.length * 2) / 1024); // Approximate size in KB

      const itemCount = Object.values(exportData.data).reduce((count, value) => {
        if (Array.isArray(value)) {
          return count + value.length;
        } else if (value) {
          return count + 1;
        }
        return count;
      }, 0);

      return { sizeKB, itemCount };
    } catch (error) {
      console.error('Error calculating data size:', error);
      return { sizeKB: 0, itemCount: 0 };
    }
  }

  /**
   * Check version compatibility
   */
  private static isVersionCompatible(version: string): boolean {
    // For now, accept version 1.x.x
    return version.startsWith('1.');
  }

  /**
   * Merge two arrays by ID, preferring items from the new array
   */
  private static mergeArrays(existing: any[], newItems: any[], idKey: string): any[] {
    const merged = [...existing];

    newItems.forEach(newItem => {
      const existingIndex = merged.findIndex(item => item[idKey] === newItem[idKey]);

      if (existingIndex >= 0) {
        // Update existing item
        merged[existingIndex] = newItem;
      } else {
        // Add new item
        merged.push(newItem);
      }
    });

    return merged;
  }
}
