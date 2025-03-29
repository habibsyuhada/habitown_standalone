import { useState } from 'react';
import { useHabits } from '../../lib/useHabits';

interface CategoryFormProps {
  onCancel: () => void;
}

export default function CategoryForm({ onCancel }: CategoryFormProps) {
  const { createCategory } = useHabits();
  const [name, setName] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    createCategory(name.trim());
    setName('');
    onCancel();
  };
  
  return (
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body">
        <h2 className="card-title">Tambah Kategori Baru</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="block text-sm font-medium mb-2">
              Nama Kategori *
            </label>
            <input
              type="text"
              placeholder="Nama kategori..."
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              className="btn btn-ghost"
              onClick={onCancel}
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 