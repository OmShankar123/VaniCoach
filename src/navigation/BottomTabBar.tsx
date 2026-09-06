import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, AppText, ms } from '@/shared';
import { useAssessmentStore, type TabType } from '@/features/assessments';

interface TabItemConfig {
  key: TabType;
  label: string;
  iconActive: keyof typeof Ionicons.glyphMap;
  iconInactive: keyof typeof Ionicons.glyphMap;
  badge?: number;
}

export const BottomTabBar: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const activeTab = useAssessmentStore((s) => s.activeTab);
  const setActiveTab = useAssessmentStore((s) => s.setActiveTab);
  const completedCount = useAssessmentStore(
    (s) => s.assessments.filter((a) => a.status === 'Completed').length
  );

  const tabs: TabItemConfig[] = [
    {
      key: 'results',
      label: 'Results',
      iconActive: 'clipboard',
      iconInactive: 'clipboard-outline',
      badge: completedCount > 0 ? completedCount : undefined,
    },
    {
      key: 'practice',
      label: 'Practice',
      iconActive: 'mic',
      iconInactive: 'mic-outline',
    },
    {
      key: 'analytics',
      label: 'Analytics',
      iconActive: 'bar-chart',
      iconInactive: 'bar-chart-outline',
    },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#0E152F' : '#FFFFFF',
          borderTopColor: colors.cardBorder,
          paddingBottom: Math.max(insets.bottom, ms(8)),
        },
      ]}
    >
      <View style={styles.tabBarInner}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const isPractice = tab.key === 'practice';

          if (isPractice) {
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.85}
                style={styles.centerTabContainer}
                accessibilityRole="button"
                accessibilityLabel={tab.label}
              >
                <View
                  style={[
                    styles.centerButton,
                    {
                      backgroundColor: colors.primary,
                      borderColor: isDark ? '#060B1F' : '#FFFFFF',
                      shadowColor: colors.primary,
                    },
                  ]}
                >
                  <Ionicons name="mic" size={ms(24)} color={colors.textInverse} />
                </View>
                <AppText
                  variant="caption"
                  weight={isActive ? '700' : '600'}
                  style={{
                    color: isActive ? colors.primary : colors.textSecondary,
                    marginTop: ms(2),
                    fontSize: ms(11),
                  }}
                >
                  {tab.label}
                </AppText>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
              style={styles.tabItem}
              accessibilityRole="button"
              accessibilityLabel={tab.label}
            >
              <View style={styles.iconWrapper}>
                <Ionicons
                  name={isActive ? tab.iconActive : tab.iconInactive}
                  size={ms(22)}
                  color={isActive ? colors.primary : colors.textMuted}
                />
                {tab.badge !== undefined && (
                  <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                    <AppText
                      variant="caption"
                      weight="700"
                      style={{
                        color: colors.textInverse,
                        fontSize: ms(9),
                        lineHeight: ms(12),
                      }}
                    >
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </AppText>
                  </View>
                )}
              </View>
              <AppText
                variant="caption"
                weight={isActive ? '700' : '500'}
                style={{
                  color: isActive ? colors.primary : colors.textSecondary,
                  fontSize: ms(11),
                }}
              >
                {tab.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingTop: ms(6),
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  tabBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(4),
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ms(2),
  },
  badge: {
    position: 'absolute',
    top: -ms(4),
    right: -ms(10),
    paddingHorizontal: ms(4),
    paddingVertical: ms(1),
    borderRadius: ms(8),
    minWidth: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -ms(14),
  },
  centerButton: {
    width: ms(50),
    height: ms(50),
    borderRadius: ms(25),
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
});