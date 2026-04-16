export default function PerformanceTab() {
  return (
    <div className="bg-gray-800 p-4 md:p-6 rounded-lg">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Company Performance</h2>
      <p className="text-gray-300 mb-6">Track the company's growth and key metrics.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-2">Fleet Expansion</h4>
          <p className="text-gray-400">24 aircraft deployed, 5 new models in development.</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-2">Market Reach</h4>
          <p className="text-gray-400">Operating in 12 cities, expanding to 5 more this year.</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg sm:col-span-2">
          <h4 className="text-lg font-semibold mb-2">Financial Metrics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-400">$2.5M</p>
              <p className="text-sm text-gray-400">Revenue Q4</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">15%</p>
              <p className="text-sm text-gray-400">Growth Rate</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">50+</p>
              <p className="text-sm text-gray-400">Active Routes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-400">98%</p>
              <p className="text-sm text-gray-400">Uptime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}