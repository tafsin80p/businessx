export const COLORS = {
  background: '#0B101E',
  surface: '#141A29',
  surfaceHighlight: '#1E293B',
  primary: '#1A66FF',
  primaryDark: '#104EB5',
  accent: '#8B5CF6',
  text: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  border: '#1E293B',
  success: '#10B981',
  successBackground: 'rgba(16, 185, 129, 0.1)',
  warning: '#F59E0B',
  warningBackground: 'rgba(245, 158, 11, 0.1)',
  error: '#EF4444',
  errorBackground: 'rgba(239, 68, 68, 0.1)',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  h2: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  h3: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  body: {
    fontSize: FONT_SIZES.md,
    fontWeight: '400',
    color: COLORS.text,
  },
  bodySm: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '400',
    color: COLORS.textSecondary,
  },
  caption: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
} as const;

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const THEME = {
  colors: COLORS,
  spacing: SPACING,
  radius: RADIUS,
  typography: TYPOGRAPHY,
  shadows: SHADOWS,
};
