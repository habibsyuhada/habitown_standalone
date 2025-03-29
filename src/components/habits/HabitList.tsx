import { useMemo, useState, useCallback } from 'react';
import { useHabits } from '../../lib/useHabits';
import HabitCard from './HabitCard';
import HabitForm from './HabitForm';

export default function HabitList() {
  const { habits, categories, isLoading } = useHabits();
  const [filter, setFilter] = useState<string | null>(null);
  
  // Find category by id
  const getCategoryById = useCallback((categoryId: string | null) => {
    if (!categoryId) return null;
    return categories.find(c => c.id === categoryId) || null;
  }, [categories]);
  
  // Group habits by category for display
  const groupedHabits = useMemo(() => {
    if (!habits.length) return [];
    
    // Filter habits based on selected category
    const filteredHabits = filter 
      ? habits.filter(h => h.category_id === filter)
      : habits;
    
    // If filtered by category, don't group
    if (filter) {
      return [{
        category: getCategoryById(filter),
        habits: filteredHabits
      }];
    }
    
    // Group by category
    const grouped: { category: ReturnType<typeof getCategoryById>; habits: typeof habits }[] = [];
    
    // First add habits with categories
    for (const category of categories) {
      const categoryHabits = habits.filter(h => h.category_id === category.id);
      if (categoryHabits.length) {
        grouped.push({
          category,
          habits: categoryHabits
        });
      }
    }
    
    // Then add uncategorized habits
    const uncategorizedHabits = habits.filter(h => !h.category_id);
    if (uncategorizedHabits.length) {
      grouped.push({
        category: null,
        habits: uncategorizedHabits
      });
    }
    
    return grouped;
  }, [habits, categories, filter, getCategoryById]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Habits</h1>
        
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn m-1">
            {filter ? `Filter: ${getCategoryById(filter)?.name || 'Unknown'}` : 'All Categories'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><button onClick={() => setFilter(null)}>All Categories</button></li>
            {categories.map(category => (
              <li key={category.id}>
                <button onClick={() => setFilter(category.id)}>{category.name}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <HabitForm />
      
      {habits.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No habits yet!</h3>
          <p className="mt-2">Create your first habit to start tracking.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedHabits.map((group, index) => (
            <div key={index}>
              {group.category ? (
                <h2 className="text-xl font-semibold mb-3">{group.category.name}</h2>
              ) : (
                <h2 className="text-xl font-semibold mb-3">Uncategorized</h2>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.habits.map(habit => (
                  <HabitCard 
                    key={habit.id} 
                    habit={habit} 
                    category={group.category}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 