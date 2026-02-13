import { useEffect, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { categoriesAPI } from '../api/client';
import CategoryModal from '../components/CategoryModal';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      alert('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await categoriesAPI.delete(categoryId);
      loadCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category. It may be in use by assets.');
    }
  };

  const handleSave = () => {
    setShowModal(false);
    setSelectedCategory(null);
    loadCategories();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="mt-2 text-sm text-gray-700">Manage asset categories</p>
        </div>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setShowModal(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Add Category
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleEdit(category)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No categories found
          </div>
        )}
      </div>

      {showModal && (
        <CategoryModal
          category={selectedCategory}
          onClose={() => {
            setShowModal(false);
            setSelectedCategory(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
