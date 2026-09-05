import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';
import { radius, space, type } from '../theme/typography';
import { Priority } from '../types';

const OPTIONS: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const colorFor = (p: Priority) =>
  p === 'high' ? colors.priorityHigh : p === 'medium' ? colors.priorityMedium : colors.priorityLow;

const softColorFor = (p: Priority) =>
  p === 'high'
    ? colors.priorityHighSoft
    : p === 'medium'
    ? colors.priorityMediumSoft
    : colors.priorityLowSoft;

interface Props {
  value: Priority;
  onChange: (p: Priority) => void;
}

export const PrioritySelector: React.FC<Props> = ({ value, onChange }) => (
  <View style={styles.row}>
    {OPTIONS.map((opt) => {
      const active = opt.value === value;
      return (
        <TouchableOpacity
          key={opt.value}
          activeOpacity={0.8}
          onPress={() => onChange(opt.value)}
          style={[
            styles.pill,
            { backgroundColor: active ? colorFor(opt.value) : softColorFor(opt.value) },
          ]}
        >
          <Text style={[styles.label, { color: active ? colors.white : colorFor(opt.value) }]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

/** Small read-only badge used on task cards. */
export const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => (
  <View style={[styles.badge, { backgroundColor: softColorFor(priority) }]}>
    <View style={[styles.dot, { backgroundColor: colorFor(priority) }]} />
    <Text style={[styles.badgeLabel, { color: colorFor(priority) }]}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: space.sm,
  },
  pill: {
    flex: 1,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...type.smallMedium,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeLabel: {
    ...type.tiny,
  },
});
