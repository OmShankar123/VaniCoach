import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ListRenderItem,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../shared/theme';
import { Header } from '../../../shared/components/Header';
import { AssessmentCard } from '../components/AssessmentCard';
import { AssessmentStats } from '../components/AssessmentStats';
import { AssessmentFilter } from '../components/AssessmentFilter';
import { EmptyState } from '../components/EmptyState';
import { useAssessments } from '../hooks/useAssessments';
import { AssessmentResult } from '../types/assessment';
import { ms } from '../../../shared/utils/scale';

export const AssessmentResultsScreen: React.FC = () => {
  const { colors, spacing } = useTheme();

  const {
    assessments,
    stats,
    filterType,
    setFilterType,
    showPending,
    setShowPending,
    isRefreshing,
    onRefresh,
    clearAllCompleted,
    resetData,
    loadStressTestData,
  } = useAssessments();

  // Performance Optimization: Memoized keyExtractor
  const keyExtractor = useCallback((item: AssessmentResult) => item.id, []);

  // Performance Optimization: Memoized renderItem
  const renderItem: ListRenderItem<AssessmentResult> = useCallback(
    ({ item }) => <AssessmentCard item={item} />,
    []
  );

  // Memoized Header component containing Stats and Filter Controls
  const renderListHeader = useCallback(() => {
    return (
      <View style={styles.headerContainer}>
        {/* Summary Metric Cards */}
        {!showPending && <AssessmentStats stats={stats} />}

        {/* Filter Tabs & Test Actions */}
        <AssessmentFilter
          currentFilter={filterType}
          onSelectFilter={setFilterType}
          showPending={showPending}
          onTogglePending={() => setShowPending((prev) => !prev)}
          onClearCompleted={clearAllCompleted}
          onResetData={resetData}
          onStressTest={loadStressTestData}
        />
      </View>
    );
  }, [
    showPending,
    stats,
    filterType,
    setFilterType,
    setShowPending,
    clearAllCompleted,
    resetData,
    loadStressTestData,
  ]);

  // Memoized Empty Component
  const renderEmptyComponent = useCallback(() => {
    return <EmptyState onReset={resetData} isPendingMode={showPending} />;
  }, [resetData, showPending]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      {/* Fixed Screen Header */}
      <Header
        title="Assessment Results"
        subtitle={
          showPending
            ? 'Reviewing submissions awaiting AI evaluation'
            : 'AI-evaluated communication coaching feedback'
        }
      />

      {/* Optimized Virtualized FlatList */}
      <FlatList
        data={assessments}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingHorizontal: spacing.base,
            paddingBottom: spacing.xxxl,
          },
        ]}
        showsVerticalScrollIndicator={false}
        // FlatList Performance tuning for large data sets
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={Platform.OS !== 'web'}
        updateCellsBatchingPeriod={50}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    marginTop: ms(8),
  },
  listContent: {
    flexGrow: 1,
  },
});
