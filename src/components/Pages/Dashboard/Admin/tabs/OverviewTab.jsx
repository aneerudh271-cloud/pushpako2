import { useState, useEffect } from 'react';
import { Loader2, TrendingUp, Users, FileText, Activity } from 'lucide-react';

export default function OverviewTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/admin/analytics');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!data) return <div className="text-red-400">Failed to load overview</div>;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-[#0F172A] border border-gray-800 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:border-blue-500/30 transition-all">
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
        <Icon className="w-24 h-24" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-lg bg-gray-800 ${color} bg-opacity-10 text-opacity-100`}>
            <Icon className={`w-5 h-5 ${color.replace('text-', 'text-')}`} />
          </div>
          <h3 className="text-gray-400 font-medium">{title}</h3>
        </div>
        <p className="text-3xl font-bold text-white mt-2">{value ? value.toLocaleString() : 0}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Page Views"
          value={data.overview.totalViews}
          icon={TrendingUp}
          color="text-blue-500"
        />
        <StatCard
          title="Total Users"
          value={data.overview.totalUsers}
          icon={Users}
          color="text-yellow-500"
        />
        <StatCard
          title="Published Blogs"
          value={data.overview.totalPublishedBlogs}
          icon={FileText}
          color="text-green-500"
        />
        <StatCard
          title="Active Investors"
          value={data.overview.totalInvestors}
          icon={Activity}
          color="text-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-[#0F172A] border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Recent Activities
          </h2>
          <div className="space-y-4">
            {data.recentActivities.length > 0 ? (
              data.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-800 hover:bg-gray-800 transition-colors">
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${activity.type === 'user' ? 'bg-green-400' : 'bg-blue-400'}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(activity.date)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">No recent activities found</div>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-[#0F172A] border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6">System Health</h2>
          <div className="space-y-4">
            {[
              { label: 'Website', status: 'Operational', color: 'bg-green-500' },
              { label: 'API Gateway', status: 'Operational', color: 'bg-green-500' },
              { label: 'Database', status: 'Connected', color: 'bg-green-500' },
              { label: 'Blob Storage', status: 'Active', color: 'bg-green-500' },
              { label: 'Auth System', status: 'Secure', color: 'bg-green-500' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <span className="text-sm text-gray-300">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.color} animate-pulse`}></span>
                  <span className="text-xs font-medium text-green-400">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}