import React from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import ImageUpload from '@/components/ui/ImageUpload';

const DEPARTMENTS = ['Executive', 'Technology', 'Engineering', 'Operations', 'Safety', 'Marketing', 'Sales', 'IT'];

export function AddEditTeamDialog({ isOpen, onClose, onSave, member, saving }) {
  const [formData, setFormData] = React.useState({
    name: '',
    position: '',
    image: '',
    bio: '',
    department: 'Executive',
    order: '',
  });

  React.useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        position: member.position || member.role || '',
        image: member.image || '',
        bio: member.bio || '',
        department: member.department || 'Executive',
        order: member.order ?? '',
      });
    } else {
      setFormData({
        name: '',
        position: '',
        image: '',
        bio: '',
        department: 'Executive',
        order: '',
      });
    }
  }, [member, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 py-10">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-4xl max-h-full overflow-y-auto hide-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{member ? 'Edit Team Member' : 'Add New Team Member'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name *"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full p-2 bg-gray-700 rounded"
                required
              />
              <input
                type="text"
                placeholder="Position/Role *"
                value={formData.position}
                onChange={(e) => handleChange('position', e.target.value)}
                className="w-full p-2 bg-gray-700 rounded"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                className="w-full p-2 bg-gray-700 rounded"
                required
              >
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Sort Order (1 for Founder)"
                value={formData.order ?? ''}
                onChange={(e) => handleChange('order', e.target.value)}
                className="w-full p-2 bg-gray-700 rounded"
              />
            </div>

            {/* Profile Image */}
            <ImageUpload
              label="Profile Image"
              value={formData.image}
              onChange={(value) => handleChange('image', value)}
            />

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bio *</label>
              <textarea
                placeholder="Biography"
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                className="w-full p-2 bg-gray-700 rounded"
                rows="3"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Saving...' : (member ? 'Update Member' : 'Add Member')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ViewTeamDialog({ isOpen, onClose, member }) {
  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 py-10">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-4xl max-h-full overflow-y-auto hide-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">View Team Member</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-6">
            <img
              src={member.image || '/placeholder-avatar.jpg'}
              alt={member.name}
              className="w-24 h-24 rounded-full object-cover bg-gray-600"
              onError={(e) => { e.target.src = '/placeholder-avatar.jpg'; }}
            />
            <div>
              <h4 className="text-2xl font-bold text-white">{member.name}</h4>
              <p className="text-blue-400 text-lg">{member.position || member.role}</p>
              {member.department && (
                <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-700 rounded-full text-gray-300">
                  {member.department}
                </span>
              )}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Biography</label>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-white whitespace-pre-line">{member.bio}</p>
            </div>
          </div>

        </div>
        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500">Close</button>
        </div>
      </div>
    </div>
  );
}
