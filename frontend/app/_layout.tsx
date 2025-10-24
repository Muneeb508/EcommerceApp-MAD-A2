import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <PaperProvider>
      <AuthProvider>
        <CartProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="auth/login" options={{ title: 'Login', headerShown: true }} />
              <Stack.Screen name="auth/signup" options={{ title: 'Sign Up', headerShown: true }} />
              <Stack.Screen name="product/[id]" options={{ title: 'Product Details', headerShown: true }} />
              <Stack.Screen name="checkout" options={{ title: 'Checkout', headerShown: true }} />
              <Stack.Screen name="order-confirmation" options={{ title: 'Order Confirmation', headerShown: true, headerBackVisible: false }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </CartProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
