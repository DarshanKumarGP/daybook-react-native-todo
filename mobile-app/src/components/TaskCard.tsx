import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';
import { radius, space, type } from '../theme/typography';
import { Task } from '../types';
import { formatDueDate } from '../utils/formatDate';
import { isOverdue } from '../utils/sortTasks';
import { PriorityBadge } from './PrioritySelector';

const priorityColor = (p: Task['priority']) =>
  p === 'high' ? colors.priorityHigh : p === 'medium' ? colors.priorityMedium : colors.priorityLow;

interface Props {
  task: Task;
  onToggle: () => void;
  onPress: () => void;
  onDelete: () => void;
}

export const TaskCard: React.FC<Props> = ({ task, onToggle, onPress, onDelete }) => {
  const overdue = isOverdue(task);
  const dueLabel = formatDueDate(task.dueDate);

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.wrapper}>
      <View style={[styles.accent, { backgroundColor: priorityColor(task.priority) }]} />
      <TouchableOpacity onPress={onToggle} hitSlop={10} style={styles.checkboxHit}>
        <View
          style={[
            styles.checkbox,
            task.completed && { backgroundColor: colors.success, borderColor: colors.success },
          ]}
        >
          {task.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>

      <View style={styles.body}>
        <Text
          style={[styles.title, task.completed && styles.titleDone]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        {!!task.description && (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        )}
        <View style={styles.metaRow}>
          <PriorityBadge priority={task.priority} />
          {!!dueLabel && (
            <View style={[styles.dueChip, overdue && styles.dueChipOverdue]}>
              <Text style={[styles.dueText, overdue && styles.dueTextOverdue]}>
                {overdue ? `Overdue · ${dueLabel}` : dueLabel}
              </Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity onPress={onDelete} hitSlop={10} style={styles.deleteHit}>
        <Text style={styles.deleteIcon}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: space.md,
    overflow: 'hidden',
    alignItems: 'stretch',
  },
  accent: {
    width: 4,
  },
  checkboxHit: {
    justifyContent: 'center',
    paddingLeft: space.md,
    paddingRight: space.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  body: {
    flex: 1,
    paddingVertical: space.md,
    paddingRight: space.sm,
  },
  title: {
    ...type.h2,
    color: colors.ink,
  },
  titleDone: {
    color: colors.inkFaint,
    textDecorationLine: 'line-through',
  },
  description: {
    ...type.small,
    color: colors.inkMuted,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    marginTop: space.sm,
    flexWrap: 'wrap',
  },
  dueChip: {
    backgroundColor: colors.divider,
    paddingHorizontal: space.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  dueChipOverdue: {
    backgroundColor: colors.dangerSoft,
  },
  dueText: {
    ...type.tiny,
    color: colors.inkMuted,
  },
  dueTextOverdue: {
    color: colors.danger,
  },
  deleteHit: {
    justifyContent: 'center',
    paddingHorizontal: space.md,
  },
  deleteIcon: {
    color: colors.inkFaint,
    fontSize: 14,
  },
});
