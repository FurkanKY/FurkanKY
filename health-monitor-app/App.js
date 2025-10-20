import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/utils/constants';

/**
 * Ana uygulama bileşeni
 * Main application component
 */
export default function App() {
  // React Native Paper teması özelleştir
  const theme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: COLORS.primary,
      secondary: COLORS.secondary,
      error: COLORS.danger,
      background: COLORS.background,
      surface: COLORS.card,
      onSurface: COLORS.text,
      onSurfaceVariant: COLORS.textSecondary,
    },
  };

  return (
    <PaperProvider theme={theme}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <AppNavigator />
    </PaperProvider>
  );
}
