import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider as PaperProvider } from 'react-native-paper';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <PaperProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen
            name="product/[id]"
            options={{
              title: 'Détail du Produit',
              headerShown: false,
            }}
          />
          <Stack.Screen name="cart" options={{ title: 'Panier' }} />
          <Stack.Screen name="add-product" options={{ title: 'Ajouter un produit', headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </PaperProvider>
  );
}
