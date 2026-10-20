import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Identifiant fixe : programmer à nouveau remplace la notification précédente au lieu d'en empiler
const REST_NOTIFICATION_ID = 'rest-timer';
const REST_CHANNEL_ID = 'rest-timer';

// Les appels sont enchaînés : une annulation ne doit pas passer avant une programmation encore en cours
let queue: Promise<unknown> = Promise.resolve();
const enqueue = (task: () => Promise<unknown>) => {
  queue = queue.then(task).catch((error) => console.warn('Notification de repos', error));
};

/**
 * À appeler une fois au démarrage de l'app.
 * App au premier plan : la fin du repos est déjà signalée par le minuteur, on n'affiche pas la notification.
 */
export function configureNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      const visible = notification.request.identifier !== REST_NOTIFICATION_ID;
      return { shouldPlaySound: false, shouldSetBadge: false, shouldShowBanner: visible, shouldShowList: visible };
    },
  });

  if (Platform.OS === 'android') {
    // Importance haute : la notification s'affiche en bannière, même écran verrouillé
    Notifications.setNotificationChannelAsync(REST_CHANNEL_ID, {
      name: 'Fin du repos',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
    }).catch((error) => console.warn('Canal de notification', error));
  }
}

// Demande l'autorisation la première fois ; ne redemande pas après un refus
async function canNotify() {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted || current.status !== 'undetermined') {
    return current.granted;
  }
  return (await Notifications.requestPermissionsAsync()).granted;
}

// Programme (ou reprogramme) la notification de fin de repos. `endsAt` en millisecondes (Date.now())
export function scheduleRestEnd(endsAt: number) {
  enqueue(async () => {
    if (endsAt <= Date.now() || !(await canNotify())) {
      return;
    }
    await Notifications.scheduleNotificationAsync({
      identifier: REST_NOTIFICATION_ID,
      content: { title: 'Repos terminé', body: 'À vous pour la série suivante !', sound: 'default' },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: new Date(endsAt),
        channelId: REST_CHANNEL_ID,
      },
    });
  });
}

// Annule la notification programmée et retire celle déjà affichée
export function cancelRestEnd() {
  enqueue(async () => {
    await Notifications.cancelScheduledNotificationAsync(REST_NOTIFICATION_ID);
    await Notifications.dismissNotificationAsync(REST_NOTIFICATION_ID);
  });
}
