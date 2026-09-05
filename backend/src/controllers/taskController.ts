import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Task from '../models/Task';

/**
 * @route   GET /api/tasks
 * @access  Private
 */
export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const tasks = await Task.find({ user: req.user!._id }).sort({ createdAt: -1 });
  res.json(tasks);
});

/**
 * @route   POST /api/tasks
 * @access  Private
 */
export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, dueDate, priority } = req.body;

  if (!title || !title.trim()) {
    res.status(400).json({ message: 'Title is required' });
    return;
  }

  const task = await Task.create({
    user: req.user!._id,
    title: title.trim(),
    description: description?.trim() || '',
    dueDate: dueDate || null,
    priority: priority || 'medium',
  });

  res.status(201).json(task);
});

/**
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user!._id });

  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

  const { title, description, dueDate, priority, completed } = req.body;

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (priority !== undefined) task.priority = priority;
  if (completed !== undefined) task.completed = completed;

  const updated = await task.save();
  res.json(updated);
});

/**
 * @route   PATCH /api/tasks/:id/complete
 * @access  Private
 */
export const toggleComplete = asyncHandler(async (req: Request, res: Response) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user!._id });

  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

  task.completed = !task.completed;
  const updated = await task.save();
  res.json(updated);
});

/**
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user!._id });

  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

  res.json({ message: 'Task deleted', _id: req.params.id });
});
