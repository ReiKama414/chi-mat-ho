import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { lightTheme, darkTheme } from '@/constants/themes';

interface CyberButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
}

export const CyberButton: React.FC<CyberButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  variant = 'primary',
  size = 'medium',
  children,
}) => {
  const { data } = useApp();
  const theme = data.settings.theme === 'dark' ? darkTheme : lightTheme;

  const getButtonColor = () => {
    switch (variant) {
      case 'secondary':
        return theme.secondary;
      case 'danger':
        return theme.danger;
      default:
        return theme.primary;
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return { paddingHorizontal: 12, paddingVertical: 8 };
      case 'large':
        return { paddingHorizontal: 24, paddingVertical: 16 };
      default:
        return { paddingHorizontal: 16, paddingVertical: 12 };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonSize(),
        {
          backgroundColor: getButtonColor(),
          borderColor: getButtonColor(),
        },
        style,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color: theme.text }, textStyle]}>
        {children ? (
          children
        ) : (
          <Text style={[styles.buttonText, { color: theme.text }, textStyle]}>
            {title}
          </Text>
        )}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00e0ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: {
    fontSize: 16,
    textShadowColor: '#00e0ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
});
