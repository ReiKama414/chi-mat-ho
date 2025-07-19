import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { lightTheme, darkTheme } from '@/constants/themes';

interface CyberCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  neonColor?: string;
}

export const CyberCard: React.FC<CyberCardProps> = ({ children, style, neonColor }) => {
  const { data } = useApp();
  const theme = data.settings.theme === 'dark' ? darkTheme : lightTheme;
  
  return (
    <View style={[
      styles.card,
      {
        backgroundColor: theme.surface,
        borderColor: neonColor || theme.primary,
      },
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#00e0ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});