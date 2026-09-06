import React, { memo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Badge, ScoreIndicator, Card, useTheme, ms } from '@/shared';
import type { AssessmentResult } from '@/features/assessments/types';

interface AssessmentCardProps {
  item: AssessmentResult;
  onEvaluate?: (id: string) => void;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = memo(({ item, onEvaluate }) => {
  const { colors, radius } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const isCompleted = item.status === 'Completed';
  const hasScore = item.score !== null;
  const isGood = hasScore && item.score! >= 70;

  return (
    <Card variant="elevated" elevation="sm" style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.badgeGroup}>
          <Badge
            label={item.assessmentType.toUpperCase()}
            variant={item.assessmentType === 'Recorded' ? 'recorded' : 'text'}
            size="sm"
          />

          {isCompleted && (
            <Badge
              label={isGood ? 'GOOD' : 'NEEDS IMPROVEMENT'}
              variant={isGood ? 'good' : 'needsImprovement'}
              size="sm"
              style={{ marginLeft: ms(6) }}
            />
          )}

          {!isCompleted && (
            <Badge
              label="PENDING EVALUATION"
              variant="pending"
              size="sm"
              style={{ marginLeft: ms(6) }}
            />
          )}
        </View>

        {item.duration && (
          <View style={styles.durationRow}>
            <Ionicons
              name={item.assessmentType === 'Recorded' ? 'time-outline' : 'document-text-outline'}
              size={ms(12)}
              color={colors.textMuted}
            />
            <AppText variant="captionMuted" style={{ marginLeft: ms(4) }}>
              {item.duration}
            </AppText>
          </View>
        )}
      </View>

      <AppText variant="h3" style={styles.question}>
        {item.question}
      </AppText>

      {isCompleted && hasScore && (
        <View style={[styles.scoreSection, { borderColor: colors.cardBorder }]}>
          <ScoreIndicator score={item.score!} status={item.status} />
          {item.submittedAt && (
            <AppText variant="captionMuted">{item.submittedAt}</AppText>
          )}
        </View>
      )}

      {isCompleted && item.feedback && (
        <View
          style={[
            styles.feedbackContainer,
            {
              backgroundColor: colors.surfaceElevated,
              borderRadius: radius.md,
            },
          ]}
        >
          <View style={styles.feedbackHeader}>
            <Ionicons name="sparkles" size={ms(13)} color={colors.primary} />
            <AppText
              variant="caption"
              weight="700"
              color={colors.primary}
              style={{ marginLeft: ms(4), letterSpacing: 0.5 }}
            >
              AI COACH
            </AppText>
          </View>

          <AppText
            variant="body"
            color={colors.textSecondary}
            numberOfLines={isExpanded ? undefined : 2}
            style={styles.feedbackText}
          >
            {item.feedback}
          </AppText>

          {item.feedback.length > 90 && (
            <TouchableOpacity
              onPress={() => setIsExpanded(!isExpanded)}
              style={styles.expandToggle}
              activeOpacity={0.7}
            >
              <AppText variant="caption" weight="600" color={colors.primary}>
                {isExpanded ? 'Show less' : 'Read full coaching note'}
              </AppText>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={ms(12)}
                color={colors.primary}
                style={{ marginLeft: ms(2) }}
              />
            </TouchableOpacity>
          )}
        </View>
      )}

      {!isCompleted && (
        <View
          style={[
            styles.pendingBox,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.cardBorder,
              borderRadius: radius.md,
            },
          ]}
        >
          <View style={styles.pendingInfoRow}>
            <Ionicons name="hourglass-outline" size={ms(16)} color={colors.pending} />
            <View style={{ marginLeft: ms(8), flex: 1 }}>
              <AppText variant="bodyBold" color={colors.text}>
                Awaiting Evaluation
              </AppText>
              <AppText variant="captionMuted">
                {item.assessmentType === 'Recorded'
                  ? 'Vani AI Coach will analyze vocal tone, pacing, and executive clarity.'
                  : 'Vani AI Coach will review structure, professional grammar, and impact.'}
              </AppText>
            </View>
          </View>

          {onEvaluate && (
            <TouchableOpacity
              onPress={() => onEvaluate(item.id)}
              style={[
                styles.evaluateBtn,
                { backgroundColor: colors.primary, borderRadius: radius.sm },
              ]}
              activeOpacity={0.8}
            >
              <Ionicons name="sparkles" size={ms(12)} color="#FFFFFF" style={{ marginRight: ms(4) }} />
              <AppText variant="caption" weight="700" color="#FFFFFF">
                Evaluate Now (Instant AI)
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      )}
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    marginBottom: ms(12),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ms(8),
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  question: {
    marginBottom: ms(10),
  },
  scoreSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: ms(10),
    marginBottom: ms(10),
  },
  feedbackContainer: {
    padding: ms(12),
    marginTop: ms(4),
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(6),
  },
  feedbackText: {
    lineHeight: ms(20),
  },
  expandToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: ms(6),
  },
  pendingBox: {
    padding: ms(12),
    borderWidth: 1,
    marginTop: ms(4),
  },
  pendingInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  evaluateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: ms(10),
    paddingVertical: ms(7),
  },
});