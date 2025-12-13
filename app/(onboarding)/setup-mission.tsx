// Covey Planner - Mission Setup Screen
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { storageService } from '@/lib/storage/AsyncStorageService';
import { COLORS } from '@/lib/constants/colors';
import { PADDING, GAP } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';

const GUIDING_QUESTIONS = [
  'What are my deepest values?',
  'What kind of person do I want to be?',
  'What legacy do I want to leave?',
  'What contributions do I want to make?',
  'How do I want to be remembered?',
];

export default function SetupMissionScreen() {
  const [mission, setMission] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleContinue = async () => {
    if (!mission.trim()) {
      alert('Please write your personal mission statement');
      return;
    }

    setIsSaving(true);
    try {
      await storageService.setUserMission(mission.trim());
      router.push('/(onboarding)/setup-values');
    } catch (error) {
      console.error('Error saving mission:', error);
      alert('Failed to save mission. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Your Personal Mission</Text>
        <Text style={styles.subtitle}>
          A personal mission statement is your constitution - the solid expression of your vision and values.
        </Text>

        <Card style={styles.questionsCard}>
          <Text style={styles.questionsTitle}>Guiding Questions:</Text>
          {GUIDING_QUESTIONS.map((question, index) => (
            <Text key={index} style={styles.question}>
              • {question}
            </Text>
          ))}
        </Card>

        <Input
          value={mission}
          onChangeText={setMission}
          placeholder="Write your personal mission statement here..."
          multiline
          numberOfLines={8}
          textAlignVertical="top"
          style={styles.textArea}
        />

        <Card variant="elevated" style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Tip</Text>
          <Text style={styles.tipText}>
            Don't worry about making it perfect. You can always refine it later. Focus on capturing what truly matters to you.
          </Text>
        </Card>
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
          disabled={!mission.trim()}
        >
          Continue
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
    lineHeight: TYPOGRAPHY.bodyLarge.lineHeight * TYPOGRAPHY.body.fontSize,
  },
  questionsCard: {
    marginBottom: PADDING.lg,
  },
  questionsTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.sm,
  },
  question: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
    marginBottom: PADDING.xs,
    lineHeight: TYPOGRAPHY.bodySmall.lineHeight * TYPOGRAPHY.bodySmall.fontSize,
  },
  textArea: {
    minHeight: 200,
    marginBottom: PADDING.lg,
  },
  tipCard: {
    backgroundColor: COLORS.bg.tertiary,
  },
  tipTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.xs,
  },
  tipText: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
    lineHeight: TYPOGRAPHY.bodySmall.lineHeight * TYPOGRAPHY.bodySmall.fontSize,
  },
  footer: {
    padding: PADDING.lg,
    gap: GAP.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
    backgroundColor: COLORS.background,
  },
});
