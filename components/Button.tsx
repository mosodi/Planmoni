import { Pressable, Text, StyleSheet, ActivityIndicator, PressableProps, View } from 'react-native';

type ButtonProps = PressableProps & {
  title?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ComponentType<any>;
};

export default function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  icon: Icon,
  ...props
}: ButtonProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary': return styles.primaryButton;
      case 'secondary': return styles.secondaryButton;
      case 'outline': return styles.outlineButton;
      default: return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary': return styles.primaryText;
      case 'secondary': return styles.secondaryText;
      case 'outline': return styles.outlineText;
      default: return styles.primaryText;
    }
  };

  return (
    <Pressable
      style={[styles.button, getVariantStyle(), disabled && styles.disabledButton, style]}
      disabled={disabled || loading}
      {...props}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="small\" color={variant === 'outline' ? '#1E3A8A' : '#FFFFFF'} />
        ) : (
          <>
            {Icon && <Icon color={variant === 'outline' ? '#1E3A8A' : '#FFFFFF'} size={24} style={styles.icon} />}
            {title && <Text style={[styles.text, getTextStyle(), disabled && styles.disabledText]}>{title}</Text>}
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { borderRadius: 8, justifyContent: 'center', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  icon: { marginRight: 8 },
  text: { fontWeight: '600', textAlign: 'center', fontSize: 14 },
  primaryButton: { backgroundColor: '#1E3A8A' },
  primaryText: { color: '#FFFFFF' },
  secondaryButton: { backgroundColor: '#CBD5E1' },
  secondaryText: { color: '#1E293B' },
  outlineButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#1E3A8A' },
  outlineText: { color: '#1E3A8A' },
  disabledButton: { backgroundColor: '#E2E8F0', borderColor: '#E2E8F0' },
  disabledText: { color: '#94A3B8' },
});