import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, ms } from '@/shared';
import {
  useAssessmentStore,
  AssessmentResultsScreen,
  TakeAssessmentScreen,
  AnalyticsScreen,
} from '@/features';
import { NAVIGATION } from '@/navigation/constants';
import type { TabParamList } from '@/navigation/types';

const Tab = createBottomTabNavigator<TabParamList>();

export function TabNavigator(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const rawAssessments = useAssessmentStore((s) => s.assessments);
  const completedCount = useMemo(() => {
    let count = 0;
    for (let i = 0; i < rawAssessments.length; i++) {
      if (rawAssessments[i].status === 'Completed') count++;
    }
    return count;
  }, [rawAssessments]);

  const bottomInset = Math.max(insets.bottom, ms(8));
  const tabBarHeight = ms(56) + bottomInset;

  return (
    <Tab.Navigator
      initialRouteName={NAVIGATION.RESULTS}
      screenOptions={{
        headerShown: false,
        animation: 'none',
        lazy: false,
        freezeOnBlur: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: isDark ? '#0E152F' : '#FFFFFF',
            borderTopColor: colors.cardBorder,
            height: tabBarHeight,
            paddingBottom: bottomInset,
          },
        ],
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: ms(11),
          marginTop: ms(2),
        },
      }}
    >
      <Tab.Screen
        name={NAVIGATION.RESULTS}
        component={AssessmentResultsScreen}
        options={{
          tabBarLabel: 'Results',
          tabBarBadge: completedCount > 0 ? (completedCount > 99 ? '99+' : completedCount) : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.primary,
            color: colors.textInverse,
            fontSize: ms(9),
            fontWeight: '700',
            minWidth: ms(16),
            height: ms(16),
            borderRadius: ms(8),
            lineHeight: ms(14),
          },
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'clipboard' : 'clipboard-outline'}
              size={size || ms(22)}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name={NAVIGATION.PRACTICE}
        component={TakeAssessmentScreen}
        options={{
          tabBarLabel: 'Practice',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'mic' : 'mic-outline'}
              size={size || ms(22)}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name={NAVIGATION.ANALYTICS}
        component={AnalyticsScreen}
        options={{
          tabBarLabel: 'Analytics',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'bar-chart' : 'bar-chart-outline'}
              size={size || ms(22)}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    paddingTop: ms(6),
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
});