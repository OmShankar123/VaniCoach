import React, { memo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/theme';
import { AppText } from '../../../shared/components/AppText';
import { Badge } from '../../../shared/components/Badge';
import { ScoreIndicator } from '../../../shared/components/ScoreIndicator';
import { Card } from '../../../shared/components/Card';
import { AssessmentResult } from '../types/assessment';
import { ms } from '../../../shared/utils/scale';

interface AssessmentCardProps {
  item: AssessmentResult;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = memo(({ item }) => {
  const { colors, spacing, radius } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const isCompleted = item.status === 'Completed';
  const hasScore = item.score !== null;
  const isGood = hasScore && item.score! >= 70;

  return (
    <Card variant="elevated" elevation="sm" style={styles.card}>
      {/* Top Meta Header: Type Badge & Status/Grade Tag */}
      <View style={styles.headerRow}>
        <View style={styles.badgeGroup}>
          <Badge
            variant={item.assessmentType === 'Recorded' ? 'recorded' : 'text'}
            size="sm"
          />
          {isCompleted && hasScore && (
            <Badge
              variant={isGood ? 'good' : 'needsImprovement'}
              size="sm"
            />
          )}
          {!isCompleted && (
            <Badge variant="pending" size="sm" />
          )}
        </View>

        {item.duration && (
          <View style={styles.durationRow}>
            <Ionicons
              name={item.assessmentType === 'Recorded' ? 'timer-outline' : 'reader-outline'}
              size={ms(12)}
              color={colors.textMuted}
            />
            <AppText variant="captionMuted" style={{ marginLeft: ms(3) }}>
              {item.duration}
            </AppText>
          </View>
        )}
      </View>

      {/* Question Prompt */}
      <View style={styles.questionSection}>
        <AppText variant="captionMuted" style={styles.questionLabel}>
          QUESTION
        </AppText>
        <AppText variant="h3" style={styles.questionText}>
          {item.question}
        </AppText>
      </View>

      {/* Score and Evaluation Status */}
      <View style={[styles.scoreSection, { borderColor: colors.divider }]}>
        <View>
          <AppText variant="captionMuted">EVALUATION SCORE</AppText>
          <ScoreIndicator score={item.score} status={item.status} />
        </View>

        {isCompleted && hasScore && (
          <View style={styles.gradeResult}>
            <AppText
              variant="bodyBold"
              style={{
                color: isGood ? colors.good : colors.needsImprovement,
                fontSize: ms(13),
              }}
            >
              {isGood ? 'Strong Performance' : 'Needs Work'}
            </AppText>
            <AppText variant="captionMuted">
              {isGood ? 'Above 70 threshold' : 'Below 70 threshold'}
            </AppText>
          </View>
        )}
      </View>

      {/* AI Feedback Section */}
      {isCompleted && item.feedback ? (
        <View
          style={[
            styles.feedbackContainer,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.cardBorder,
              borderRadius: radius.md,
            },
          ]}
        >
          <View style={styles.feedbackHeader}>
            <View style={styles.aiLabelRow}>
              <Ionicons name="sparkles" size={ms(14)} color={colors.primary} />
              <AppText
                variant="tag"
                color={colors.primary}
                style={{ marginLeft: ms(4), letterSpacing: 0.5 }}
              >
                AI COACH FEEDBACK
              </AppText>
            </View>
          </View>

          <AppText
            variant="body"
            color={colors.textSecondary}
            numberOfLines={isExpanded ? undefined : 3}
            style={styles.feedbackText}
          >
            {item.feedback}
          </AppText>

          {item.feedback.length > 100 && (
            <TouchableOpacity
              onPress={() => setIsExpanded((prev) => !prev)}
              activeOpacity={0.7}
              style={styles.expandButton}
            >
              <AppText variant="caption" color={colors.primary} weight="600">
                {isExpanded ? 'Show less' : 'Read full feedback'}
              </AppText>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={ms(13)}
                color={colors.primary}
                style={{ marginLeft: ms(2) }}
              />
            </TouchableOpacity>
          )}
        </View>
      ) : null}

      {/* Footer Timestamp */}
      {item.submittedAt && (
        <View style={styles.footerRow}>
          <AppText variant="captionMuted">
            Submitted: {item.submittedAt}
          </AppText>
        </View>
      )}
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    marginBottom: ms(14),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ms(10),
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: ms(6),
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questionSection: {
    marginBottom: ms(12),
  },
  questionLabel: {
    marginBottom: ms(2),
    letterSpacing: 0.5,
  },
  questionText: {
    letterSpacing: -0.2,
  },
  scoreSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: ms(10),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: ms(12),
  },
  gradeResult: {
    alignItems: 'flex-end',
  },
  feedbackContainer: {
    padding: ms(12),
    borderWidth: 1,
    marginBottom: ms(8),
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(6),
  },
  aiLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedbackText: {
    lineHeight: ms(20),
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: ms(6),
    alignSelf: 'flex-start',
  },
  footerRow: {
    marginTop: ms(4),
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
