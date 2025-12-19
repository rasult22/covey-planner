// Principle Centered Planner - useRoles Hook
import { storageService } from '@/lib/storage/AsyncStorageService';
import { Achievement, Role, STORAGE_KEYS } from '@/types';
import { useCallback, useEffect, useState } from 'react';

const MAX_ROLES = 7;

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRoles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await storageService.getItem<Role[]>(STORAGE_KEYS.USER_ROLES);
      setRoles(data || []);
    } catch (err) {
      setError('Failed to load roles');
      console.error('Error loading roles:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addRole = useCallback(async (role: Omit<Role, 'id' | 'createdAt'>) => {
    try {
      setError(null);

      if (roles.length >= MAX_ROLES) {
        setError(`Maximum ${MAX_ROLES} roles allowed`);
        return null;
      }

      const hadRoles = roles.length > 0;
      const newRole: Role = {
        ...role,
        id: `role-${Date.now()}-${Math.random()}`,
        createdAt: new Date().toISOString(),
      };

      const updatedRoles = [...roles, newRole];
      await storageService.setItem(STORAGE_KEYS.USER_ROLES, updatedRoles);
      setRoles(updatedRoles);

      // Unlock achievement for first role
      if (!hadRoles) {
        try {
          const achievements = await storageService.getItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS);
          if (achievements) {
            const updated = achievements.map(a =>
              a.key === 'roles_complete'
                ? { ...a, isUnlocked: true, unlockedAt: new Date().toISOString() }
                : a
            );
            await storageService.setItem(STORAGE_KEYS.ACHIEVEMENTS, updated);
          }
        } catch (achievementErr) {
          console.error('Error unlocking achievement:', achievementErr);
        }
      }

      return newRole;
    } catch (err) {
      setError('Failed to add role');
      console.error('Error adding role:', err);
      return null;
    }
  }, [roles]);

  const updateRole = useCallback(async (id: string, updates: Partial<Role>) => {
    try {
      setError(null);
      const updatedRoles = roles.map(r =>
        r.id === id ? { ...r, ...updates } : r
      );
      await storageService.setItem(STORAGE_KEYS.USER_ROLES, updatedRoles);
      setRoles(updatedRoles);
      return true;
    } catch (err) {
      setError('Failed to update role');
      console.error('Error updating role:', err);
      return false;
    }
  }, [roles]);

  const deleteRole = useCallback(async (id: string) => {
    try {
      setError(null);
      const updatedRoles = roles.filter(r => r.id !== id);
      await storageService.setItem(STORAGE_KEYS.USER_ROLES, updatedRoles);
      setRoles(updatedRoles);
      return true;
    } catch (err) {
      setError('Failed to delete role');
      console.error('Error deleting role:', err);
      return false;
    }
  }, [roles]);

  const canAddRole = useCallback(() => {
    return roles.length < MAX_ROLES;
  }, [roles]);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  return {
    roles,
    isLoading,
    error,
    addRole,
    updateRole,
    deleteRole,
    canAddRole,
    maxRoles: MAX_ROLES,
    reload: loadRoles,
  };
}
