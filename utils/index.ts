// Centralized utility exports
export * from './formatters';

// Common constants to reduce repetition
export const COLORS = {
  primary: '#1E3A8A',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  text: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  background: '#FFFFFF',
  surface: '#F8FAFC',
} as const;

export const SPACING = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32
} as const;

export const FONT_SIZES = {
  xs: 12, sm: 14, md: 16, lg: 18, xl: 20, xxl: 24
} as const;