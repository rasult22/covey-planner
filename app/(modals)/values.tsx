// Covey Planner - Values Modal
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useValues } from '@/hooks/foundation/useValues';
import { CATEGORY_LABELS } from '@/lib/constants/predefinedValues';
import { Value, ValueCategory } from '@/types';
import { COLORS } from '@/lib/constants/colors';
import { PADDING, GAP, RADIUS } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';

export default function ValuesModal() {
  const { values, addValue, updateValue, deleteValue, isLoading } = useValues();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newValueName, setNewValueName] = useState('');
  const [newValueStatement, setNewValueStatement] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatement, setEditStatement] = useState('');

  const handleAddValue = async () => {
    if (!newValueName.trim()) return;

    const result = await addValue({
      name: newValueName.trim(),
      statement: newValueStatement.trim(),
      predefined: false,
    });

    if (result) {
      setNewValueName('');
      setNewValueStatement('');
      setShowAddForm(false);
    }
  };

  const handleUpdateStatement = async (id: string) => {
    const success = await updateValue(id, { statement: editStatement });
    if (success) {
      setEditingId(null);
      setEditStatement('');
    }
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Value',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteValue(id),
        },
      ]
    );
  };

  const startEditing = (value: Value) => {
    setEditingId(value.id);
    setEditStatement(value.statement);
  };

  const groupedValues = values.reduce((acc, value) => {
    const category = value.category || 'personal';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(value);
    return acc;
  }, {} as Record<string, Value[]>);

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
            {values.length} {values.length === 1 ? 'Value' : 'Values'}
          </Text>
        </Card>

        {Object.entries(groupedValues).map(([category, categoryValues]) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>
              {CATEGORY_LABELS[category as ValueCategory] || category}
            </Text>
            {categoryValues.map((value) => (
              <Card key={value.id} style={styles.valueCard}>
                <View style={styles.valueHeader}>
                  <Text style={styles.valueName}>{value.name}</Text>
                  <TouchableOpacity
                    onPress={() => handleDelete(value.id, value.name)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                {editingId === value.id ? (
                  <>
                    <Input
                      value={editStatement}
                      onChangeText={setEditStatement}
                      placeholder="What does this value mean to you?"
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
                        onPress={() => handleUpdateStatement(value.id)}
                        size="sm"
                      >
                        Save
                      </Button>
                    </View>
                  </>
                ) : (
                  <>
                    {value.statement && (
                      <Text style={styles.valueStatement}>{value.statement}</Text>
                    )}
                    <TouchableOpacity onPress={() => startEditing(value)}>
                      <Text style={styles.editText}>
                        {value.statement ? 'Edit statement' : 'Add statement'}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </Card>
            ))}
          </View>
        ))}

        {!showAddForm ? (
          <Button
            onPress={() => setShowAddForm(true)}
            variant="ghost"
            fullWidth
          >
            + Add Value
          </Button>
        ) : (
          <Card style={styles.addForm}>
            <Text style={styles.addFormTitle}>Add New Value</Text>
            <Input
              value={newValueName}
              onChangeText={setNewValueName}
              placeholder="Value name..."
            />
            <Input
              value={newValueStatement}
              onChangeText={setNewValueStatement}
              placeholder="What does this value mean to you?"
              multiline
              numberOfLines={3}
            />
            <View style={styles.addFormActions}>
              <Button
                onPress={() => {
                  setShowAddForm(false);
                  setNewValueName('');
                  setNewValueStatement('');
                }}
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                onPress={handleAddValue}
                disabled={!newValueName.trim()}
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
  },
  categorySection: {
    marginBottom: PADDING.lg,
  },
  categoryTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.sm,
  },
  valueCard: {
    marginBottom: PADDING.md,
  },
  valueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: PADDING.xs,
  },
  valueName: {
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
  valueStatement: {
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
