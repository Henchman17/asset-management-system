import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { assetsAPI } from '../api/client';

export default function AssetActionsModal({ asset, locations, onClose, onSave }) {
  const [action, setAction] = useState('');
  const [formData, setFormData] = useState({
    assigned_to_id: '',
    to_location_id: '',
    condition_on_return: 'GOOD',
    remarks: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (action === 'checkout') {
        await assetsAPI.checkout(asset.id, {
          assigned_to_id: parseInt(formData.assigned_to_id),
          remarks: formData.remarks,
        });
      } else if (action === 'return') {
        await assetsAPI.return(asset.id, {
          condition_on_return: formData.condition_on_return,
          to_location_id: formData.to_location_id ? parseInt(formData.to_location_id) : undefined,
          remarks: formData.remarks,
        });
      } else if (action === 'transfer') {
        await assetsAPI.transfer(asset.id, {
          to_location_id: parseInt(formData.to_location_id),
          remarks: formData.remarks,
        });
      }
      onSave();
    } catch (error) {
      console.error('Failed to perform action:', error);
      alert('Failed: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button type="button" className="rounded-md bg-white text-gray-400 hover:text-gray-500" onClick={onClose}>
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                  Asset Actions: {asset.asset_tag}
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Action *</label>
                    <select
                      required
                      value={action}
                      onChange={(e) => setAction(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                      <option value="">Select action</option>
                      {asset.status === 'AVAILABLE' && <option value="checkout">Checkout</option>}
                      {asset.status === 'ASSIGNED' && <option value="return">Return</option>}
                      {asset.status !== 'RETIRED' && <option value="transfer">Transfer</option>}
                    </select>
                  </div>

                  {action === 'checkout' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Assign to User ID *</label>
                      <input
                        type="number"
                        required
                        value={formData.assigned_to_id}
                        onChange={(e) => setFormData({ ...formData, assigned_to_id: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  )}

                  {action === 'return' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Condition *</label>
                        <select
                          value={formData.condition_on_return}
                          onChange={(e) => setFormData({ ...formData, condition_on_return: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        >
                          <option value="GOOD">Good</option>
                          <option value="DAMAGED">Damaged</option>
                          <option value="MISSING_PARTS">Missing Parts</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Return to Location</label>
                        <select
                          value={formData.to_location_id}
                          onChange={(e) => setFormData({ ...formData, to_location_id: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        >
                          <option value="">Same location</option>
                          {locations.map(loc => (
                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {action === 'transfer' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Transfer to Location *</label>
                      <select
                        required
                        value={formData.to_location_id}
                        onChange={(e) => setFormData({ ...formData, to_location_id: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                        <option value="">Select location</option>
                        {locations.map(loc => (
                          <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {action && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Remarks</label>
                      <textarea
                        rows={3}
                        value={formData.remarks}
                        onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  )}

                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={loading || !action}
                      className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Submit'}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
