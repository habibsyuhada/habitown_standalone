import { useState } from 'react';
import { useHabits } from '../../lib/useHabits';
import { Category } from '../../types/models';

interface CategorySelectProps {
  selectedCategory: string | null;
  onSelect: (categoryId: string | null) => void;
}

export default function CategorySelect({ selectedCategory, onSelect }: CategorySelectProps) {
  const { categories, createCategory } = useHabits();
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      createCategory(newCategoryName.trim());
      setNewCategoryName('');
      setShowAddCategory(false);
    }
  };
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">
        Category
      </label>
      
      {!showAddCategory ? (
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="w-full">
            <select 
              className="select select-bordered w-full"
              value={selectedCategory || ''}
              onChange={(e) => onSelect(e.target.value === '' ? null : e.target.value)}
            >
              <option value="">No Category</option>
              {categories.map((category: Category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <button 
            type="button"
            className="btn btn-outline sm:w-auto"
            onClick={() => setShowAddCategory(true)}
          >
            Add New
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Category name..."
            className="input input-bordered w-full"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <div className="flex gap-2">
            <button 
              type="button"
              className="btn btn-primary flex-1 sm:flex-none"
              onClick={handleCreateCategory}
            >
              Save
            </button>
            <button 
              type="button"
              className="btn btn-ghost flex-1 sm:flex-none"
              onClick={() => setShowAddCategory(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 