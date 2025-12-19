// Principle Centered Planner - AsyncStorage Service
// Centralized service for all local storage operations

import { STORAGE_KEYS } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AsyncStorageService {
  /**
   * Get item from storage
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return JSON.parse(value) as T;
      }
      return null;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  /**
   * Set item in storage
   */
  async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      return false;
    }
  }

  /**
   * Remove item from storage
   */
  async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      return false;
    }
  }

  /**
   * Clear all storage (use with caution)
   */
  async clearAll(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  /**
   * Get string value (without JSON parsing)
   */
  async getString(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting string ${key}:`, error);
      return null;
    }
  }

  /**
   * Set string value (without JSON stringifying)
   */
  async setString(key: string, value: string): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error setting string ${key}:`, error);
      return false;
    }
  }

  /**
   * Get boolean value
   */
  async getBoolean(key: string): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value === 'true';
    } catch (error) {
      console.error(`Error getting boolean ${key}:`, error);
      return false;
    }
  }

  /**
   * Set boolean value
   */
  async setBoolean(key: string, value: boolean): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, value.toString());
      return true;
    } catch (error) {
      console.error(`Error setting boolean ${key}:`, error);
      return false;
    }
  }

  /**
   * Get multiple items at once
   */
  async getMultiple(keys: string[]): Promise<Record<string, any>> {
    try {
      const pairs = await AsyncStorage.multiGet(keys);
      const result: Record<string, any> = {};

      pairs.forEach(([key, value]) => {
        if (value !== null) {
          try {
            result[key] = JSON.parse(value);
          } catch {
            result[key] = value;
          }
        }
      });

      return result;
    } catch (error) {
      console.error('Error getting multiple items:', error);
      return {};
    }
  }

  /**
   * Set multiple items at once
   */
  async setMultiple(items: Record<string, any>): Promise<boolean> {
    try {
      const pairs: [string, string][] = Object.entries(items).map(([key, value]) => [
        key,
        typeof value === 'string' ? value : JSON.stringify(value),
      ]);

      await AsyncStorage.multiSet(pairs);
      return true;
    } catch (error) {
      console.error('Error setting multiple items:', error);
      return false;
    }
  }

  /**
   * Get all keys in storage
   */
  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  /**
   * Merge value with existing data
   */
  async mergeItem<T extends Record<string, any>>(
    key: string,
    value: Partial<T>
  ): Promise<boolean> {
    try {
      await AsyncStorage.mergeItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error merging item ${key}:`, error);
      return false;
    }
  }

  // ============================================
  // Specialized getters for Principle Centered Planner data
  // ============================================

  /**
   * Check if onboarding is completed
   */
  async isOnboardingCompleted(): Promise<boolean> {
    return this.getBoolean(STORAGE_KEYS.ONBOARDING_COMPLETED);
  }

  /**
   * Set onboarding completed
   */
  async setOnboardingCompleted(completed: boolean): Promise<boolean> {
    return this.setBoolean(STORAGE_KEYS.ONBOARDING_COMPLETED, completed);
  }

  /**
   * Get user mission
   */
  async getUserMission(): Promise<string | null> {
    return this.getString(STORAGE_KEYS.USER_MISSION);
  }

  /**
   * Set user mission
   */
  async setUserMission(mission: string): Promise<boolean> {
    return this.setString(STORAGE_KEYS.USER_MISSION, mission);
  }
}

// Export singleton instance
export const storageService = new AsyncStorageService();
export default storageService;
