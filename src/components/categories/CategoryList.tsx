import { useState } from 'react';
import { useHabits } from '../../lib/useHabits';
import { Category } from '../../types/models';
import CategoryForm from './CategoryForm';
import CategoryEditForm from './CategoryEditForm';

export default function CategoryList() {
  const { categories, habits, removeCategory, isLoading } = useHabits();
  const [isAdding, setIsAdding] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Hitung jumlah habit per kategori
  const getCategoryHabitCount = (categoryId: string) => {
    return habits.filter(habit => habit.category_id === categoryId).length;
  };
  
  // Check if category is used in any habit
  const isCategoryUsed = (categoryId: string) => {
    return habits.some(habit => habit.category_id === categoryId);
  };
  
  // Handler for delete category
  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini? Habit yang menggunakan kategori ini akan berubah menjadi Tanpa Kategori.')) {
      removeCategory(categoryId);
    }
  };
  
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
        <h1 className="text-2xl font-bold">Kelola Kategori</h1>
        
        {!isAdding && !editingCategory && (
          <button 
            className="btn btn-primary"
            onClick={() => setIsAdding(true)}
          >
            Tambah Kategori
          </button>
        )}
      </div>
      
      {isAdding && (
        <CategoryForm onCancel={() => setIsAdding(false)} />
      )}
      
      {editingCategory && (
        <CategoryEditForm 
          category={editingCategory} 
          onCancel={() => setEditingCategory(null)} 
        />
      )}
      
      {categories.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">Belum ada kategori</h3>
          <p className="mt-2">Buat kategori pertama Anda untuk mengatur habit.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Nama Kategori</th>
                <th>Jumlah Habit</th>
                <th>Tanggal Dibuat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id} className="hover">
                  <td>{category.name}</td>
                  <td>{getCategoryHabitCount(category.id)}</td>
                  <td>{new Date(category.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => setEditingCategory(category)}
                        disabled={!!editingCategory || isAdding}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-outline btn-error"
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={!!editingCategory || isAdding}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {categories.length > 0 && (
        <div className="mt-8 p-4 bg-base-200 rounded-lg">
          <h3 className="font-medium mb-2">Informasi</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Menghapus kategori akan mengubah semua habit terkait menjadi "Tanpa Kategori"</li>
            <li>Kategori yang digunakan oleh habit masih dapat dihapus</li>
          </ul>
        </div>
      )}
    </div>
  );
} 