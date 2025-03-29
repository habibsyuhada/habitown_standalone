export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string | null;
  category_id: string | null;
  name: string;
  description: string | null;
  frequency: string;
  created_at: string;
}

export interface HabitRecord {
  id: string;
  habit_id: string;
  date: string;
  completed: boolean;
  created_at: string;
}

export type FrequencyType = 'daily' | 'weekly' | 'monthly';

export interface AuthState {
  user: {
    id?: string;
    email?: string;
  } | null;
  session: {
    access_token?: string;
    refresh_token?: string;
  } | null;
  isLoading: boolean;
}

export interface HabitState {
  categories: Category[];
  habits: Habit[];
  records: HabitRecord[];
  isLoading: boolean;
  error: string | null;
}

export type ThemeType = 'light' | 'dark' | 'system';

export interface ThemeState {
  theme: ThemeType;
}

export interface RootState {
  auth: AuthState;
  habits: HabitState;
  theme: ThemeState;
} 