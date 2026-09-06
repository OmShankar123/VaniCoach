import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText, Card, useTheme, ms } from '@/shared';
import type { AssessmentStatsSummary } from '@/features/assessments/types';

interface AssessmentStatsProps {
  stats: AssessmentStatsSummary;
}

export const AssessmentStats: React.FC<AssessmentStatsProps> = ({ stats }) => {
  const { colors, spacing, radius } = useTheme();

  return (
    <Card variant="elevated" elevation="sm" style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.metricItem}>
          <AppText variant="captionMuted">AVERAGE SCORE</AppText>
          <View style={styles.scoreRow}>
            <AppText
              variant="scoreBig"
              color={stats.averageScore >= 70 ? colors.good : colors.needsImprovement}
            >
              {stats.averageScore > 0 ? stats.averageScore : '--'}
            </AppText>
            <AppText variant="captionMuted" style={{ marginLeft: ms(2) }}>
              /100
            </AppText>
          </View>
        </View>

        <View style={styles.metricItem}>
          <AppText variant="captionMuted">TOTAL ATTEMPTS</AppText>
          <AppText variant="scoreBig" color={colors.text}>
            {stats.totalAttempted}
          </AppText>
        </View>

        <View style={styles.metricItem}>
          <AppText variant="captionMuted">GOOD PERF (≥70)</AppText>
          <AppText variant="scoreBig" color={colors.good}>
            {stats.goodCount}
          </AppText>
        </View>
      </View>

      {stats.completedCount > 0 && (
        <View style={styles.progressBarWrapper}>
          <View style={styles.progressLabelRow}>
            <AppText variant="captionMuted">Performance Ratio</AppText>
            <AppText variant="caption" weight="600" color={colors.good}>
              {Math.round((stats.goodCount / stats.completedCount) * 100)}% Good
            </AppText>
          </View>
          <View
            style={[
              styles.progressBarTrack,
              { backgroundColor: colors.needsImprovement, borderRadius: radius.full },
            ]}
          >
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.round((stats.goodCount / stats.completedCount) * 100)}%`,
                  backgroundColor: colors.good,
                  borderRadius: radius.full,
                },
              ]}
            />
          </View>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: ms(12),
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  metricItem: {
    flex: 1,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  progressBarWrapper: {
    marginTop: ms(12),
    paddingTop: ms(10),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ms(4),
  },
  progressBarTrack: {
    height: ms(6),
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
});