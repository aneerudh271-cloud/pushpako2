import { useState, useEffect } from 'react';
import { Loader2, TrendingUp, ArrowUpRight } from 'lucide-react';

export default function AnalyticsTab() {
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

  if (!data) return <div className="text-red-400">Failed to load analytics</div>;

  const maxViews = Math.max(...data.traffic.topPages.map(p => p.views), 1);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Traffic Analytics</h2>
        <span className="text-sm text-gray-400">Real-time Data</span>
      </div>

      {/* Pages Table */}
      <div className="bg-[#0F172A] border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Top Visited Pages
          </h3>
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Views: {data.traffic.pageViews.toLocaleString()}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Page Path</th>
                <th className="px-6 py-4">Title / Context</th>
                <th className="px-6 py-4 text-right">Views</th>
                <th className="px-6 py-4 w-1/3">Traffic Distribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {data.traffic.topPages.length > 0 ? (
                data.traffic.topPages.map((page, index) => {
                  const percent = (page.views / maxViews) * 100;
                  return (
                    <tr key={index} className="hover:bg-gray-800/30 transition-colors group">
                      <td className="px-6 py-4 font-mono text-sm text-blue-400 group-hover:text-blue-300">
                        {page.page}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {page.title}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-white">
                        {page.views.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-purple-500 rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    No traffic data available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}