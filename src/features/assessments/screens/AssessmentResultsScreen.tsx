import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { Header, AppText, useTheme, ms } from '@/shared';
import {
  AssessmentCard,
  AssessmentStats,
  AssessmentFilter,
  EmptyState,
} from '@/features/assessments/components';
import { useAssessmentStore } from '@/features/assessments/store';
import type { AssessmentResult, AssessmentStatsSummary } from '@/features/assessments/types';

const PAGE_SIZE = 4;

export const AssessmentResultsScreen: React.FC = () => {
  const { colors, spacing } = useTheme();

  const rawAssessments = useAssessmentStore((s) => s.assessments);
  const filterType = useAssessmentStore((s) => s.filterType);
  const performanceFilter = useAssessmentStore((s) => s.performanceFilter);
  const searchQuery = useAssessmentStore((s) => s.searchQuery);
  const showPending = useAssessmentStore((s) => s.showPending);
  const isRefreshing = useAssessmentStore((s) => s.isRefreshing);

  const setFilterType = useAssessmentStore((s) => s.setFilterType);
  const setPerformanceFilter = useAssessmentStore((s) => s.setPerformanceFilter);
  const setSearchQuery = useAssessmentStore((s) => s.setSearchQuery);
  const setShowPending = useAssessmentStore((s) => s.setShowPending);
  const triggerRefresh = useAssessmentStore((s) => s.triggerRefresh);
  const clearAllCompleted = useAssessmentStore((s) => s.clearAllCompleted);
  const loadPdfExampleData = useAssessmentStore((s) => s.loadPdfExampleData);
  const generateStressTestData = useAssessmentStore((s) => s.generateStressTestData);
  const evaluatePendingAssessment = useAssessmentStore((s) => s.evaluatePendingAssessment);
  const appendMockBatch = useAssessmentStore((s) => s.appendMockBatch);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  const { filteredList, stats } = useMemo(() => {
    let completedCount = 0;
    let pendingCount = 0;
    let sumScore = 0;
    let goodCount = 0;
    let needsImprovementCount = 0;

    const query = searchQuery.trim().toLowerCase();
    const resultList: AssessmentResult[] = [];

    for (let i = 0; i < rawAssessments.length; i++) {
      const item = rawAssessments[i];

      if (item.status === 'Completed') {
        completedCount++;
        if (item.score !== null) {
          sumScore += item.score;
          if (item.score >= 70) goodCount++;
          else needsImprovementCount++;
        }
      } else {
        pendingCount++;
      }

      if (!showPending && item.status === 'Pending') continue;
      if (showPending && item.status !== 'Pending') continue;
      if (filterType !== 'All' && item.assessmentType !== filterType) continue;

      if (performanceFilter !== 'All') {
        if (item.status === 'Pending') continue;
        const isGood = (item.score ?? 0) >= 70;
        if (performanceFilter === 'Good' && !isGood) continue;
        if (performanceFilter === 'Needs Improvement' && isGood) continue;
      }

      if (query.length > 0) {
        const matchQ = item.question.toLowerCase().includes(query);
        const matchF = item.feedback?.toLowerCase().includes(query);
        if (!matchQ && !matchF) continue;
      }

      resultList.push(item);
    }

    const summary: AssessmentStatsSummary = {
      totalAttempted: completedCount + pendingCount,
      completedCount,
      pendingCount,
      averageScore: completedCount > 0 ? Math.round(sumScore / completedCount) : 0,
      goodCount,
      needsImprovementCount,
    };

    return {
      filteredList: resultList,
      stats: summary,
    };
  }, [rawAssessments, filterType, performanceFilter, searchQuery, showPending]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, filterType, performanceFilter, showPending]);

  const pagedList = useMemo(() => {
    if (visibleCount >= filteredList.length) return filteredList;
    return filteredList.slice(0, visibleCount);
  }, [filteredList, visibleCount]);

  const handleEndReached = useCallback(() => {
    // 1. If more items already exist in local store, reveal next chunk
    if (visibleCount < filteredList.length) {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredList.length));
      return;
    }

    // 2. Continuous infinite scroll: simulate realistic API latency and append next batch
    if (isLoadingMore) return;
    setIsLoadingMore(true);

    setTimeout(() => {
      appendMockBatch(4, showPending);
      setVisibleCount((prev) => prev + 4);
      setIsLoadingMore(false);
    }, 650);
  }, [visibleCount, filteredList.length, isLoadingMore, appendMockBatch, showPending]);

  const handleEvaluate = useCallback(
    (id: string) => {
      evaluatePendingAssessment(id);
    },
    [evaluatePendingAssessment]
  );

  const renderItem: ListRenderItem<AssessmentResult> = useCallback(
    ({ item }) => <AssessmentCard item={item} onEvaluate={handleEvaluate} />,
    [handleEvaluate]
  );

  const keyExtractor = useCallback((item: AssessmentResult) => item.id, []);

  const ListHeader = useMemo(
    () => (
      <View style={styles.headerBlock}>
        {!showPending && <AssessmentStats stats={stats} />}
        <AssessmentFilter
          currentFilter={filterType}
          onSelectFilter={setFilterType}
          performanceFilter={performanceFilter}
          onSelectPerformanceFilter={setPerformanceFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showPending={showPending}
          onTogglePending={setShowPending}
          completedCount={stats.completedCount}
          pendingCount={stats.pendingCount}
          onLoadPdfData={loadPdfExampleData}
          onStressTest={() => generateStressTestData(50)}
          onClearCompleted={clearAllCompleted}
        />
        <View style={styles.resultsMetaBar}>
          <AppText variant="captionMuted">
            Showing {pagedList.length} of {filteredList.length} assessments
          </AppText>
          {rawAssessments.length >= 100 && (
            <View style={[styles.largeDataBadge, { backgroundColor: colors.surfaceElevated }]}>
              <AppText variant="caption" color={colors.primary} style={styles.badgeText}>
                ⚡ {rawAssessments.length} Total Loaded
              </AppText>
            </View>
          )}
        </View>
      </View>
    ),
    [
      showPending,
      stats,
      filterType,
      performanceFilter,
      searchQuery,
      pagedList.length,
      filteredList.length,
      rawAssessments.length,
      colors,
      setFilterType,
      setPerformanceFilter,
      setSearchQuery,
      setShowPending,
      loadPdfExampleData,
      generateStressTestData,
      clearAllCompleted,
    ]
  );

  const ListEmpty = useMemo(
    () => (
      <EmptyState
        onAction={loadPdfExampleData}
        isPendingMode={showPending}
        onLoadPdfData={loadPdfExampleData}
      />
    ),
    [loadPdfExampleData, showPending]
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <Header
        title="Assessment Results"
        subtitle={
          showPending
            ? 'Reviewing submissions awaiting AI evaluation'
            : 'AI-evaluated communication coaching feedback'
        }
      />

      <View style={styles.listContainer}>
        <FlashList
          data={pagedList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ListEmpty}
          contentContainerStyle={[
            styles.contentContainer,
            { paddingBottom: spacing.xxxl },
          ]}
          showsVerticalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={triggerRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListFooterComponent={
            isLoadingMore || visibleCount < filteredList.length ? (
              <View style={styles.loadingFooter}>
                <ActivityIndicator size="small" color={colors.primary} />
                <AppText variant="captionMuted" style={{ marginLeft: ms(8) }}>
                  Loading more assessments...
                </AppText>
              </View>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: ms(16),
  },
  headerBlock: {
    marginTop: ms(8),
    marginBottom: ms(8),
  },
  resultsMetaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(4),
    marginTop: ms(10),
    marginBottom: ms(4),
  },
  largeDataBadge: {
    paddingHorizontal: ms(8),
    paddingVertical: ms(2),
    borderRadius: ms(12),
  },
  badgeText: {
    fontSize: ms(11),
    fontWeight: '700',
  },
  loadingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(16),
  },
});
