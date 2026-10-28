import { Bell, BellOff } from 'lucide-react-native/icons';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Linking, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/src/components/themed-text';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { palette, spacing } from '@/src/constants/theme';
import {
  getNotificationAccess,
  NotificationAccess,
  requestNotificationAccess,
} from '@/src/services/rest-notification';

/**
 * État de l'autorisation des notifications de fin de repos, avec l'action possible : demander l'autorisation tant
 * que le système le permet, sinon ouvrir les réglages de l'app dans ceux du téléphone (après un refus sur iOS).
 */
export function NotificationSetting() {
  const [access, setAccess] = useState<NotificationAccess | null>(null);

  const refresh = useCallback(() => {
    getNotificationAccess()
      .then(setAccess)
      .catch(() => setAccess(null));
  }, []);

  // Relu au retour dans l'app : l'autorisation a pu être changée dans les réglages du téléphone
  useEffect(() => {
    refresh();
    const subscription = AppState.addEventListener('change', (state) => state === 'active' && refresh());
    return () => subscription.remove();
  }, [refresh]);

  if (!access) {
    return null;
  }

  const Icon = access.granted ? Bell : BellOff;

  return (
    <Card style={styles.card}>
      <View style={styles.status}>
        <Icon size={20} color={access.granted ? palette.accent : palette.textSecondary} strokeWidth={2} pointerEvents="none" />
        <View style={styles.statusText}>
          <ThemedText type="defaultSemiBold">{access.granted ? 'Autorisées' : 'Désactivées'}</ThemedText>
          <ThemedText type="caption">
            {access.granted
              ? 'Une notification vous prévient à la fin du repos, même téléphone verrouillé.'
              : 'Sans notification, la fin du repos n’est signalée que si l’app est ouverte.'}
          </ThemedText>
        </View>
      </View>
      {!access.granted &&
        (access.canAsk ? (
          <Button
            title="Autoriser les notifications"
            variant="secondary"
            icon={Bell}
            onPress={() => requestNotificationAccess().then(setAccess).catch(refresh)}
          />
        ) : (
          <Button title="Ouvrir les réglages du téléphone" variant="secondary" onPress={() => Linking.openSettings()} />
        ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  statusText: {
    flex: 1,
    gap: 2,
  },
});
