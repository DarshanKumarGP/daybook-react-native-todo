import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { space, type } from '../theme/typography';

interface Props {
  title: string;
  subtitle: string;
}

export const EmptyState: React.FC<Props> = ({ title, subtitle }) => (
  <View style={styles.wrapper}>
    <View style={styles.mark} />
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingTop: space.xxxl,
    paddingHorizontal: space.xl,
  },
  mark: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.brandSoft,
    marginBottom: space.lg,
  },
  title: {
    ...type.h1,
    color: colors.ink,
    marginBottom: space.xs,
  },
  subtitle: {
    ...type.body,
    color: colors.inkMuted,
    textAlign: 'center',
  },
});
