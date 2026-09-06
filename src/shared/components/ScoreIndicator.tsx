import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { AppText } from './AppText';
import { ms } from '../utils/scale';

interface ScoreIndicatorProps {
  score: number | null;
  status: 'Completed' | 'Pending';
}

export const ScoreIndicator: React.FC<ScoreIndicatorProps> = ({ score, status }) => {
  const { colors, radius, spacing } = useTheme();

  if (status === 'Pending' || score === null) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.pendingBg,
            borderColor: colors.cardBorder,
            borderRadius: radius.md,
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xs,
          },
        ]}
      >
        <AppText variant="caption" color={colors.textMuted}>
          Pending Evaluation
        </AppText>
      </View>
    );
  }

  const isGood = score >= 70;
  const scoreColor = isGood ? colors.good : colors.needsImprovement;
  const scoreBg = isGood ? colors.goodBg : colors.needsImprovementBg;

  return (
    <View style={styles.scoreRow}>
      <View
        style={[
          styles.badgeBox,
          {
            backgroundColor: scoreBg,
            borderColor: scoreColor,
            borderRadius: radius.md,
          },
        ]}
      >
        <AppText variant="bodyBold" style={{ color: scoreColor, fontSize: ms(16) }}>
          {score}
        </AppText>
        <AppText variant="captionMuted" style={{ color: scoreColor, opacity: 0.8 }}>
          /100
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: ms(10),
    paddingVertical: ms(4),
    borderWidth: 1,
    gap: ms(2),
  },
});
