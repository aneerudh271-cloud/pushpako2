import { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader2, Link, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ImageUpload({
  value,
  onChange,
  label = 'Image',
  required = false,
  disabled = false,
  className = '',
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value || '');
  const [mode, setMode] = useState(value ? 'url' : 'upload'); // 'upload' or 'url'
  const [urlInput, setUrlInput] = useState(value || '');
  // Sync with prop value
  useEffect(() => {
    if (value) {
      setPreviewUrl(value);
      setUrlInput(value);
      // Auto-switch to URL mode if it looks like a URL and we are not uploading
      if (value.startsWith('http') || value.startsWith('/')) {
        // Keep current mode if user is actively uploading, but initial load should show preview
        if (!isUploading) {
          // Optional: You could switch to URL mode, but keeping Preview is enough
        }
      }
    } else {
      setPreviewUrl('');
      setUrlInput('');
    }
  }, [value, isUploading]);

  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      toast.error(`Invalid file type. Please select: ${acceptedTypes.join(', ')}`);
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      toast.error(`File size too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }

    setIsUploading(true);
    try {
      // For Vercel Blob, we send the file as the body and the filename as a query param
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      const uploadedUrl = data.url;

      setPreviewUrl(uploadedUrl);
      setUrlInput(uploadedUrl);
      onChange(uploadedUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (newUrl) => {
    setUrlInput(newUrl);
    setPreviewUrl(newUrl);
    onChange(newUrl);
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    if (newMode === 'url') {
      toast('Switched to URL input mode');
    } else {
      toast('Switched to file upload mode');
    }
  };

  const clearImage = () => {
    setPreviewUrl('');
    setUrlInput('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageError = () => {
    setPreviewUrl('');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => handleModeSwitch('upload')}
          className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition-colors ${mode === 'upload'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          disabled={disabled || isUploading}
        >
          <Upload className="w-4 h-4" />
          Upload File
        </button>
        <button
          type="button"
          onClick={() => handleModeSwitch('url')}
          className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition-colors ${mode === 'url'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          disabled={disabled || isUploading}
        >
          <Link className="w-4 h-4" />
          URL
        </button>
      </div>

      {/* Upload Mode */}
      {mode === 'upload' && (
        <div className="space-y-3">
          <div
            onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${disabled || isUploading
              ? 'border-gray-600 bg-gray-800 cursor-not-allowed'
              : 'border-gray-600 hover:border-gray-500 bg-gray-800 hover:bg-gray-750'
              }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                <p className="text-gray-300">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-gray-400" />
                <p className="text-gray-300">Click to upload image</p>
                <p className="text-xs text-gray-500">
                  Max {Math.round(maxSize / 1024 / 1024)}MB • {acceptedTypes.join(', ')}
                </p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled || isUploading}
          />
        </div>
      )}

      {/* URL Mode */}
      {mode === 'url' && (
        <input
          type="url"
          placeholder="Enter image URL"
          value={urlInput}
          onChange={(e) => handleUrlChange(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded disabled:opacity-50"
          disabled={disabled}
          required={required}
        />
      )}

      {/* Preview */}
      {previewUrl && (
        <div className="relative inline-block">
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-xs h-auto rounded border border-gray-600"
              onError={handleImageError}
            />
            {!disabled && (
              <button
                type="button"
                onClick={clearImage}
                className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 cursor-pointer"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1 break-all">{previewUrl}</p>
        </div>
      )}

      {/* Empty State */}
      {!previewUrl && (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <ImageIcon className="w-4 h-4" />
          <span>No image selected</span>
        </div>
      )}
    </div>
  );
}