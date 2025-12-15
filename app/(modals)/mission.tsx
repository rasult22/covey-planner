// Covey Planner - Mission Modal
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { COLORS } from '@/lib/constants/colors';
import { GAP, PADDING } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';
import { useMissionQuery, useSaveMissionMutation } from '@/queries/foundation/mission';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function MissionModal() {
  const { data: savedMission = '', isLoading } = useMissionQuery();
  const { mutate: saveMission, isPending } = useSaveMissionMutation();
  const [mission, setMission] = useState(savedMission);
  const [isEditing, setIsEditing] = useState(false);

  // Update local state when saved mission loads
  useState(() => {
    if (!isLoading && savedMission) {
      setMission(savedMission);
    }
  });

  const handleSave = () => {
    if (!mission.trim()) {
      Alert.alert('Error', 'Mission statement cannot be empty');
      return;
    }

    saveMission(mission.trim(), {
      onSuccess: () => {
        setIsEditing(false);
        Alert.alert('Success', 'Mission statement saved');
      },
      onError: () => {
        Alert.alert('Error', 'Failed to save mission statement');
      },
    });
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
                loading={isPending}
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
    gap: GAP.md,
  },
  footer: {
    padding: PADDING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
});
