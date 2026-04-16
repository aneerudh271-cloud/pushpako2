import { Eye, Edit, Trash2 } from 'lucide-react';

export default function InvestorsTable({ investors, onView, onEdit, onDelete }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Investor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Auth Provider</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Investment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Current Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ROI</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {investors.map((investor, index) => (
              <tr key={investor._id || index} className="hover:bg-gray-750">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full object-cover" src={investor.profilePicture || '/placeholder-avatar.jpg'} alt={investor.name} />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">{investor.name}</div>
                      <div className="text-sm text-gray-400">{investor.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300 capitalize">{investor.type}</td>
                <td className="px-6 py-4 text-sm text-gray-300 capitalize">{investor.role || 'investor'}</td>
                <td className="px-6 py-4 text-sm text-gray-300 capitalize">{investor.authProvider || 'email'}</td>
                <td className="px-6 py-4 text-sm text-gray-300">${investor.investmentAmount?.toLocaleString() || 0}</td>
                <td className="px-6 py-4 text-sm text-gray-300">${investor.currentValue?.toLocaleString() || 0}</td>
                <td className="px-6 py-4 text-sm text-green-400">{investor.roi || 0}%</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${investor.status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                    }`}>
                    {investor.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onView(investor)} className="text-blue-400 hover:text-blue-300 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => onEdit(investor)} className="text-yellow-400 hover:text-yellow-300 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(investor)} className="text-red-400 hover:text-red-300 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}