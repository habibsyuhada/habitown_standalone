import { useState } from 'react';
import { useHabits } from '../../lib/useHabits';
import { FrequencyType } from '../../types/models';
import CategorySelect from './CategorySelect';

export default function HabitForm() {
  const { createHabit } = useHabits();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<FrequencyType>('daily');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    // Split by newlines and create multiple habits
    const habitNames = name.split('\n').filter(n => n.trim() !== '');
    
    habitNames.forEach(habitName => {
      createHabit({
        name: habitName.trim(),
        description: description.trim() || null,
        frequency,
        category_id: categoryId,
      });
    });
    
    // Reset form
    setName('');
    setDescription('');
    setFrequency('daily');
    setCategoryId(null);
    setIsAdding(false);
  };
  
  if (!isAdding) {
    return (
      <div className="my-4">
        <button
          className="btn btn-primary w-full"
          onClick={() => setIsAdding(true)}
        >
          Add New Habit
        </button>
      </div>
    );
  }
  
  return (
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body">
        <h2 className="card-title">Create New Habit</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="block text-sm font-medium mb-2">
              Habit Name * <span className="text-xs opacity-70">(Gunakan baris baru untuk membuat multiple habits)</span>
            </label>
            <textarea
              placeholder="Satu baris, satu habit. Contoh:&#10;Minum air 2L&#10;Olahraga 30 menit&#10;Baca buku"
              className="textarea textarea-bordered w-full min-h-[120px]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-control mb-4">
            <label className="block text-sm font-medium mb-2">
              Description (Optional)
            </label>
            <textarea
              placeholder="Why do you want to build this habit?"
              className="textarea textarea-bordered w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <CategorySelect 
            selectedCategory={categoryId}
            onSelect={setCategoryId}
          />
          
          <div className="form-control mb-6">
            <label className="block text-sm font-medium mb-2">
              Frequency
            </label>
            <div className="flex flex-wrap gap-2">
              <label className="label cursor-pointer gap-2">
                <input 
                  type="radio" 
                  name="frequency" 
                  className="radio radio-primary" 
                  checked={frequency === 'daily'}
                  onChange={() => setFrequency('daily')}
                />
                <span className="label-text">Daily</span>
              </label>
              <label className="label cursor-pointer gap-2">
                <input 
                  type="radio" 
                  name="frequency" 
                  className="radio radio-primary" 
                  checked={frequency === 'weekly'}
                  onChange={() => setFrequency('weekly')}
                />
                <span className="label-text">Weekly</span>
              </label>
              <label className="label cursor-pointer gap-2">
                <input 
                  type="radio" 
                  name="frequency" 
                  className="radio radio-primary" 
                  checked={frequency === 'monthly'}
                  onChange={() => setFrequency('monthly')}
                />
                <span className="label-text">Monthly</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              className="btn btn-ghost"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              Create Habit{name.split('\n').filter(n => n.trim() !== '').length > 1 ? 's' : ''}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 