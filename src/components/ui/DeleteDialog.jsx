import { X, AlertTriangle } from 'lucide-react';

export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  itemType = "item",
  customMessage,
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
  isSubmitting = false
}) {
  if (!isOpen) return null;

  const defaultMessage = `Are you sure you want to delete this ${itemType}?`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            {title}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            {customMessage || defaultMessage}
            {itemName && <strong className="text-white"> "{itemName}"</strong>}?
          </p>
          <p className="text-gray-400 text-sm">
            This action cannot be undone. This will permanently remove the {itemType} from the system.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-white cursor-pointer"
            disabled={isSubmitting}
          >
            {cancelButtonText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white cursor-pointer disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Deleting...' : confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}