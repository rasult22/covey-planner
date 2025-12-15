// Covey Planner - Roles Modal
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { COLORS } from '@/lib/constants/colors';
import { GAP, PADDING, RADIUS } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';
import { MAX_ROLES, useAddRoleMutation, useCanAddRole, useDeleteRoleMutation, useRolesQuery, useUpdateRoleMutation } from '@/queries/foundation/roles';
import { Role } from '@/types';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RolesModal() {
  const { data: roles = [], isLoading } = useRolesQuery();
  const { mutate: addRole } = useAddRoleMutation();
  const { mutate: updateRole } = useUpdateRoleMutation();
  const { mutate: deleteRole } = useDeleteRoleMutation();
  const canAddRole = useCanAddRole();
  const maxRoles = MAX_ROLES;
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleStatement, setNewRoleStatement] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatement, setEditStatement] = useState('');

  const handleAddRole = () => {
    if (!newRoleName.trim()) return;

    if (!canAddRole) {
      Alert.alert(
        'Maximum Roles Reached',
        `You can only have ${maxRoles} roles. Consider consolidating or removing a role before adding a new one.`,
        [{ text: 'OK' }]
      );
      return;
    }

    addRole(
      {
        name: newRoleName.trim(),
        statement: newRoleStatement.trim(),
      },
      {
        onSuccess: () => {
          setNewRoleName('');
          setNewRoleStatement('');
          setShowAddForm(false);
        },
      }
    );
  };

  const handleUpdateStatement = (id: string) => {
    updateRole(
      { id, updates: { statement: editStatement } },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditStatement('');
        },
      }
    );
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Role',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteRole(id),
        },
      ]
    );
  };

  const startEditing = (role: Role) => {
    setEditingId(role.id);
    setEditStatement(role.statement);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.countCard}>
          <Text style={styles.countText}>
            {roles.length} / {maxRoles} Roles
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(roles.length / maxRoles) * 100}%` }
              ]}
            />
          </View>
          <Text style={styles.helperText}>
            Focus on your most important life roles
          </Text>
        </Card>

        {roles.map((role) => (
          <Card key={role.id} style={styles.roleCard}>
            <View style={styles.roleHeader}>
              <Text style={styles.roleName}>{role.name}</Text>
              <TouchableOpacity
                onPress={() => handleDelete(role.id, role.name)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {editingId === role.id ? (
              <>
                <Input
                  value={editStatement}
                  onChangeText={setEditStatement}
                  placeholder="Who do you want to be in this role?"
                  multiline
                  numberOfLines={2}
                />
                <View style={styles.editActions}>
                  <Button
                    onPress={() => {
                      setEditingId(null);
                      setEditStatement('');
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onPress={() => handleUpdateStatement(role.id)}
                    size="sm"
                  >
                    Save
                  </Button>
                </View>
              </>
            ) : (
              <>
                {role.statement && (
                  <Text style={styles.roleStatement}>{role.statement}</Text>
                )}
                <TouchableOpacity onPress={() => startEditing(role)}>
                  <Text style={styles.editText}>
                    {role.statement ? 'Edit statement' : 'Add statement'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Card>
        ))}

        {!showAddForm ? (
          <Button
            onPress={() => {
              if (!canAddRole) {
                Alert.alert(
                  'Maximum Roles Reached',
                  `You can only have ${maxRoles} roles. Consider consolidating or removing a role before adding a new one.`,
                  [{ text: 'OK' }]
                );
                return;
              }
              setShowAddForm(true);
            }}
            variant="ghost"
            fullWidth
          >
            + Add Role
          </Button>
        ) : (
          <Card style={styles.addForm}>
            <Text style={styles.addFormTitle}>Add New Role</Text>
            <Input
              value={newRoleName}
              onChangeText={setNewRoleName}
              placeholder="Role name (e.g., Parent, Leader, Friend)..."
            />
            <Input
              value={newRoleStatement}
              onChangeText={setNewRoleStatement}
              placeholder="Who do you want to be in this role?"
              multiline
              numberOfLines={3}
            />
            <View style={styles.addFormActions}>
              <Button
                onPress={() => {
                  setShowAddForm(false);
                  setNewRoleName('');
                  setNewRoleStatement('');
                }}
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                onPress={handleAddRole}
                disabled={!newRoleName.trim()}
              >
                Add
              </Button>
            </View>
          </Card>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          onPress={() => router.back()}
          variant="secondary"
          fullWidth
        >
          Close
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: PADDING.lg,
    paddingBottom: PADDING['2xl'],
  },
  loadingText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: PADDING.xl,
  },
  countCard: {
    marginBottom: PADDING.lg,
  },
  countText: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.gray[200],
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginBottom: PADDING.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
  },
  helperText: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.tertiary,
    marginTop: PADDING.xs,
  },
  roleCard: {
    marginBottom: PADDING.md,
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: PADDING.xs,
  },
  roleName: {
    fontSize: TYPOGRAPHY.bodyLarge.fontSize,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  deleteButton: {
    padding: PADDING.xs,
  },
  deleteButtonText: {
    fontSize: 20,
    color: COLORS.text.tertiary,
  },
  roleStatement: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
    marginBottom: PADDING.xs,
    lineHeight: TYPOGRAPHY.bodySmall.lineHeight * TYPOGRAPHY.bodySmall.fontSize,
  },
  editText: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  editActions: {
    flexDirection: 'row',
    gap: GAP.sm,
    marginTop: PADDING.xs,
  },
  addForm: {
    marginTop: PADDING.lg,
    gap: GAP.md,
  },
  addFormTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
  },
  addFormActions: {
    flexDirection: 'row',
    gap: GAP.md,
  },
  footer: {
    padding: PADDING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
});
