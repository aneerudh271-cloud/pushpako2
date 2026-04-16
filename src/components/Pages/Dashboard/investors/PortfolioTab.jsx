export default function PortfolioTab({ investor }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-gray-800 p-4 md:p-6 rounded-lg">
          <h3 className="text-lg md:text-xl font-semibold mb-2">Investment Amount</h3>
          <p className="text-2xl md:text-3xl font-bold text-green-400">${investor.investmentAmount?.toLocaleString() || '0'}</p>
        </div>
        <div className="bg-gray-800 p-4 md:p-6 rounded-lg">
          <h3 className="text-lg md:text-xl font-semibold mb-2">Current Value</h3>
          <p className="text-2xl md:text-3xl font-bold text-blue-400">${investor.currentValue?.toLocaleString() || '0'}</p>
        </div>
        <div className="bg-gray-800 p-4 md:p-6 rounded-lg sm:col-span-2 lg:col-span-1">
          <h3 className="text-lg md:text-xl font-semibold mb-2">ROI</h3>
          <p className="text-2xl md:text-3xl font-bold text-yellow-400">+{investor.roi?.toFixed(2) || '0.00'}%</p>
        </div>
      </div>

      {/* Portfolio Breakdown if available */}
      {investor.portfolio && investor.portfolio.length > 0 && (
        <div className="bg-gray-800 p-4 md:p-6 rounded-lg">
          <h3 className="text-lg md:text-xl font-semibold mb-4">Portfolio Breakdown</h3>
          <div className="space-y-3">
            {investor.portfolio.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-300">{item.company}</span>
                <div className="text-right">
                  <span className="text-green-400">${item.invested?.toLocaleString() || '0'}</span>
                  <span className="text-gray-400 text-sm ml-2">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}