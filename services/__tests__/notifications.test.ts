import * as Notifications from 'expo-notifications';
import { requestNotificationPermission, scheduleReminder } from '../../services/notifications';

jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notification-id'),
  setNotificationHandler: jest.fn(),
  SchedulableTriggerInputTypes: { TIME_INTERVAL: 'timeInterval' },
}));

describe('notifications utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should request permission and return granted', async () => {
    const granted = await requestNotificationPermission();
    expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
    expect(granted).toBe(true);
  });

  it('should schedule a reminder when permission granted', async () => {
    const granted = await requestNotificationPermission();
    expect(granted).toBe(true);

    await scheduleReminder('Test reminder', 2000);

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
      content: expect.objectContaining({
        title: 'Rappel',
        body: 'Test reminder',
        sound: true,
        priority: 'high',
      }),
      trigger: expect.objectContaining({ seconds: 2 }),
    });
  });
});
