import { useEffect, useState } from 'react';
import { transactionsAPI, assetsAPI } from '../api/client';
import { format } from 'date-fns';

const TYPE_COLORS = {
  CHECKOUT: 'bg-blue-100 text-blue-800',
  RETURN: 'bg-green-100 text-green-800',
  TRANSFER: 'bg-purple-100 text-purple-800',
  REPAIR: 'bg-yellow-100 text-yellow-800',
  RETIRE: 'bg-red-100 text-red-800',
};

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [transactionsRes, assetsRes] = await Promise.all([
        transactionsAPI.getAll(),
        assetsAPI.getAll(),
      ]);
      setTransactions(transactionsRes.data);
      setAssets(assetsRes.data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
      alert('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const getAssetInfo = (assetId) => {
    const asset = assets.find(a => a.id === assetId);
    return asset ? `${asset.asset_tag} - ${asset.name}` : `Asset #${assetId}`;
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
        <p className="mt-2 text-sm text-gray-700">View all asset transactions</p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${TYPE_COLORS[transaction.type]}`}>
                    {transaction.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getAssetInfo(transaction.asset)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.from_location ? `Location #${transaction.from_location}` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.to_location ? `Location #${transaction.to_location}` : '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {transaction.remarks || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
}
