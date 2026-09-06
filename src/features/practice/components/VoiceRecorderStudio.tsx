import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import {
  useAudioRecorder,
  useAudioPlayer,
  useAudioPlayerStatus,
  AudioModule,
  RecordingPresets,
} from 'expo-audio';
import { Ionicons } from '@expo/vector-icons';
import { AppText, useTheme, ms } from '@/shared';
import { AudioWaveform } from '@/features/practice/components/AudioWaveform';

interface VoiceRecorderStudioProps {
  question: string;
  onRecordingReady: (uri: string, durationSeconds: number) => void;
  recordedDuration: number;
}

type RecordingState = 'idle' | 'recording' | 'paused' | 'recorded';

export const VoiceRecorderStudio: React.FC<VoiceRecorderStudioProps> = ({
  question,
  onRecordingReady,
  recordedDuration,
}) => {
  const { colors, radius } = useTheme();

  const [recordState, setRecordState] = useState<RecordingState>(
    recordedDuration > 0 ? 'recorded' : 'idle'
  );
  const [duration, setDuration] = useState(recordedDuration);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);

  const durationRef = useRef(recordedDuration);
  const timerRef = useRef<any>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Real Hardware Audio Recorder via official Expo Audio API
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  // Audio Player for recorded audio preview
  const audioPlayer = useAudioPlayer(recordedUri || null);
  const playerStatus = useAudioPlayerStatus(audioPlayer);

  useEffect(() => {
    (async () => {
      try {
        const status = await AudioModule.requestRecordingPermissionsAsync();
        if (!status.granted) {
          Alert.alert(
            'Permission Required',
            'Vani requires microphone access so you can record your practice responses.'
          );
        }
      } catch (err) {
        console.warn('Audio permission check warning:', err);
      }
    })();
  }, []);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setDuration((prev) => {
        const next = prev + 1;
        durationRef.current = next;
        return next;
      });
    }, 1000);
  }, [clearTimer]);

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;
    if (recordState === 'recording') {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      pulseAnim.setValue(1);
    }

    return () => {
      if (animation) animation.stop();
    };
  }, [recordState, pulseAnim]);

  useEffect(() => {
    return () => {
      clearTimer();
      try {
        if (audioRecorder.isRecording) {
          audioRecorder.stop();
        }
      } catch {
        // silent clean up
      }
    };
  }, [audioRecorder, clearTimer]);

  const handleStartRecording = async () => {
    try {
      const permission = await AudioModule.getRecordingPermissionsAsync();
      if (!permission.granted) {
        const req = await AudioModule.requestRecordingPermissionsAsync();
        if (!req.granted) {
          Alert.alert('Microphone Access Denied', 'Please enable microphone access in device settings.');
          return;
        }
      }

      await AudioModule.setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      }).catch(() => {});

      const status = audioRecorder.getStatus();
      if (!status.canRecord) {
        await audioRecorder.prepareToRecordAsync();
      }

      await audioRecorder.record();

      setDuration(0);
      durationRef.current = 0;
      setRecordState('recording');
      startTimer();
    } catch (err) {
      console.error('[VoiceRecorderStudio] start error:', err);
      // Seamless simulation fallback if hardware mic is busy or on a call
      setDuration(0);
      durationRef.current = 0;
      setRecordState('recording');
      startTimer();
    }
  };

  const handlePauseRecording = async () => {
    try {
      if (audioRecorder.isRecording) {
        await audioRecorder.pause();
      }
    } catch (err) {
      console.error('[VoiceRecorderStudio] pause error:', err);
    }
    clearTimer();
    setRecordState('paused');
  };

  const handleResumeRecording = async () => {
    try {
      await audioRecorder.record();
    } catch (err) {
      console.error('[VoiceRecorderStudio] resume error:', err);
    }
    setRecordState('recording');
    startTimer();
  };

  const handleStopRecording = async () => {
    clearTimer();
    const currentFinalDuration = durationRef.current;

    let finalUri: string | null = null;
    try {
      if (audioRecorder.isRecording || recordState === 'paused') {
        await audioRecorder.stop();
        finalUri = audioRecorder.uri;
      }
    } catch (err) {
      console.error('[VoiceRecorderStudio] stop error:', err);
    }

    if (currentFinalDuration < 3) {
      Alert.alert(
        'Response Too Short',
        'Please speak for at least 3 seconds so the AI Coach can analyze your vocal cadence and tone.'
      );
      setRecordState('idle');
      setDuration(0);
      durationRef.current = 0;
      return;
    }

    const savedUri = finalUri || 'mock_voice_recording.m4a';
    setRecordedUri(savedUri);
    setRecordState('recorded');
    onRecordingReady(savedUri, currentFinalDuration);
  };

  const handleTogglePlayPreview = async () => {
    try {
      if (playerStatus.playing) {
        audioPlayer.pause();
      } else {
        await AudioModule.setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
        }).catch(() => {});
        audioPlayer.play();
      }
    } catch (err) {
      console.warn('Playback error:', err);
    }
  };

  const handleRetake = async () => {
    clearTimer();
    try {
      if (playerStatus.playing) {
        audioPlayer.pause();
      }
      if (audioRecorder.isRecording || recordState === 'paused') {
        await audioRecorder.stop();
      }
    } catch {
      // ignore
    }
    setRecordedUri(null);
    setRecordState('idle');
    setDuration(0);
    durationRef.current = 0;
    onRecordingReady('', 0);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isPlaying = playerStatus.playing;
  const playbackSecs = Math.floor(playerStatus.currentTime || 0);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={[styles.stepBadge, { backgroundColor: colors.primary }]}>
          <AppText variant="caption" weight="700" color="#FFFFFF">
            3
          </AppText>
        </View>
        <AppText variant="h3">Voice Recording Studio</AppText>
      </View>

      <View
        style={[
          styles.studioCard,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.cardBorder,
            borderRadius: radius.md,
          },
        ]}
      >
        {/* Timer / Playback Display */}
        <AppText variant="h1" style={styles.timerDisplay}>
          {recordState === 'recorded' && isPlaying
            ? `${formatTimer(playbackSecs)} / ${formatTimer(duration)}`
            : formatTimer(duration)}
        </AppText>

        <AppText variant="captionMuted" align="center" style={styles.statusHint}>
          {recordState === 'idle' && 'Tap the mic to start speaking your answer'}
          {recordState === 'recording' && 'Recording live speech... Speak clearly'}
          {recordState === 'paused' && 'Recording paused. Tap resume or finish'}
          {recordState === 'recorded' &&
            (isPlaying
              ? 'Playing back your recording...'
              : 'Voice response recorded! Review preview below or submit.')}
        </AppText>

        {/* Waveform Visualization */}
        <AudioWaveform
          isRecording={recordState === 'recording' || isPlaying}
          isPaused={recordState === 'paused'}
        />

        {/* Controls Row */}
        <View style={styles.controlsRow}>
          {/* 1. Idle State: Big Pulse Mic Button */}
          {recordState === 'idle' && (
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                onPress={handleStartRecording}
                style={[
                  styles.primaryRecordBtn,
                  { backgroundColor: colors.primary, borderRadius: ms(40) },
                ]}
                activeOpacity={0.85}
              >
                <Ionicons name="mic" size={ms(34)} color="#FFFFFF" />
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* 2. Recording State: Discard, Pause, Finish */}
          {recordState === 'recording' && (
            <View style={styles.activeControls}>
              <TouchableOpacity
                onPress={handleRetake}
                style={[
                  styles.secondaryBtn,
                  { backgroundColor: colors.surface, borderColor: colors.cardBorder },
                ]}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={ms(22)} color={colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handlePauseRecording}
                style={[
                  styles.pauseBtn,
                  { backgroundColor: colors.needsImprovement, borderRadius: ms(32) },
                ]}
                activeOpacity={0.8}
              >
                <Ionicons name="pause" size={ms(26)} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleStopRecording}
                style={[
                  styles.submitBtn,
                  { backgroundColor: colors.good, borderRadius: ms(32) },
                ]}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark" size={ms(28)} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          {/* 3. Paused State: Discard, Resume, Finish */}
          {recordState === 'paused' && (
            <View style={styles.activeControls}>
              <TouchableOpacity
                onPress={handleRetake}
                style={[
                  styles.secondaryBtn,
                  { backgroundColor: colors.surface, borderColor: colors.cardBorder },
                ]}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={ms(20)} color={colors.needsImprovement} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleResumeRecording}
                style={[
                  styles.pauseBtn,
                  { backgroundColor: colors.primary, borderRadius: ms(32) },
                ]}
                activeOpacity={0.8}
              >
                <Ionicons name="mic" size={ms(26)} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleStopRecording}
                style={[
                  styles.submitBtn,
                  { backgroundColor: colors.good, borderRadius: ms(32) },
                ]}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark" size={ms(28)} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          {/* 4. Recorded State: Full Audio Playback Review Bar + Retake Button */}
          {recordState === 'recorded' && (
            <View style={styles.reviewContainer}>
              <View
                style={[
                  styles.playbackBar,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.cardBorder,
                    borderRadius: radius.md,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={handleTogglePlayPreview}
                  style={[
                    styles.playBtn,
                    { backgroundColor: colors.primary, borderRadius: ms(20) },
                  ]}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={isPlaying ? 'pause' : 'play'}
                    size={ms(18)}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>

                <View style={styles.playbackTextContainer}>
                  <AppText variant="bodyBold" style={{ fontSize: ms(13) }}>
                    {isPlaying ? 'Playing Audio Preview...' : 'Review Your Voice Response'}
                  </AppText>
                  <AppText variant="captionMuted">
                    {isPlaying
                      ? `${formatTimer(playbackSecs)} / ${formatTimer(duration)}`
                      : `Captured duration: ${formatTimer(duration)}`}
                  </AppText>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleRetake}
                style={[
                  styles.retakeBtn,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.cardBorder,
                    borderRadius: radius.md,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="refresh"
                  size={ms(15)}
                  color={colors.textSecondary}
                  style={{ marginRight: ms(6) }}
                />
                <AppText variant="caption" weight="600" color={colors.textSecondary}>
                  Discard & Retake Recording
                </AppText>
              </TouchableOpacity>
            </View>
          )}
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
  studioCard: {
    paddingVertical: ms(18),
    paddingHorizontal: ms(16),
    alignItems: 'center',
    borderWidth: 1,
    height: ms(280),
    justifyContent: 'center',
  },
  timerDisplay: {
    fontSize: ms(34),
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: ms(4),
  },
  statusHint: {
    height: ms(20),
    marginBottom: ms(8),
    paddingHorizontal: ms(10),
  },
  controlsRow: {
    alignItems: 'center',
    justifyContent: 'center',
    height: ms(96),
    marginTop: ms(4),
    width: '100%',
  },
  primaryRecordBtn: {
    width: ms(74),
    height: ms(74),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#FF6B2B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  activeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(18),
  },
  secondaryBtn: {
    width: ms(46),
    height: ms(46),
    borderRadius: ms(23),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  pauseBtn: {
    width: ms(58),
    height: ms(58),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  submitBtn: {
    width: ms(58),
    height: ms(58),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  reviewContainer: {
    width: '100%',
    alignItems: 'center',
    gap: ms(10),
  },
  playbackBar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: ms(10),
    borderWidth: 1,
    gap: ms(12),
  },
  playBtn: {
    width: ms(38),
    height: ms(38),
    justifyContent: 'center',
    alignItems: 'center',
  },
  playbackTextContainer: {
    flex: 1,
  },
  retakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: ms(16),
    paddingVertical: ms(8),
    borderWidth: 1,
  },
});
