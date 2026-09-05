import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { radius, space, type } from '../theme/typography';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchTasks, removeTask, toggleTaskComplete } from '../store/slices/tasksSlice';
import { logoutThunk } from '../store/slices/authSlice';
import { TaskCard } from '../components/TaskCard';
import { EmptyState } from '../components/EmptyState';
import { sortTasks } from '../utils/sortTasks';
import { formatGreetingDate, getGreeting } from '../utils/formatDate';
import { Task } from '../types';

type Props = NativeStackScreenProps<AppStackParamList, 'TaskList'>;

type Filter = 'all' | 'active' | 'completed';

export const TaskListScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((s) => s.tasks);
  const user = useAppSelector((s) => s.auth.user);
  const [filter, setFilter] = useState<Filter>('all');
  const now = useMemo(() => new Date(), []);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const base =
      filter === 'active'
        ? items.filter((t) => !t.completed)
        : filter === 'completed'
        ? items.filter((t) => t.completed)
        : items;
    return sortTasks(base);
  }, [items, filter]);

  const pendingCount = items.filter((t) => !t.completed).length;
  const completedCount = items.length - pendingCount;

  const handleDelete = (task: Task) => {
    Alert.alert('Delete task', `Delete "${task.title}"? This can't be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(removeTask(task._id)),
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => dispatch(logoutThunk()) },
    ]);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>
            {getGreeting(now)}
            {user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </Text>
          <Text style={styles.date}>{formatGreetingDate(now)}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn} hitSlop={10}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statPill}>
          <Text style={styles.statNumber}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statPill}>
          <Text style={styles.statNumber}>{completedCount}</Text>
          <Text style={styles.statLabel}>Done</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        {(['all', 'active', 'completed'] as Filter[]).map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={status === 'loading'}
            onRefresh={() => {
              dispatch(fetchTasks());
            }}
            tintColor={colors.brand}
          />
        }
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggle={() => dispatch(toggleTaskComplete(item._id))}
            onPress={() => navigation.navigate('TaskEditor', { taskId: item._id })}
            onDelete={() => handleDelete(item)}
          />
        )}
        ListEmptyComponent={
          status !== 'loading' ? (
            <EmptyState
              title={filter === 'completed' ? 'Nothing finished yet' : 'You are all clear'}
              subtitle={
                filter === 'completed'
                  ? 'Completed tasks will show up here.'
                  : 'Tap the + button to add your first task.'
              }
            />
          ) : undefined
        }
      />

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('TaskEditor', undefined)}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: space.xl,
    paddingTop: space.xl,
  },
  greeting: {
    ...type.display,
    fontSize: 24,
    lineHeight: 30,
    color: colors.ink,
  },
  date: {
    ...type.body,
    color: colors.inkMuted,
    marginTop: 2,
  },
  logoutBtn: {
    paddingVertical: space.xs,
    paddingHorizontal: space.sm,
  },
  logoutText: {
    ...type.smallMedium,
    color: colors.brand,
  },
  statsRow: {
    flexDirection: 'row',
    gap: space.md,
    paddingHorizontal: space.xl,
    marginTop: space.lg,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: colors.surface,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    gap: 6,
  },
  statNumber: {
    ...type.h1,
    color: colors.brand,
  },
  statLabel: {
    ...type.small,
    color: colors.inkMuted,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: space.xl,
    marginTop: space.lg,
    gap: space.sm,
  },
  filterTab: {
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  filterTabActive: {
    backgroundColor: colors.brandSoft,
  },
  filterText: {
    ...type.smallMedium,
    color: colors.inkMuted,
  },
  filterTextActive: {
    color: colors.brandDark,
  },
  listContent: {
    padding: space.xl,
    paddingBottom: space.xxxl * 2,
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    right: space.xl,
    bottom: space.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: colors.brandDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  fabIcon: {
    color: colors.white,
    fontSize: 30,
    lineHeight: 32,
    marginTop: -2,
  },
});
