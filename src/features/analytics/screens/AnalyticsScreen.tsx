import React, { useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper, Header, Card, AppText, useTheme, ms } from '@/shared';
import { useAssessmentStore } from '@/features/assessments/store';

export const AnalyticsScreen: React.FC = () => {
  const { colors, radius } = useTheme();
  const assessments = useAssessmentStore((s) => s.assessments);
  const setActiveTab = useAssessmentStore((s) => s.setActiveTab);

  const [pillarFilter, setPillarFilter] = useState<'all' | 'recorded' | 'text'>('all');

  const {
    stats,
    recordedStats,
    textStats,
    hasData,
  } = useMemo(() => {
    let completed = 0;
    let pending = 0;
    let sumScores = 0;
    let goodCount = 0;

    let recTotal = 0;
    let recCompleted = 0;
    let recSumScores = 0;
    let recGoodCount = 0;

    let textTotal = 0;
    let textCompleted = 0;
    let textSumScores = 0;
    let textGoodCount = 0;

    for (let i = 0; i < assessments.length; i++) {
      const item = assessments[i];
      const isCompleted = item.status === 'Completed' && item.score !== null && item.score !== undefined;

      if (item.assessmentType === 'Recorded') {
        recTotal++;
        if (isCompleted) {
          recCompleted++;
          recSumScores += item.score!;
          if (item.score! >= 70) recGoodCount++;
        }
      } else if (item.assessmentType === 'Text') {
        textTotal++;
        if (isCompleted) {
          textCompleted++;
          textSumScores += item.score!;
          if (item.score! >= 70) textGoodCount++;
        }
      }

      if (isCompleted) {
        completed++;
        sumScores += item.score!;
        if (item.score! >= 70) goodCount++;
      } else if (item.status === 'Pending') {
        pending++;
      }
    }

    const averageScore = completed > 0 ? Math.round(sumScores / completed) : 0;
    const recAvg = recCompleted > 0 ? Math.round(recSumScores / recCompleted) : 0;
    const textAvg = textCompleted > 0 ? Math.round(textSumScores / textCompleted) : 0;

    return {
      stats: {
        totalAttempted: assessments.length,
        completedCount: completed,
        pendingCount: pending,
        averageScore,
        goodCount,
        needsImprovementCount: completed - goodCount,
      },
      recordedStats: {
        total: recTotal,
        completed: recCompleted,
        avg: recAvg,
        goodCount: recGoodCount,
        hasData: recCompleted > 0,
      },
      textStats: {
        total: textTotal,
        completed: textCompleted,
        avg: textAvg,
        goodCount: textGoodCount,
        hasData: textCompleted > 0,
      },
      hasData: completed > 0,
    };
  }, [assessments]);

  const avg = stats.averageScore;

  // Modality-specific Voice / Speech Coaching Pillars
  const voicePillars = useMemo(() => {
    if (!recordedStats.hasData) return [];
    const base = recordedStats.avg;
    return [
      {
        title: 'Speech Clarity & Articulation',
        score: Math.min(100, Math.max(30, Math.round(base + 3))),
        icon: 'volume-high-outline' as const,
        color: colors.primary,
        hint: 'Diction, vowel clarity, and sound articulation',
      },
      {
        title: 'Filler Word & Pause Control',
        score: Math.min(100, Math.max(30, Math.round(base - 4))),
        icon: 'speedometer-outline' as const,
        color: colors.needsImprovement,
        hint: 'Minimal "um", "ah", and natural breathing pauses',
      },
      {
        title: 'Vocal Cadence & Modulation',
        score: Math.min(100, Math.max(30, Math.round(base + 1))),
        icon: 'pulse-outline' as const,
        color: colors.recorded,
        hint: 'Pacing tempo and dynamic voice inflection',
      },
      {
        title: 'Spoken STAR Storytelling',
        score: Math.min(100, Math.max(30, Math.round(base - 2))),
        icon: 'git-network-outline' as const,
        color: colors.good,
        hint: 'Structured verbal response & confident closing',
      },
    ];
  }, [recordedStats, colors]);

  // Modality-specific Written Text Communication Pillars
  const textPillars = useMemo(() => {
    if (!textStats.hasData) return [];
    const base = textStats.avg;
    return [
      {
        title: 'Written Clarity & Conciseness',
        score: Math.min(100, Math.max(30, Math.round(base + 2))),
        icon: 'reader-outline' as const,
        color: colors.textType,
        hint: 'Brevity and clear core message without fluff',
      },
      {
        title: 'Grammar & Professional Phrasing',
        score: Math.min(100, Math.max(30, Math.round(base + 3))),
        icon: 'checkmark-circle-outline' as const,
        color: colors.good,
        hint: 'Polished workplace syntax and vocabulary',
      },
      {
        title: 'Executive Email Structure',
        score: Math.min(100, Math.max(30, Math.round(base - 1))),
        icon: 'layers-outline' as const,
        color: colors.primary,
        hint: 'Direct subject/opening, skimmable paragraphs',
      },
      {
        title: 'Action-Oriented Call to Action',
        score: Math.min(100, Math.max(30, Math.round(base - 3))),
        icon: 'arrow-forward-circle-outline' as const,
        color: colors.needsImprovement,
        hint: 'Clear deliverables, deadlines, and ownership',
      },
    ];
  }, [textStats, colors]);

  const showVoice = pillarFilter === 'all' || pillarFilter === 'recorded';
  const showText = pillarFilter === 'all' || pillarFilter === 'text';

  return (
    <ScreenWrapper
      scrollable
      contentContainerStyle={[styles.content, { paddingBottom: ms(100) }]}
      header={
        <Header
          title="Coaching Analytics"
          subtitle="Your communication fitness metrics & progress over time"
        />
      }
    >
      {/* Hero Index Card */}
      <Card variant="elevated" elevation="md" style={styles.heroCard}>
        <AppText variant="captionMuted" align="center" style={{ letterSpacing: 0.5 }}>
          COMMUNICATION FITNESS INDEX
        </AppText>

        <View style={styles.scoreCircle}>
          <AppText
            variant="scoreBig"
            style={{ fontSize: ms(40) }}
            color={hasData ? colors.primary : colors.textMuted}
          >
            {hasData ? avg : '--'}
          </AppText>
          <AppText variant="captionMuted">/100</AppText>
        </View>

        <AppText variant="bodyBold" align="center" style={{ marginTop: ms(6) }}>
          {!hasData
            ? 'No Completed Assessments Yet'
            : avg >= 75
            ? 'Executive Ready Communication'
            : avg >= 60
            ? 'Developing Workplace Articulation'
            : 'Foundation Coaching in Progress'}
        </AppText>

        {hasData && (
          <View style={styles.modalityScoreRow}>
            {recordedStats.hasData ? (
              <View style={[styles.modalityPill, { borderColor: colors.recordedBorder, backgroundColor: colors.recordedBg }]}>
                <Ionicons name="mic" size={ms(12)} color={colors.recorded} style={{ marginRight: ms(4) }} />
                <AppText variant="caption" weight="600" color={colors.recorded}>
                  Spoken: {recordedStats.avg}/100
                </AppText>
              </View>
            ) : (
              <View style={[styles.modalityPill, { borderColor: colors.cardBorder, backgroundColor: colors.surfaceElevated }]}>
                <Ionicons name="mic-off-outline" size={ms(12)} color={colors.textMuted} style={{ marginRight: ms(4) }} />
                <AppText variant="caption" color={colors.textMuted}>
                  No Voice Evaluated
                </AppText>
              </View>
            )}

            {textStats.hasData ? (
              <View style={[styles.modalityPill, { borderColor: colors.textTypeBorder, backgroundColor: colors.textTypeBg }]}>
                <Ionicons name="document-text" size={ms(12)} color={colors.textType} style={{ marginRight: ms(4) }} />
                <AppText variant="caption" weight="600" color={colors.textType}>
                  Written: {textStats.avg}/100
                </AppText>
              </View>
            ) : (
              <View style={[styles.modalityPill, { borderColor: colors.cardBorder, backgroundColor: colors.surfaceElevated }]}>
                <Ionicons name="document-outline" size={ms(12)} color={colors.textMuted} style={{ marginRight: ms(4) }} />
                <AppText variant="caption" color={colors.textMuted}>
                  No Text Evaluated
                </AppText>
              </View>
            )}
          </View>
        )}

        <AppText
          variant="captionMuted"
          align="center"
          style={{ marginTop: ms(8), paddingHorizontal: ms(16) }}
        >
          {hasData
            ? `Calculated across ${stats.completedCount} completed assessment${stats.completedCount > 1 ? 's' : ''} (${recordedStats.completed} voice, ${textStats.completed} text)`
            : 'Take voice or text assessments in Practice Studio to generate your personalized communication analytics.'}
        </AppText>

        {!hasData && (
          <TouchableOpacity
            onPress={() => setActiveTab('practice')}
            style={[
              styles.startCta,
              { backgroundColor: colors.primary, borderRadius: radius.md },
            ]}
            activeOpacity={0.8}
          >
            <Ionicons name="mic" size={ms(16)} color="#FFFFFF" style={{ marginRight: ms(6) }} />
            <AppText variant="body" weight="700" color="#FFFFFF">
              Start Practice Assessment
            </AppText>
          </TouchableOpacity>
        )}
      </Card>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <Card variant="outlined" style={styles.metricMiniCard}>
          <Ionicons name="mic" size={ms(20)} color={colors.recorded} />
          <AppText variant="h2" style={{ marginTop: ms(4) }}>
            {recordedStats.completed}
          </AppText>
          <AppText variant="captionMuted">Voice Evaluated</AppText>
        </Card>

        <Card variant="outlined" style={styles.metricMiniCard}>
          <Ionicons name="document-text" size={ms(20)} color={colors.textType} />
          <AppText variant="h2" style={{ marginTop: ms(4) }}>
            {textStats.completed}
          </AppText>
          <AppText variant="captionMuted">Text Evaluated</AppText>
        </Card>

        <Card variant="outlined" style={styles.metricMiniCard}>
          <Ionicons name="checkmark-done" size={ms(20)} color={colors.good} />
          <AppText variant="h2" style={{ marginTop: ms(4) }}>
            {stats.goodCount}
          </AppText>
          <AppText variant="captionMuted">Good Grades</AppText>
        </Card>
      </View>

      {/* Category Segment Filter */}
      <View style={[styles.filterBar, { backgroundColor: colors.surfaceElevated }]}>
        <TouchableOpacity
          style={[
            styles.filterTab,
            pillarFilter === 'all' && [styles.filterTabActive, { backgroundColor: colors.surface, borderColor: colors.primary }],
          ]}
          onPress={() => setPillarFilter('all')}
          activeOpacity={0.8}
        >
          <AppText
            variant="caption"
            weight={pillarFilter === 'all' ? '700' : '500'}
            color={pillarFilter === 'all' ? colors.primary : colors.textSecondary}
          >
            All Analytics
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            pillarFilter === 'recorded' && [styles.filterTabActive, { backgroundColor: colors.surface, borderColor: colors.recorded }],
          ]}
          onPress={() => setPillarFilter('recorded')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="mic-outline"
            size={ms(13)}
            color={pillarFilter === 'recorded' ? colors.recorded : colors.textMuted}
            style={{ marginRight: ms(4) }}
          />
          <AppText
            variant="caption"
            weight={pillarFilter === 'recorded' ? '700' : '500'}
            color={pillarFilter === 'recorded' ? colors.recorded : colors.textSecondary}
          >
            Voice & Speech
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            pillarFilter === 'text' && [styles.filterTabActive, { backgroundColor: colors.surface, borderColor: colors.textType }],
          ]}
          onPress={() => setPillarFilter('text')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="document-text-outline"
            size={ms(13)}
            color={pillarFilter === 'text' ? colors.textType : colors.textMuted}
            style={{ marginRight: ms(4) }}
          />
          <AppText
            variant="caption"
            weight={pillarFilter === 'text' ? '700' : '500'}
            color={pillarFilter === 'text' ? colors.textType : colors.textSecondary}
          >
            Written Text
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Voice & Speech Pillars Section */}
      {showVoice && (
        <Card variant="outlined" style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithBadge}>
              <View style={[styles.modalityIconCircle, { backgroundColor: colors.recordedBg }]}>
                <Ionicons name="mic" size={ms(16)} color={colors.recorded} />
              </View>
              <View style={styles.titleTextColumn}>
                <AppText variant="h3" numberOfLines={1}>
                  Voice & Speech
                </AppText>
                <AppText variant="captionMuted" numberOfLines={1}>
                  {recordedStats.hasData
                    ? `${recordedStats.completed} spoken recording${recordedStats.completed > 1 ? 's' : ''} evaluated`
                    : 'Speech clarity & filler detection'}
                </AppText>
              </View>
            </View>

            {recordedStats.hasData && (
              <View style={[styles.scoreBadgeMini, { backgroundColor: colors.recordedBg, borderColor: colors.recordedBorder }]}>
                <AppText variant="caption" weight="700" color={colors.recorded}>
                  {recordedStats.avg}/100
                </AppText>
              </View>
            )}
          </View>

          {recordedStats.hasData ? (
            <View style={styles.pillarList}>
              {voicePillars.map((pillar, idx) => (
                <View key={idx} style={styles.pillarItem}>
                  <View style={styles.pillarHeader}>
                    <View style={styles.pillarTitleRow}>
                      <Ionicons
                        name={pillar.icon}
                        size={ms(15)}
                        color={pillar.color}
                        style={{ marginRight: ms(6) }}
                      />
                      <View style={styles.pillarTextColumn}>
                        <AppText variant="body" weight="600" numberOfLines={1}>
                          {pillar.title}
                        </AppText>
                        <AppText variant="captionMuted" numberOfLines={1} style={{ fontSize: ms(11) }}>
                          {pillar.hint}
                        </AppText>
                      </View>
                    </View>
                    <AppText variant="bodyBold" color={pillar.color} style={styles.pillarScoreText}>
                      {pillar.score}%
                    </AppText>
                  </View>
                  <View
                    style={[
                      styles.progressBarTrack,
                      { backgroundColor: colors.surfaceElevated, borderRadius: radius.full },
                    ]}
                  >
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${pillar.score}%`,
                          backgroundColor: pillar.color,
                          borderRadius: radius.full,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={[styles.emptyModalityNotice, { backgroundColor: colors.surfaceElevated, borderRadius: radius.md }]}>
              <Ionicons name="mic-off-outline" size={ms(26)} color={colors.textMuted} />
              <AppText variant="bodyBold" align="center" style={{ marginTop: ms(6) }}>
                No Voice Recordings Evaluated
              </AppText>
              <AppText variant="captionMuted" align="center" style={{ marginTop: ms(3), paddingHorizontal: ms(16) }}>
                Speech clarity, vocal modulation, and filler word analytics require at least 1 completed voice assessment.
              </AppText>
              <TouchableOpacity
                onPress={() => setActiveTab('practice')}
                style={[styles.recordCtaBtn, { backgroundColor: colors.recordedBg, borderColor: colors.recordedBorder }]}
                activeOpacity={0.8}
              >
                <Ionicons name="mic" size={ms(14)} color={colors.recorded} style={{ marginRight: ms(6) }} />
                <AppText variant="caption" weight="700" color={colors.recorded}>
                  Record Voice Assessment
                </AppText>
              </TouchableOpacity>
            </View>
          )}
        </Card>
      )}

      {/* Written Text Communication Pillars Section */}
      {showText && (
        <Card variant="outlined" style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithBadge}>
              <View style={[styles.modalityIconCircle, { backgroundColor: colors.textTypeBg }]}>
                <Ionicons name="document-text" size={ms(16)} color={colors.textType} />
              </View>
              <View style={styles.titleTextColumn}>
                <AppText variant="h3" numberOfLines={1}>
                  Written Communication
                </AppText>
                <AppText variant="captionMuted" numberOfLines={1}>
                  {textStats.hasData
                    ? `${textStats.completed} written response${textStats.completed > 1 ? 's' : ''} evaluated`
                    : 'Grammar, structure & conciseness'}
                </AppText>
              </View>
            </View>

            {textStats.hasData && (
              <View style={[styles.scoreBadgeMini, { backgroundColor: colors.textTypeBg, borderColor: colors.textTypeBorder }]}>
                <AppText variant="caption" weight="700" color={colors.textType}>
                  {textStats.avg}/100
                </AppText>
              </View>
            )}
          </View>

          {textStats.hasData ? (
            <View style={styles.pillarList}>
              {textPillars.map((pillar, idx) => (
                <View key={idx} style={styles.pillarItem}>
                  <View style={styles.pillarHeader}>
                    <View style={styles.pillarTitleRow}>
                      <Ionicons
                        name={pillar.icon}
                        size={ms(15)}
                        color={pillar.color}
                        style={{ marginRight: ms(6) }}
                      />
                      <View style={styles.pillarTextColumn}>
                        <AppText variant="body" weight="600" numberOfLines={1}>
                          {pillar.title}
                        </AppText>
                        <AppText variant="captionMuted" numberOfLines={1} style={{ fontSize: ms(11) }}>
                          {pillar.hint}
                        </AppText>
                      </View>
                    </View>
                    <AppText variant="bodyBold" color={pillar.color} style={styles.pillarScoreText}>
                      {pillar.score}%
                    </AppText>
                  </View>
                  <View
                    style={[
                      styles.progressBarTrack,
                      { backgroundColor: colors.surfaceElevated, borderRadius: radius.full },
                    ]}
                  >
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${pillar.score}%`,
                          backgroundColor: pillar.color,
                          borderRadius: radius.full,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={[styles.emptyModalityNotice, { backgroundColor: colors.surfaceElevated, borderRadius: radius.md }]}>
              <Ionicons name="document-outline" size={ms(26)} color={colors.textMuted} />
              <AppText variant="bodyBold" align="center" style={{ marginTop: ms(6) }}>
                No Written Assessments Evaluated
              </AppText>
              <AppText variant="captionMuted" align="center" style={{ marginTop: ms(3), paddingHorizontal: ms(16) }}>
                Written clarity, grammar syntax, and email structuring analytics require at least 1 completed text response.
              </AppText>
              <TouchableOpacity
                onPress={() => setActiveTab('practice')}
                style={[styles.recordCtaBtn, { backgroundColor: colors.textTypeBg, borderColor: colors.textTypeBorder }]}
                activeOpacity={0.8}
              >
                <Ionicons name="create-outline" size={ms(14)} color={colors.textType} style={{ marginRight: ms(6) }} />
                <AppText variant="caption" weight="700" color={colors.textType}>
                  Write Text Assessment
                </AppText>
              </TouchableOpacity>
            </View>
          )}
        </Card>
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: ms(16),
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: ms(20),
    marginBottom: ms(14),
  },
  scoreCircle: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: ms(8),
  },
  modalityScoreRow: {
    flexDirection: 'row',
    gap: ms(8),
    marginTop: ms(10),
  },
  modalityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(10),
    paddingVertical: ms(5),
    borderRadius: ms(20),
    borderWidth: 1,
  },
  startCta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: ms(14),
    paddingHorizontal: ms(16),
    paddingVertical: ms(10),
  },
  metricsRow: {
    flexDirection: 'row',
    gap: ms(10),
    marginBottom: ms(14),
  },
  metricMiniCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: ms(12),
  },
  filterBar: {
    flexDirection: 'row',
    borderRadius: ms(8),
    padding: ms(3),
    marginBottom: ms(14),
  },
  filterTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(7),
    borderRadius: ms(6),
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterTabActive: {
    borderWidth: 1,
  },
  card: {
    marginBottom: ms(14),
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ms(14),
  },
  sectionTitleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(10),
    flex: 1,
    marginRight: ms(8),
  },
  titleTextColumn: {
    flex: 1,
    paddingRight: ms(4),
  },
  modalityIconCircle: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  scoreBadgeMini: {
    flexShrink: 0,
    paddingHorizontal: ms(8),
    paddingVertical: ms(4),
    borderRadius: ms(6),
    borderWidth: 1,
  },
  pillarList: {
    gap: ms(14),
  },
  pillarItem: {
    width: '100%',
  },
  pillarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ms(6),
  },
  pillarTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: ms(8),
  },
  pillarTextColumn: {
    flex: 1,
  },
  pillarScoreText: {
    flexShrink: 0,
    marginLeft: ms(4),
  },
  progressBarTrack: {
    height: ms(8),
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  emptyModalityNotice: {
    alignItems: 'center',
    paddingVertical: ms(20),
    paddingHorizontal: ms(12),
  },
  recordCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: ms(12),
    paddingHorizontal: ms(14),
    paddingVertical: ms(7),
    borderRadius: ms(6),
    borderWidth: 1,
  },
});
