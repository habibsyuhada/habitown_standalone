import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from './AuthContext';
import { RootState } from '../store';
import { 
  addCategory,
  addHabit,
  toggleHabitCompletion,
  deleteHabit,
  fetchCategoriesFromSupabase,
  createCategoryInSupabase,
  fetchHabitsFromSupabase,
  createHabitInSupabase,
  fetchHabitRecordsFromSupabase,
  toggleHabitCompletionInSupabase,
  editCategory,
  deleteCategory
} from '../store/habitsSlice';
import { Habit } from '../types/models';

export const useHabits = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { categories, habits, records, isLoading } = useSelector((state: RootState) => state.habits);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCategoriesFromSupabase());
      dispatch(fetchHabitsFromSupabase());
    }
  }, [isAuthenticated, dispatch]);

  // Create a new category
  const createCategory = (name: string) => {
    if (isAuthenticated) {
      dispatch(createCategoryInSupabase(name));
    } else {
      dispatch(addCategory(name));
    }
  };

  // Edit category
  const updateCategory = (id: string, name: string) => {
    if (isAuthenticated) {
      // TODO: Add Supabase implementation when needed
      alert('Editing categories in cloud mode not implemented yet');
    } else {
      dispatch(editCategory({ id, name }));
    }
  };

  // Delete category
  const removeCategory = (id: string) => {
    if (isAuthenticated) {
      // TODO: Add Supabase implementation when needed
      alert('Deleting categories in cloud mode not implemented yet');
    } else {
      dispatch(deleteCategory(id));
    }
  };

  // Create a new habit
  const createHabit = (habit: Omit<Habit, 'id' | 'user_id' | 'created_at'>) => {
    if (isAuthenticated) {
      dispatch(createHabitInSupabase(habit));
    } else {
      dispatch(addHabit(habit));
    }
  };

  // Toggle habit completion
  const completeHabit = (habitId: string, date: string, completed: boolean) => {
    if (isAuthenticated) {
      dispatch(toggleHabitCompletionInSupabase({ habitId, date, completed }));
    } else {
      dispatch(toggleHabitCompletion({ habitId, date, completed }));
    }
  };

  // Load habit records
  const loadHabitRecords = (habitId: string) => {
    if (isAuthenticated) {
      dispatch(fetchHabitRecordsFromSupabase(habitId));
    }
  };

  // Remove a habit
  const removeHabit = (habitId: string) => {
    dispatch(deleteHabit(habitId));
  };

  // Get records for a specific habit
  const getHabitRecords = (habitId: string) => {
    return records.filter(record => record.habit_id === habitId);
  };

  return {
    categories,
    habits,
    records,
    isLoading,
    createCategory,
    updateCategory,
    removeCategory,
    createHabit,
    completeHabit,
    loadHabitRecords,
    removeHabit,
    getHabitRecords
  };
}; 