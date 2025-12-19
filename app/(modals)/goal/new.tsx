// Principle Centered Planner - New Goal Modal
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DatePicker } from '@/components/ui/DatePicker';
import { Input } from '@/components/ui/Input';
import { COLORS } from '@/lib/constants/colors';
import { GAP, PADDING } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';
import { useAddGoalMutation } from '@/queries/foundation/goals';
import { useRolesQuery } from '@/queries/foundation/roles';
import { useValuesQuery } from '@/queries/foundation/values';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Quadrant = 'I' | 'II' | 'III' | 'IV';

const QUADRANT_OPTIONS = [
  { value: 'I' as Quadrant, label: 'I - Urgent & Important', description: 'Crises, deadlines, emergencies' },
  { value: 'II' as Quadrant, label: 'II - Important, Not Urgent', description: 'Planning, prevention, development' },
  { value: 'III' as Quadrant, label: 'III - Urgent, Not Important', description: 'Interruptions, some calls/emails' },
  { value: 'IV' as Quadrant, label: 'IV - Neither', description: 'Time wasters, trivial activities' },
];

export default function NewGoalModal() {
  const { mutate: addGoal, isPending } = useAddGoalMutation();
  const { data: values = [] } = useValuesQuery();
  const { data: roles = [] } = useRolesQuery();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState<Date>(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)); // Default 1 year from now
  const [quadrant, setQuadrant] = useState<Quadrant>('II');
  const [selectedValueIds, setSelectedValueIds] = useState<string[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);

  const toggleValue = (valueId: string) => {
    setSelectedValueIds(prev =>
      prev.includes(valueId)
        ? prev.filter(id => id !== valueId)
        : [...prev, valueId]
    );
  };

  const toggleRole = (roleId: string) => {
    setSelectedRoleIds(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Missing Information', 'Please enter a goal title.');
      return;
    }

    addGoal(
      {
        title: title.trim(),
        description: description.trim(),
        deadline: deadline.toISOString(),
        linkedValueIds: selectedValueIds,
        linkedRoleIds: selectedRoleIds,
        steps: [],
        quadrant,
      },
      {
        onSuccess: () => {
          router.back();
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        <Card>
          <Text style={styles.sectionTitle}>Goal Details</Text>

          <Input
            value={title}
            onChangeText={setTitle}
            placeholder="Goal title..."
            style={styles.input}
          />

          <Input
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your goal..."
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          <DatePicker
            value={deadline}
            onChange={setDeadline}
            placeholder="Select deadline"
            minimumDate={new Date()}
            style={styles.input}
          />
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Quadrant</Text>
          <Text style={styles.helperText}>
            Which quadrant does this goal belong to?
          </Text>

          <View style={styles.quadrantGrid}>
            {QUADRANT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => setQuadrant(option.value)}
                style={[
                  styles.quadrantOption,
                  quadrant === option.value && styles.quadrantOptionSelected,
                ]}
              >
                <Text
                  style={[
                    styles.quadrantLabel,
                    quadrant === option.value && styles.quadrantLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
                <Text
                  style={[
                    styles.quadrantDescription,
                    quadrant === option.value && styles.quadrantDescriptionSelected,
                  ]}
                >
                  {option.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {values.length > 0 && (
          <Card>
            <Text style={styles.sectionTitle}>Linked Values</Text>
            <Text style={styles.helperText}>
              Which values does this goal support?
            </Text>

            <View style={styles.chipContainer}>
              {values.map((value) => (
                <TouchableOpacity
                  key={value.id}
                  onPress={() => toggleValue(value.id)}
                  style={[
                    styles.chip,
                    selectedValueIds.includes(value.id) && styles.chipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedValueIds.includes(value.id) && styles.chipTextSelected,
                    ]}
                  >
                    {value.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        )}

        {roles.length > 0 && (
          <Card>
            <Text style={styles.sectionTitle}>Linked Roles</Text>
            <Text style={styles.helperText}>
              Which life roles does this goal relate to?
            </Text>

            <View style={styles.chipContainer}>
              {roles.map((role) => (
                <TouchableOpacity
                  key={role.id}
                  onPress={() => toggleRole(role.id)}
                  style={[
                    styles.chip,
                    selectedRoleIds.includes(role.id) && styles.chipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedRoleIds.includes(role.id) && styles.chipTextSelected,
                    ]}
                  >
                    {role.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        )}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <Button onPress={() => router.back()} variant="ghost" style={styles.footerButton}>
          Cancel
        </Button>
        <Button onPress={handleSubmit} loading={isPending} disabled={isPending} style={styles.footerButton}>
          Create Goal
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
  keyboardAvoid: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: PADDING.lg,
    paddingBottom: PADDING['2xl'],
    gap: GAP.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.sm,
  },
  helperText: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.tertiary,
    marginBottom: PADDING.md,
  },
  input: {
    marginBottom: PADDING.md,
  },
  quadrantGrid: {
    gap: GAP.sm,
  },
  quadrantOption: {
    padding: PADDING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    backgroundColor: COLORS.background,
  },
  quadrantOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  quadrantLabel: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: PADDING.xs,
  },
  quadrantLabelSelected: {
    color: COLORS.background,
  },
  quadrantDescription: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.tertiary,
  },
  quadrantDescriptionSelected: {
    color: COLORS.background,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP.sm,
  },
  chip: {
    paddingHorizontal: PADDING.md,
    paddingVertical: PADDING.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    backgroundColor: COLORS.background,
  },
  chipSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  chipText: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
  },
  chipTextSelected: {
    color: COLORS.background,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: PADDING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
    gap: GAP.md,
  },
  footerButton: {
    flex: 1,
  },
});
