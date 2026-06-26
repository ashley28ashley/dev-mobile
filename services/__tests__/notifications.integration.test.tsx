import * as Notifications from 'expo-notifications';
import { scheduleReminder } from '../../services/notifications';

jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notification-id'),
  setNotificationHandler: jest.fn(),
  SchedulableTriggerInputTypes: { TIME_INTERVAL: 'timeInterval' },
}));

describe('Integration - Notification via UI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('planifie une notification lorsque le bouton est presse', async () => {
    const message = 'Rappel test';
    const delay = 3000;

    await scheduleReminder(message, delay);

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(1);

    const callArg = (Notifications.scheduleNotificationAsync as jest.Mock).mock.calls[0][0];
    expect(callArg).toMatchObject({
      content: {
        title: 'Rappel',
        body: message,
        sound: true,
        priority: 'high',
      },
      trigger: expect.objectContaining({ seconds: Math.floor(delay / 1000) }),
    });
  });
});
