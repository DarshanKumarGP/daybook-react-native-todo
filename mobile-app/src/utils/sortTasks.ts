import { Priority, Task } from '../types';

/**
 * Urgency sort — combines priority and deadline proximity into one score
 * instead of sorting by either field alone.
 *
 * Why: sorting purely by due date buries an urgent, undated "call the
 * client" task under a low-priority task that merely has a date attached.
 * Sorting purely by priority ignores the fact that a medium-priority task
 * due in twenty minutes is more pressing right now than a high-priority
 * task due next month.
 *
 * How it works:
 *  1. Completed tasks always sink to the bottom (most recently completed
 *     first), so the active list stays the focus.
 *  2. For active tasks we compute a single `urgencyScore`:
 *
 *       score = priorityPenalty(priority) + hoursUntilDue
 *
 *     `hoursUntilDue` is negative for overdue tasks, which makes them
 *     float to the very top. `priorityPenalty` shifts a task earlier or
 *     later by the equivalent of a chunk of hours per priority step, so
 *     priority acts as a tie-breaker window rather than an absolute order:
 *     a high-priority task effectively "jumps the queue" by
 *     PRIORITY_WINDOW_HOURS, but a genuinely close deadline can still
 *     outrank a lower-priority task.
 *  3. Tasks with no due date are treated as due far in the future, so they
 *     still sort by priority relative to each other but never crowd out
 *     dated work.
 */

const PRIORITY_WINDOW_HOURS = 36;
const NO_DUE_DATE_HOURS = 24 * 365; // effectively "someday"

const priorityPenalty: Record<Priority, number> = {
  high: 0,
  medium: PRIORITY_WINDOW_HOURS,
  low: PRIORITY_WINDOW_HOURS * 2,
};

const hoursUntil = (dueDate: string | null): number => {
  if (!dueDate) return NO_DUE_DATE_HOURS;
  const diffMs = new Date(dueDate).getTime() - Date.now();
  return diffMs / (1000 * 60 * 60);
};

export const urgencyScore = (task: Task): number => {
  return priorityPenalty[task.priority] + hoursUntil(task.dueDate);
};

export const sortTasks = (tasks: Task[]): Task[] => {
  const active = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  active.sort((a, b) => urgencyScore(a) - urgencyScore(b));
  completed.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return [...active, ...completed];
};

export const isOverdue = (task: Task): boolean =>
  !task.completed && !!task.dueDate && new Date(task.dueDate).getTime() < Date.now();
