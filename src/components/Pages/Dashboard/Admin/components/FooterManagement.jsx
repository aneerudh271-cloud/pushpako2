import { Edit, Eye, Trash2, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DeleteDialog } from '@/components/ui/DeleteDialog';
import { AddEditFooterCTADialog, AddEditFooterBrandDialog, AddEditFooterSectionDialog, AddEditFooterSocialLinkDialog, AddEditFooterBottomBarDialog } from './FooterOperations';
import toast from 'react-hot-toast';

export default function FooterManagement() {
  const [aboutUsData, setAboutUsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  // Dialog states
  const [isCTADialogOpen, setIsCTADialogOpen] = useState(false);
  const [isBrandDialogOpen, setIsBrandDialogOpen] = useState(false);
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
  const [isSocialLinkDialogOpen, setIsSocialLinkDialogOpen] = useState(false);
  const [isBottomBarDialogOpen, setIsBottomBarDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

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
      setAboutUsData(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching about us data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditBrand = () => {
    setIsBrandDialogOpen(true);
  };

  const handleEditSocialLink = (link) => {
    setEditingItem(link);
    setIsSocialLinkDialogOpen(true);
  };

  const handleDeleteSocialLink = (link) => {
    setSelectedItem(link);
    setSelectedType('socialLink');
    setIsDeleteDialogOpen(true);
  };

  const handleAddSocialLink = () => {
    setEditingItem(null);
    setIsSocialLinkDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setSaving(true);
      let updateData = {};

      if (selectedType === 'socialLink') {
        updateData = {
          footer: {
            ...aboutUsData.footer,
            socialLinks: aboutUsData.footer.socialLinks.filter(l => l.platform !== selectedItem.platform)
          }
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
      setAboutUsData(updatedData);

      toast.success('Social link deleted successfully!');
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error deleting item:', err);
      const errorMessage = 'Failed to delete item. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
      setSelectedType(null);
    }
  };

  const handleSaveBrand = async (brandData) => {
    try {
      setSaving(true);
      const updateData = {
        footer: {
          ...aboutUsData.footer,
          companyInfo: {
            ...aboutUsData.footer.companyInfo,
            name: aboutUsData.footer.companyInfo.name, // Keep existing name
            address: brandData.description,
            email: brandData.email,
            phone: brandData.phone,
          }
        }
      };

      const response = await fetch('/api/about-us', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update brand information');
      }

      const updatedData = await response.json();
      setAboutUsData(updatedData);

      toast.success('Brand information updated successfully!');
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error saving brand data:', err);
      const errorMessage = 'Failed to save brand information. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSocialLink = async (linkData) => {
    try {
      setSaving(true);
      let updateData = {};

      if (editingItem) {
        // Edit existing link
        updateData = {
          footer: {
            ...aboutUsData.footer,
            socialLinks: aboutUsData.footer.socialLinks.map(l => l.platform === editingItem.platform ? linkData : l)
          }
        };
      } else {
        // Add new link
        updateData = {
          footer: {
            ...aboutUsData.footer,
            socialLinks: [...aboutUsData.footer.socialLinks, linkData]
          }
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
        throw new Error('Failed to save social link');
      }

      const updatedData = await response.json();
      setAboutUsData(updatedData);

      toast.success(`Social link ${editingItem ? 'updated' : 'added'} successfully!`);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error saving social link:', err);
      const errorMessage = 'Failed to save social link. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const closeDialogs = () => {
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
    setSelectedType(null);
    setIsBrandDialogOpen(false);
    setIsSocialLinkDialogOpen(false);
    setEditingItem(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Footer Management</h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-300">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Footer Management</h2>
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={fetchAboutUsData}
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!aboutUsData) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Footer Management</h2>
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No footer data found. Please initialize the about us data first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Footer Management</h2>
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brand Section */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Brand Section</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <p className="text-white bg-gray-700 p-3 rounded text-sm">{aboutUsData.footer.companyInfo.address}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <p className="text-white bg-gray-700 p-2 rounded text-sm">{aboutUsData.footer.companyInfo.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                <p className="text-white bg-gray-700 p-2 rounded text-sm">{aboutUsData.footer.companyInfo.phone}</p>
              </div>
            </div>
            <button
              onClick={handleEditBrand}
              disabled={saving}
              className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? 'Saving...' : 'Edit Brand'}
            </button>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Social Links</h3>
            <button
              onClick={handleAddSocialLink}
              disabled={saving}
              className="bg-green-600 px-3 py-1 rounded-lg hover:bg-green-700 transition text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              {saving ? 'Saving...' : 'Add Link'}
            </button>
          </div>
          <div className="space-y-3">
            {aboutUsData.footer.socialLinks.map((link) => (
              <div key={link.platform} className="flex items-center justify-between bg-gray-700 p-3 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-white">{link.icon}</span>
                  <span className="text-white text-sm">{link.platform}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditSocialLink(link)}
                    disabled={saving}
                    className="text-yellow-400 hover:text-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSocialLink(link)}
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
      </div>

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDialogs}
        onConfirm={handleConfirmDelete}
        title="Delete Social Link"
        itemName={selectedItem?.platform}
        itemType="social link"
      />

      <AddEditFooterBrandDialog
        isOpen={isBrandDialogOpen}
        onClose={closeDialogs}
        onSave={handleSaveBrand}
        initialData={{
          description: aboutUsData.footer.companyInfo.address,
          email: aboutUsData.footer.companyInfo.email,
          phone: aboutUsData.footer.companyInfo.phone,
        }}
      />

      <AddEditFooterSocialLinkDialog
        isOpen={isSocialLinkDialogOpen}
        onClose={closeDialogs}
        onSave={handleSaveSocialLink}
        initialData={editingItem}
      />
    </div>
  );
}