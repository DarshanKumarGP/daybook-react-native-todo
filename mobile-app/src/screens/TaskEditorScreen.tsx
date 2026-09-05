import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { radius, space, type } from '../theme/typography';
import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';
import { PrioritySelector } from '../components/PrioritySelector';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { addTask, editTask, removeTask } from '../store/slices/tasksSlice';
import { Priority } from '../types';
import { formatDueDate } from '../utils/formatDate';

type Props = NativeStackScreenProps<AppStackParamList, 'TaskEditor'>;

export const TaskEditorScreen: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const taskId = route.params?.taskId;
  const existing = useAppSelector((s) => s.tasks.items.find((t) => t._id === taskId));
  const isEditing = !!existing;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [priority, setPriority] = useState<Priority>(existing?.priority ?? 'medium');
  const [dueDate, setDueDate] = useState<Date | null>(
    existing?.dueDate ? new Date(existing.dueDate) : null
  );
  const [pickerStage, setPickerStage] = useState<'none' | 'date' | 'time'>('none');
  const [titleError, setTitleError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const dueLabel = useMemo(
    () => (dueDate ? formatDueDate(dueDate.toISOString()) : null),
    [dueDate]
  );

  const onDateChange = (event: any, selected?: Date) => {
    if (Platform.OS === 'android') setPickerStage('none');
    if (event.type === 'dismissed' || !selected) return;

    if (pickerStage === 'date') {
      const merged = new Date(selected);
      if (dueDate) {
        merged.setHours(dueDate.getHours(), dueDate.getMinutes());
      }
      setDueDate(merged);
      // Chain into the time picker for a single smooth flow on Android.
      setTimeout(() => setPickerStage('time'), 150);
    } else if (pickerStage === 'time') {
      setDueDate((prev) => {
        const base = prev ? new Date(prev) : new Date();
        base.setHours(selected.getHours(), selected.getMinutes());
        return base;
      });
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      setTitleError('Give your task a title');
      return;
    }
    setTitleError(null);
    setSaving(true);

    const input = {
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? dueDate.toISOString() : null,
      priority,
    };

    const promise = isEditing
      ? dispatch(editTask({ id: existing!._id, input })).unwrap()
      : dispatch(addTask(input)).unwrap();

    promise
      .then(() => navigation.goBack())
      .catch((message: string) => Alert.alert('Could not save task', message))
      .finally(() => setSaving(false));
  };

  const handleDelete = () => {
    if (!existing) return;
    Alert.alert('Delete task', `Delete "${existing.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          dispatch(removeTask(existing._id));
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Text style={styles.topBarAction}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>{isEditing ? 'Edit task' : 'New task'}</Text>
        {isEditing ? (
          <TouchableOpacity onPress={handleDelete} hitSlop={12}>
            <Text style={[styles.topBarAction, { color: colors.danger }]}>Delete</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 50 }} />
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppInput
          label="Title"
          placeholder="e.g. Prepare submission zip"
          value={title}
          onChangeText={setTitle}
          error={titleError ?? undefined}
        />
        <AppInput
          label="Description"
          placeholder="Add any useful detail (optional)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={styles.multiline}
        />

        <Text style={styles.sectionLabel}>Priority</Text>
        <PrioritySelector value={priority} onChange={setPriority} />

        <Text style={[styles.sectionLabel, { marginTop: space.xl }]}>Deadline</Text>
        <TouchableOpacity style={styles.dateField} onPress={() => setPickerStage('date')}>
          <Text style={dueDate ? styles.dateText : styles.datePlaceholder}>
            {dueLabel ?? 'Set a date & time'}
          </Text>
          {!!dueDate && (
            <TouchableOpacity onPress={() => setDueDate(null)} hitSlop={10}>
              <Text style={styles.clearDate}>Clear</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {pickerStage !== 'none' && (
          <DateTimePicker
            value={dueDate ?? new Date()}
            mode={pickerStage === 'date' ? 'date' : 'time'}
            is24Hour={false}
            onChange={onDateChange}
          />
        )}

        <AppButton
          label={isEditing ? 'Save changes' : 'Add task'}
          onPress={handleSave}
          loading={saving}
          style={styles.saveButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    paddingBottom: space.md,
  },
  topBarAction: {
    ...type.bodyMedium,
    color: colors.brand,
    width: 50,
  },
  topBarTitle: {
    ...type.h2,
    color: colors.ink,
  },
  content: {
    padding: space.xl,
    paddingBottom: space.xxxl,
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: space.sm,
  },
  sectionLabel: {
    ...type.smallMedium,
    color: colors.inkMuted,
    marginBottom: space.sm,
  },
  dateField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: space.md,
  },
  dateText: {
    ...type.body,
    color: colors.ink,
  },
  datePlaceholder: {
    ...type.body,
    color: colors.inkFaint,
  },
  clearDate: {
    ...type.smallMedium,
    color: colors.danger,
  },
  saveButton: {
    marginTop: space.xxl,
  },
});
