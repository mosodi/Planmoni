import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { router, Link } from 'expo-router';
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react-native';
import Button from '@/components/Button';
import ScreenLayout from '@/components/ScreenLayout';
import InfoBox from '@/components/InfoBox';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { createCommonStyles } from '@/styles/common';

export default function LoginScreen() {
  const { colors } = useTheme();
  const commonStyles = createCommonStyles(colors);
  const { signIn, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{email?: string; password?: string}>({});

  const validateForm = () => {
    const errors: {email?: string; password?: string} = {};
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    try {
      await signIn(email.toLowerCase().trim(), password);
      router.replace('/(tabs)');
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  const styles = createStyles(colors);

  return (
    <ScreenLayout scrollable={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={commonStyles.title}>Welcome back</Text>
          <Text style={commonStyles.subtitle}>Sign in to your Planmoni account</Text>
        </View>

        <View style={styles.form}>
          {error && <InfoBox type="error\" message={error} />}

          <View style={styles.inputGroup}>
            <Text style={commonStyles.label}>Email Address</Text>
            <View style={[
              commonStyles.inputContainer,
              formErrors.email && commonStyles.inputError
            ]}>
              <Mail size={20} color={colors.textSecondary} style={commonStyles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={colors.textTertiary}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (formErrors.email) {
                    setFormErrors(prev => ({ ...prev, email: undefined }));
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
              />
            </View>
            {formErrors.email && (
              <Text style={styles.fieldError}>{formErrors.email}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={commonStyles.label}>Password</Text>
            <View style={[
              commonStyles.inputContainer,
              formErrors.password && commonStyles.inputError
            ]}>
              <Lock size={20} color={colors.textSecondary} style={commonStyles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={colors.textTertiary}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (formErrors.password) {
                    setFormErrors(prev => ({ ...prev, password: undefined }));
                  }
                }}
                secureTextEntry={!showPassword}
                autoComplete="password"
                textContentType="password"
              />
              <Pressable
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </Pressable>
            </View>
            {formErrors.password && (
              <Text style={styles.fieldError}>{formErrors.password}</Text>
            )}
          </View>

          <View style={styles.forgotPasswordContainer}>
            <Link href="/(auth)/forgot-password" asChild>
              <Pressable>
                <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
              </Pressable>
            </Link>
          </View>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            style={[commonStyles.buttonBase, commonStyles.primaryButton]}
            icon={ArrowRight}
          />

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <Link href="/(auth)/signup" asChild>
              <Pressable>
                <Text style={styles.signUpLink}>Sign up</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </ScreenLayout>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    height: '100%',
  },
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },
  fieldError: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: -8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  signUpText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  signUpLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});