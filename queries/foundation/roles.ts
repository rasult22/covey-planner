// Principle Centered Planner - Roles Queries & Mutations
import { storageService } from '@/lib/storage/AsyncStorageService';
import { Achievement, Role, STORAGE_KEYS } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const MAX_ROLES = 7;

// ============================================================================
// QUERIES
// ============================================================================

export function useRolesQuery() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const data = await storageService.getItem<Role[]>(STORAGE_KEYS.USER_ROLES);
      return data || [];
    },
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

export function useAddRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (role: Omit<Role, 'id' | 'createdAt'>) => {
      const currentRoles = queryClient.getQueryData<Role[]>(['roles']) || [];

      if (currentRoles.length >= MAX_ROLES) {
        throw new Error(`Maximum ${MAX_ROLES} roles allowed`);
      }

      const hadRoles = currentRoles.length > 0;

      const newRole: Role = {
        ...role,
        id: `role-${Date.now()}-${Math.random()}`,
        createdAt: new Date().toISOString(),
      };

      const updatedRoles = [...currentRoles, newRole];
      await storageService.setItem(STORAGE_KEYS.USER_ROLES, updatedRoles);

      // Unlock achievement for first role
      if (!hadRoles) {
        try {
          const achievements = await storageService.getItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS);
          if (achievements) {
            const updated = achievements.map(a =>
              a.key === 'roles_complete' ? { ...a, isUnlocked: true, unlockedAt: new Date().toISOString() } : a
            );
            await storageService.setItem(STORAGE_KEYS.ACHIEVEMENTS, updated);
            queryClient.invalidateQueries({ queryKey: ['achievements'] });
          }
        } catch (err) {
          console.error('Error unlocking achievement:', err);
        }
      }

      return newRole;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

export function useUpdateRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Role> }) => {
      const currentRoles = queryClient.getQueryData<Role[]>(['roles']) || [];
      const updatedRoles = currentRoles.map(r => (r.id === id ? { ...r, ...updates } : r));
      await storageService.setItem(STORAGE_KEYS.USER_ROLES, updatedRoles);
      return updatedRoles;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

export function useDeleteRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const currentRoles = queryClient.getQueryData<Role[]>(['roles']) || [];
      const updatedRoles = currentRoles.filter(r => r.id !== id);
      await storageService.setItem(STORAGE_KEYS.USER_ROLES, updatedRoles);
      return updatedRoles;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

// ============================================================================
// HELPERS
// ============================================================================

export function useCanAddRole() {
  const { data: roles = [] } = useRolesQuery();
  return roles.length < MAX_ROLES;
}

export { MAX_ROLES };
