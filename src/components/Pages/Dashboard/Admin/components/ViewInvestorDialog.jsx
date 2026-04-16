import { X } from 'lucide-react';

export default function ViewInvestorDialog({ isOpen, onClose, investor }) {
  if (!isOpen || !investor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Investor Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <img className="h-16 w-16 rounded-full object-cover" src={investor.profilePicture} alt={investor.name} />
            <div>
              <h4 className="text-lg font-semibold">{investor.name}</h4>
              <p className="text-gray-400">{investor.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><strong>Phone:</strong> {investor.phone}</div>
            <div><strong>Type:</strong> {investor.type}</div>
            <div><strong>Investment:</strong> ${investor.investmentAmount.toLocaleString()}</div>
            <div><strong>Current Value:</strong> ${investor.currentValue.toLocaleString()}</div>
            <div><strong>ROI:</strong> {investor.roi}%</div>
            <div><strong>Status:</strong> {investor.status}</div>
            <div><strong>Risk Profile:</strong> {investor.riskProfile}</div>
            <div><strong>Stage:</strong> {investor.investmentStage}</div>
            <div><strong>Join Date:</strong> {investor.joinDate}</div>
            <div><strong>Last Contact:</strong> {investor.lastContact}</div>
          </div>
          <div><strong>Notes:</strong> {investor.notes}</div>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500">Close</button>
        </div>
      </div>
    </div>
  );
}