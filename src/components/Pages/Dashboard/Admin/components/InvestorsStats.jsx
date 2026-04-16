export default function InvestorsStats({ investors }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Total Investors</h3>
        <p className="text-3xl font-bold text-blue-400">{investors.length}</p>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Active Investors</h3>
        <p className="text-3xl font-bold text-green-400">{investors.filter(i => i.status === 'active').length}</p>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Total Investment</h3>
        <p className="text-3xl font-bold text-yellow-400">${investors.reduce((sum, i) => sum + i.investmentAmount, 0).toLocaleString()}</p>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Avg ROI</h3>
        <p className="text-3xl font-bold text-purple-400">{investors.length > 0 ? (investors.reduce((sum, i) => sum + i.roi, 0) / investors.length).toFixed(1) : 0}%</p>
      </div>
    </div>
  );
}