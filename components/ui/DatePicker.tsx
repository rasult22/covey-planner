// Covey Planner - DatePicker Component
import { COLORS } from '@/lib/constants/colors';
import { PADDING } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  style?: any;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  minimumDate,
  maximumDate,
  style,
}: DatePickerProps) {
  const [show, setShow] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleChange = (_event: any, selectedDate?: Date) => {
    // On Android, the picker closes automatically
    if (Platform.OS === 'android') {
      setShow(false);
    }

    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={styles.button}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>
          {value ? formatDate(value) : placeholder}
        </Text>
        <Text style={styles.icon}>📅</Text>
      </TouchableOpacity>

      {show && (
        <>
          {Platform.OS === 'ios' && (
            <View style={styles.iosPickerContainer}>
              <View style={styles.iosHeader}>
                <TouchableOpacity
                  onPress={() => setShow(false)}
                  style={styles.iosDoneButton}
                >
                  <Text style={styles.iosDoneText}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={value || new Date()}
                mode="date"
                display="spinner"
                onChange={handleChange}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                textColor={COLORS.text.primary}
              />
            </View>
          )}

          {Platform.OS === 'android' && (
            <DateTimePicker
              value={value || new Date()}
              mode="date"
              display="default"
              onChange={handleChange}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: PADDING.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bg.secondary,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderRadius: 8,
    paddingHorizontal: PADDING.md,
    paddingVertical: PADDING.md,
    minHeight: 48,
  },
  buttonText: {
    flex: 1,
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.primary,
  },
  icon: {
    fontSize: 20,
    marginLeft: PADDING.sm,
  },
  iosPickerContainer: {
    backgroundColor: COLORS.bg.secondary,
    borderRadius: 8,
    marginTop: PADDING.sm,
    overflow: 'hidden',
  },
  iosHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: PADDING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  iosDoneButton: {
    paddingHorizontal: PADDING.md,
    paddingVertical: PADDING.sm,
  },
  iosDoneText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
