// Principle Centered Planner - Notification Settings Screen
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useNotificationSettings } from '@/hooks/settings/useNotificationSettings';
import { COLORS } from '@/lib/constants/colors';
import { GAP, PADDING } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';
import { NotificationService } from '@/lib/notifications/NotificationService';
import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export default function NotificationSettingsScreen() {
  const {
    settings,
    permissionGranted,
    toggleWeeklyPlanning,
    setWeeklyPlanningDay,
    setWeeklyPlanningTime,
    toggleDailyPlanning,
    setDailyPlanningTime,
    toggleWeeklyCompass,
    setWeeklyCompassTime,
    toggleWeeklyReflection,
    setWeeklyReflectionDay,
    setWeeklyReflectionTime,
    requestPermissions,
  } = useNotificationSettings();

  const handleRequestPermissions = async () => {
    const granted = await requestPermissions();
    if (!granted) {
      Alert.alert(
        'Permissions Required',
        'Please enable notifications in your device settings to receive reminders.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderDayPicker = (
    currentDay: number,
    onSelect: (day: number) => Promise<boolean>
  ) => (
    <View style={styles.dayPicker}>
      {DAYS_OF_WEEK.map((day, index) => (
        <TouchableOpacity
          key={day}
          style={[
            styles.dayButton,
            currentDay === index && styles.dayButtonActive,
          ]}
          onPress={() => onSelect(index)}
        >
          <Text
            style={[
              styles.dayButtonText,
              currentDay === index && styles.dayButtonTextActive,
            ]}
          >
            {day.substring(0, 3)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (!permissionGranted) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Notification Settings</Text>
          <Button onPress={() => router.back()} variant="ghost">
            Close
          </Button>
        </View>

        <View style={styles.content}>
          <Card style={styles.permissionCard}>
            <Text style={styles.permissionTitle}>Permissions Required</Text>
            <Text style={styles.permissionText}>
              Principle Centered Planner needs notification permissions to send you helpful reminders for planning and reflection.
            </Text>
            <Button onPress={handleRequestPermissions} style={styles.permissionButton}>
              Enable Notifications
            </Button>
          </Card>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notification Settings</Text>
        <Button onPress={() => router.back()} variant="ghost">
          Close
        </Button>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <View style={styles.settingTitleRow}>
              <Text style={styles.settingTitle}>Weekly Planning</Text>
              <Switch
                value={settings.weeklyPlanningEnabled}
                onValueChange={(bool) => {toggleWeeklyPlanning(bool)}}
                trackColor={{ false: COLORS.border.light, true: COLORS.gray[400] }}
                thumbColor={COLORS.text.primary}
              />
            </View>
            <Text style={styles.settingDescription}>
              Reminder to plan your week and identify Big Rocks
            </Text>
            <TouchableOpacity
              style={styles.testButton}
              onPress={() => NotificationService.sendTestNotification('weeklyPlanning')}
            >
              <Text style={styles.testButtonText}>Send Test Notification</Text>
            </TouchableOpacity>
          </View>

          {settings.weeklyPlanningEnabled && (
            <View style={styles.settingOptions}>
              <Text style={styles.optionLabel}>Day</Text>
              {renderDayPicker(settings.weeklyPlanningDay, setWeeklyPlanningDay)}

              <Text style={styles.optionLabel}>Time: {settings.weeklyPlanningTime}</Text>
              <Text style={styles.optionHint}>
                Recommended: Sunday evening before the week starts
              </Text>
            </View>
          )}
        </Card>

        <Card style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <View style={styles.settingTitleRow}>
              <Text style={styles.settingTitle}>Daily Planning</Text>
              <Switch
                value={settings.dailyPlanningEnabled}
                onValueChange={bool => {
                  toggleDailyPlanning(bool)
                }}
                trackColor={{ false: COLORS.border.light, true: COLORS.gray[400] }}
                thumbColor={COLORS.text.primary}
              />
            </View>
            <Text style={styles.settingDescription}>
              Daily reminder to organize your most important tasks
            </Text>
            <TouchableOpacity
              style={styles.testButton}
              onPress={() => NotificationService.sendTestNotification('dailyPlanning')}
            >
              <Text style={styles.testButtonText}>Send Test Notification</Text>
            </TouchableOpacity>
          </View>

          {settings.dailyPlanningEnabled && (
            <View style={styles.settingOptions}>
              <Text style={styles.optionLabel}>Time: {settings.dailyPlanningTime}</Text>
              <Text style={styles.optionHint}>
                Recommended: Morning before your day starts
              </Text>
            </View>
          )}
        </Card>

        <Card style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <View style={styles.settingTitleRow}>
              <Text style={styles.settingTitle}>Weekly Compass</Text>
              <Switch
                value={settings.weeklyCompassEnabled}
                onValueChange={bool => {
                  toggleWeeklyCompass(bool)
                }}
                trackColor={{ false: COLORS.border.light, true: COLORS.gray[400] }}
                thumbColor={COLORS.text.primary}
              />
            </View>
            <Text style={styles.settingDescription}>
              Review your mission, values, and roles weekly
            </Text>
            <TouchableOpacity
              style={styles.testButton}
              onPress={() => NotificationService.sendTestNotification('weeklyCompass')}
            >
              <Text style={styles.testButtonText}>Send Test Notification</Text>
            </TouchableOpacity>
          </View>

          {settings.weeklyCompassEnabled && (
            <View style={styles.settingOptions}>
              <Text style={styles.optionLabel}>Time: {settings.weeklyCompassTime}</Text>
              <Text style={styles.optionHint}>
                Recommended: Sunday morning to start the week aligned
              </Text>
            </View>
          )}
        </Card>

        <Card style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <View style={styles.settingTitleRow}>
              <Text style={styles.settingTitle}>Weekly Reflection</Text>
              <Switch
                value={settings.weeklyReflectionEnabled}
                onValueChange={bool => {
                  toggleWeeklyReflection(bool)
                }}
                trackColor={{ false: COLORS.border.light, true: COLORS.gray[400] }}
                thumbColor={COLORS.text.primary}
              />
            </View>
            <Text style={styles.settingDescription}>
              Reflect on your week and plan improvements
            </Text>
            <TouchableOpacity
              style={styles.testButton}
              onPress={() => NotificationService.sendTestNotification('weeklyReflection')}
            >
              <Text style={styles.testButtonText}>Send Test Notification</Text>
            </TouchableOpacity>
          </View>

          {settings.weeklyReflectionEnabled && (
            <View style={styles.settingOptions}>
              <Text style={styles.optionLabel}>Day</Text>
              {renderDayPicker(settings.weeklyReflectionDay, setWeeklyReflectionDay)}

              <Text style={styles.optionLabel}>Time: {settings.weeklyReflectionTime}</Text>
              <Text style={styles.optionHint}>
                Recommended: Sunday evening to close the week
              </Text>
            </View>
          )}
        </Card>
      </ScrollView>
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
    alignItems: 'center',
    padding: PADDING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  title: {
    fontSize: TYPOGRAPHY.h2.fontSize,
    fontWeight: TYPOGRAPHY.h2.fontWeight,
    color: COLORS.text.primary,
  },
  content: {
    flex: 1,
    padding: PADDING.lg,
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: PADDING.lg,
    paddingBottom: PADDING['2xl'],
  },
  permissionCard: {
    alignItems: 'center',
    padding: PADDING.xl,
  },
  permissionTitle: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: TYPOGRAPHY.h3.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.md,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: PADDING.lg,
    lineHeight: 22,
  },
  permissionButton: {
    marginTop: PADDING.md,
  },
  settingCard: {
    marginBottom: PADDING.lg,
  },
  settingHeader: {
    marginBottom: PADDING.md,
  },
  settingTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: PADDING.xs,
  },
  settingTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
  },
  settingDescription: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
  },
  settingOptions: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
    paddingTop: PADDING.md,
    gap: GAP.md,
  },
  optionLabel: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  optionHint: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.tertiary,
    fontStyle: 'italic',
  },
  dayPicker: {
    flexDirection: 'row',
    gap: GAP.xs,
    flexWrap: 'wrap',
  },
  dayButton: {
    paddingVertical: PADDING.sm,
    paddingHorizontal: PADDING.md,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  dayButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dayButtonText: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  dayButtonTextActive: {
    color: COLORS.background,
  },
  testButton: {
    alignSelf: 'flex-start',
    marginTop: PADDING.sm,
    paddingVertical: PADDING.xs,
    paddingHorizontal: PADDING.md,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  testButtonText: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.text.tertiary,
  },
});
