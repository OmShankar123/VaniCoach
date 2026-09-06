import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/shared/theme';
import { ms } from '@/shared/utils';
import { AppText } from '@/shared/components/AppText';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { colors, spacing, toggleTheme, isDark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: spacing.base,
          paddingTop: spacing.md,
          paddingBottom: spacing.sm,
          backgroundColor: colors.background,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          {/* Official Vani.Coach Logo */}
          <View style={styles.logoRow}>
            <View
              style={[
                styles.logoBadge,
                isDark && styles.logoBadgeDark,
              ]}
            >
              <Image
                source={require('@/assets/images/vani-logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
                accessibilityLabel="Vani Coach Logo"
              />
            </View>
            <View style={[styles.statusDot, { backgroundColor: colors.good }]} />
            <AppText variant="captionMuted" style={{ fontSize: ms(10), letterSpacing: 0.5 }}>
              AI COACH ACTIVE
            </AppText>
          </View>

          <AppText variant="h1">{title}</AppText>
          {subtitle && (
            <AppText variant="subtitle" color={colors.textSecondary} style={{ marginTop: spacing.xxs }}>
              {subtitle}
            </AppText>
          )}
        </View>

        <TouchableOpacity
          onPress={toggleTheme}
          activeOpacity={0.7}
          style={[
            styles.themeButton,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.cardBorder,
            },
          ]}
          accessibilityLabel="Toggle dark/light theme"
          accessibilityRole="button"
        >
          <Ionicons
            name={isDark ? 'sunny-outline' : 'moon-outline'}
            size={ms(20)}
            color={isDark ? colors.needsImprovement : colors.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textContainer: {
    flex: 1,
    paddingRight: ms(12),
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(8),
    gap: ms(6),
  },
  logoBadge: {
    paddingHorizontal: ms(4),
    paddingVertical: ms(2),
    borderRadius: ms(6),
  },
  logoBadgeDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  logoImage: {
    width: ms(88),
    height: ms(24),
  },
  statusDot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
    marginLeft: ms(2),
  },
  themeButton: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});