import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/theme';
import { AppText } from '../../../shared/components/AppText';
import { Card } from '../../../shared/components/Card';
import { AssessmentStatsSummary } from '../types/assessment';
import { ms } from '../../../shared/utils/scale';

interface AssessmentStatsProps {
  stats: AssessmentStatsSummary;
}

export const AssessmentStats: React.FC<AssessmentStatsProps> = ({ stats }) => {
  const { colors, spacing, radius } = useTheme();

  if (stats.completedCount === 0) {
    return null;
  }

  return (
    <Card variant="flat" style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.statBox}>
          <AppText variant="captionMuted">AVERAGE SCORE</AppText>
          <View style={styles.scoreRow}>
            <AppText
              variant="scoreBig"
              color={stats.averageScore >= 70 ? colors.good : colors.needsImprovement}
            >
              {stats.averageScore}
            </AppText>
            <AppText variant="subtitle" color={colors.textMuted} style={styles.scoreMax}>
              /100
            </AppText>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.statBox}>
          <AppText variant="captionMuted">COMPLETED</AppText>
          <AppText variant="scoreBig" color={colors.text}>
            {stats.completedCount}
          </AppText>
        </View>

        <View style={styles.divider} />

        <View style={styles.statBox}>
          <AppText variant="captionMuted">PERFORMANCE</AppText>
          <View style={styles.breakdownRow}>
            <View style={[styles.pill, { backgroundColor: colors.goodBg }]}>
              <AppText variant="caption" color={colors.good} weight="700">
                {stats.goodCount} Good
              </AppText>
            </View>
            <View style={[styles.pill, { backgroundColor: colors.needsImprovementBg }]}>
              <AppText variant="caption" color={colors.needsImprovement} weight="700">
                {stats.needsImprovementCount} Needs Imp.
              </AppText>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: ms(16),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: ms(36),
    backgroundColor: '#E2E8F0',
    opacity: 0.5,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: ms(2),
  },
  scoreMax: {
    marginLeft: ms(2),
  },
  breakdownRow: {
    marginTop: ms(4),
    gap: ms(4),
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: ms(6),
    paddingVertical: ms(2),
    borderRadius: ms(4),
  },
});
