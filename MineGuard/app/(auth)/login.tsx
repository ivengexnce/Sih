import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { loginUser } from '@/services/authService';
import { useInspection } from '@/context/InspectionContext';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';

  const { setCurrentMine } = useInspection();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Clear inputs and errors whenever Login screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setEmail('');
      setPassword('');
      setEmailError(null);
      setPasswordError(null);
      setGeneralError(null);
      setIsLoading(false);
    }, [])
  );

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError(null);
    if (generalError) setGeneralError(null);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError(null);
    if (generalError) setGeneralError(null);
  };

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    let isValid = true;

    if (!trimmedEmail) {
      setEmailError('Official email is required');
      isValid = false;
    } else {
      setEmailError(null);
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError(null);
    }

    if (!isValid) {
      return;
    }

    setIsLoading(true);
    setGeneralError(null);

    const result = await loginUser(trimmedEmail, password);
    setIsLoading(false);

    if (result.success && result.mine) {
      // Set active allocated mine loaded directly from Firebase
      setCurrentMine(result.mine);
      router.replace('/(main)/home');
    } else {
      setGeneralError(result.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  const inputBackgroundColor = isDark ? '#1E2328' : '#F1F4F8';
  const defaultBorderColor = isDark ? '#333D47' : '#D0D7DE';
  const errorBorderColor = '#DC2626';
  const textColor = isDark ? '#ECEDEE' : '#11181C';
  const placeholderTextColor = isDark ? '#808B96' : '#8C959F';

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.badge}>
              <ThemedText style={styles.badgeText}>STATUTORY SAFETY INSPECTOR</ThemedText>
            </View>
            <ThemedText type="title" style={styles.title}>
              CoalGuard Inspector
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Ministry of Coal · DGMS Compliance Portal
            </ThemedText>
          </View>

          {/* Web Sync Info Banner */}
          <View style={[styles.infoBanner, { backgroundColor: isDark ? '#0C2A44' : '#EFF6FF', borderColor: isDark ? '#1E4976' : '#BFDBFE' }]}>
            <Ionicons name="information-circle-outline" size={18} color={isDark ? '#38BDF8' : '#0284C7'} />
            <ThemedText style={[styles.infoBannerText, { color: isDark ? '#BAE6FD' : '#1E40AF' }]}>
              Enter the credentials registered on the MineGuard web portal. Your assigned mine and statutory profile will sync automatically.
            </ThemedText>
          </View>

          <View style={styles.form}>
            {generalError ? (
              <View style={styles.generalErrorBanner}>
                <Ionicons name="alert-circle" size={18} color="#B91C1C" />
                <ThemedText style={styles.generalErrorText}>
                  {generalError}
                </ThemedText>
              </View>
            ) : null}

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Official Email *</ThemedText>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: inputBackgroundColor,
                      borderColor: emailError ? errorBorderColor : defaultBorderColor,
                      color: textColor,
                    },
                  ]}
                  value={email}
                  onChangeText={handleEmailChange}
                  placeholder="inspector@dgms.gov.in"
                  placeholderTextColor={placeholderTextColor}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                <View style={styles.inputIconLeft}>
                  <Ionicons name="mail-outline" size={18} color={isDark ? '#94A3B8' : '#64748B'} />
                </View>
              </View>
              {emailError ? (
                <ThemedText style={styles.inlineErrorText}>
                  {emailError}
                </ThemedText>
              ) : null}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Password / Access Key *</ThemedText>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    styles.inputWithRightIcon,
                    {
                      backgroundColor: inputBackgroundColor,
                      borderColor: passwordError ? errorBorderColor : defaultBorderColor,
                      color: textColor,
                    },
                  ]}
                  value={password}
                  onChangeText={handlePasswordChange}
                  placeholder="••••••••"
                  placeholderTextColor={placeholderTextColor}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
                <View style={styles.inputIconLeft}>
                  <Ionicons name="lock-closed-outline" size={18} color={isDark ? '#94A3B8' : '#64748B'} />
                </View>
                <Pressable
                  style={styles.inputIconRight}
                  onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={isDark ? '#94A3B8' : '#64748B'}
                  />
                </Pressable>
              </View>
              {passwordError ? (
                <ThemedText style={styles.inlineErrorText}>
                  {passwordError}
                </ThemedText>
              ) : null}
            </View>

            {/* Submit Button */}
            <Pressable
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: isDark ? '#0284C7' : '#0369A1',
                  opacity: pressed || isLoading ? 0.85 : 1,
                  transform: [{ scale: pressed && !isLoading ? 0.98 : 1 }],
                },
              ]}
              onPress={handleLogin}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <View style={styles.buttonInner}>
                  <ThemedText
                    lightColor="#FFFFFF"
                    darkColor="#FFFFFF"
                    style={styles.buttonText}>
                    Sign In to Inspector Portal
                  </ThemedText>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </View>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#D97706',
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.7,
    textAlign: 'center',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  form: {
    width: '100%',
    gap: 16,
  },
  generalErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  generalErrorText: {
    flex: 1,
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '600',
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    paddingLeft: 42,
    paddingRight: 14,
    fontSize: 15,
  },
  inputWithRightIcon: {
    paddingRight: 42,
  },
  inputIconLeft: {
    position: 'absolute',
    left: 14,
    pointerEvents: 'none',
  },
  inputIconRight: {
    position: 'absolute',
    right: 14,
    padding: 4,
  },
  inlineErrorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
    marginLeft: 2,
  },
  button: {
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
