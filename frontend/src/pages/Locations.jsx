import { useEffect, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { locationsAPI } from '../api/client';
import LocationModal from '../components/LocationModal';

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const response = await locationsAPI.getAll();
      setLocations(response.data);
    } catch (error) {
      console.error('Failed to load locations:', error);
      alert('Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (location) => {
    setSelectedLocation(location);
    setShowModal(true);
  };

  const handleDelete = async (locationId) => {
    if (!confirm('Are you sure you want to delete this location?')) return;
    
    try {
      await locationsAPI.delete(locationId);
      loadLocations();
    } catch (error) {
      console.error('Failed to delete location:', error);
      alert('Failed to delete location. It may be in use by assets.');
    }
  };

  const handleSave = () => {
    setShowModal(false);
    setSelectedLocation(null);
    loadLocations();
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
          <h1 className="text-3xl font-bold text-gray-900">Locations</h1>
          <p className="mt-2 text-sm text-gray-700">Manage storage locations</p>
        </div>
        <button
          onClick={() => {
            setSelectedLocation(null);
            setShowModal(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Add Location
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {locations.map((location) => (
              <tr key={location.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{location.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{location.description || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleEdit(location)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(location.id)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {locations.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No locations found
          </div>
        )}
      </div>

      {showModal && (
        <LocationModal
          location={selectedLocation}
          onClose={() => {
            setShowModal(false);
            setSelectedLocation(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
