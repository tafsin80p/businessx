import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View, Text } from 'react-native';
import { THEME } from '../../constants/theme';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({ label, error, leftIcon, rightIcon, onFocus, onBlur, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const borderOpacity = useSharedValue(0);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    borderOpacity.value = withTiming(1, { duration: 200 });
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    borderOpacity.value = withTiming(0, { duration: 200 });
    onBlur?.(e);
  };

  const animatedBorderStyle = useAnimatedStyle(() => {
    return {
      borderColor: error ? THEME.colors.error : THEME.colors.primary,
      borderWidth: 1,
      opacity: borderOpacity.value,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: THEME.radius.md,
    };
  });

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <Animated.View style={animatedBorderStyle} pointerEvents="none" />
        
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            leftIcon && { paddingLeft: 40 },
            rightIcon && { paddingRight: 40 },
          ]}
          placeholderTextColor={THEME.colors.textMuted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: THEME.spacing.md,
  },
  label: {
    ...THEME.typography.bodySm,
    marginBottom: THEME.spacing.sm,
  },
  inputContainer: {
    backgroundColor: THEME.colors.surfaceHighlight,
    borderRadius: THEME.radius.md,
    height: 48,
    position: 'relative',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: THEME.colors.error,
  },
  input: {
    ...THEME.typography.body,
    height: '100%',
    paddingHorizontal: THEME.spacing.md,
  },
  iconLeft: {
    position: 'absolute',
    left: THEME.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    zIndex: 1,
  },
  iconRight: {
    position: 'absolute',
    right: THEME.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    zIndex: 1,
  },
  errorText: {
    ...THEME.typography.caption,
    color: THEME.colors.error,
    marginTop: THEME.spacing.xs,
  },
});
