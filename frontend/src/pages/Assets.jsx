import { useEffect, useState } from 'react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { assetsAPI, categoriesAPI, locationsAPI } from '../api/client';
import AssetModal from '../components/AssetModal';
import AssetActionsModal from '../components/AssetActionsModal';

const STATUS_COLORS = {
  AVAILABLE: 'bg-green-100 text-green-800',
  ASSIGNED: 'bg-blue-100 text-blue-800',
  REPAIR: 'bg-yellow-100 text-yellow-800',
  LOST: 'bg-red-100 text-red-800',
  RETIRED: 'bg-gray-100 text-gray-800',
};

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [assetsRes, categoriesRes, locationsRes] = await Promise.all([
        assetsAPI.getAll(),
        categoriesAPI.getAll(),
        locationsAPI.getAll(),
      ]);
      setAssets(assetsRes.data);
      setCategories(categoriesRes.data);
      setLocations(locationsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
      alert('Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (asset) => {
    setSelectedAsset(asset);
    setShowModal(true);
  };

  const handleActions = (asset) => {
    setSelectedAsset(asset);
    setShowActionsModal(true);
  };

  const handleDelete = async (assetId) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;
    
    try {
      await assetsAPI.delete(assetId);
      loadData();
    } catch (error) {
      console.error('Failed to delete asset:', error);
      alert('Failed to delete asset');
    }
  };

  const handleSave = async () => {
    setShowModal(false);
    setShowActionsModal(false);
    setSelectedAsset(null);
    loadData();
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      asset.asset_tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serial_no?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || asset.status === statusFilter;
    const matchesCategory = !categoryFilter || asset.category === parseInt(categoryFilter);
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  const getLocationName = (locationId) => {
    const location = locations.find(l => l.id === locationId);
    return location?.name || 'Unknown';
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
          <h1 className="text-3xl font-bold text-gray-900">Assets</h1>
          <p className="mt-2 text-sm text-gray-700">Manage all your assets in one place</p>
        </div>
        <button
          onClick={() => {
            setSelectedAsset(null);
            setShowModal(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Add Asset
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by tag, name, or serial..."
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="REPAIR">Under Repair</option>
              <option value="LOST">Lost</option>
              <option value="RETIRED">Retired</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Tag</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAssets.map((asset) => (
              <tr key={asset.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{asset.asset_tag}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{asset.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getCategoryName(asset.category)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[asset.status]}`}>
                    {asset.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getLocationName(asset.current_location)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleActions(asset)} className="text-primary-600 hover:text-primary-900 mr-4">
                    Actions
                  </button>
                  <button onClick={() => handleEdit(asset)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(asset.id)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAssets.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No assets found
          </div>
        )}
      </div>

      {showModal && (
        <AssetModal
          asset={selectedAsset}
          categories={categories}
          locations={locations}
          onClose={() => {
            setShowModal(false);
            setSelectedAsset(null);
          }}
          onSave={handleSave}
        />
      )}

      {showActionsModal && (
        <AssetActionsModal
          asset={selectedAsset}
          locations={locations}
          onClose={() => {
            setShowActionsModal(false);
            setSelectedAsset(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
