import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';
import { AuthState } from '../types/models';

// Initial state
const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: false
};

// Async thunks
export const signInWithEmail = createAsyncThunk(
  'auth/signInWithEmail',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured. Please update .env.local with valid credentials.');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

export const signUpWithEmail = createAsyncThunk(
  'auth/signUpWithEmail',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured. Please update .env.local with valid credentials.');
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      if (!supabase) {
        return null;
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return null;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

export const getSession = createAsyncThunk(
  'auth/getSession',
  async (_, { rejectWithValue }) => {
    try {
      if (!supabase) {
        return { session: null };
      }
      
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInWithEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.session = action.payload.session;
      })
      .addCase(signInWithEmail.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(signUpWithEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.session = action.payload.session;
      })
      .addCase(signUpWithEmail.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.session = null;
      })
      .addCase(getSession.fulfilled, (state, action) => {
        state.session = action.payload.session;
        state.user = action.payload.session?.user || null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer; 