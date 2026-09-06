import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, useTheme, ms } from '@/shared';

interface TextResponseStudioProps {
  value: string;
  onChangeText: (text: string) => void;
  wordCount: number;
}

export const TextResponseStudio: React.FC<TextResponseStudioProps> = ({
  value,
  onChangeText,
  wordCount,
}) => {
  const { colors, radius } = useTheme();

  const isEligible = wordCount >= 5;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={[styles.stepBadge, { backgroundColor: colors.primary }]}>
          <AppText variant="caption" weight="700" color="#FFFFFF">
            3
          </AppText>
        </View>
        <AppText variant="h3">Written Studio</AppText>
      </View>

      <View
        style={[
          styles.tipBox,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.cardBorder,
            borderRadius: radius.md,
          },
        ]}
      >
        <View style={styles.tipHeader}>
          <Ionicons name="bulb-outline" size={ms(14)} color={colors.primary} />
          <AppText
            variant="caption"
            weight="700"
            color={colors.primary}
            style={{ marginLeft: ms(4) }}
          >
            VANI STAR COACHING FRAMEWORK
          </AppText>
        </View>
        <AppText variant="captionMuted">
          Structure your answer: Situation (context) → Task (objective) → Action (your strategy) → Result (measurable impact).
        </AppText>
      </View>

      <View
        style={[
          styles.editorWrapper,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.cardBorder,
            borderRadius: radius.md,
          },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Compose your structured business response here... Include context, resolution, and measurable impact."
          placeholderTextColor={colors.textMuted}
          multiline
          textAlignVertical="top"
          style={[styles.input, { color: colors.text }]}
        />

        <View style={[styles.toolbar, { borderTopColor: colors.cardBorder }]}>
          <View style={styles.counterRow}>
            <Ionicons
              name={isEligible ? 'checkmark-circle' : 'create-outline'}
              size={ms(14)}
              color={isEligible ? colors.good : colors.textMuted}
              style={{ marginRight: ms(4) }}
            />
            <AppText
              variant="caption"
              weight="600"
              color={isEligible ? colors.good : colors.textMuted}
            >
              {wordCount} word{wordCount === 1 ? '' : 's'} {isEligible ? '(Ready for AI)' : '(min. 5 words)'}
            </AppText>
          </View>

          <AppText variant="captionMuted">
            {value.length} characters
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: ms(16),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(12),
  },
  stepBadge: {
    width: ms(22),
    height: ms(22),
    borderRadius: ms(11),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(8),
  },
  tipBox: {
    padding: ms(10),
    borderWidth: 1,
    marginBottom: ms(10),
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(4),
  },
  editorWrapper: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  input: {
    height: ms(140),
    padding: ms(14),
    fontSize: ms(14),
    lineHeight: ms(22),
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(12),
    paddingVertical: ms(10),
    borderTopWidth: 1,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});