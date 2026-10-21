import { useEffect, useState } from 'react';

import { ThemedText } from '@/src/components/themed-text';
import { formatDuration } from '@/src/utils/duration';

/**
 * Temps de repos restant (`endsAt` en millisecondes), affiché hors de l'écran de séance ; disparaît à la fin du repos.
 */
export function RestCountdown({ endsAt }: { endsAt: number }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(interval);
  }, []);

  const remaining = Math.ceil((endsAt - now) / 1000);
  if (remaining <= 0) {
    return null;
  }
  return (
    <ThemedText type="defaultSemiBold" tone="accent" accessibilityRole="timer">
      Repos · {formatDuration(remaining)}
    </ThemedText>
  );
}
