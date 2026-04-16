import { Edit, Eye, Trash2, Plus, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AddEditAboutUsDialog, ViewAboutUsDialog } from './AboutOperations';
import { DeleteDialog } from '@/components/ui/DeleteDialog';
import toast from 'react-hot-toast';
import { aboutUsPageData, companyProfile } from '@/lib/data/companyData';

export default function AboutUsManagement() {
  const [aboutUs, setAboutUs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedSectionType, setSelectedSectionType] = useState(null);
  const [formData, setFormData] = useState({
    section: '',
    title: '',
    subtitle: '',
    content: '',
    image: '',
    isActive: true,
  });

  // Fetch about us data on component mount
  useEffect(() => {
    fetchAboutUsData();
  }, []);

  const fetchAboutUsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/about-us');
      if (!response.ok) {
        throw new Error('Failed to fetch about us data');
      }
      const data = await response.json();
      setAboutUs(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching about us data:', err);
      // Use hardcoded data as fallback
      setAboutUs(aboutUsPageData);
    } finally {
      setLoading(false);
    }
  };

  const handleEditHero = () => {
    setSelectedSection(aboutUs.hero);
    setSelectedSectionType('hero');
    setFormData({
      section: 'hero',
      title: aboutUs.hero?.title || '',
      subtitle: aboutUs.hero?.subtitle || '',
      content: aboutUs.hero?.description || '',
      image: aboutUs.hero?.backgroundImage || '',
      isActive: true,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditVision = () => {
    setSelectedSection(aboutUs.vision);
    setSelectedSectionType('vision');
    setFormData({
      section: 'vision',
      title: aboutUs.vision?.title || '',
      subtitle: '',
      content: aboutUs.vision?.content || '',
      extendedContent: aboutUs.vision?.extendedContent || '',
      image: aboutUs.vision?.image || '',
      isActive: true,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditMission = () => {
    setSelectedSection(aboutUs.mission);
    setSelectedSectionType('mission');
    setFormData({
      section: 'mission',
      title: aboutUs.mission?.title || 'Our Mission',
      subtitle: '',
      content: (aboutUs.mission?.items || companyProfile.mission).join('\n'),
      image: '',
      isActive: true,
    });
    setIsEditDialogOpen(true);
  };

  const handleAddValue = () => {
    setSelectedSection(null);
    setSelectedSectionType('value');
    setFormData({
      section: 'value',
      title: '',
      subtitle: '',
      content: '',
      icon: 'Star',
      isActive: true,
    });
    setIsAddDialogOpen(true);
  };

  const handleEditValue = (value) => {
    setSelectedSection(value);
    setSelectedSectionType('value');
    setFormData({
      section: 'value',
      title: value.title,
      subtitle: '',
      content: value.description,
      icon: value.icon || 'Star',
      isActive: true,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteValue = (value) => {
    setSelectedSection(value);
    setSelectedSectionType('value');
    setIsDeleteDialogOpen(true);
  };

  const handleViewValue = (value) => {
    setSelectedSection(value);
    setSelectedSectionType('value');
    setIsViewDialogOpen(true);
  };

  const handleAddPhilosophy = () => {
    setSelectedSection(null);
    setSelectedSectionType('philosophy');
    setFormData({
      section: 'philosophy',
      title: '',
      subtitle: '',
      content: '',
      isActive: true,
    });
    setIsAddDialogOpen(true);
  };

  const handleEditPhilosophy = (philosophy) => {
    setSelectedSection(philosophy);
    setSelectedSectionType('philosophy');
    setFormData({
      section: 'philosophy',
      title: philosophy.title,
      subtitle: '',
      content: philosophy.description,
      isActive: true,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeletePhilosophy = (philosophy) => {
    setSelectedSection(philosophy);
    setSelectedSectionType('philosophy');
    setIsDeleteDialogOpen(true);
  };

  const handleSaveSection = async () => {
    try {
      setSaving(true);
      let updateData = {};

      if (selectedSectionType === 'hero') {
        updateData = {
          hero: {
            ...aboutUs.hero,
            title: formData.title,
            subtitle: formData.subtitle,
            description: formData.content,
            backgroundImage: formData.image,
          }
        };
      } else if (selectedSectionType === 'vision') {
        updateData = {
          vision: {
            ...aboutUs.vision,
            title: formData.title,
            content: formData.content,
            extendedContent: formData.extendedContent || formData.content,
            image: formData.image,
          }
        };
      } else if (selectedSectionType === 'mission') {
        updateData = {
          mission: {
            ...aboutUs.mission,
            title: formData.title,
            items: formData.content.split('\n').filter(item => item.trim()),
          }
        };
      } else if (selectedSectionType === 'value') {
        if (selectedSection) {
          // Edit existing value
          updateData = {
            values: (aboutUs.values || []).map(v => v.id === selectedSection.id ? {
              ...v,
              title: formData.title,
              description: formData.content,
              icon: formData.icon || 'Star',
            } : v)
          };
        } else {
          // Add new value
          const newValue = {
            id: Date.now().toString(),
            title: formData.title,
            description: formData.content,
            icon: formData.icon || 'Star',
          };
          updateData = {
            values: [...(aboutUs.values || []), newValue]
          };
        }
      } else if (selectedSectionType === 'philosophy') {
        if (selectedSection) {
          // Edit existing philosophy
          updateData = {
            corePhilosophy: (aboutUs.corePhilosophy || []).map(p => p.id === selectedSection.id ? {
              ...p,
              title: formData.title,
              description: formData.content,
            } : p)
          };
        } else {
          // Add new philosophy
          const newPhilosophy = {
            id: Date.now().toString(),
            title: formData.title,
            description: formData.content,
          };
          updateData = {
            corePhilosophy: [...(aboutUs.corePhilosophy || []), newPhilosophy]
          };
        }
      }

      const response = await fetch('/api/about-us', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update about us data');
      }

      const updatedData = await response.json();
      setAboutUs(updatedData);

      toast.success(`${selectedSectionType} ${selectedSection ? 'updated' : 'added'} successfully!`);
      setError(null);

      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setSelectedSection(null);
      setSelectedSectionType(null);
    } catch (err) {
      console.error('Error saving section:', err);
      const errorMessage = 'Failed to save changes. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setSaving(true);
      let updateData = {};

      if (selectedSectionType === 'value') {
        updateData = {
          values: (aboutUs.values || []).filter(v => v.id !== selectedSection.id)
        };
      } else if (selectedSectionType === 'philosophy') {
        updateData = {
          corePhilosophy: (aboutUs.corePhilosophy || []).filter(p => p.id !== selectedSection.id)
        };
      }

      const response = await fetch('/api/about-us', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      const updatedData = await response.json();
      setAboutUs(updatedData);

      toast.success(`${selectedSectionType} deleted successfully!`);
      setError(null);
      setIsDeleteDialogOpen(false);
      setSelectedSection(null);
      setSelectedSectionType(null);
    } catch (err) {
      console.error('Error deleting item:', err);
      const errorMessage = 'Failed to delete item. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const closeDialogs = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsViewDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedSection(null);
    setSelectedSectionType(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">About Us Management</h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-300">Loading...</span>
        </div>
      </div>
    );
  }

  if (!aboutUs) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">About Us Management</h2>
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No about us data found. Using default data.</p>
          <button
            onClick={fetchAboutUsData}
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">About Us Management</h2>
        <button
          onClick={fetchAboutUsData}
          disabled={loading}
          className="bg-gray-700 px-3 py-2 rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Company Info */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
            <p className="text-white bg-gray-700 p-3 rounded">{aboutUs.companyName || companyProfile.companyName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Brand Name</label>
            <p className="text-white bg-gray-700 p-3 rounded">{aboutUs.brandName || companyProfile.brandName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tagline</label>
            <p className="text-white bg-gray-700 p-3 rounded text-sm">{aboutUs.tagline || companyProfile.tagline}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Section */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Hero Section</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <p className="text-white bg-gray-700 p-3 rounded">{aboutUs.hero?.title || aboutUsPageData.hero.title}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Subtitle</label>
              <p className="text-white bg-gray-700 p-3 rounded">{aboutUs.hero?.subtitle || aboutUsPageData.hero.subtitle}</p>
            </div>
            <button
              onClick={handleEditHero}
              disabled={saving}
              className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? 'Saving...' : 'Edit Hero'}
            </button>
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Vision Section</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <p className="text-white bg-gray-700 p-3 rounded">{aboutUs.vision?.title || aboutUsPageData.vision.title}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
              <p className="text-white bg-gray-700 p-3 rounded text-sm">
                {(aboutUs.vision?.content || aboutUsPageData.vision.content).substring(0, 100)}...
              </p>
            </div>
            <button
              onClick={handleEditVision}
              disabled={saving}
              className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? 'Saving...' : 'Edit Vision'}
            </button>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Mission Section</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mission Items</label>
              <ul className="text-white bg-gray-700 p-3 rounded text-sm space-y-1">
                {(aboutUs.mission?.items || companyProfile.mission).slice(0, 3).map((item, idx) => (
                  <li key={idx} className="truncate">• {item}</li>
                ))}
                {(aboutUs.mission?.items || companyProfile.mission).length > 3 && (
                  <li className="text-gray-400">...and {(aboutUs.mission?.items || companyProfile.mission).length - 3} more</li>
                )}
              </ul>
            </div>
            <button
              onClick={handleEditMission}
              disabled={saving}
              className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? 'Saving...' : 'Edit Mission'}
            </button>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Core Values</h3>
            <button
              onClick={handleAddValue}
              disabled={saving}
              className="bg-green-600 px-3 py-1 rounded-lg hover:bg-green-700 transition text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              Add Value
            </button>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {(aboutUs.values || aboutUsPageData.values).map((value) => (
              <div key={value.id} className="flex items-center justify-between bg-gray-700 p-3 rounded">
                <div>
                  <span className="text-white font-medium">{value.title}</span>
                  <p className="text-gray-400 text-xs truncate max-w-xs">{value.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewValue(value)}
                    disabled={saving}
                    className="text-blue-400 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditValue(value)}
                    disabled={saving}
                    className="text-yellow-400 hover:text-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteValue(value)}
                    disabled={saving}
                    className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Philosophy */}
        <div className="bg-gray-800 p-6 rounded-lg lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Core Philosophy</h3>
            <button
              onClick={handleAddPhilosophy}
              disabled={saving}
              className="bg-green-600 px-3 py-1 rounded-lg hover:bg-green-700 transition text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              Add Philosophy
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(aboutUs.corePhilosophy || aboutUsPageData.corePhilosophy).map((philosophy) => (
              <div key={philosophy.id} className="bg-gray-700 p-4 rounded">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-medium">{philosophy.title}</h4>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditPhilosophy(philosophy)}
                      disabled={saving}
                      className="text-yellow-400 hover:text-yellow-300 disabled:opacity-50 cursor-pointer"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeletePhilosophy(philosophy)}
                      disabled={saving}
                      className="text-red-400 hover:text-red-300 disabled:opacity-50 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{philosophy.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(aboutUs.stats || aboutUsPageData.stats).map((stat) => (
            <div key={stat.id} className="bg-gray-700 p-4 rounded text-center">
              <p className="text-2xl font-bold text-blue-400">{stat.value}{stat.suffix}</p>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <AddEditAboutUsDialog
        isOpen={isAddDialogOpen}
        onClose={closeDialogs}
        onSubmit={handleSaveSection}
        formData={formData}
        setFormData={setFormData}
        isEdit={false}
        saving={saving}
        sectionType={selectedSectionType}
      />

      <AddEditAboutUsDialog
        isOpen={isEditDialogOpen}
        onClose={closeDialogs}
        onSubmit={handleSaveSection}
        formData={formData}
        setFormData={setFormData}
        isEdit={true}
        saving={saving}
        sectionType={selectedSectionType}
      />

      <ViewAboutUsDialog
        isOpen={isViewDialogOpen}
        onClose={closeDialogs}
        section={selectedSection ? {
          section: selectedSectionType,
          title: selectedSection.title,
          subtitle: selectedSection.subtitle || '',
          content: selectedSection.description || selectedSection.content || '',
          image: selectedSection.image || '',
          isActive: true,
        } : null}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDialogs}
        onConfirm={handleConfirmDelete}
        title={`Delete ${selectedSectionType === 'value' ? 'Value' : selectedSectionType === 'philosophy' ? 'Philosophy' : 'Section'}`}
        itemName={selectedSection?.title}
        itemType={selectedSectionType === 'value' ? 'value' : selectedSectionType === 'philosophy' ? 'philosophy' : 'section'}
      />
    </div>
  );
}
