export default function ReportsTab() {
  const reports = [
    { name: 'Q4 2023 Report', type: 'Quarterly', size: '2.4 MB', date: '2024-01-15' },
    { name: 'Annual 2023 Report', type: 'Annual', size: '5.1 MB', date: '2024-01-10' },
    { name: 'Investor Presentation', type: 'Presentation', size: '8.7 MB', date: '2024-01-05' },
    { name: 'Q3 2023 Report', type: 'Quarterly', size: '2.2 MB', date: '2023-10-15' },
  ];

  return (
    <div className="bg-gray-800 p-4 md:p-6 rounded-lg">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Financial Reports</h2>
      <p className="text-gray-300 mb-6">Access quarterly and annual financial reports.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reports.map((report, index) => (
          <div key={index} className="bg-gray-700 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{report.name}</h3>
              <span className="text-xs bg-blue-600 px-2 py-1 rounded">{report.type}</span>
            </div>
            <div className="text-sm text-gray-400 mb-3">
              <p>Size: {report.size}</p>
              <p>Date: {report.date}</p>
            </div>
            <button className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm w-full sm:w-auto">
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}