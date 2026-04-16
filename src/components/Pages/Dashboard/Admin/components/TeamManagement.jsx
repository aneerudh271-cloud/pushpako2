import { Plus, Eye, Edit, Trash2, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AddEditTeamDialog, ViewTeamDialog } from './TeamOperations';
import { DeleteDialog } from '@/components/ui/DeleteDialog';
import toast from 'react-hot-toast';
import { leadershipTeam } from '@/lib/data/companyData';

export default function TeamManagement() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Fetch team data on component mount
  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/team?active=true');
      if (!response.ok) {
        throw new Error('Failed to fetch team data');
      }
      const data = await response.json();
      // If no data from API, use hardcoded leadership data
      if (data.length === 0) {
        setTeam(leadershipTeam);
      } else {
        setTeam(data);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching team data:', err);
      // Use hardcoded data as fallback
      setTeam(leadershipTeam);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = () => {
    setSelectedMember(null);
    setIsAddDialogOpen(true);
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setIsEditDialogOpen(true);
  };

  const handleViewMember = (member) => {
    setSelectedMember(member);
    setIsViewDialogOpen(true);
  };

  const handleDeleteMember = (member) => {
    setSelectedMember(member);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveMember = async (memberData) => {
    try {
      setSaving(true);

      const teamMemberData = {
        name: memberData.name,
        role: memberData.position,
        bio: memberData.bio,
        image: memberData.image,
        department: memberData.department || 'Executive',
        order: memberData.order ? parseInt(memberData.order) : 99,
      };

      if (selectedMember && selectedMember._id) {
        // Edit existing member via API
        const response = await fetch(`/api/team/${selectedMember._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(teamMemberData),
        });

        if (!response.ok) {
          throw new Error('Failed to update team member');
        }

        const updatedMember = await response.json();
        setTeam(team.map(m => m._id === selectedMember._id ? updatedMember : m));
        toast.success('Team member updated successfully!');
      } else if (selectedMember) {
        // Edit local member (from hardcoded data)
        const updatedMember = {
          ...selectedMember,
          ...teamMemberData,
          id: selectedMember.id,
        };
        setTeam(team.map(m => (m.id === selectedMember.id || m._id === selectedMember._id) ? updatedMember : m));
        toast.success('Team member updated locally!');
      } else {
        // Add new member via API
        const response = await fetch('/api/team', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(teamMemberData),
        });

        if (!response.ok) {
          throw new Error('Failed to add team member');
        }

        const newMember = await response.json();
        setTeam([...team, newMember]);
        toast.success('Team member added successfully!');
      }

      setSelectedMember(null);
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error('Error saving team member:', err);
      toast.error(err.message || 'Failed to save team member');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setSaving(true);

      if (selectedMember._id) {
        // Delete from database
        const response = await fetch(`/api/team/${selectedMember._id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete team member');
        }

        setTeam(team.filter(m => m._id !== selectedMember._id));
        toast.success('Team member deleted successfully!');
      } else {
        // Delete from local state (hardcoded data)
        setTeam(team.filter(m => m.id !== selectedMember.id));
        toast.success('Team member removed locally!');
      }

      setIsDeleteDialogOpen(false);
      setSelectedMember(null);
    } catch (err) {
      console.error('Error deleting team member:', err);
      toast.error(err.message || 'Failed to delete team member');
    } finally {
      setSaving(false);
    }
  };

  const closeDialogs = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsViewDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedMember(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Team Management</h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-300">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Management</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchTeamData}
            disabled={loading}
            className="bg-gray-700 px-3 py-2 rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleAddMember}
            disabled={saving}
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add New Member
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {team.map((member) => (
                <tr key={member._id || member.id} className="hover:bg-gray-750">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full object-cover bg-gray-600"
                        src={member.image || '/placeholder-avatar.jpg'}
                        alt={member.name}
                        onError={(e) => { e.target.src = '/placeholder-avatar.jpg'; }}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{member.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{member.role}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{member.department}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewMember(member)}
                        disabled={saving}
                        className="text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditMember(member)}
                        disabled={saving}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors disabled:opacity-50"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member)}
                        disabled={saving}
                        className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                      >
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

      {team.length === 0 && (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <p className="text-gray-400 mb-4">No team members found.</p>
          <button
            onClick={handleAddMember}
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add First Team Member
          </button>
        </div>
      )}

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Members</h3>
          <p className="text-3xl font-bold text-blue-400">{team.length}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Departments</h3>
          <p className="text-3xl font-bold text-yellow-400">{new Set(team.map(m => m.department)).size}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Leadership</h3>
          <p className="text-3xl font-bold text-purple-400">
            {team.filter(m => m.department === 'Executive' || m.department === 'Technology').length}
          </p>
        </div>
      </div>

      <AddEditTeamDialog
        isOpen={isAddDialogOpen}
        onClose={closeDialogs}
        onSave={handleSaveMember}
        member={null}
        saving={saving}
      />

      <AddEditTeamDialog
        isOpen={isEditDialogOpen}
        onClose={closeDialogs}
        onSave={handleSaveMember}
        member={selectedMember ? {
          ...selectedMember,
          position: selectedMember.role,
        } : null}
        saving={saving}
      />

      <ViewTeamDialog
        isOpen={isViewDialogOpen}
        onClose={closeDialogs}
        member={selectedMember ? {
          ...selectedMember,
          position: selectedMember.role,
        } : null}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDialogs}
        onConfirm={handleConfirmDelete}
        title="Delete Team Member"
        itemName={selectedMember?.name}
        itemType="team member"
      />
    </div>
  );
}
