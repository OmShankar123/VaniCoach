import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper, Header, AppText, Card, useTheme, ms } from '@/shared';
import {
  QuestionPicker,
  VoiceRecorderStudio,
  TextResponseStudio,
  EvaluationModal,
} from '@/features/practice/components';
import {
  useAssessmentStore,
  type AssessmentType,
  type AssessmentStatus,
} from '@/features/assessments';

const PRESET_QUESTIONS = [
  'Tell me about yourself',
  'Describe a challenging situation',
  'Write a professional email to your manager',
  'Explain your current project',
];

export const TakeAssessmentScreen: React.FC = () => {
  const { colors, radius } = useTheme();

  const addAssessment = useAssessmentStore((s) => s.addAssessment);
  const setActiveTab = useAssessmentStore((s) => s.setActiveTab);

  // Form State
  const [selectedQuestion, setSelectedQuestion] = useState(PRESET_QUESTIONS[0]);
  const [customQuestion, setCustomQuestion] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const [assessmentType, setAssessmentType] = useState<AssessmentType>('Recorded');
  const [submissionStatus, setSubmissionStatus] = useState<AssessmentStatus>('Completed');

  // Input states
  const [recordedUri, setRecordedUri] = useState<string>('');
  const [recordedDurationSec, setRecordedDurationSec] = useState<number>(0);
  const [textAnswer, setTextAnswer] = useState<string>('');

  // AI Evaluation Simulation State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationStep, setEvaluationStep] = useState('Analyzing speech clarity...');
  const [evaluationModalVisible, setEvaluationModalVisible] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<{
    id: string;
    question: string;
    type: AssessmentType;
    score: number;
    feedback: string;
    duration?: string;
  } | null>(null);

  const activeQuestionText = isCustomMode ? customQuestion.trim() : selectedQuestion;
  const wordCount = textAnswer.trim() ? textAnswer.trim().split(/\s+/).length : 0;

  const handleRecordingReady = useCallback((uri: string, durationSeconds: number) => {
    setRecordedUri(uri);
    setRecordedDurationSec(durationSeconds);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!activeQuestionText) {
      Alert.alert('Question Required', 'Please select or enter a practice question.');
      return;
    }

    if (assessmentType === 'Recorded' && recordedDurationSec < 3) {
      Alert.alert(
        'Recording Needed',
        'Please record your spoken response (at least 3 seconds) before submitting.'
      );
      return;
    }

    if (assessmentType === 'Text' && wordCount < 5) {
      Alert.alert(
        'Minimum Words Required',
        'Please write at least 5 words for an accurate AI evaluation.'
      );
      return;
    }

    const minutes = Math.floor(recordedDurationSec / 60);
    const seconds = recordedDurationSec % 60;
    const durationStr =
      assessmentType === 'Recorded'
        ? `${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`
        : `${wordCount} words`;

    // Case 1: Submitting as Pending
    if (submissionStatus === 'Pending') {
      addAssessment({
        question: activeQuestionText,
        assessmentType,
        score: null,
        status: 'Pending',
        feedback: null,
        submittedAt: 'Just now',
        duration: durationStr,
        audioUri: recordedUri || undefined,
      });

      // Reset studio inputs
      setRecordedUri('');
      setRecordedDurationSec(0);
      setTextAnswer('');

      Alert.alert(
        'Submitted as Pending',
        'Your assessment has been queued. You can evaluate it with AI anytime from the Results tab.',
        [
          {
            text: 'View in Results',
            onPress: () => setActiveTab('results'),
          },
          {
            text: 'Practice Another',
            style: 'cancel',
          },
        ]
      );
      return;
    }

    // Case 2: Instant AI Evaluation Pipeline
    setIsEvaluating(true);
    setEvaluationModalVisible(true);
    setEvaluationStep(
      assessmentType === 'Recorded'
        ? 'Transcribing vocal cadence & sound dynamics...'
        : 'Parsing written structure & paragraph conciseness...'
    );

    setTimeout(() => {
      setEvaluationStep(
        assessmentType === 'Recorded'
          ? 'Detecting filler words, pause frequency, & speech clarity...'
          : 'Analyzing professional grammar, vocabulary, & sentence syntax...'
      );
    }, 900);

    setTimeout(() => {
      setEvaluationStep(
        assessmentType === 'Recorded'
          ? 'Synthesizing vocal coaching feedback & score...'
          : 'Synthesizing written executive feedback & score...'
      );
    }, 1800);

    setTimeout(() => {
      setIsEvaluating(false);

      const baseScore = assessmentType === 'Recorded' ? 78 : 83;
      const scoreVariance = Math.floor(Math.random() * 16) - 5;
      const finalScore = Math.min(97, Math.max(62, baseScore + scoreVariance));

      const feedback =
        assessmentType === 'Recorded'
          ? `Vani AI Coach Analysis: Strong presence and clear pacing. Key strength: Excellent framing using STAR method. Recommended focus: Use more decisive transitional phrases to reinforce executive presence.`
          : `Vani AI Coach Analysis: Thoughtful written structure (${wordCount} words) with courteous tone. Key strength: Direct answer to the core scenario. Recommendation: Clarify actionable deadlines with metrics.`;

      const newId = `eval_${Date.now()}`;
      addAssessment({
        question: activeQuestionText,
        assessmentType,
        score: finalScore,
        status: 'Completed',
        feedback,
        submittedAt: 'Just now',
        duration: durationStr,
        audioUri: recordedUri || undefined,
      });

      setLastSubmission({
        id: newId,
        question: activeQuestionText,
        type: assessmentType,
        score: finalScore,
        feedback,
        duration: durationStr,
      });

      // Reset studio inputs
      setRecordedUri('');
      setRecordedDurationSec(0);
      setTextAnswer('');
    }, 2700);
  }, [
    activeQuestionText,
    assessmentType,
    recordedDurationSec,
    recordedUri,
    wordCount,
    submissionStatus,
    addAssessment,
    setActiveTab,
  ]);

  const handleDismissModal = useCallback(() => {
    setEvaluationModalVisible(false);
    setLastSubmission(null);
  }, []);

  const handleViewResults = useCallback(() => {
    setEvaluationModalVisible(false);
    setLastSubmission(null);
    setActiveTab('results');
  }, [setActiveTab]);

  const isSubmitDisabled =
    !activeQuestionText ||
    (assessmentType === 'Recorded' && recordedDurationSec < 3) ||
    (assessmentType === 'Text' && wordCount < 5);

  return (
    <ScreenWrapper
      scrollable={false}
      header={
        <Header
          title="Practice Studio"
          subtitle="Submit a voice or written assessment for instant AI coaching"
        />
      }
    >
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingBottom: ms(120) }]}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={ms(30)}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Step 1: Question Selection Component */}
        <Card variant="outlined" style={styles.card}>
          <QuestionPicker
            questions={PRESET_QUESTIONS}
            selectedQuestion={selectedQuestion}
            onSelectQuestion={setSelectedQuestion}
            customQuestion={customQuestion}
            onChangeCustomQuestion={setCustomQuestion}
            isCustomMode={isCustomMode}
            onToggleCustomMode={setIsCustomMode}
          />
        </Card>

        {/* Step 2: Assessment Format Switcher */}
        <Card variant="outlined" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.stepDot, { backgroundColor: colors.primary }]}>
              <AppText variant="caption" color={colors.textInverse} weight="700">
                2
              </AppText>
            </View>
            <AppText variant="h3">Choose Response Format</AppText>
          </View>

          <View style={styles.typeSelectorRow}>
            <TouchableOpacity
              onPress={() => setAssessmentType('Recorded')}
              activeOpacity={0.8}
              style={[
                styles.typeButton,
                {
                  backgroundColor:
                    assessmentType === 'Recorded' ? colors.recordedBg : colors.surfaceElevated,
                  borderColor:
                    assessmentType === 'Recorded' ? colors.recorded : colors.cardBorder,
                  borderRadius: radius.lg,
                },
              ]}
            >
              <Ionicons
                name="mic"
                size={ms(26)}
                color={assessmentType === 'Recorded' ? colors.recorded : colors.textMuted}
              />
              <AppText
                variant="bodyBold"
                color={assessmentType === 'Recorded' ? colors.recorded : colors.text}
                style={{ marginTop: ms(6) }}
              >
                Recorded Response
              </AppText>
              <AppText variant="captionMuted" align="center" style={{ marginTop: ms(2) }}>
                Audio recording evaluated for pitch, cadence & clarity
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAssessmentType('Text')}
              activeOpacity={0.8}
              style={[
                styles.typeButton,
                {
                  backgroundColor:
                    assessmentType === 'Text' ? colors.textTypeBg : colors.surfaceElevated,
                  borderColor:
                    assessmentType === 'Text' ? colors.textType : colors.cardBorder,
                  borderRadius: radius.lg,
                },
              ]}
            >
              <Ionicons
                name="document-text"
                size={ms(26)}
                color={assessmentType === 'Text' ? colors.textType : colors.textMuted}
              />
              <AppText
                variant="bodyBold"
                color={assessmentType === 'Text' ? colors.textType : colors.text}
                style={{ marginTop: ms(6) }}
              >
                Written Text
              </AppText>
              <AppText variant="captionMuted" align="center" style={{ marginTop: ms(2) }}>
                Text response evaluated for executive tone & structure
              </AppText>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Step 3: Interactive Recording or Writing Studio Component */}
        <Card variant="outlined" style={styles.card}>
          {assessmentType === 'Recorded' ? (
            <VoiceRecorderStudio
              question={activeQuestionText}
              onRecordingReady={handleRecordingReady}
              recordedDuration={recordedDurationSec}
            />
          ) : (
            <TextResponseStudio
              value={textAnswer}
              onChangeText={setTextAnswer}
              wordCount={wordCount}
            />
          )}
        </Card>

        {/* Step 4: Submission Option (Completed vs Pending) - Responsive Full-Width Layout */}
        <Card variant="outlined" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.stepDot, { backgroundColor: colors.primary }]}>
              <AppText variant="caption" color={colors.textInverse} weight="700">
                4
              </AppText>
            </View>
            <AppText variant="h3">Evaluation Mode</AppText>
          </View>

          <AppText variant="captionMuted" style={{ marginBottom: ms(12) }}>
            Choose whether to run instant AI evaluation or queue as a pending item for later review.
          </AppText>

          <View style={styles.evalModeRow}>
            <TouchableOpacity
              onPress={() => setSubmissionStatus('Completed')}
              activeOpacity={0.8}
              style={[
                styles.evalModeOption,
                {
                  backgroundColor:
                    submissionStatus === 'Completed' ? colors.goodBg : colors.surfaceElevated,
                  borderColor:
                    submissionStatus === 'Completed' ? colors.good : colors.cardBorder,
                  borderRadius: radius.md,
                },
              ]}
            >
              <Ionicons
                name="sparkles"
                size={ms(18)}
                color={submissionStatus === 'Completed' ? colors.good : colors.textMuted}
                style={{ marginRight: ms(6) }}
              />
              <View style={styles.evalModeTextCol}>
                <AppText
                  variant="caption"
                  weight={submissionStatus === 'Completed' ? '700' : '600'}
                  color={submissionStatus === 'Completed' ? colors.good : colors.text}
                >
                  Instant AI
                </AppText>
                <AppText variant="captionMuted" style={{ fontSize: ms(10) }}>
                  Score immediately
                </AppText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSubmissionStatus('Pending')}
              activeOpacity={0.8}
              style={[
                styles.evalModeOption,
                {
                  backgroundColor:
                    submissionStatus === 'Pending' ? colors.pendingBg : colors.surfaceElevated,
                  borderColor:
                    submissionStatus === 'Pending' ? colors.pending : colors.cardBorder,
                  borderRadius: radius.md,
                },
              ]}
            >
              <Ionicons
                name="time-outline"
                size={ms(18)}
                color={submissionStatus === 'Pending' ? colors.pending : colors.textMuted}
                style={{ marginRight: ms(6) }}
              />
              <View style={styles.evalModeTextCol}>
                <AppText
                  variant="caption"
                  weight={submissionStatus === 'Pending' ? '700' : '600'}
                  color={submissionStatus === 'Pending' ? colors.pending : colors.text}
                >
                  Mark Pending
                </AppText>
                <AppText variant="captionMuted" style={{ fontSize: ms(10) }}>
                  Review later
                </AppText>
              </View>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Main Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitDisabled}
          activeOpacity={0.85}
          style={[
            styles.submitButton,
            {
              backgroundColor:
                submissionStatus === 'Completed' ? colors.primary : colors.surfaceElevated,
              borderColor:
                submissionStatus === 'Completed' ? colors.primary : colors.cardBorder,
              borderRadius: radius.lg,
              opacity: isSubmitDisabled ? 0.6 : 1,
            },
          ]}
        >
          <Ionicons
            name={submissionStatus === 'Completed' ? 'sparkles' : 'hourglass-outline'}
            size={ms(18)}
            color={submissionStatus === 'Completed' ? '#FFFFFF' : colors.text}
            style={{ marginRight: ms(8) }}
          />
          <AppText
            variant="bodyBold"
            color={submissionStatus === 'Completed' ? '#FFFFFF' : colors.text}
          >
            {submissionStatus === 'Completed'
              ? 'Submit for AI Evaluation'
              : 'Submit as Pending Assessment'}
          </AppText>
        </TouchableOpacity>
      </KeyboardAwareScrollView>

      {/* Modal Evaluation Dialog with Multi-step AI Pipeline & Result */}
      <EvaluationModal
        visible={evaluationModalVisible}
        isEvaluating={isEvaluating}
        stepMessage={evaluationStep}
        result={lastSubmission}
        onDismiss={handleDismissModal}
        onViewResults={handleViewResults}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: ms(16),
  },
  card: {
    marginBottom: ms(16),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(12),
  },
  stepDot: {
    width: ms(22),
    height: ms(22),
    borderRadius: ms(11),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(8),
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: ms(10),
  },
  typeButton: {
    flex: 1,
    paddingVertical: ms(14),
    paddingHorizontal: ms(10),
    alignItems: 'center',
    borderWidth: 1.5,
  },
  evalModeRow: {
    flexDirection: 'row',
    gap: ms(10),
    width: '100%',
  },
  evalModeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(12),
    paddingHorizontal: ms(10),
    borderWidth: 1.5,
  },
  evalModeTextCol: {
    justifyContent: 'center',
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: ms(14),
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});
