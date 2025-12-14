// Covey Planner - Values Setup Screen
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { COLORS } from '@/lib/constants/colors';
import { CATEGORY_LABELS, PREDEFINED_VALUES } from '@/lib/constants/predefinedValues';
import { GAP, PADDING, RADIUS } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';
import { storageService } from '@/lib/storage/AsyncStorageService';
import { STORAGE_KEYS, Value, ValueCategory } from '@/types';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SetupValuesScreen() {
  const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set());
  const [customValue, setCustomValue] = useState('');
  const [customStatement, setCustomStatement] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const toggleValue = (valueName: string) => {
    const newSelected = new Set(selectedValues);
    if (newSelected.has(valueName)) {
      newSelected.delete(valueName);
    } else {
      newSelected.add(valueName);
    }
    setSelectedValues(newSelected);
  };

  const addCustomValue = () => {
    if (!customValue.trim()) return;

    const newSelected = new Set(selectedValues);
    newSelected.add(customValue.trim());
    setSelectedValues(newSelected);
    setCustomValue('');
    setCustomStatement('');
    setShowCustomForm(false);
  };

  const handleContinue = async () => {
    if (selectedValues.size === 0) {
      alert('Please select at least one value');
      return;
    }

    setIsSaving(true);
    try {
      const valuesToSave: Value[] = Array.from(selectedValues).map((valueName) => {
        const predefined = PREDEFINED_VALUES.find(v => v.name === valueName);
        return {
          id: `value-${Date.now()}-${Math.random()}`,
          name: valueName,
          statement: predefined?.description || '',
          predefined: !!predefined,
          category: predefined?.category,
          createdAt: new Date().toISOString(),
        };
      });

      await storageService.setItem(STORAGE_KEYS.USER_VALUES, valuesToSave);
      router.push('/(onboarding)/setup-roles');
    } catch (error) {
      console.error('Error saving values:', error);
      alert('Failed to save values. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderCategory = (category: ValueCategory) => {
    const values = PREDEFINED_VALUES.filter(v => v.category === category);

    return (
      <View key={category} style={styles.categorySection}>
        <Text style={styles.categoryTitle}>{CATEGORY_LABELS[category]}</Text>
        <View style={styles.valuesGrid}>
          {values.map((value) => (
            <TouchableOpacity
              key={value.name}
              onPress={() => toggleValue(value.name)}
              style={[
                styles.valueChip,
                selectedValues.has(value.name) && styles.valueChipSelected,
              ]}
            >
              <Text
                style={[
                  styles.valueChipText,
                  selectedValues.has(value.name) && styles.valueChipTextSelected,
                ]}
              >
                {value.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Your Core Values</Text>
        <Text style={styles.subtitle}>
          Select the values that resonate with you. These will guide your decisions and actions.
        </Text>

        <Card style={styles.selectedCard}>
          <Text style={styles.selectedTitle}>
            Selected: {selectedValues.size}
          </Text>
        </Card>

        {(['personal', 'relationships', 'professional', 'financial', 'spiritual'] as ValueCategory[]).map(
          renderCategory
        )}

        {!showCustomForm ? (
          <Button
            onPress={() => setShowCustomForm(true)}
            variant="ghost"
            fullWidth
          >
            + Add Custom Value
          </Button>
        ) : (
          <Card style={styles.customForm}>
            <Text style={styles.customFormTitle}>Add Custom Value</Text>
            <Input
              value={customValue}
              onChangeText={setCustomValue}
              placeholder="Value name..."
            />
            <Input
              value={customStatement}
              onChangeText={setCustomStatement}
              placeholder="What does this value mean to you? (optional)"
              multiline
              numberOfLines={3}
            />
            <View style={styles.customFormActions}>
              <Button
                onPress={() => {
                  setShowCustomForm(false);
                  setCustomValue('');
                  setCustomStatement('');
                }}
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                onPress={addCustomValue}
                disabled={!customValue.trim()}
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
          variant="ghost"
          fullWidth
        >
          Back
        </Button>
        <Button
          onPress={handleContinue}
          fullWidth
          loading={isSaving}
          disabled={selectedValues.size === 0}
        >
          Continue ({selectedValues.size} selected)
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
  selectedCard: {
    marginBottom: PADDING.lg,
  },
  selectedTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
  },
  categorySection: {
    marginBottom: PADDING.xl,
  },
  categoryTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.sm,
  },
  valuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP.sm,
  },
  valueChip: {
    paddingHorizontal: PADDING.md,
    paddingVertical: PADDING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border.default,
    backgroundColor: COLORS.bg.secondary,
  },
  valueChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  valueChipText: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.primary,
  },
  valueChipTextSelected: {
    color: COLORS.background,
    fontWeight: '600',
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
