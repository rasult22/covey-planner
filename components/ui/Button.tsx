// Covey Planner - Button Component
import { COLORS } from '@/lib/constants/colors';
import { PADDING, RADIUS } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  style?: ViewStyle;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className,
  style,
}: ButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return COLORS.interactive.disabled;

    switch (variant) {
      case 'primary':
        return COLORS.primary;
      case 'secondary':
        return COLORS.bg.tertiary;
      case 'ghost':
        return 'transparent';
      case 'danger':
        return COLORS.status.error;
      default:
        return COLORS.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return COLORS.text.disabled;

    switch (variant) {
      case 'primary':
        return COLORS.background; // Black text on white background
      case 'secondary':
      case 'ghost':
      case 'danger':
        return COLORS.text.primary;
      default:
        return COLORS.background;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: PADDING.xs, paddingHorizontal: PADDING.sm };
      case 'md':
        return { paddingVertical: PADDING.sm, paddingHorizontal: PADDING.md };
      case 'lg':
        return { paddingVertical: PADDING.md, paddingHorizontal: PADDING.lg };
      default:
        return { paddingVertical: PADDING.sm, paddingHorizontal: PADDING.md };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm':
        return 14;
      case 'md':
        return 16;
      case 'lg':
        return 18;
      default:
        return 16;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderWidth: variant === 'ghost' ? 1 : 0,
          borderColor: variant === 'ghost' ? COLORS.border.default : 'transparent',
          opacity: disabled ? 0.5 : 1,
          width: fullWidth ? '100%' : 'auto',
        },
        getPadding(),
        style,
      ]}
      className={className}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
        />
      ) : (
        <Text
          style={[
            styles.buttonText,
            {
              color: getTextColor(),
              fontSize: getFontSize(),
            },
          ]}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    fontWeight: TYPOGRAPHY.button.fontWeight,
    letterSpacing: TYPOGRAPHY.button.letterSpacing,
    textAlign: 'center',
  },
});
