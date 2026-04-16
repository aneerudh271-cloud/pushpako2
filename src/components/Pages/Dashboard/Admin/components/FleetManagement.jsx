import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AddEditFleetDialog, ViewFleetDialog } from './FleetOperations';
import { DeleteDialog } from '@/components/ui/DeleteDialog';

export default function FleetManagement() {
  const [fleet, setFleet] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    model: '',
    status: 'active',
    location: '',
    flightHours: 0,
  });

  const handleAddAircraft = () => {
    setFormData({
      name: '',
      type: '',
      model: '',
      status: 'active',
      location: '',
      flightHours: 0,
    });
    setIsAddDialogOpen(true);
  };

  const handleEditAircraft = (aircraft) => {
    setSelectedAircraft(aircraft);
    setFormData({
      name: aircraft.name,
      type: aircraft.type,
      model: aircraft.model,
      status: aircraft.status,
      location: aircraft.location,
      flightHours: aircraft.flightHours,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteAircraft = (aircraft) => {
    setSelectedAircraft(aircraft);
    setIsDeleteDialogOpen(true);
  };

  const handleViewAircraft = (aircraft) => {
    setSelectedAircraft(aircraft);
    setIsViewDialogOpen(true);
  };

  const handleSubmitAdd = () => {
    const newAircraft = {
      ...formData,
      id: Date.now().toString(),
      image: '',
    };
    setFleet([...fleet, newAircraft]);
    setIsAddDialogOpen(false);
  };

  const handleSubmitEdit = () => {
    const updatedAircraft = {
      ...selectedAircraft,
      ...formData,
    };
    setFleet(fleet.map(aircraft => aircraft.id === selectedAircraft.id ? updatedAircraft : aircraft));
    setIsEditDialogOpen(false);
    setSelectedAircraft(null);
  };

  const handleConfirmDelete = () => {
    setFleet(fleet.filter(aircraft => aircraft.id !== selectedAircraft.id));
    setIsDeleteDialogOpen(false);
    setSelectedAircraft(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Fleet Management</h2>
        <button className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2" onClick={handleAddAircraft}>
          <Plus className="w-4 h-4" />
          Add New Aircraft
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Aircraft</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Flight Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {fleet.map((aircraft) => (
                <tr key={aircraft.id} className="hover:bg-gray-750">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-white">{aircraft.name}</div>
                    <div className="text-sm text-gray-400">{aircraft.type}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{aircraft.model}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      aircraft.status === 'active' ? 'bg-green-600 text-white' :
                      aircraft.status === 'maintenance' ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {aircraft.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{aircraft.location}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{aircraft.flightHours}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-400 hover:text-blue-300 transition-colors" onClick={() => handleViewAircraft(aircraft)}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-yellow-400 hover:text-yellow-300 transition-colors" onClick={() => handleEditAircraft(aircraft)}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-400 hover:text-red-300 transition-colors" onClick={() => handleDeleteAircraft(aircraft)}>
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

      {/* Fleet Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Aircraft</h3>
          <p className="text-3xl font-bold text-blue-400">{fleet.length}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Active</h3>
          <p className="text-3xl font-bold text-green-400">{fleet.filter(f => f.status === 'active').length}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">In Maintenance</h3>
          <p className="text-3xl font-bold text-yellow-400">{fleet.filter(f => f.status === 'maintenance').length}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Flight Hours</h3>
          <p className="text-3xl font-bold text-purple-400">{fleet.reduce((sum, f) => sum + f.flightHours, 0)}</p>
        </div>
      </div>

      <AddEditFleetDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleSubmitAdd}
        formData={formData}
        setFormData={setFormData}
        isEdit={false}
      />

      <AddEditFleetDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleSubmitEdit}
        formData={formData}
        setFormData={setFormData}
        isEdit={true}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Aircraft"
        itemName={selectedAircraft?.name}
        itemType="aircraft"
      />

      <ViewFleetDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        aircraft={selectedAircraft}
      />
    </div>
  );
}