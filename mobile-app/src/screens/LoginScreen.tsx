import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { radius, space, type } from '../theme/typography';
import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { loginThunk, clearAuthError } from '../store/slices/authSlice';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);

  const loading = status === 'loading';

  const handleSubmit = () => {
    dispatch(clearAuthError());
    if (!email.trim() || !password) {
      setFieldError('Enter your email and password to continue');
      return;
    }
    setFieldError(null);
    dispatch(loginThunk({ email: email.trim(), password }));
  };

  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <Text style={styles.wordmark}>Daybook</Text>
        <Text style={styles.tagline}>Plan the day. Finish what matters.</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.sheet}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.sheetContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subheading}>Log in to see what's on today.</Text>

          <AppInput
            label="Email"
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <AppInput
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {!!(fieldError || error) && (
            <Text style={styles.error}>{fieldError || error}</Text>
          )}

          <AppButton
            label="Log in"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submit}
          />

          <TouchableOpacity
            style={styles.footer}
            onPress={() => {
              dispatch(clearAuthError());
              navigation.navigate('Register');
            }}
          >
            <Text style={styles.footerText}>
              New here? <Text style={styles.footerLink}>Create an account</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.brandDark,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: space.xl,
    paddingBottom: space.xxl,
  },
  wordmark: {
    ...type.display,
    color: colors.white,
    marginBottom: space.xs,
  },
  tagline: {
    ...type.body,
    color: 'rgba(255,255,255,0.75)',
  },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    flex: 1.35,
  },
  sheetContent: {
    padding: space.xl,
    paddingTop: space.xxl,
  },
  heading: {
    ...type.h1,
    color: colors.ink,
    marginBottom: space.xs,
  },
  subheading: {
    ...type.body,
    color: colors.inkMuted,
    marginBottom: space.xl,
  },
  error: {
    ...type.small,
    color: colors.danger,
    marginBottom: space.md,
  },
  submit: {
    marginTop: space.sm,
  },
  footer: {
    marginTop: space.xl,
    alignItems: 'center',
  },
  footerText: {
    ...type.body,
    color: colors.inkMuted,
  },
  footerLink: {
    color: colors.brand,
    fontWeight: '700',
  },
});
