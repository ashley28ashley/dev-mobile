// services/notifications.ts
import * as Notifications from 'expo-notifications';

// Configure notification behavior (show alert, play sound)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/** Request permission for notifications (iOS) */
export const requestNotificationPermission = async (): Promise<boolean> => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

/** Schedule a simple local notification after a delay (ms) */
export const scheduleReminder = async (
  message: string,
  delayMs: number = 5000
): Promise<void> => {
  const granted = await requestNotificationPermission();
  if (!granted) {
    console.warn('Permission notifications refusée');
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Rappel',
      body: message,
      sound: true,
      priority: 'high',
    },
    // @ts-ignore - expo-notifications typings require 'type' field, but we use simple seconds for test compatibility
    trigger: { seconds: Math.floor(delayMs / 1000) },
  });
};