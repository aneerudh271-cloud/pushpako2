import { Plus, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AddEditServicesDialog, ViewServicesDialog } from './ServiceOperations';
import { DeleteDialog } from '@/components/ui/DeleteDialog';

export default function ServicesManagement() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Fetch services from API
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/services');
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: 'Products',
    status: 'active',
    icon: '',
    featuredImage: '',
    features: [],
    isPopular: false,
  });

  const handleAddService = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      category: 'Products',
      status: 'active',
      icon: '',
      featuredImage: '',
      features: [],
      isPopular: false,
    });
    setIsAddDialogOpen(true);
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setFormData({
      title: service.title,
      slug: service.slug,
      description: service.description,
      category: service.category,
      status: service.status,
      icon: service.icon,
      featuredImage: service.featuredImage || '',
      features: service.features,
      isPopular: service.isPopular,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteService = (service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const handleViewService = (service) => {
    setSelectedService(service);
    setIsViewDialogOpen(true);
  };

  const handleSubmitAdd = async () => {
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          images: [],
          pricing: {},
          testimonials: [],
          specifications: {},
          bookingUrl: '',
          inquirySystem: 'integrated',
          order: services.length + 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create service');
      }

      await fetchServices(); // Refresh the list
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error creating service:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleSubmitEdit = async () => {
    try {
      const response = await fetch(`/api/services/${selectedService._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update service');
      }

      await fetchServices(); // Refresh the list
      setIsEditDialogOpen(false);
      setSelectedService(null);
    } catch (error) {
      console.error('Error updating service:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`/api/services/${selectedService._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete service');
      }

      await fetchServices(); // Refresh the list
      setIsDeleteDialogOpen(false);
      setSelectedService(null);
    } catch (error) {
      console.error('Error deleting service:', error);
      // You might want to show an error message to the user here
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        <span className="ml-2 text-gray-300">Loading services...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-900 border border-red-700 rounded-lg p-4">
          <h3 className="text-red-400 font-semibold">Error loading services</h3>
          <p className="text-red-300 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Services Management</h2>
        <button className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2" onClick={handleAddService}>
          <Plus className="w-4 h-4" />
          Add New Service
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Pricing</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Inquiries</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {services.map((service) => (
                <tr key={service._id} className="hover:bg-gray-750">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-white">{service.title}</div>
                      <div className="text-sm text-gray-400 ml-2">{service.description.substring(0, 40)}...</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{service.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      service.status === 'active' ? 'bg-green-600 text-white' :
                      service.status === 'development' ? 'bg-yellow-600 text-white' : 'bg-gray-600 text-white'
                    }`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {service.pricing?.standard ? `$${service.pricing.standard.price?.toLocaleString() || 'N/A'}` : 'Custom'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {/* Placeholder for inquiries - you might want to add this to your API */}
                    0
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-400 hover:text-blue-300 transition-colors" onClick={() => handleViewService(service)}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-yellow-400 hover:text-yellow-300 transition-colors" onClick={() => handleEditService(service)}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-400 hover:text-red-300 transition-colors" onClick={() => handleDeleteService(service)}>
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

      {/* Services Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Services</h3>
          <p className="text-3xl font-bold text-blue-400">{services.length}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Active Services</h3>
          <p className="text-3xl font-bold text-green-400">{services.filter(s => s.status === 'active').length}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Inquiries</h3>
          <p className="text-3xl font-bold text-yellow-400">0</p> {/* Placeholder - you can add inquiry tracking later */}
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Popular Services</h3>
          <p className="text-3xl font-bold text-purple-400">{services.filter(s => s.isPopular).length}</p>
        </div>
      </div>

      <AddEditServicesDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleSubmitAdd}
        formData={formData}
        setFormData={setFormData}
        isEdit={false}
      />

      <AddEditServicesDialog
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
        title="Delete Service"
        itemName={selectedService?.title}
        itemType="service"
      />

      <ViewServicesDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        service={selectedService}
      />
    </div>
  );
}