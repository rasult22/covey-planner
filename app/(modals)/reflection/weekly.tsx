// Principle Centered Planner - Weekly Reflection Screen
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAchievements } from '@/hooks/gamification/useAchievements';
import { useWeeklyReflection } from '@/hooks/reflection/useWeeklyReflection';
import { COLORS } from '@/lib/constants/colors';
import { GAP, PADDING } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';
import { endOfWeek, format } from 'date-fns';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function WeeklyReflectionScreen() {
  const {
    reflection,
    currentWeekStart,
    createReflection,
    updateReflection,
    getCurrentStreak,
    getTotalCount,
  } = useWeeklyReflection();

  const { unlockAchievement } = useAchievements();

  const [whatWorkedWell, setWhatWorkedWell] = useState(
    reflection?.questions.whatWorkedWell || ''
  );
  const [whatToImprove, setWhatToImprove] = useState(
    reflection?.questions.whatToImprove || ''
  );
  const [lessonsLearned, setLessonsLearned] = useState(
    reflection?.questions.lessonsLearned || ''
  );
  const [gratitude, setGratitude] = useState(
    reflection?.questions.gratitude || ''
  );

  const formatWeekRange = () => {
    const start = new Date(currentWeekStart);
    const end = endOfWeek(start, { weekStartsOn: 0 });
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  };

  const handleSave = async () => {
    if (!whatWorkedWell.trim() || !whatToImprove.trim() || !lessonsLearned.trim()) {
      Alert.alert(
        'Incomplete Reflection',
        'Please answer the first three questions to complete your reflection.',
        [{ text: 'OK' }]
      );
      return;
    }

    const questions = {
      whatWorkedWell: whatWorkedWell.trim(),
      whatToImprove: whatToImprove.trim(),
      lessonsLearned: lessonsLearned.trim(),
      gratitude: gratitude.trim() || undefined,
    };

    let success = false;

    if (reflection) {
      success = await updateReflection(questions);
    } else {
      success = await createReflection(questions);

      if (success) {
        // Check for achievement unlocks
        const total = getTotalCount() + 1;
        if (total === 1) {
          await unlockAchievement('first_reflection');
        }

        const streak = getCurrentStreak();
        if (streak >= 12) {
          await unlockAchievement('reflective_quarter');
        }
      }
    }

    if (success) {
      Alert.alert(
        'Reflection Saved',
        'Your weekly reflection has been saved.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
       <View style={styles.headerLeft}>
          <Text style={styles.title}>Weekly Reflection</Text>
          <Text style={styles.subtitle}>{formatWeekRange()}</Text>
        </View>
        <Button onPress={() => router.back()} variant="ghost">
          Close
        </Button>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        <Card style={styles.introCard}>
          <Text style={styles.introTitle}>Take Time to Reflect</Text>
          <Text style={styles.introText}>
            Weekly reflection helps you learn from experience and make continuous improvements. Be honest and specific in your answers.
          </Text>
          {getTotalCount() > 0 && (
            <View style={styles.statsRow}>
              <View style={styles.statBadge}>
                <Text style={styles.statValue}>{getTotalCount()}</Text>
                <Text style={styles.statLabel}>Reflections</Text>
              </View>
              <View style={styles.statBadge}>
                <Text style={styles.statValue}>{getCurrentStreak()}</Text>
                <Text style={styles.statLabel}>Week Streak</Text>
              </View>
            </View>
          )}
        </Card>

        <View style={styles.questionSection}>
          <Text style={styles.questionLabel}>
            1. What worked well this week?
          </Text>
          <Text style={styles.questionHint}>
            Identify your wins and successes. What should you continue doing?
          </Text>
          <TextInput
            style={styles.textArea}
            value={whatWorkedWell}
            onChangeText={setWhatWorkedWell}
            placeholder="Write about your successes..."
            placeholderTextColor={COLORS.text.tertiary}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.questionSection}>
          <Text style={styles.questionLabel}>
            2. What could be better next week?
          </Text>
          <Text style={styles.questionHint}>
            Be specific about what you want to improve and how.
          </Text>
          <TextInput
            style={styles.textArea}
            value={whatToImprove}
            onChangeText={setWhatToImprove}
            placeholder="Write about areas for improvement..."
            placeholderTextColor={COLORS.text.tertiary}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.questionSection}>
          <Text style={styles.questionLabel}>
            3. What lessons did you learn?
          </Text>
          <Text style={styles.questionHint}>
            What insights or wisdom did you gain this week?
          </Text>
          <TextInput
            style={styles.textArea}
            value={lessonsLearned}
            onChangeText={setLessonsLearned}
            placeholder="Write about your learnings..."
            placeholderTextColor={COLORS.text.tertiary}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.questionSection}>
          <Text style={styles.questionLabel}>
            4. What are you grateful for? (Optional)
          </Text>
          <Text style={styles.questionHint}>
            Cultivate gratitude by acknowledging the good in your life.
          </Text>
          <TextInput
            style={styles.textArea}
            value={gratitude}
            onChangeText={setGratitude}
            placeholder="Write about what you're grateful for..."
            placeholderTextColor={COLORS.text.tertiary}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <Button
          onPress={handleSave}
          fullWidth
          style={styles.saveButton}
          disabled={
            !whatWorkedWell.trim() ||
            !whatToImprove.trim() ||
            !lessonsLearned.trim()
          }
        >
          {reflection ? 'Update Reflection' : 'Save Reflection'}
        </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: PADDING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.h2.fontSize,
    fontWeight: TYPOGRAPHY.h2.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
  },
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
  introCard: {
    backgroundColor: COLORS.surface,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    marginBottom: PADDING.lg,
  },
  introTitle: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: TYPOGRAPHY.h3.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.sm,
  },
  introText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.secondary,
    lineHeight: 22,
    marginBottom: PADDING.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: GAP.md,
  },
  statBadge: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: PADDING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.tertiary,
  },
  questionSection: {
    marginBottom: PADDING.xl,
  },
  questionLabel: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.xs,
  },
  questionHint: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.tertiary,
    marginBottom: PADDING.md,
    fontStyle: 'italic',
  },
  textArea: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderRadius: 8,
    padding: PADDING.md,
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.primary,
    minHeight: 120,
  },
  saveButton: {
    marginTop: PADDING.md,
  },
});
