import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/theme';
import { AppText } from '../../../shared/components/AppText';
import { ms } from '../../../shared/utils/scale';

interface EmptyStateProps {
  onReset: () => void;
  isPendingMode?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onReset, isPendingMode }) => {
  const { colors, spacing, radius } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.cardBorder,
          borderRadius: radius.xl,
          padding: spacing.xxl,
        },
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: colors.primaryLight,
          },
        ]}
      >
        <Ionicons
          name={isPendingMode ? 'hourglass-outline' : 'school-outline'}
          size={ms(42)}
          color={colors.primary}
        />
      </View>

      <AppText variant="h2" align="center" style={styles.title}>
        {isPendingMode ? 'No Pending Assessments' : 'No Completed Assessments'}
      </AppText>

      <AppText
        variant="body"
        color={colors.textSecondary}
        align="center"
        style={styles.description}
      >
        {isPendingMode
          ? 'All your submitted questions have been evaluated by our AI coach.'
          : "You haven't completed any assessments yet. Submit a voice or text response to receive instant AI-powered scoring and personalized coaching feedback."}
      </AppText>

      <TouchableOpacity
        onPress={onReset}
        activeOpacity={0.8}
        style={[
          styles.button,
          {
            backgroundColor: colors.primary,
            borderRadius: radius.md,
          },
        ]}
      >
        <Ionicons name="refresh-outline" size={ms(16)} color={colors.textInverse} style={styles.buttonIcon} />
        <AppText variant="bodyBold" color={colors.textInverse}>
          Load Sample Assessments
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginTop: ms(20),
    marginHorizontal: ms(4),
  },
  iconCircle: {
    width: ms(80),
    height: ms(80),
    borderRadius: ms(40),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ms(16),
  },
  title: {
    marginBottom: ms(8),
  },
  description: {
    lineHeight: ms(22),
    marginBottom: ms(20),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ms(10),
    paddingHorizontal: ms(18),
  },
  buttonIcon: {
    marginRight: ms(6),
  },
});
