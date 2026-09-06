import React from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, useTheme, ms } from '@/shared';

interface QuestionPickerProps {
  questions: string[];
  selectedQuestion: string;
  onSelectQuestion: (question: string) => void;
  customQuestion: string;
  onChangeCustomQuestion: (text: string) => void;
  isCustomMode: boolean;
  onToggleCustomMode: (custom: boolean) => void;
}

export const QuestionPicker: React.FC<QuestionPickerProps> = ({
  questions,
  selectedQuestion,
  onSelectQuestion,
  customQuestion,
  onChangeCustomQuestion,
  isCustomMode,
  onToggleCustomMode,
}) => {
  const { colors, radius } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={[styles.stepBadge, { backgroundColor: colors.primary }]}>
          <AppText variant="caption" weight="700" color="#FFFFFF">
            1
          </AppText>
        </View>
        <AppText variant="h3">Select Practice Question</AppText>
      </View>

      <View style={[styles.modeToggleRow, { backgroundColor: colors.surfaceElevated }]}>
        <TouchableOpacity
          style={[
            styles.modeTab,
            !isCustomMode && [
              styles.modeTabActive,
              { backgroundColor: colors.surface, borderColor: colors.primary },
            ],
          ]}
          onPress={() => onToggleCustomMode(false)}
          activeOpacity={0.8}
        >
          <Ionicons
            name="list-outline"
            size={ms(14)}
            color={!isCustomMode ? colors.primary : colors.textMuted}
            style={{ marginRight: ms(6) }}
          />
          <AppText
            variant="caption"
            weight={!isCustomMode ? '700' : '500'}
            color={!isCustomMode ? colors.primary : colors.textSecondary}
          >
            Preset Questions
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeTab,
            isCustomMode && [
              styles.modeTabActive,
              { backgroundColor: colors.surface, borderColor: colors.primary },
            ],
          ]}
          onPress={() => onToggleCustomMode(true)}
          activeOpacity={0.8}
        >
          <Ionicons
            name="create-outline"
            size={ms(14)}
            color={isCustomMode ? colors.primary : colors.textMuted}
            style={{ marginRight: ms(6) }}
          />
          <AppText
            variant="caption"
            weight={isCustomMode ? '700' : '500'}
            color={isCustomMode ? colors.primary : colors.textSecondary}
          >
            Custom Question
          </AppText>
        </TouchableOpacity>
      </View>

      {!isCustomMode ? (
        <View style={styles.list}>
          {questions.map((question, index) => {
            const isSelected = question === selectedQuestion;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.questionItem,
                  {
                    backgroundColor: isSelected ? colors.surfaceElevated : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.cardBorder,
                    borderRadius: radius.md,
                  },
                  isSelected && styles.questionItemSelected,
                ]}
                onPress={() => onSelectQuestion(question)}
                activeOpacity={0.7}
              >
                <View style={styles.radioWrapper}>
                  <Ionicons
                    name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                    size={ms(18)}
                    color={isSelected ? colors.primary : colors.textMuted}
                  />
                </View>
                <AppText
                  variant="body"
                  weight={isSelected ? '700' : '500'}
                  color={isSelected ? colors.text : colors.textSecondary}
                  style={styles.questionText}
                >
                  {question}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View
          style={[
            styles.customInputBox,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.cardBorder,
              borderRadius: radius.md,
            },
          ]}
        >
          <TextInput
            value={customQuestion}
            onChangeText={onChangeCustomQuestion}
            placeholder="Type your custom interview question or communication scenario..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={3}
            style={[styles.customTextInput, { color: colors.text }]}
          />
        </View>
      )}
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
  modeToggleRow: {
    flexDirection: 'row',
    borderRadius: ms(8),
    padding: ms(3),
    marginBottom: ms(10),
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(7),
    borderRadius: ms(6),
    borderWidth: 1,
    borderColor: 'transparent',
  },
  modeTabActive: {
    borderWidth: 1,
  },
  list: {
    gap: ms(8),
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ms(12),
    paddingHorizontal: ms(14),
    borderWidth: 1,
  },
  questionItemSelected: {
    borderWidth: 1.5,
  },
  radioWrapper: {
    marginRight: ms(10),
  },
  questionText: {
    flex: 1,
    lineHeight: ms(20),
  },
  customInputBox: {
    borderWidth: 1,
    padding: ms(12),
  },
  customTextInput: {
    fontSize: ms(14),
    minHeight: ms(60),
    textAlignVertical: 'top',
  },
});