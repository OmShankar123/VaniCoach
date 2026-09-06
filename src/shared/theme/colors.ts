// Official Vani.Coach Brand Color Palette
export const colors = {
  light: {
    primary: '#F05A30', // Official Vani signature coral
    primaryLight: '#FDEEEA',
    primaryDark: '#D9451C',
    primaryBorder: '#F9C1B1',
    accent: '#060B1F', // Deep coaching navy
    
    // Performance semantic colors
    good: '#10B981', // Emerald green for Good score (>= 70)
    goodBg: '#ECFDF5',
    goodBorder: '#A7F3D0',
    
    needsImprovement: '#F59E0B', // Amber for Needs Improvement (< 70)
    needsImprovementBg: '#FFFBEB',
    needsImprovementBorder: '#FDE68A',
    
    pending: '#82858F',
    pendingBg: '#F3F4F6',
    
    // Assessment Type Badges
    recorded: '#7C3AED', // Purple for Voice/Recorded
    recordedBg: '#F5F3FF',
    recordedBorder: '#DDD6FE',
    
    textType: '#0284C7', // Sky Blue for Text Assessment
    textTypeBg: '#F0F9FF',
    textTypeBorder: '#BAE6FD',
    
    // Surfaces & Neutrals
    background: '#FAFAFB',
    surface: '#FFFFFF',
    surfaceElevated: '#F4F5F7',
    cardBorder: '#E5E7EB',
    
    text: '#060B1F', // Vani dark navy headline text
    textSecondary: '#44454E',
    textMuted: '#82858F',
    textInverse: '#FFFFFF',
    
    divider: '#F1F2F4',
    shadow: '#060B1F',
  },
  dark: {
    primary: '#FF734C', // High-contrast coral for dark mode
    primaryLight: '#2D1610',
    primaryDark: '#D9451C',
    primaryBorder: '#5E281A',
    accent: '#38BDF8',
    
    good: '#34D399',
    goodBg: 'rgba(16, 185, 129, 0.15)',
    goodBorder: 'rgba(52, 211, 153, 0.3)',
    
    needsImprovement: '#FBBF24',
    needsImprovementBg: 'rgba(245, 158, 11, 0.15)',
    needsImprovementBorder: 'rgba(251, 191, 36, 0.3)',
    
    pending: '#9CA3AF',
    pendingBg: 'rgba(130, 133, 143, 0.2)',
    
    recorded: '#A78BFA',
    recordedBg: 'rgba(124, 58, 237, 0.15)',
    recordedBorder: 'rgba(167, 139, 250, 0.3)',
    
    textType: '#38BDF8',
    textTypeBg: 'rgba(2, 132, 199, 0.15)',
    textTypeBorder: 'rgba(56, 189, 248, 0.3)',
    
    background: '#060B1F', // Vani deep dark navy
    surface: '#0E152F',
    surfaceElevated: '#17203F',
    cardBorder: '#1F2B4D',
    
    text: '#FFFFFF',
    textSecondary: '#CBD5E1',
    textMuted: '#82858F',
    textInverse: '#060B1F',
    
    divider: '#1F2B4D',
    shadow: '#000000',
  },
};

export type ThemeColors = typeof colors.light;