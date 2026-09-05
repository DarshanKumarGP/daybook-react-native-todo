import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import { radius, space, type } from '../theme/typography';

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

export const AppInput: React.FC<Props> = ({ label, error, style, onFocus, onBlur, ...rest }) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.inkFaint}
        style={[
          styles.input,
          focused && styles.inputFocused,
          !!error && styles.inputError,
          style,
        ]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: space.lg,
  },
  label: {
    ...type.smallMedium,
    color: colors.inkMuted,
    marginBottom: space.xs,
  },
  input: {
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: space.md,
    backgroundColor: colors.surface,
    color: colors.ink,
    ...type.body,
  },
  inputFocused: {
    borderColor: colors.brand,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    ...type.small,
    color: colors.danger,
    marginTop: space.xs,
  },
});
