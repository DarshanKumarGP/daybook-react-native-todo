import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { taskApi } from '../../api/taskApi';
import { getErrorMessage } from '../../api/client';
import { NewTaskInput, Task } from '../../types';
import { logoutThunk } from './authSlice';

interface TasksState {
  items: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  mutating: boolean; // true while an add/update/delete is in flight
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  status: 'idle',
  mutating: false,
  error: null,
};

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (_: void, { rejectWithValue }) => {
  try {
    return await taskApi.getAll();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const addTask = createAsyncThunk(
  'tasks/add',
  async (input: NewTaskInput, { rejectWithValue }) => {
    try {
      return await taskApi.create(input);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const editTask = createAsyncThunk(
  'tasks/edit',
  async (payload: { id: string; input: Partial<NewTaskInput> }, { rejectWithValue }) => {
    try {
      return await taskApi.update(payload.id, payload.input);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const toggleTaskComplete = createAsyncThunk(
  'tasks/toggleComplete',
  async (id: string, { rejectWithValue }) => {
    try {
      return await taskApi.toggleComplete(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const removeTask = createAsyncThunk(
  'tasks/remove',
  async (id: string, { rejectWithValue }) => {
    try {
      await taskApi.remove(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTasksError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Could not load tasks';
      })
      .addCase(addTask.pending, (state) => {
        state.mutating = true;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.mutating = false;
        state.items.unshift(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.mutating = false;
        state.error = (action.payload as string) || 'Could not add task';
      })
      .addCase(editTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(toggleTaskComplete.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.items = [];
        state.status = 'idle';
      });
  },
});

export const { clearTasksError } = tasksSlice.actions;
export default tasksSlice.reducer;
