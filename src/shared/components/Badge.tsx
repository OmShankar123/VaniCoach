import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/shared/theme';
import { ms } from '@/shared/utils';
import { AppText } from '@/shared/components/AppText';

export type BadgeVariant =
  | 'recorded'
  | 'text'
  | 'good'
  | 'needsImprovement'
  | 'pending';

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  variant,
  label,
  size = 'md',
  style,
}) => {
  const { colors, radius, spacing } = useTheme();

  const getBadgeConfig = () => {
    switch (variant) {
      case 'recorded':
        return {
          bg: colors.recordedBg,
          border: colors.recordedBorder,
          text: colors.recorded,
          icon: 'mic-outline' as const,
          defaultLabel: 'Recorded',
        };
      case 'text':
        return {
          bg: colors.textTypeBg,
          border: colors.textTypeBorder,
          text: colors.textType,
          icon: 'document-text-outline' as const,
          defaultLabel: 'Text',
        };
      case 'good':
        return {
          bg: colors.goodBg,
          border: colors.goodBorder,
          text: colors.good,
          icon: 'checkmark-circle-outline' as const,
          defaultLabel: 'Good',
        };
      case 'needsImprovement':
        return {
          bg: colors.needsImprovementBg,
          border: colors.needsImprovementBorder,
          text: colors.needsImprovement,
          icon: 'alert-circle-outline' as const,
          defaultLabel: 'Needs Improvement',
        };
      case 'pending':
        return {
          bg: colors.pendingBg,
          border: colors.cardBorder,
          text: colors.pending,
          icon: 'time-outline' as const,
          defaultLabel: 'Pending',
        };
    }
  };

  const config = getBadgeConfig();
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
          borderRadius: radius.full,
          paddingVertical: isSm ? spacing.xxs : spacing.xs,
          paddingHorizontal: isSm ? spacing.sm : spacing.md,
        },
        style,
      ]}
    >
      <Ionicons
        name={config.icon}
        size={isSm ? ms(12) : ms(14)}
        color={config.text}
        style={styles.icon}
      />
      <AppText
        variant="tag"
        style={{
          color: config.text,
          fontSize: isSm ? ms(10) : ms(11),
        }}
      >
        {label || config.defaultLabel}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  icon: {
    marginRight: ms(4),
  },
});