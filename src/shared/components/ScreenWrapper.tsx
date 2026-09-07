import React, { ReactNode } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  StyleProp,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets, Edge } from "react-native-safe-area-context";
import { useTheme } from "@/shared/theme";

export interface ScreenWrapperProps {
  children: ReactNode;
  edges?: Edge[];
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  header?: ReactNode;
  footer?: ReactNode;
  keyboardAvoiding?: boolean;
  bounces?: boolean;
  showsVerticalScrollIndicator?: boolean;
}

/**
 * Global ScreenWrapper primitive.
 * Standardizes Safe Area insets, Theme background, StatusBar styling,
 * and optional KeyboardAvoidingView across all app screens.
 */
export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  edges = ["top", "left", "right"],
  scrollable = false,
  style,
  contentContainerStyle,
  header,
  footer,
  keyboardAvoiding = Platform.OS === "ios",
  bounces = true,
  showsVerticalScrollIndicator = false,
}) => {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const content = scrollable ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      bounces={bounces}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.staticContent, contentContainerStyle]}>
      {children}
    </View>
  );

  const wrappedContent = keyboardAvoiding ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboardAvoid}
    >
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  const paddingTop = edges.includes("top") ? insets.top : 0;
  const paddingBottom = edges.includes("bottom") ? insets.bottom : 0;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop,
          paddingBottom,
          backgroundColor: colors.background,
        },
        style,
      ]}
    >
      {header}
      {wrappedContent}
      {footer}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  staticContent: {
    flex: 1,
  },
});
