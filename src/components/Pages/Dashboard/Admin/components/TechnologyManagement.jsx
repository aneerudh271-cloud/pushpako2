import { Plus, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AddEditTechnologyDialog, ViewTechnologyDialog } from './TechnologyOperations';
import { DeleteDialog } from '@/components/ui/DeleteDialog';
import toast from 'react-hot-toast';

export default function TechnologyManagement() {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogState, setDialogState] = useState({
    add: false,
    edit: false,
    view: false,
    delete: false,
  });
  const [selectedTechnology, setSelectedTechnology] = useState(null);
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    status: 'active',
    version: '',
    downloads: 0,
    featuredImage: '',
  });

  // Fetch technologies from API
  const fetchTechnologies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/technologies');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch technologies (${response.status})`);
      }
      const data = await response.json();
      setTechnologies(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching technologies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const handleOpenDialog = (type, technology = null) => {
    setSelectedTechnology(technology);
    if (type === 'edit' && technology) {
      setFormData({
        title: technology.title,
        description: technology.description,
        category: technology.category,
        status: technology.status,
        version: technology.version,
        downloads: technology.downloads,
        featuredImage: technology.featuredImage,
      });
    } else if (type === 'add') {
      setFormData({
        title: '',
        description: '',
        category: '',
        status: 'active',
        version: '',
        downloads: 0,
        featuredImage: '',
      });
    }
    setDialogState(prev => ({ ...prev, [type]: true }));
  };

  const handleCloseDialog = () => {
    setDialogState({
      add: false,
      edit: false,
      view: false,
      delete: false,
    });
    setSelectedTechnology(null);
  };

  const handleConfirmDelete = async () => {
    setIsSubmittingDelete(true);
    try {
      const response = await fetch(`/api/technologies/${selectedTechnology._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete technology');
      }

      await fetchTechnologies(); // Refresh the list
      handleCloseDialog();
      toast.success('Technology deleted successfully');
    } catch (error) {
      console.error('Error deleting technology:', error);
      toast.error(error.message || 'Failed to delete technology');
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  const handleSubmitAdd = async () => {
    setIsSubmittingAdd(true);
    try {
      const response = await fetch('/api/technologies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          views: 0,
          images: [],
          videos: [],
          features: [],
          partners: [],
          documentation: [],
          isFeatured: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create technology');
      }

      await fetchTechnologies(); // Refresh the list
      setFormData({
        title: '',
        description: '',
        category: '',
        status: 'active',
        version: '',
        downloads: 0,
        featuredImage: '',
      });
      handleCloseDialog();
      toast.success('Technology created successfully');
    } catch (error) {
      console.error('Error creating technology:', error);
      toast.error(error.message || 'Failed to create technology');
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  const handleSubmitEdit = async () => {
    setIsSubmittingEdit(true);
    try {
      const response = await fetch(`/api/technologies/${selectedTechnology._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update technology');
      }

      await fetchTechnologies(); // Refresh the list
      handleCloseDialog();
      toast.success('Technology updated successfully');
    } catch (error) {
      console.error('Error updating technology:', error);
      toast.error(error.message || 'Failed to update technology');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        <span className="ml-2 text-gray-300">Loading technologies...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-900 border border-red-700 rounded-lg p-4">
          <h3 className="text-red-400 font-semibold">Error loading technologies</h3>
          <p className="text-red-300 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Technology Management</h2>
        <button onClick={() => handleOpenDialog('add')} className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4" />
          Add New Technology
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Technology</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Version</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Downloads</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {technologies.map((tech) => (
                <tr key={tech._id} className="hover:bg-gray-750">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {tech.featuredImage ? (
                        <img className="h-10 w-10 rounded-lg object-cover" src={tech.featuredImage} alt={tech.title} />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-600 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{tech.title}</div>
                        <div className="text-sm text-gray-400">{tech.description.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{tech.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${tech.status === 'active' ? 'bg-green-600 text-white' :
                        tech.status === 'development' ? 'bg-yellow-600 text-white' : 'bg-gray-600 text-white'
                      }`}>
                      {tech.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{tech.version}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{tech.downloads}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleOpenDialog('view', tech)} className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleOpenDialog('edit', tech)} className="text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleOpenDialog('delete', tech)} className="text-red-400 hover:text-red-300 transition-colors cursor-pointer">
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

      {/* Technology Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Technologies</h3>
          <p className="text-3xl font-bold text-blue-400">{technologies.length}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Active</h3>
          <p className="text-3xl font-bold text-green-400">{technologies.filter(t => t.status === 'active').length}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Downloads</h3>
          <p className="text-3xl font-bold text-yellow-400">{technologies.reduce((sum, t) => sum + t.downloads, 0)}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Views</h3>
          <p className="text-3xl font-bold text-purple-400">{technologies.reduce((sum, t) => sum + t.views, 0)}</p>
        </div>
      </div>

      <DeleteDialog
        isOpen={dialogState.delete}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Technology"
        itemName={selectedTechnology?.title}
        itemType="technology"
        isSubmitting={isSubmittingDelete}
      />

      {/* Add / Edit Technology Dialog */}
      <AddEditTechnologyDialog
        isOpen={dialogState.add || dialogState.edit}
        isEdit={dialogState.edit}
        onClose={handleCloseDialog}
        onSubmit={dialogState.add ? handleSubmitAdd : handleSubmitEdit}
        formData={formData}
        setFormData={setFormData}
        isSubmitting={dialogState.add ? isSubmittingAdd : isSubmittingEdit}
      />

      {/* View Technology Dialog */}
      <ViewTechnologyDialog
        isOpen={dialogState.view}
        technology={selectedTechnology}
        onClose={handleCloseDialog}
      />

    </div>
  );
}