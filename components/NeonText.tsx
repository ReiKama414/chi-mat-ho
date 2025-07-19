import React from 'react';
import { Text, TextStyle, StyleSheet, TextProps } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { lightTheme, darkTheme } from '@/constants/themes';

interface NeonTextProps extends TextProps {
  color?: string;
  size?: number;
  glow?: boolean;
  style?: TextStyle;
}

export const NeonText: React.FC<NeonTextProps> = ({
  children,
  style,
  color,
  size = 16,
  glow = true,
  ...rest
}) => {
  const { data } = useApp();
  const theme = data.settings.theme === 'dark' ? darkTheme : lightTheme;

  return (
    <Text
      style={[
        styles.neonText,
        {
          color: color || theme.primary,
          fontSize: size,
          textShadowColor: glow ? color || theme.primary : 'transparent',
        },
        style,
      ]}
      {...rest} // 支援 numberOfLines、ellipsizeMode 等
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  neonText: {
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});
