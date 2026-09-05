import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../../api/authApi';
import { getErrorMessage } from '../../api/client';
import { User } from '../../types';

const TOKEN_KEY = '@daybook/token';
const USER_KEY = '@daybook/user';

interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  bootstrapped: boolean; // whether we've checked AsyncStorage for a saved session
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
  bootstrapped: false,
  error: null,
};

/** Restores a persisted session (if any) when the app cold-starts. */
export const bootstrapAuth = createAsyncThunk('auth/bootstrap', async () => {
  const [token, userJson] = await Promise.all([
    AsyncStorage.getItem(TOKEN_KEY),
    AsyncStorage.getItem(USER_KEY),
  ]);
  if (token && userJson) {
    return { token, user: JSON.parse(userJson) as User };
  }
  return { token: null, user: null };
});

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (
    payload: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await authApi.register(payload.name, payload.email, payload.password);
      const { token, ...user } = res;
      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      return { token, user };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await authApi.login(payload.email, payload.password);
      const { token, ...user } = res;
      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      return { token, user };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.bootstrapped = true;
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.bootstrapped = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.status = 'idle';
      })
      .addMatcher(
        (action): action is PayloadAction<unknown> =>
          [registerThunk.pending.type, loginThunk.pending.type].includes(action.type),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        (action): action is PayloadAction<{ token: string; user: User }> =>
          [registerThunk.fulfilled.type, loginThunk.fulfilled.type].includes(action.type),
        (state, action) => {
          state.status = 'succeeded';
          state.token = action.payload.token;
          state.user = action.payload.user;
        }
      )
      .addMatcher(
        (action): action is PayloadAction<string> =>
          [registerThunk.rejected.type, loginThunk.rejected.type].includes(action.type),
        (state, action) => {
          state.status = 'failed';
          state.error = (action.payload as string) || 'Authentication failed';
        }
      );
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
