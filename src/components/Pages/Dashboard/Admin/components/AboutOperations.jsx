import { X } from 'lucide-react';
import ImageUpload from '@/components/ui/ImageUpload';

const SECTION_LABELS = {
  hero: 'Hero Section',
  vision: 'Vision Section',
  mission: 'Mission Section',
  value: 'Core Value',
  philosophy: 'Core Philosophy',
};

const ICON_OPTIONS = [
  'Star', 'Flag', 'Lightbulb', 'Shield', 'Plane', 'Cog', 'Leaf', 'Target',
  'Brain', 'Award', 'CheckCircle', 'Users', 'Building2'
];

export function AddEditAboutUsDialog({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEdit,
  saving = false,
  sectionType = 'value'
}) {
  if (!isOpen) return null;

  const sectionLabel = SECTION_LABELS[sectionType] || 'Section';
  const showImage = ['hero', 'vision'].includes(sectionType);
  const showSubtitle = sectionType === 'hero';
  const showIcon = ['value'].includes(sectionType);
  const isMultilineContent = sectionType === 'mission';

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 py-10">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-3xl max-h-full overflow-y-auto hide-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {isEdit ? `Edit ${sectionLabel}` : `Add New ${sectionLabel}`}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Section Type</label>
              <input
                type="text"
                value={sectionLabel}
                className="w-full p-2 bg-gray-700 rounded opacity-50"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
              <input
                type="text"
                placeholder="Enter title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 bg-gray-700 rounded disabled:opacity-50"
                required
                disabled={saving}
              />
            </div>

            {showSubtitle && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subtitle</label>
                <input
                  type="text"
                  placeholder="Enter subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full p-2 bg-gray-700 rounded disabled:opacity-50"
                  disabled={saving}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {isMultilineContent ? 'Items (one per line) *' : 'Content/Description *'}
              </label>
              <textarea
                placeholder={isMultilineContent ? 'Enter each item on a new line' : 'Enter content'}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full p-2 bg-gray-700 rounded disabled:opacity-50"
                rows={isMultilineContent ? 8 : 5}
                required
                disabled={saving}
              />
              {isMultilineContent && (
                <p className="text-xs text-gray-400 mt-1">Each line will become a separate mission item</p>
              )}
            </div>

            {sectionType === 'vision' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Extended Content</label>
                <textarea
                  placeholder="Enter extended content (optional)"
                  value={formData.extendedContent || ''}
                  onChange={(e) => setFormData({ ...formData, extendedContent: e.target.value })}
                  className="w-full p-2 bg-gray-700 rounded disabled:opacity-50"
                  rows="4"
                  disabled={saving}
                />
              </div>
            )}

            {showIcon && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
                <select
                  value={formData.icon || 'Star'}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full p-2 bg-gray-700 rounded disabled:opacity-50"
                  disabled={saving}
                >
                  {ICON_OPTIONS.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
            )}

            {showImage && (
              <ImageUpload
                label="Image"
                value={formData.image}
                onChange={(value) => setFormData({ ...formData, image: value })}
                disabled={saving}
              />
            )}

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                disabled={saving}
              />
              <span className="text-gray-300">Active</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? 'Saving...' : (isEdit ? `Update ${sectionLabel}` : `Add ${sectionLabel}`)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ViewAboutUsDialog({ isOpen, onClose, section }) {
  if (!isOpen || !section) return null;

  const sectionLabel = SECTION_LABELS[section.section] || 'Section';

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 py-10">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-3xl max-h-full overflow-y-auto hide-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">View {sectionLabel}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400">Section Type</label>
            <p className="mt-1 text-white">{sectionLabel}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Title</label>
            <p className="mt-1 text-white">{section.title}</p>
          </div>
          {section.subtitle && (
            <div>
              <label className="block text-sm font-medium text-gray-400">Subtitle</label>
              <p className="mt-1 text-white">{section.subtitle}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-400">Content</label>
            <div className="mt-1 text-white bg-gray-700 p-3 rounded whitespace-pre-line">
              {section.content}
            </div>
          </div>
          {section.image && (
            <div>
              <label className="block text-sm font-medium text-gray-400">Image</label>
              <div className="mt-1">
                <img
                  src={section.image}
                  alt="Section image"
                  className="max-w-xs rounded"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <p className="text-gray-400 text-sm mt-1">{section.image}</p>
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-400">Status</label>
            <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${section.isActive ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
              }`}>
              {section.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
