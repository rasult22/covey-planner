// Covey Planner - Input Component
import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { COLORS } from '@/lib/constants/colors';
import { PADDING, RADIUS, GAP } from '@/lib/constants/spacing';
import { FONT_SIZES } from '@/lib/constants/typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  fullWidth = true,
  style,
  ...props
}: InputProps) {
  return (
    <View style={[styles.container, fullWidth && styles.fullWidth]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={COLORS.text.tertiary}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: GAP.sm,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
  input: {
    backgroundColor: COLORS.bg.tertiary,
    borderWidth: 1,
    borderColor: COLORS.border.default,
    borderRadius: RADIUS.md,
    paddingHorizontal: PADDING.md,
    paddingVertical: PADDING.sm,
    fontSize: FONT_SIZES.base,
    color: COLORS.text.primary,
    minHeight: 48,
  },
  inputError: {
    borderColor: COLORS.status.error,
  },
  errorText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.status.error,
  },
});
