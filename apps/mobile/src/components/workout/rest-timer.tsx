import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/src/components/themed-text';
import { fontFamily, palette, radius } from '@/src/constants/theme';
import { formatDuration } from '@/src/utils/duration';

type RestTimerProps = {
  // Fin du repos, en millisecondes (Date.now())
  endsAt: number;
  // Durée totale du repos en secondes, pour la barre de progression
  duration: number;
  onAdjust: (deltaSeconds: number) => void;
  // Repos terminé ou passé
  onEnd: () => void;
};

export function RestTimer({ endsAt, duration, onAdjust, onEnd }: RestTimerProps) {
  const [now, setNow] = useState(() => Date.now());
  const remaining = Math.max(0, Math.ceil((endsAt - now) / 1000));

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (remaining === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onEnd();
    }
  }, [remaining, onEnd]);

  const progress = duration > 0 ? Math.min(1, remaining / duration) : 0;

  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <View style={styles.row}>
        <View style={styles.time}>
          <ThemedText type="label">Repos</ThemedText>
          <ThemedText style={styles.timeText} accessibilityRole="timer">
            {formatDuration(remaining)}
          </ThemedText>
        </View>
        <Pressable
          onPress={() => onAdjust(-15)}
          accessibilityRole="button"
          accessibilityLabel="Retirer 15 secondes"
          style={({ pressed }) => [styles.adjust, pressed && styles.pressed]}>
          <ThemedText type="defaultSemiBold">−15 s</ThemedText>
        </Pressable>
        <Pressable
          onPress={() => onAdjust(15)}
          accessibilityRole="button"
          accessibilityLabel="Ajouter 15 secondes"
          style={({ pressed }) => [styles.adjust, pressed && styles.pressed]}>
          <ThemedText type="defaultSemiBold">+15 s</ThemedText>
        </Pressable>
        <Pressable
          onPress={onEnd}
          accessibilityRole="button"
          style={({ pressed }) => [styles.skip, pressed && styles.pressed]}>
          <ThemedText type="defaultSemiBold" tone="onAccent">
            Passer
          </ThemedText>
        </Pressable>
      </View>
      <View style={styles.track}>
        <View style={[styles.bar, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    padding: 14,
    paddingLeft: 18,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surfaceRaised,
    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  time: {
    flex: 1,
  },
  timeText: {
    fontFamily: fontFamily.displayBold,
    fontSize: 36,
    lineHeight: 40,
    fontVariant: ['tabular-nums'],
  },
  adjust: {
    width: 56,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.border,
  },
  skip: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.accent,
  },
  pressed: {
    opacity: 0.8,
  },
  track: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: palette.border,
  },
  bar: {
    height: '100%',
    backgroundColor: palette.accent,
  },
});
