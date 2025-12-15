// Covey Planner - Fix Mission Storage Migration
// This migration fixes the mission data that was incorrectly stored with JSON.stringify

import { STORAGE_KEYS } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function fixMissionStorage(): Promise<boolean> {
  try {
    const rawValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_MISSION);
    
    if (!rawValue) {
      console.log('No mission data to fix');
      return true;
    }

    // Check if it's already a plain string (correct format)
    if (!rawValue.startsWith('"') && !rawValue.startsWith('{')) {
      console.log('Mission data is already in correct format');
      return true;
    }

    // Try to parse it as JSON (incorrect format)
    try {
      const parsed = JSON.parse(rawValue);
      
      // If it's a string that was JSON.stringified, save it correctly
      if (typeof parsed === 'string') {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_MISSION, parsed);
        console.log('Fixed mission storage format');
        return true;
      }
    } catch (parseError) {
      // If parsing fails, the data might be corrupted beyond repair
      console.error('Mission data is corrupted, clearing it');
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_MISSION);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error fixing mission storage:', error);
    return false;
  }
}
