import { useState, useEffect } from 'react';
import { useHabits } from '../../lib/useHabits';
import { Category, Habit } from '../../types/models';
import { format, subDays, isToday, parseISO } from 'date-fns';

interface HabitCardProps {
  habit: Habit;
  category?: Category | null;
}

export default function HabitCard({ habit, category }: HabitCardProps) {
  const { completeHabit, loadHabitRecords, getHabitRecords, removeHabit } = useHabits();
  const [showDetails, setShowDetails] = useState(false);
  
  const habitRecords = getHabitRecords(habit.id);
  
  useEffect(() => {
    loadHabitRecords(habit.id);
  }, [habit.id, loadHabitRecords]);
  
  // Calculate date tracking range based on frequency
  const getDatesToShow = () => {
    const today = new Date();
    
    if (habit.frequency === 'daily') {
      // Show last 7 days for daily habits
      return Array.from({ length: 7 }, (_, i) => {
        const date = subDays(today, 6 - i);
        return {
          date,
          formattedDate: format(date, 'd'),
          label: i === 6 ? 'Today' : i === 5 ? 'Yesterday' : format(date, 'EEE'),
          dateStr: format(date, 'yyyy-MM-dd'),
          isToday: i === 6
        };
      });
    } else if (habit.frequency === 'weekly') {
      // Show current week
      const dayOfWeek = today.getDay();
      return Array.from({ length: 7 }, (_, i) => {
        const date = subDays(today, dayOfWeek - i);
        const isTodayDate = isToday(date);
        return {
          date,
          formattedDate: format(date, 'd'),
          label: format(date, 'EEE'),
          dateStr: format(date, 'yyyy-MM-dd'),
          isToday: isTodayDate
        };
      });
    } else {
      // For monthly, show the last 7 days as a sample
      return Array.from({ length: 7 }, (_, i) => {
        const date = subDays(today, 6 - i);
        return {
          date,
          formattedDate: format(date, 'd'),
          label: i === 6 ? 'Today' : i === 5 ? 'Yesterday' : format(date, 'EEE'),
          dateStr: format(date, 'yyyy-MM-dd'),
          isToday: i === 6
        };
      });
    }
  };
  
  const dates = getDatesToShow();
  
  // Check if a habit is completed on a specific date
  const isCompleted = (dateStr: string) => {
    return habitRecords.some(record => record.date === dateStr && record.completed);
  };
  
  // Toggle completion status - only allow for today
  const toggleCompletion = (dateStr: string, isToday: boolean) => {
    if (!isToday) {
      // Only allow editing today's habit
      return;
    }
    
    const completed = !isCompleted(dateStr);
    completeHabit(habit.id, dateStr, completed);
  };
  
  // Calculate streak
  const calculateStreak = () => {
    if (habitRecords.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    const completedDates = new Set(
      habitRecords
        .filter(record => record.completed)
        .map(record => record.date)
    );
    
    if (habit.frequency === 'daily') {
      // For daily habits, count consecutive days
      for (let i = 0; i < 100; i++) {
        const date = subDays(today, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        
        if (completedDates.has(dateStr)) {
          streak++;
        } else {
          break;
        }
      }
    } else if (habit.frequency === 'weekly') {
      // For weekly habits, count consecutive weeks
      let currentWeekStart = today;
      for (let i = 0; i < 52; i++) {
        let hasCompleted = false;
        for (let j = 0; j < 7; j++) {
          const date = subDays(currentWeekStart, j);
          const dateStr = format(date, 'yyyy-MM-dd');
          
          if (completedDates.has(dateStr)) {
            hasCompleted = true;
            break;
          }
        }
        
        if (hasCompleted) {
          streak++;
          currentWeekStart = subDays(currentWeekStart, 7);
        } else {
          break;
        }
      }
    } else {
      // For monthly habits, count consecutive months
      let currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      for (let i = 0; i < 24; i++) {
        let hasCompleted = false;
        for (const dateStr of completedDates) {
          const recordDate = parseISO(dateStr);
          if (recordDate.getMonth() === currentMonth.getMonth() && 
              recordDate.getFullYear() === currentMonth.getFullYear()) {
            hasCompleted = true;
            break;
          }
        }
        
        if (hasCompleted) {
          streak++;
          currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        } else {
          break;
        }
      }
    }
    
    return streak;
  };
  
  const streak = calculateStreak();
  
  return (
    <div className="card bg-base-100 shadow-xl mb-4">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="card-title">{habit.name}</h2>
            {category && (
              <div className="badge badge-outline mt-1">{category.name}</div>
            )}
          </div>
          <div className="badge badge-accent gap-1">
            <span className="text-xs">Streak:</span> {streak}
          </div>
        </div>
        
        {habit.description && showDetails && (
          <p className="text-sm mt-2">{habit.description}</p>
        )}
        
        <div className="grid grid-cols-7 gap-1 mt-4">
          {dates.map(({ dateStr, formattedDate, label, isToday }) => (
            <div key={dateStr} className="flex flex-col items-center">
              <div className="text-xs text-center mb-1">{label}</div>
              <button 
                onClick={() => toggleCompletion(dateStr, isToday)}
                disabled={!isToday}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted(dateStr) 
                    ? 'bg-success text-success-content' 
                    : 'bg-base-200'
                } ${!isToday ? 'cursor-not-allowed opacity-70' : 'hover:opacity-90'}`}
                title={isToday ? "Click to toggle completion" : "Only today's habits can be edited"}
              >
                {isCompleted(dateStr) ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-xs">{formattedDate}</span>
                )}
              </button>
              {isToday && (
                <div className="text-xs text-primary mt-1 font-bold">Today</div>
              )}
            </div>
          ))}
        </div>
        
        <div className="card-actions justify-between mt-4">
          <button 
            className="btn btn-xs btn-ghost"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
          
          {showDetails && (
            <button 
              className="btn btn-xs btn-error"
              onClick={() => removeHabit(habit.id)}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 