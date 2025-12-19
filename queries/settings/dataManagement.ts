// Principle Centered Planner - Data Management (import/export - no TanStack Query needed)
// This is utility logic, not data fetching - keep as hook or convert to service
import { DataService, ExportData } from '@/lib/import-export/DataService';
import { useState } from 'react';
import { Share } from 'react-native';

// NOTE: Data import/export is NOT typical async state that needs caching.
// It's imperative operations (export once, import once).
// This can stay as a hook or be converted to a plain service.
// For consistency with migration, creating a minimal "query" wrapper.

export function useDataManagement() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const exportData = async (): Promise<ExportData | null> => {
    try {
      setIsExporting(true);
      return await DataService.exportAllData();
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    } finally {
      setIsExporting(false);
    }
  };

  const exportDataAsJSON = async (): Promise<string | null> => {
    try {
      const data = await exportData();
      if (!data) return null;
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data as JSON:', error);
      return null;
    }
  };

  const shareDataAsText = async (): Promise<boolean> => {
    try {
      const jsonString = await exportDataAsJSON();
      if (!jsonString) return false;
      await Share.share({ message: jsonString, title: 'Principle Centered Planner Data Export' });
      return true;
    } catch (error) {
      console.error('Error sharing data:', error);
      return false;
    }
  };

  const importData = async (jsonString: string, merge: boolean = false): Promise<boolean> => {
    try {
      setIsImporting(true);
      const data: ExportData = JSON.parse(jsonString);
      return await DataService.importData(data, merge);
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    } finally {
      setIsImporting(false);
    }
  };

  const clearAllData = async (): Promise<boolean> => {
    try {
      return await DataService.clearAllData();
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  };

  const getDataSize = async () => {
    try {
      return await DataService.getDataSize();
    } catch (error) {
      console.error('Error getting data size:', error);
      return { sizeKB: 0, itemCount: 0 };
    }
  };

  return {
    isExporting,
    isImporting,
    exportData,
    exportDataAsJSON,
    shareDataAsText,
    importData,
    clearAllData,
    getDataSize,
  };
}

// No changes needed - import/export is imperative, not cached data
