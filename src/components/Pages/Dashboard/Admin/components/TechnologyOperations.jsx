import { X, Loader2 } from 'lucide-react';
import ImageUpload from '@/components/ui/ImageUpload';

export function AddEditTechnologyDialog({ isOpen, onClose, onSubmit, formData, setFormData, isEdit, isSubmitting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 py-10">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-4xl max-h-full overflow-y-auto hide-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{isEdit ? 'Edit Technology' : 'Add New Technology'}</h3>
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
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 bg-gray-700 rounded"
              rows="3"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 bg-gray-700 rounded"
            />
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
              placeholder="Version"
              value={formData.version}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              className="w-full p-2 bg-gray-700 rounded"
            />
            <input
              type="number"
              placeholder="Downloads"
              value={formData.downloads}
              onChange={(e) => setFormData({ ...formData, downloads: parseInt(e.target.value) || 0 })}
              className="w-full p-2 bg-gray-700 rounded"
            />
            <ImageUpload
              label="Featured Image"
              value={formData.featuredImage}
              onChange={(value) => setFormData({ ...formData, featuredImage: value })}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? 'Update Technology' : 'Add Technology'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ViewTechnologyDialog({ isOpen, onClose, technology }) {
  if (!isOpen || !technology) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 py-10">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-4xl max-h-full overflow-y-auto hide-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">View Technology</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Title</label>
            <p className="mt-1 text-white">{technology.title}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Description</label>
            <p className="mt-1 text-white">{technology.description}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Category</label>
            <p className="mt-1 text-white">{technology.category}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Status</label>
            <p className="mt-1 text-white capitalize">{technology.status}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Version</label>
            <p className="mt-1 text-white">{technology.version}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Downloads</label>
            <p className="mt-1 text-white">{technology.downloads}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Featured Image</label>
            {technology.featuredImage ? (
              <div className="mt-1">
                <img src={technology.featuredImage} alt={technology.title} className="max-w-xs h-auto rounded" />
                <p className="mt-2 text-white">{technology.featuredImage}</p>
              </div>
            ) : (
              <p className="mt-1 text-gray-400">No image provided</p>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500">Close</button>
        </div>
      </div>
    </div>
  );
}