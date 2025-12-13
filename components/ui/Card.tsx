// Covey Planner - Card Component
import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { COLORS } from '@/lib/constants/colors';
import { PADDING, RADIUS } from '@/lib/constants/spacing';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated';
  padding?: keyof typeof PADDING;
  className?: string;
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  style,
  className,
  ...props
}: CardProps) {
  const backgroundColor =
    variant === 'elevated' ? COLORS.bg.elevated : COLORS.bg.secondary;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor,
          padding: PADDING[padding],
        },
        style,
      ]}
      className={className}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
});
