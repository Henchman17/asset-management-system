import { useEffect, useState } from 'react';
import { CubeIcon, CheckCircleIcon, WrenchScrewdriverIcon, ArchiveBoxXMarkIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { statsAPI } from '../api/client';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    assigned: 0,
    repair: 0,
    retired: 0,
  });
  const [categoryData, setCategoryData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await statsAPI.getDashboard();
      
      // Calculate stats
      const assets = data.assets || [];
      const statusCounts = {
        total: assets.length,
        available: assets.filter(a => a.status === 'AVAILABLE').length,
        assigned: assets.filter(a => a.status === 'ASSIGNED').length,
        repair: assets.filter(a => a.status === 'REPAIR').length,
        retired: assets.filter(a => a.status === 'RETIRED').length,
      };
      setStats(statusCounts);

      // Group by category
      const categoryMap = {};
      assets.forEach(asset => {
        const catId = asset.category;
        categoryMap[catId] = (categoryMap[catId] || 0) + 1;
      });
      const catData = Object.entries(categoryMap).map(([name, count]) => ({
        name: `Category ${name}`,
        count,
      }));
      setCategoryData(catData);

      // Recent transactions
      const transactions = data.transactions || [];
      setRecentTransactions(transactions.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { name: 'Total Assets', value: stats.total, icon: CubeIcon, color: 'bg-blue-500' },
    { name: 'Available', value: stats.available, icon: CheckCircleIcon, color: 'bg-green-500' },
    { name: 'Assigned', value: stats.assigned, icon: CubeIcon, color: 'bg-yellow-500' },
    { name: 'Under Repair', value: stats.repair, icon: WrenchScrewdriverIcon, color: 'bg-orange-500' },
    { name: 'Retired', value: stats.retired, icon: ArchiveBoxXMarkIcon, color: 'bg-red-500' },
  ];

  const statusData = [
    { name: 'Available', value: stats.available },
    { name: 'Assigned', value: stats.assigned },
    { name: 'Repair', value: stats.repair },
    { name: 'Retired', value: stats.retired },
  ].filter(item => item.value > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="text-3xl font-semibold text-gray-900">{stat.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Asset Status Distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Status Distribution</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 py-20">No data available</div>
          )}
        </div>

        {/* Assets by Category */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Assets by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 py-20">No data available</div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
        </div>
        <div className="overflow-hidden">
          {recentTransactions.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${transaction.type === 'CHECKOUT' ? 'bg-blue-100 text-blue-800' : ''}
                        ${transaction.type === 'RETURN' ? 'bg-green-100 text-green-800' : ''}
                        ${transaction.type === 'TRANSFER' ? 'bg-purple-100 text-purple-800' : ''}
                      `}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Asset #{transaction.asset}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {transaction.remarks || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-gray-500 py-10">No recent transactions</div>
          )}
        </div>
      </div>
    </div>
  );
}
