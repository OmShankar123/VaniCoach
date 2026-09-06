import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, useTheme, ms } from '@/shared';
import type { AssessmentFilterType, PerformanceFilterType } from '@/features/assessments/types';

interface AssessmentFilterProps {
  currentFilter: AssessmentFilterType;
  onSelectFilter: (filter: AssessmentFilterType) => void;
  performanceFilter: PerformanceFilterType;
  onSelectPerformanceFilter: (filter: PerformanceFilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showPending: boolean;
  onTogglePending: (show: boolean) => void;
  completedCount: number;
  pendingCount: number;
  onLoadPdfData: () => void;
  onStressTest: () => void;
  onClearCompleted?: () => void;
  onResetData?: () => void;
}

export const AssessmentFilter: React.FC<AssessmentFilterProps> = ({
  currentFilter,
  onSelectFilter,
  performanceFilter,
  onSelectPerformanceFilter,
  searchQuery,
  onSearchChange,
  showPending,
  onTogglePending,
  completedCount,
  pendingCount,
  onLoadPdfData,
  onStressTest,
  onClearCompleted,
}) => {
  const { colors, radius } = useTheme();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debounceTimerRef = useRef<any>(null);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleTextChange = (text: string) => {
    setLocalSearch(text);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      onSearchChange(text);
    }, 180);
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    onSearchChange('');
  };

  const typeOptions: AssessmentFilterType[] = ['All', 'Recorded', 'Text'];
  const gradeOptions: PerformanceFilterType[] = ['All', 'Good', 'Needs Improvement'];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.cardBorder,
            borderRadius: radius.md,
          },
        ]}
      >
        <Ionicons name="search" size={ms(16)} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          value={localSearch}
          onChangeText={handleTextChange}
          placeholder="Search question or AI feedback..."
          placeholderTextColor={colors.textMuted}
          style={[styles.searchInput, { color: colors.text }]}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {localSearch.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close-circle" size={ms(16)} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.statusToggleRow}>
        <TouchableOpacity
          style={[
            styles.statusTab,
            !showPending && [styles.statusTabActive, { borderColor: colors.primary, backgroundColor: colors.surface }],
          ]}
          onPress={() => onTogglePending(false)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={!showPending ? 'checkmark-circle' : 'checkmark-circle-outline'}
            size={ms(14)}
            color={!showPending ? colors.primary : colors.textMuted}
            style={{ marginRight: ms(4) }}
          />
          <AppText
            variant="body"
            weight={!showPending ? '700' : '500'}
            color={!showPending ? colors.primary : colors.textSecondary}
          >
            Completed ({completedCount})
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statusTab,
            showPending && [styles.statusTabActive, { borderColor: colors.needsImprovement, backgroundColor: colors.surface }],
          ]}
          onPress={() => onTogglePending(true)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={showPending ? 'time' : 'time-outline'}
            size={ms(14)}
            color={showPending ? colors.needsImprovement : colors.textMuted}
            style={{ marginRight: ms(4) }}
          />
          <AppText
            variant="body"
            weight={showPending ? '700' : '500'}
            color={showPending ? colors.needsImprovement : colors.textSecondary}
          >
            Pending ({pendingCount})
          </AppText>
        </TouchableOpacity>
      </View>

      {!showPending && (
        <>
          <View style={[styles.typePillRow, { backgroundColor: colors.surfaceElevated }]}>
            {typeOptions.map((type) => {
              const isActive = currentFilter === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typePill,
                    isActive && [styles.typePillActive, { backgroundColor: colors.surface, borderColor: colors.primary }],
                  ]}
                  onPress={() => onSelectFilter(type)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={
                      type === 'All'
                        ? 'grid-outline'
                        : type === 'Recorded'
                        ? 'mic-outline'
                        : 'document-text-outline'
                    }
                    size={ms(13)}
                    color={isActive ? colors.primary : colors.textMuted}
                    style={{ marginRight: ms(4) }}
                  />
                  <AppText
                    variant="caption"
                    weight={isActive ? '700' : '500'}
                    color={isActive ? colors.primary : colors.textSecondary}
                  >
                    {type}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.gradeFilterRow}>
            {gradeOptions.map((grade) => {
              const isActive = performanceFilter === grade;
              const isGood = grade === 'Good';
              const isNeedsImp = grade === 'Needs Improvement';

              return (
                <TouchableOpacity
                  key={grade}
                  style={[
                    styles.gradePill,
                    {
                      backgroundColor: isActive
                        ? isGood
                          ? colors.goodBg
                          : isNeedsImp
                          ? colors.needsImprovementBg
                          : colors.surfaceElevated
                        : colors.surface,
                      borderColor: isActive
                        ? isGood
                          ? colors.good
                          : isNeedsImp
                          ? colors.needsImprovement
                          : colors.primary
                        : colors.cardBorder,
                    },
                  ]}
                  onPress={() => onSelectPerformanceFilter(grade)}
                  activeOpacity={0.7}
                >
                  <AppText
                    variant="caption"
                    weight={isActive ? '700' : '500'}
                    color={
                      isActive
                        ? isGood
                          ? colors.good
                          : isNeedsImp
                          ? colors.needsImprovement
                          : colors.primary
                        : colors.textSecondary
                    }
                  >
                    {grade === 'All' ? 'All Scores' : grade === 'Good' ? 'Good (≥70)' : 'Needs Imp. (<70)'}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

      <View style={styles.actionToolbar}>
        <TouchableOpacity
          onPress={onLoadPdfData}
          style={[styles.actionBtn, { borderColor: colors.primary, backgroundColor: colors.surfaceElevated }]}
          activeOpacity={0.8}
        >
          <Ionicons name="document-attach-outline" size={ms(13)} color={colors.primary} style={{ marginRight: ms(4) }} />
          <AppText variant="caption" weight="600" color={colors.primary}>
            Load PDF Example Scenario
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onStressTest}
          style={[styles.iconActionBtn, { borderColor: colors.cardBorder, backgroundColor: colors.surface }]}
          activeOpacity={0.7}
        >
          <Ionicons name="flash-outline" size={ms(14)} color={colors.textSecondary} />
        </TouchableOpacity>

        {onClearCompleted && completedCount > 0 && (
          <TouchableOpacity
            onPress={onClearCompleted}
            style={[styles.iconActionBtn, { borderColor: colors.cardBorder, backgroundColor: colors.surface }]}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={ms(14)} color={colors.needsImprovement} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: ms(8),
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(12),
    height: ms(40),
    borderWidth: 1,
    marginBottom: ms(10),
  },
  searchIcon: {
    marginRight: ms(8),
  },
  searchInput: {
    flex: 1,
    fontSize: ms(13),
    paddingVertical: 0,
  },
  statusToggleRow: {
    flexDirection: 'row',
    gap: ms(8),
    marginBottom: ms(10),
  },
  statusTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(9),
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: 'transparent',
  },
  statusTabActive: {
    borderWidth: 1.5,
  },
  typePillRow: {
    flexDirection: 'row',
    borderRadius: ms(8),
    padding: ms(3),
    marginBottom: ms(8),
  },
  typePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(6),
    borderRadius: ms(6),
    borderWidth: 1,
    borderColor: 'transparent',
  },
  typePillActive: {
    borderWidth: 1,
  },
  gradeFilterRow: {
    flexDirection: 'row',
    gap: ms(6),
    marginBottom: ms(10),
  },
  gradePill: {
    paddingHorizontal: ms(10),
    paddingVertical: ms(5),
    borderRadius: ms(14),
    borderWidth: 1,
  },
  actionToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(10),
    paddingVertical: ms(6),
    borderRadius: ms(6),
    borderWidth: 1,
  },
  iconActionBtn: {
    padding: ms(7),
    borderRadius: ms(6),
    borderWidth: 1,
  },
});