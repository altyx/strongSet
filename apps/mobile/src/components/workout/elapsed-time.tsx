import { useEffect, useState } from 'react';
import { type StyleProp, type TextStyle } from 'react-native';

import { ThemedText } from '@/src/components/themed-text';
import { formatDuration } from '@/src/utils/duration';

/**
 * Durée écoulée depuis `startedAt` (timestamp en secondes), mise à jour chaque seconde.
 * Isolée dans son composant pour ne pas re-rendre tout l'écran à chaque tic.
 */
export function ElapsedTime({ startedAt, style }: { startedAt: number; style?: StyleProp<TextStyle> }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemedText type="metric" style={style} accessibilityRole="timer">
      {formatDuration(now / 1000 - startedAt)}
    </ThemedText>
  );
}
