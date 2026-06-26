// components/TestNotificationButton.tsx
import React from 'react';
import { Button } from 'react-native';
import { scheduleReminder } from '../services/notifications';

type Props = {
  /** Message de la notification */
  message: string;
  /** Délai avant affichage (ms) */
  delayMs?: number;
};

/** Bouton de démonstration qui planifie une notification locale */
export const TestNotificationButton: React.FC<Props> = ({
  message,
  delayMs = 2000,
}) => {
  const onPress = async () => {
    try {
      await scheduleReminder(message, delayMs);
    } catch (e) {
      console.warn(e);
    }
  };

  return <Button title="Planifier rappel" onPress={onPress} testID="scheduleBtn" />;
};
export default TestNotificationButton;
