import Head from 'next/head';
import { useHabits } from '../../lib/useHabits';

export default function Stats() {
  const { habits, records } = useHabits();
  
  // Calculate simple stats
  const totalHabits = habits.length;
  const totalCompleted = records.filter(r => r.completed).length;
  const completionRate = totalHabits > 0 
    ? Math.round((records.filter(r => r.completed).length / records.length) * 100) 
    : 0;
  
  // Find most consistent habit
  const habitCompletionCounts: Record<string, number> = {};
  
  habits.forEach(habit => {
    const habitRecords = records.filter(r => r.habit_id === habit.id);
    const completedCount = habitRecords.filter(r => r.completed).length;
    habitCompletionCounts[habit.id] = completedCount;
  });
  
  const mostConsistentHabitId = Object.entries(habitCompletionCounts)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0])[0];
  
  const mostConsistentHabit = habits.find(h => h.id === mostConsistentHabitId);
  
  return (
    <>
      <Head>
        <title>Statistics - HabiTown</title>
        <meta name="description" content="View your habit statistics and progress" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Statistics</h1>
        
        {habits.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">No habits yet!</h3>
            <p className="mt-2">Create your first habit to see statistics.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-primary text-primary-content">
              <div className="card-body">
                <h2 className="card-title">Total Habits</h2>
                <p className="text-4xl font-bold">{totalHabits}</p>
              </div>
            </div>
            
            <div className="card bg-secondary text-secondary-content">
              <div className="card-body">
                <h2 className="card-title">Completed Tasks</h2>
                <p className="text-4xl font-bold">{totalCompleted}</p>
              </div>
            </div>
            
            <div className="card bg-accent text-accent-content">
              <div className="card-body">
                <h2 className="card-title">Completion Rate</h2>
                <p className="text-4xl font-bold">{completionRate}%</p>
              </div>
            </div>
          </div>
        )}
        
        {mostConsistentHabit && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">Most Consistent Habit</h2>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">{mostConsistentHabit.name}</h3>
                <p>Completed {habitCompletionCounts[mostConsistentHabit.id]} times</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 