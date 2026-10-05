import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { THEME } from '../../constants/theme';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outline';
  padding?: keyof typeof THEME.spacing;
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  style,
  ...props
}: CardProps) {
  const getStyle = () => {
    switch (variant) {
      case 'elevated':
        return [styles.base, styles.elevated];
      case 'outline':
        return [styles.base, styles.outline];
      default:
        return [styles.base, styles.default];
    }
  };

  return (
    <View
      style={[
        getStyle(),
        { padding: THEME.spacing[padding] },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: THEME.radius.lg,
  },
  default: {
    backgroundColor: THEME.colors.surface,
  },
  elevated: {
    backgroundColor: THEME.colors.surface,
    ...THEME.shadows.md,
  },
  outline: {
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
});
