import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import { Category, Habit, HabitState } from '../types/models';
import { RootState } from './index';

// Initial state
const initialState: HabitState = {
  categories: [],
  habits: [],
  records: [],
  isLoading: false,
  error: null
};

// Async thunks for categories
export const fetchCategoriesFromSupabase = createAsyncThunk(
  'habits/fetchCategoriesFromSupabase',
  async (_, { rejectWithValue }) => {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured. Please update .env.local with valid credentials.');
      }
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

export const createCategoryInSupabase = createAsyncThunk(
  'habits/createCategoryInSupabase',
  async (name: string, { rejectWithValue }) => {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured. Please update .env.local with valid credentials.');
      }
      
      const { data, error } = await supabase
        .from('categories')
        .insert({ name })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

// Async thunks for habits
export const fetchHabitsFromSupabase = createAsyncThunk(
  'habits/fetchHabitsFromSupabase',
  async (_, { rejectWithValue, getState }) => {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured. Please update .env.local with valid credentials.');
      }
      
      const state = getState() as RootState;
      const user_id = state.auth?.user?.id;

      if (!user_id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

export const createHabitInSupabase = createAsyncThunk(
  'habits/createHabitInSupabase',
  async (habit: Omit<Habit, 'id' | 'created_at'>, { rejectWithValue, getState }) => {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured. Please update .env.local with valid credentials.');
      }
      
      const state = getState() as RootState;
      const user_id = state.auth?.user?.id;

      if (!user_id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('habits')
        .insert({ ...habit, user_id })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

// Async thunks for habit records
export const fetchHabitRecordsFromSupabase = createAsyncThunk(
  'habits/fetchHabitRecordsFromSupabase',
  async (habitId: string, { rejectWithValue }) => {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured. Please update .env.local with valid credentials.');
      }
      
      const { data, error } = await supabase
        .from('habit_records')
        .select('*')
        .eq('habit_id', habitId)
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

export const toggleHabitCompletionInSupabase = createAsyncThunk(
  'habits/toggleHabitCompletionInSupabase',
  async ({ 
    habitId, 
    date, 
    completed 
  }: { 
    habitId: string, 
    date: string, 
    completed: boolean 
  }, { rejectWithValue, getState }) => {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured. Please update .env.local with valid credentials.');
      }
      
      const state = getState() as RootState;
      const existingRecord = state.habits?.records.find(
        (r) => r.habit_id === habitId && r.date === date
      );

      if (existingRecord) {
        // Update existing record
        const { data, error } = await supabase
          .from('habit_records')
          .update({ completed })
          .eq('id', existingRecord.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('habit_records')
          .insert({
            habit_id: habitId,
            date,
            completed
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

// Habits slice
const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    // Local actions
    addCategory: (state, action) => {
      const newCategory: Category = {
        id: uuidv4(),
        name: action.payload,
        created_at: new Date().toISOString()
      };
      state.categories.push(newCategory);
    },
    editCategory: (state, action) => {
      const { id, name } = action.payload;
      const category = state.categories.find(c => c.id === id);
      if (category) {
        category.name = name;
      }
    },
    deleteCategory: (state, action) => {
      const categoryId = action.payload;
      // Hapus kategori
      state.categories = state.categories.filter(c => c.id !== categoryId);
      
      // Update habits yang menggunakan kategori ini, set category_id ke null
      state.habits.forEach(habit => {
        if (habit.category_id === categoryId) {
          habit.category_id = null;
        }
      });
    },
    addHabit: (state, action) => {
      const newHabit: Habit = {
        id: uuidv4(),
        user_id: null, // No user_id for local habits
        category_id: action.payload.category_id,
        name: action.payload.name,
        description: action.payload.description,
        frequency: action.payload.frequency,
        created_at: new Date().toISOString()
      };
      state.habits.push(newHabit);
    },
    toggleHabitCompletion: (state, action) => {
      const { habitId, date, completed } = action.payload;
      const existingRecord = state.records.find(
        (r) => r.habit_id === habitId && r.date === date
      );

      if (existingRecord) {
        existingRecord.completed = completed;
      } else {
        state.records.push({
          id: uuidv4(),
          habit_id: habitId,
          date,
          completed,
          created_at: new Date().toISOString()
        });
      }
    },
    deleteHabit: (state, action) => {
      state.habits = state.habits.filter(habit => habit.id !== action.payload);
      state.records = state.records.filter(record => record.habit_id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Category actions
      .addCase(fetchCategoriesFromSupabase.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCategoriesFromSupabase.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesFromSupabase.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createCategoryInSupabase.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      // Habit actions
      .addCase(fetchHabitsFromSupabase.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchHabitsFromSupabase.fulfilled, (state, action) => {
        state.isLoading = false;
        state.habits = action.payload;
      })
      .addCase(fetchHabitsFromSupabase.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createHabitInSupabase.fulfilled, (state, action) => {
        state.habits.push(action.payload);
      })
      // Habit record actions
      .addCase(fetchHabitRecordsFromSupabase.fulfilled, (state, action) => {
        // Merge with existing records, avoiding duplicates
        const existingIds = new Set(state.records.map(r => r.id));
        const newRecords = action.payload.filter(r => !existingIds.has(r.id));
        state.records = [...state.records, ...newRecords];
      })
      .addCase(toggleHabitCompletionInSupabase.fulfilled, (state, action) => {
        const index = state.records.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.records[index] = action.payload;
        } else {
          state.records.push(action.payload);
        }
      });
  }
});

export const { 
  addCategory, 
  editCategory,
  deleteCategory,
  addHabit, 
  toggleHabitCompletion,
  deleteHabit
} = habitsSlice.actions;

export default habitsSlice.reducer; 