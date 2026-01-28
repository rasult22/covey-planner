// Principle Centered Planner - Roles Setup Screen
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAchievements } from '@/hooks/gamification/useAchievements';
import { COLORS } from '@/lib/constants/colors';
import { ROLE_EXAMPLES } from '@/lib/constants/roleExamples';
import { GAP, PADDING, RADIUS } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';
import { storageService } from '@/lib/storage/AsyncStorageService';
import { Role, STORAGE_KEYS } from '@/types';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MAX_ROLES = 7;

export default function SetupRolesScreen() {
  const [roles, setRoles] = useState<Array<{ name: string; statement: string }>>([]);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customRole, setCustomRole] = useState('');
  const [customStatement, setCustomStatement] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { unlockAchievement } = useAchievements();

  const addRole = (roleName: string) => {
    if (roles.length >= MAX_ROLES) {
      Alert.alert(
        'Maximum Roles Reached',
        `You can only have ${MAX_ROLES} roles to maintain focus and balance.`
      );
      return;
    }

    if (roles.find(r => r.name === roleName)) {
      return; // Already added
    }

    setRoles([...roles, { name: roleName, statement: '' }]);
  };

  const addCustomRole = () => {
    if (!customRole.trim()) return;

    if (roles.length >= MAX_ROLES) {
      Alert.alert(
        'Maximum Roles Reached',
        `You can only have ${MAX_ROLES} roles to maintain focus and balance.`
      );
      return;
    }

    setRoles([...roles, { name: customRole.trim(), statement: customStatement.trim() }]);
    setCustomRole('');
    setCustomStatement('');
    setShowCustomForm(false);
  };

  const removeRole = (index: number) => {
    setRoles(roles.filter((_, i) => i !== index));
  };

  const updateStatement = (index: number, statement: string) => {
    const newRoles = [...roles];
    newRoles[index].statement = statement;
    setRoles(newRoles);
  };

  const handleContinue = async () => {
    if (roles.length === 0) {
      alert('Please add at least one role');
      return;
    }

    setIsSaving(true);
    try {
      const rolesToSave: Role[] = roles.map((role) => ({
        id: `role-${Date.now()}-${Math.random()}`,
        name: role.name,
        statement: role.statement,
        createdAt: new Date().toISOString(),
      }));

      await storageService.setItem(STORAGE_KEYS.USER_ROLES, rolesToSave);
      // Unlock achievement for establishing roles
      await unlockAchievement('roles_complete');
      router.push('/(onboarding)/complete');
    } catch (error) {
      console.error('Error saving roles:', error);
      alert('Failed to save roles. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        <Text style={styles.title}>Your Life Roles</Text>
        <Text style={styles.subtitle}>
          Define your key life roles (maximum {MAX_ROLES}). These help maintain balance across different areas of life.
        </Text>

        <Card style={styles.progressCard}>
          <Text style={styles.progressText}>
            {roles.length} / {MAX_ROLES} roles defined
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(roles.length / MAX_ROLES) * 100}%` },
              ]}
            />
          </View>
        </Card>

        {roles.length > 0 && (
          <View style={styles.rolesSection}>
            <Text style={styles.sectionTitle}>Your Roles:</Text>
            {roles.map((role, index) => (
              <Card key={index} style={styles.roleCard}>
                <View style={styles.roleHeader}>
                  <Text style={styles.roleName}>{role.name}</Text>
                  <TouchableOpacity
                    onPress={() => removeRole(index)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <Input
                  value={role.statement}
                  onChangeText={(text) => updateStatement(index, text)}
                  placeholder="Who do you want to be in this role?"
                  multiline
                  numberOfLines={2}
                />
              </Card>
            ))}
          </View>
        )}

        {roles.length < MAX_ROLES && (
          <>
            <Text style={styles.sectionTitle}>Suggested Roles:</Text>
            <View style={styles.examplesGrid}>
              {ROLE_EXAMPLES.filter(
                (example) => !roles.find((r) => r.name === example)
              ).slice(0, 12).map((example) => (
                <TouchableOpacity
                  key={example}
                  onPress={() => addRole(example)}
                  style={styles.exampleChip}
                >
                  <Text style={styles.exampleChipText}>+ {example}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {!showCustomForm ? (
              <Button
                onPress={() => setShowCustomForm(true)}
                variant="ghost"
                fullWidth
              >
                + Add Custom Role
              </Button>
            ) : (
              <Card style={styles.customForm}>
                <Text style={styles.customFormTitle}>Add Custom Role</Text>
                <Input
                  value={customRole}
                  onChangeText={setCustomRole}
                  placeholder="Role name..."
                />
                <Input
                  value={customStatement}
                  onChangeText={setCustomStatement}
                  placeholder="Who do you want to be in this role?"
                  multiline
                  numberOfLines={3}
                />
                <View style={styles.customFormActions}>
                  <Button
                    onPress={() => {
                      setShowCustomForm(false);
                      setCustomRole('');
                      setCustomStatement('');
                    }}
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                  <Button
                    onPress={addCustomRole}
                    disabled={!customRole.trim()}
                  >
                    Add
                  </Button>
                </View>
              </Card>
            )}
          </>
        )}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <Button
          onPress={() => router.back()}
          variant="ghost"
          fullWidth
        >
          Back
        </Button>
        <Button
          onPress={handleContinue}
          fullWidth
          loading={isSaving}
          disabled={roles.length === 0}
        >
          Continue ({roles.length} roles)
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: PADDING.lg,
    paddingBottom: PADDING['2xl'],
  },
  title: {
    fontSize: TYPOGRAPHY.h2.fontSize,
    fontWeight: TYPOGRAPHY.h2.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.secondary,
    marginBottom: PADDING.lg,
  },
  progressCard: {
    marginBottom: PADDING.lg,
  },
  progressText: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
    marginBottom: PADDING.xs,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.bg.tertiary,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  rolesSection: {
    marginBottom: PADDING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.sm,
  },
  roleCard: {
    marginBottom: PADDING.md,
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: PADDING.sm,
  },
  roleName: {
    fontSize: TYPOGRAPHY.bodyLarge.fontSize,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  removeButton: {
    padding: PADDING.xs,
  },
  removeButtonText: {
    fontSize: 20,
    color: COLORS.text.tertiary,
  },
  examplesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP.sm,
    marginBottom: PADDING.lg,
  },
  exampleChip: {
    paddingHorizontal: PADDING.md,
    paddingVertical: PADDING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border.default,
    backgroundColor: COLORS.bg.secondary,
  },
  exampleChipText: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
  },
  customForm: {
    marginTop: PADDING.lg,
    gap: GAP.md,
  },
  customFormTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
  },
  customFormActions: {
    flexDirection: 'row',
    gap: GAP.md,
  },
  footer: {
    padding: PADDING.lg,
    gap: GAP.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
    backgroundColor: COLORS.background,
  },
});
