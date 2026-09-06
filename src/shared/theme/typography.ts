import { TextStyle } from 'react-native';
import { ms } from '@/shared/utils';

export const typography: Record<string, TextStyle> = {
  h1: {
    fontSize: ms(24),
    fontWeight: '700',
    lineHeight: ms(30),
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: ms(20),
    fontWeight: '700',
    lineHeight: ms(26),
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: ms(17),
    fontWeight: '600',
    lineHeight: ms(22),
  },
  subtitle: {
    fontSize: ms(15),
    fontWeight: '500',
    lineHeight: ms(20),
  },
  body: {
    fontSize: ms(14),
    fontWeight: '400',
    lineHeight: ms(20),
  },
  bodyBold: {
    fontSize: ms(14),
    fontWeight: '600',
    lineHeight: ms(20),
  },
  caption: {
    fontSize: ms(12),
    fontWeight: '500',
    lineHeight: ms(16),
  },
  captionMuted: {
    fontSize: ms(11),
    fontWeight: '400',
    lineHeight: ms(15),
  },
  tag: {
    fontSize: ms(11),
    fontWeight: '700',
    lineHeight: ms(14),
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  scoreBig: {
    fontSize: ms(28),
    fontWeight: '800',
    lineHeight: ms(32),
  },
};