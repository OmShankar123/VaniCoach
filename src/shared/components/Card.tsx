import React from 'react';
import { View, ViewProps, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/shared/theme';

export interface CardProps extends ViewProps {
  variant?: 'elevated' | 'outlined' | 'flat';
  elevation?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  variant = 'outlined',
  elevation = 'sm',
  style,
  children,
  ...props
}) => {
  const { colors, radius, shadows, spacing } = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: variant === 'flat' ? colors.surfaceElevated : colors.surface,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: variant === 'outlined' ? 1 : 0,
    borderColor: colors.cardBorder,
    ...(variant === 'elevated' ? shadows[elevation] : {}),
  };

  return (
    <View style={[cardStyle, style]} {...props}>
      {children}
    </View>
  );
};