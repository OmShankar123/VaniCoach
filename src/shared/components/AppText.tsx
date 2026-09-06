import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '@/shared/theme';

export interface AppTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'subtitle' | 'body' | 'bodyBold' | 'caption' | 'captionMuted' | 'tag' | 'scoreBig';
  color?: string;
  weight?: TextStyle['fontWeight'];
  align?: TextStyle['textAlign'];
}

export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color,
  weight,
  align,
  style,
  children,
  ...props
}) => {
  const { typography, colors } = useTheme();

  const baseStyle = typography[variant] || typography.body;
  const computedColor =
    color ||
    (variant === 'captionMuted'
      ? colors.textMuted
      : variant === 'subtitle'
      ? colors.textSecondary
      : colors.text);

  return (
    <Text
      style={[
        baseStyle,
        { color: computedColor },
        weight ? { fontWeight: weight } : null,
        align ? { textAlign: align } : null,
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};