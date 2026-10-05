import React from 'react';
import { StyleSheet, Text, Pressable, PressableProps, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { THEME } from '../../constants/theme';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  fullWidth = false,
  disabled,
  onPressIn,
  onPressOut,
  ...props
}: ButtonProps) {
  const scale = useSharedValue(1);

  const handlePressIn = (e: any) => {
    scale.value = withSpring(0.96, { stiffness: 400, damping: 25 });
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    scale.value = withSpring(1, { stiffness: 400, damping: 25 });
    onPressOut?.(e);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const getBackgroundColor = () => {
    if (variant === 'primary') return THEME.colors.primary;
    if (variant === 'secondary') return THEME.colors.surfaceHighlight;
    if (variant === 'ghost' || variant === 'outline') return 'transparent';
    return THEME.colors.primary;
  };

  const getBorderColor = () => {
    if (variant === 'outline') return THEME.colors.border;
    return 'transparent';
  };

  const getTextColor = () => {
    if (variant === 'primary') return '#FFFFFF';
    if (variant === 'secondary') return THEME.colors.text;
    if (variant === 'outline') return THEME.colors.text;
    if (variant === 'ghost') return THEME.colors.primary;
    return '#FFFFFF';
  };

  const height = size === 'sm' ? 36 : size === 'md' ? 48 : 56;
  const paddingHorizontal = size === 'sm' ? 16 : size === 'md' ? 24 : 32;

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.base,
        {
          height,
          paddingHorizontal,
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
          opacity: disabled ? 0.5 : 1,
          width: fullWidth ? '100%' : 'auto',
        },
        animatedStyle,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text
            style={[
              styles.text,
              { color: getTextColor(), fontSize: size === 'sm' ? 14 : 16 },
              textStyle,
              icon && iconPosition === 'left' && { marginLeft: 8 },
              icon && iconPosition === 'right' && { marginRight: 8 },
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: THEME.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
