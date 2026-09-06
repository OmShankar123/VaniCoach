import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useTheme } from '@/shared';
import { navigationRef } from '@/navigation/navigationRef';
import { TabNavigator } from '@/navigation/TabNavigator';

export function AppNavigator(): React.JSX.Element {
  const { isDark, colors } = useTheme();

  const navTheme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: colors.background,
          card: '#0E152F',
          text: colors.text,
          border: colors.cardBorder,
          primary: colors.primary,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: colors.background,
          card: '#FFFFFF',
          text: colors.text,
          border: colors.cardBorder,
          primary: colors.primary,
        },
      };

  return (
    <NavigationContainer ref={navigationRef} theme={navTheme}>
      <TabNavigator />
    </NavigationContainer>
  );
}