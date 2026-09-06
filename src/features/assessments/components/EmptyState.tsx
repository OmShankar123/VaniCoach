import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, useTheme, ms } from '@/shared';

interface EmptyStateProps {
  onAction: () => void;
  isPendingMode?: boolean;
  onLoadPdfData?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onAction,
  isPendingMode = false,
  onLoadPdfData,
}) => {
  const { colors, radius } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <Ionicons
          name={isPendingMode ? 'time-outline' : 'sparkles-outline'}
          size={ms(32)}
          color={isPendingMode ? colors.pending : colors.primary}
        />
      </View>

      <AppText variant="h2" align="center" style={styles.title}>
        {isPendingMode ? 'No Pending Submissions' : 'No Completed Assessments'}
      </AppText>

      <AppText
        variant="body"
        color={colors.textSecondary}
        align="center"
        style={styles.description}
      >
        {isPendingMode
          ? 'All your practice attempts have been evaluated by Vani AI Coach.'
          : 'Complete a voice or text practice session to view your coaching score and personalized AI feedback.'}
      </AppText>

      {onLoadPdfData && (
        <TouchableOpacity
          onPress={onLoadPdfData}
          style={[
            styles.ctaButton,
            {
              backgroundColor: colors.primary,
              borderRadius: radius.md,
            },
          ]}
          activeOpacity={0.8}
        >
          <Ionicons
            name="document-attach-outline"
            size={ms(18)}
            color="#FFFFFF"
            style={{ marginRight: ms(8) }}
          />
          <AppText variant="body" weight="700" color="#FFFFFF">
            Load PDF Example Data
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: ms(40),
    paddingHorizontal: ms(24),
  },
  iconCircle: {
    width: ms(72),
    height: ms(72),
    borderRadius: ms(36),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ms(16),
  },
  title: {
    marginBottom: ms(8),
  },
  description: {
    marginBottom: ms(20),
    maxWidth: ms(280),
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(20),
    paddingVertical: ms(12),
  },
});