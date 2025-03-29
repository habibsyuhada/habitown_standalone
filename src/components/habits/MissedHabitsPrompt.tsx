import { useState, useEffect } from 'react';
import { useHabits } from '../../lib/useHabits';
import { format, subDays } from 'date-fns';
import { Habit } from '../../types/models';

export default function MissedHabitsPrompt() {
  const { habits, records, completeHabit } = useHabits();
  const [missedHabits, setMissedHabits] = useState<Habit[]>([]);
  const [habitStatuses, setHabitStatuses] = useState<Record<string, boolean>>({});
  const [showPrompt, setShowPrompt] = useState(false);
  const [loading, setLoading] = useState(true);

  // Konstanta untuk localStorage key
  const MISSED_HABITS_KEY = 'missedHabits';
  const HABIT_STATUSES_KEY = 'habitStatuses';
  const PROMPT_SHOWN_KEY = 'missedHabitsPromptShown';

  // Check for last visit date in localStorage
  useEffect(() => {
    const loadMissedHabits = () => {
      const lastVisitDate = localStorage.getItem('lastVisitDate');
      const today = format(new Date(), 'yyyy-MM-dd');
      
      // Cek apakah prompt sedang ditampilkan dari session sebelumnya
      const promptShown = localStorage.getItem(PROMPT_SHOWN_KEY) === 'true';
      const savedMissedHabits = localStorage.getItem(MISSED_HABITS_KEY);
      const savedHabitStatuses = localStorage.getItem(HABIT_STATUSES_KEY);
      
      // Jika prompt sudah ditampilkan sebelumnya dan masih ada habit yang belum diisi
      if (promptShown && savedMissedHabits) {
        try {
          const parsedMissedHabits = JSON.parse(savedMissedHabits);
          setMissedHabits(parsedMissedHabits);
          
          if (savedHabitStatuses) {
            setHabitStatuses(JSON.parse(savedHabitStatuses));
          } else {
            // Inisialisasi status habit yang belum diisi (default: false = tidak selesai)
            const initialStatuses: Record<string, boolean> = {};
            parsedMissedHabits.forEach((habit: Habit) => {
              initialStatuses[habit.id] = false;
            });
            setHabitStatuses(initialStatuses);
            localStorage.setItem(HABIT_STATUSES_KEY, JSON.stringify(initialStatuses));
          }
          
          setShowPrompt(true);
          setLoading(false);
          return;
        } catch (e) {
          console.error('Error parsing saved missed habits:', e);
        }
      }
      
      // Jika belum ada prompt atau prompt telah diselesaikan, cek untuk missed habits baru
      if (lastVisitDate && lastVisitDate !== today && habits.length > 0) {
        const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
        
        // Find habits that weren't completed yesterday
        const missed = habits.filter(habit => {
          const yesterdayRecord = records.find(
            record => record.habit_id === habit.id && record.date === yesterday
          );
          return !yesterdayRecord || !yesterdayRecord.completed;
        });
        
        if (missed.length > 0) {
          setMissedHabits(missed);
          
          // Inisialisasi status habit (default: false = tidak selesai)
          const initialStatuses: Record<string, boolean> = {};
          missed.forEach(habit => {
            initialStatuses[habit.id] = false;
          });
          setHabitStatuses(initialStatuses);
          
          // Simpan ke localStorage
          localStorage.setItem(MISSED_HABITS_KEY, JSON.stringify(missed));
          localStorage.setItem(HABIT_STATUSES_KEY, JSON.stringify(initialStatuses));
          localStorage.setItem(PROMPT_SHOWN_KEY, 'true');
          
          setShowPrompt(true);
        }
      }
      
      // Update last visit date
      localStorage.setItem('lastVisitDate', today);
      setLoading(false);
    };

    loadMissedHabits();
  }, [habits, records]);

  const handleToggleHabit = (habitId: string, completed: boolean) => {
    // Update status di state
    const updatedStatuses = { ...habitStatuses, [habitId]: completed };
    setHabitStatuses(updatedStatuses);
    
    // Update localStorage
    localStorage.setItem(HABIT_STATUSES_KEY, JSON.stringify(updatedStatuses));
  };

  const handleSubmitAll = () => {
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    
    // Simpan semua status
    Object.entries(habitStatuses).forEach(([habitId, completed]) => {
      completeHabit(habitId, yesterday, completed);
    });
    
    // Hapus data dari localStorage
    localStorage.removeItem(MISSED_HABITS_KEY);
    localStorage.removeItem(HABIT_STATUSES_KEY);
    localStorage.removeItem(PROMPT_SHOWN_KEY);
    
    // Tutup prompt
    setShowPrompt(false);
  };

  if (!showPrompt || loading || missedHabits.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-2">Update Habit Kemarin</h2>
        <p className="mb-4">
          Anda memiliki {missedHabits.length} habit yang belum diisi statusnya untuk kemarin ({format(subDays(new Date(), 1), 'dd MMMM yyyy')}).
          Centang habit yang telah Anda selesaikan.
        </p>
        
        <div className="overflow-y-auto max-h-[60vh]">
          {missedHabits.map(habit => (
            <div key={habit.id} className="card bg-base-200 p-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="flex-none pt-1">
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-primary"
                    checked={habitStatuses[habit.id] === true}
                    onChange={(e) => handleToggleHabit(habit.id, e.target.checked)}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{habit.name}</h3>
                  {habit.description && (
                    <p className="text-sm mt-1 mb-1 text-base-content/70">{habit.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <button 
            className="btn btn-primary w-full"
            onClick={handleSubmitAll}
          >
            Simpan Semua
          </button>
          <p className="text-xs text-center mt-2 text-base-content opacity-70">
            Tekan tombol Simpan Semua untuk melanjutkan
          </p>
        </div>
      </div>
    </div>
  );
} 