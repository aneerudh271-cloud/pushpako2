import { X } from 'lucide-react';
import ImageUpload from '@/components/ui/ImageUpload';

export function AddEditServicesDialog({ isOpen, onClose, onSubmit, formData, setFormData, isEdit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 py-10">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-4xl max-h-full overflow-y-auto hide-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{isEdit ? 'Edit Service' : 'Add New Service'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 bg-gray-700 rounded"
              required
            />
            <input
              type="text"
              placeholder="Slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full p-2 bg-gray-700 rounded"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 bg-gray-700 rounded"
              rows="3"
              required
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 bg-gray-700 rounded"
            >
              <option value="Products">Products</option>
              <option value="Services">Services</option>
              <option value="Solutions">Solutions</option>
            </select>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2 bg-gray-700 rounded"
            >
              <option value="active">Active</option>
              <option value="development">Development</option>
              <option value="deprecated">Deprecated</option>
            </select>
            <input
              type="text"
              placeholder="Icon"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full p-2 bg-gray-700 rounded"
            />
            <ImageUpload
              label="Featured Image"
              value={formData.featuredImage || ''}
              onChange={(value) => setFormData({ ...formData, featuredImage: value })}
            />
            <input
              type="text"
              placeholder="Features (comma separated)"
              value={formData.features.join(', ')}
              onChange={(e) => setFormData({ ...formData, features: e.target.value.split(',').map(f => f.trim()) })}
              className="w-full p-2 bg-gray-700 rounded"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
              />
              Popular Service
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">{isEdit ? 'Update Service' : 'Add Service'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ViewServicesDialog({ isOpen, onClose, service }) {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 py-10">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-4xl max-h-full overflow-y-auto hide-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">View Service</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Title</label>
            <p className="mt-1 text-white">{service.title}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Description</label>
            <p className="mt-1 text-white">{service.description}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Category</label>
            <p className="mt-1 text-white">{service.category}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Status</label>
            <p className="mt-1 text-white capitalize">{service.status}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Features</label>
            <p className="mt-1 text-white">{service.features.join(', ')}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Popular</label>
            <p className="mt-1 text-white">{service.isPopular ? 'Yes' : 'No'}</p>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500">Close</button>
        </div>
      </div>
    </div>
  );
}