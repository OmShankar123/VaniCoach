import React, { memo, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@/shared/theme';
import { ms } from '@/shared/utils';

interface AudioWaveformProps {
  isRecording: boolean;
  isPaused: boolean;
  barCount?: number;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = memo(
  ({ isRecording, isPaused, barCount = 11 }) => {
    const { colors } = useTheme();

    const waveScales = useRef(
      Array.from({ length: barCount }, () => new Animated.Value(0.3))
    ).current;

    const animationsRef = useRef<Animated.CompositeAnimation[]>([]);

    useEffect(() => {
      if (isRecording && !isPaused) {
        animationsRef.current = waveScales.map((anim, index) => {
          const duration = 260 + (index % 5) * 60;
          const minScale = 0.25 + (index % 3) * 0.1;
          return Animated.loop(
            Animated.sequence([
              Animated.timing(anim, {
                toValue: 1.0,
                duration,
                useNativeDriver: true,
              }),
              Animated.timing(anim, {
                toValue: minScale,
                duration,
                useNativeDriver: true,
              }),
            ])
          );
        });

        animationsRef.current.forEach((a) => a.start());

        return () => {
          animationsRef.current.forEach((a) => a.stop());
          animationsRef.current = [];
        };
      } else {
        animationsRef.current.forEach((a) => a.stop());
        animationsRef.current = [];
        waveScales.forEach((anim) => {
          anim.stopAnimation();
          anim.setValue(0.3);
        });
      }
    }, [isRecording, isPaused, waveScales]);

    return (
      <View style={[styles.container, { opacity: isRecording ? (isPaused ? 0.35 : 1) : 0.2 }]}>
        {waveScales.map((anim, idx) => (
          <Animated.View
            key={idx}
            style={[
              styles.bar,
              {
                backgroundColor: isRecording
                  ? isPaused
                    ? colors.textMuted
                    : colors.primary
                  : colors.cardBorder,
                transform: [{ scaleY: anim }],
              },
            ]}
          />
        ))}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: ms(56),
    gap: ms(5),
    marginVertical: ms(12),
  },
  bar: {
    width: ms(5),
    height: ms(36),
    borderRadius: ms(3),
  },
});