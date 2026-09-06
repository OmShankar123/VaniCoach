import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, ScoreIndicator, Badge, useTheme, ms } from '@/shared';
import type { AssessmentType } from '@/features/assessments/types';

interface EvaluationModalProps {
  visible: boolean;
  isEvaluating?: boolean;
  stepMessage?: string;
  result: {
    id: string;
    question: string;
    type: AssessmentType;
    score: number;
    feedback: string;
    duration?: string;
  } | null;
  onDismiss: () => void;
  onViewResults: () => void;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({
  visible,
  isEvaluating = false,
  stepMessage = 'Evaluating with Vani AI...',
  result,
  onDismiss,
  onViewResults,
}) => {
  const { colors, radius } = useTheme();

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.backdrop}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: colors.surface,
              borderColor: colors.cardBorder,
              borderRadius: radius.lg,
            },
          ]}
        >
          {isEvaluating || !result ? (
            <View style={styles.loadingContainer}>
              <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="sparkles" size={ms(32)} color={colors.primary} />
              </View>
              <AppText variant="h2" align="center" style={styles.title}>
                Evaluating with Vani AI
              </AppText>
              <AppText
                variant="body"
                color={colors.textSecondary}
                align="center"
                style={styles.stepMessageText}
              >
                {stepMessage}
              </AppText>
              <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: ms(16) }} />
            </View>
          ) : (
            <>
              <View style={styles.iconCircle}>
                <Ionicons name="sparkles" size={ms(28)} color={colors.primary} />
              </View>

              <AppText variant="h2" align="center" style={styles.title}>
                AI Evaluation Ready!
              </AppText>

              <View style={styles.badgeRow}>
                <Badge
                  label={result.type.toUpperCase()}
                  variant={result.type === 'Recorded' ? 'recorded' : 'text'}
                  size="sm"
                />
                <Badge
                  label={result.score >= 70 ? 'GOOD' : 'NEEDS IMPROVEMENT'}
                  variant={result.score >= 70 ? 'good' : 'needsImprovement'}
                  size="sm"
                  style={{ marginLeft: ms(6) }}
                />
              </View>

              <AppText variant="captionMuted" align="center" style={styles.question}>
                "{result.question}"
              </AppText>

              <View style={styles.scoreBox}>
                <ScoreIndicator score={result.score} status="Completed" />
              </View>

              <View
                style={[
                  styles.feedbackBox,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.cardBorder,
                    borderRadius: radius.md,
                  },
                ]}
              >
                <View style={styles.feedbackHeader}>
                  <Ionicons
                    name={result.type === "Recorded" ? "mic" : "document-text"}
                    size={ms(13)}
                    color={result.type === "Recorded" ? colors.recorded : colors.textType}
                  />
                  <AppText
                    variant="caption"
                    weight="700"
                    color={result.type === "Recorded" ? colors.recorded : colors.textType}
                    style={{ marginLeft: ms(4), letterSpacing: 0.5 }}
                  >
                    {result.type === "Recorded"
                      ? "VANI VOICE & SPEECH COACHING"
                      : "VANI WRITTEN COMMUNICATION COACHING"}
                  </AppText>
                </View>
                <AppText variant="body" color={colors.textSecondary} style={styles.feedbackText}>
                  {result.feedback}
                </AppText>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[
                    styles.primaryBtn,
                    { backgroundColor: colors.primary, borderRadius: radius.md },
                  ]}
                  onPress={onViewResults}
                  activeOpacity={0.8}
                >
                  <Ionicons name="clipboard" size={ms(16)} color="#FFFFFF" style={{ marginRight: ms(6) }} />
                  <AppText variant="body" weight="700" color="#FFFFFF">
                    View in Assessment Results
                  </AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.dismissBtn, { borderRadius: radius.md }]}
                  onPress={onDismiss}
                  activeOpacity={0.7}
                >
                  <AppText variant="caption" weight="600" color={colors.textSecondary}>
                    Practice Another Question
                  </AppText>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: ms(20),
  },
  modalContent: {
    width: '100%',
    padding: ms(20),
    borderWidth: 1,
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: ms(20),
    width: '100%',
  },
  stepMessageText: {
    marginTop: ms(8),
    paddingHorizontal: ms(16),
  },
  iconCircle: {
    width: ms(52),
    height: ms(52),
    borderRadius: ms(26),
    backgroundColor: 'rgba(255, 107, 43, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ms(12),
  },
  title: {
    marginBottom: ms(8),
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(10),
  },
  question: {
    fontStyle: 'italic',
    marginBottom: ms(14),
    textAlign: 'center',
  },
  scoreBox: {
    marginBottom: ms(16),
  },
  feedbackBox: {
    width: '100%',
    padding: ms(12),
    borderWidth: 1,
    marginBottom: ms(16),
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(6),
  },
  feedbackText: {
    lineHeight: ms(20),
  },
  actionRow: {
    width: '100%',
    gap: ms(8),
  },
  primaryBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: ms(12),
  },
  dismissBtn: {
    alignItems: 'center',
    paddingVertical: ms(8),
  },
});