// Covey Planner - Mission Modal
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useMission } from '@/hooks/foundation/useMission';
import { COLORS } from '@/lib/constants/colors';
import { PADDING, GAP } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';

export default function MissionModal() {
  const { mission: savedMission, saveMission, isLoading } = useMission();
  const [mission, setMission] = useState(savedMission);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Update local state when saved mission loads
  useState(() => {
    if (!isLoading && savedMission) {
      setMission(savedMission);
    }
  });

  const handleSave = async () => {
    if (!mission.trim()) {
      Alert.alert('Error', 'Mission statement cannot be empty');
      return;
    }

    setIsSaving(true);
    const success = await saveMission(mission.trim());
    setIsSaving(false);

    if (success) {
      setIsEditing(false);
      Alert.alert('Success', 'Mission statement saved');
    } else {
      Alert.alert('Error', 'Failed to save mission statement');
    }
  };

  const handleCancel = () => {
    setMission(savedMission);
    setIsEditing(false);
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
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>Your Personal Constitution</Text>
          <Text style={styles.infoText}>
            This is your personal mission statement - the foundation of all your decisions and actions.
          </Text>
        </Card>

        {!isEditing && savedMission ? (
          <>
            <Card variant="elevated" style={styles.missionCard}>
              <Text style={styles.missionText}>{savedMission}</Text>
            </Card>
            <Button onPress={() => setIsEditing(true)} fullWidth>
              Edit Mission
            </Button>
          </>
        ) : (
          <>
            <Input
              value={mission}
              onChangeText={setMission}
              placeholder="Write your personal mission statement..."
              multiline
              numberOfLines={10}
              textAlignVertical="top"
              style={styles.textArea}
            />
            <View style={styles.actions}>
              {isEditing && (
                <Button
                  onPress={handleCancel}
                  variant="ghost"
                  fullWidth
                >
                  Cancel
                </Button>
              )}
              <Button
                onPress={handleSave}
                fullWidth
                loading={isSaving}
                disabled={!mission.trim()}
              >
                Save
              </Button>
            </View>
          </>
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
  infoCard: {
    marginBottom: PADDING.lg,
  },
  infoTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.xs,
  },
  infoText: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
    lineHeight: TYPOGRAPHY.bodySmall.lineHeight * TYPOGRAPHY.bodySmall.fontSize,
  },
  missionCard: {
    marginBottom: PADDING.lg,
  },
  missionText: {
    fontSize: TYPOGRAPHY.bodyLarge.fontSize,
    color: COLORS.text.primary,
    lineHeight: TYPOGRAPHY.bodyLarge.lineHeight * TYPOGRAPHY.bodyLarge.fontSize,
  },
  textArea: {
    minHeight: 250,
    marginBottom: PADDING.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: GAP.md,
  },
  footer: {
    padding: PADDING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
});
