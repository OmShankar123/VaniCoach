import { useState, useMemo, useCallback } from 'react';
import {
  AssessmentResult,
  AssessmentFilterType,
  AssessmentStatsSummary,
} from '../types/assessment';
import { INITIAL_ASSESSMENTS } from '../data/mockAssessments';

export const useAssessments = () => {
  const [data, setData] = useState<AssessmentResult[]>(INITIAL_ASSESSMENTS);
  const [filterType, setFilterType] = useState<AssessmentFilterType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPending, setShowPending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter logic: PDF asks to display user's completed assessments
  const filteredList = useMemo(() => {
    return data.filter((item) => {
      // Status filter
      if (!showPending && item.status !== 'Completed') {
        return false;
      }
      if (showPending && item.status !== 'Pending') {
        return false;
      }

      // Type filter
      if (filterType !== 'All' && item.assessmentType !== filterType) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQuestion = item.question.toLowerCase().includes(query);
        const matchesFeedback = item.feedback?.toLowerCase().includes(query) || false;
        return matchesQuestion || matchesFeedback;
      }

      return true;
    });
  }, [data, filterType, searchQuery, showPending]);

  // Statistics calculation across completed assessments
  const stats: AssessmentStatsSummary = useMemo(() => {
    const completedItems = data.filter((i) => i.status === 'Completed' && i.score !== null);
    const totalCompleted = completedItems.length;
    const pendingCount = data.filter((i) => i.status === 'Pending').length;

    if (totalCompleted === 0) {
      return {
        totalAttempted: data.length,
        completedCount: 0,
        pendingCount,
        averageScore: 0,
        goodCount: 0,
        needsImprovementCount: 0,
      };
    }

    const sumScores = completedItems.reduce((acc, curr) => acc + (curr.score || 0), 0);
    const goodCount = completedItems.filter((i) => (i.score || 0) >= 70).length;
    const needsImprovementCount = totalCompleted - goodCount;

    return {
      totalAttempted: data.length,
      completedCount: totalCompleted,
      pendingCount,
      averageScore: Math.round(sumScores / totalCompleted),
      goodCount,
      needsImprovementCount,
    };
  }, [data]);

  // Pull to refresh simulation
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  }, []);

  // Handlers for candidate demo & edge case testing
  const clearAllCompleted = useCallback(() => {
    setData((prev) => prev.filter((item) => item.status === 'Pending'));
  }, []);

  const resetData = useCallback(() => {
    setData(INITIAL_ASSESSMENTS);
    setFilterType('All');
    setSearchQuery('');
  }, []);

  const loadStressTestData = useCallback(() => {
    // Generate 50 items to demonstrate FlatList scaling performance
    const stressItems: AssessmentResult[] = Array.from({ length: 60 }, (_, idx) => {
      const isRecorded = idx % 2 === 0;
      const score = 55 + (idx % 45);
      return {
        id: `stress-${idx}`,
        question: `Coaching Scenario #${idx + 1}: ${
          isRecorded
            ? 'Executive presentation & stakeholder Q&A'
            : 'Constructive performance review feedback memo'
        }`,
        assessmentType: isRecorded ? 'Recorded' : 'Text',
        score,
        status: 'Completed',
        feedback: `AI evaluation for scenario ${idx + 1}: Articulation score was ${score}%. Key focus area is reducing hesitation pauses and structuring recommendations with high clarity.`,
        submittedAt: `Aug ${Math.max(1, 30 - (idx % 28))}, 2:30 PM`,
        duration: isRecorded ? `${1 + (idx % 3)}m ${15 + (idx % 40)}s` : `${150 + idx * 5} words`,
      };
    });
    setData(stressItems);
  }, []);

  return {
    assessments: filteredList,
    totalCount: filteredList.length,
    stats,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    showPending,
    setShowPending,
    isRefreshing,
    onRefresh,
    clearAllCompleted,
    resetData,
    loadStressTestData,
  };
};
