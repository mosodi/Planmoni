import { StyleSheet } from 'react-native';

export const createCommonStyles = (colors: any) => StyleSheet.create({
  // Input styles
  inputBase: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    height: 56,
    fontSize: 16,
    color: colors.text,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    height: 56,
  },

  inputError: {
    borderColor: colors.error,
  },

  inputIcon: {
    marginRight: 12,
  },

  // Card styles
  cardBase: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  // Button styles
  buttonBase: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  primaryButton: {
    backgroundColor: colors.primary,
  },

  secondaryButton: {
    backgroundColor: colors.backgroundTertiary,
    borderWidth: 1,
    borderColor: colors.border,
  },

  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Text styles
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  // Error and info containers
  errorContainer: {
    backgroundColor: colors.errorLight,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },

  errorText: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
  },

  infoContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  warningContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },

  successContainer: {
    backgroundColor: colors.successLight,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.success,
  },

  // Layout helpers
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  spaceBetween: {
    justifyContent: 'space-between',
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  flex1: {
    flex: 1,
  },

  // Spacing
  marginBottom8: {
    marginBottom: 8,
  },

  marginBottom12: {
    marginBottom: 12,
  },

  marginBottom16: {
    marginBottom: 16,
  },

  marginBottom24: {
    marginBottom: 24,
  },

  marginBottom32: {
    marginBottom: 32,
  },

  // Icon containers
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  // Progress bar
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: 8,
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },

  // Footer
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },

  // Status tags
  statusTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },

  statusTagSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },

  statusTextSmall: {
    fontSize: 10,
    fontWeight: '500',
  },
});

// Helper function to get status colors
export const getStatusColors = (status: string) => {
  switch (status) {
    case 'active':
    case 'completed':
    case 'success':
      return { bg: '#DCFCE7', text: '#22C55E' };
    case 'pending':
    case 'warning':
      return { bg: '#FEF3C7', text: '#D97706' };
    case 'paused':
    case 'failed':
    case 'error':
      return { bg: '#FEE2E2', text: '#EF4444' };
    case 'cancelled':
    case 'inactive':
      return { bg: '#F1F5F9', text: '#64748B' };
    default:
      return { bg: '#F1F5F9', text: '#64748B' };
  }
};