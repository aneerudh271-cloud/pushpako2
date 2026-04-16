'use client';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import InvestorsTable from '../components/InvestorsTable';
import InvestorsStats from '../components/InvestorsStats';
import AddInvestorDialog from '../components/AddInvestorDialog';
import EditInvestorDialog from '../components/EditInvestorDialog';
import ViewInvestorDialog from '../components/ViewInvestorDialog';
import { DeleteDialog } from '@/components/ui/DeleteDialog';
import toast from 'react-hot-toast';

export default function InvestorsTab() {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    investmentAmount: '',
    type: 'individual',
    riskProfile: 'moderate',
    investmentStage: 'seed',
    status: 'active',
    role: 'investor',
    notes: '',
  });

  useEffect(() => {
    fetchInvestors();
  }, []);

  const fetchInvestors = async () => {
    try {
      const res = await fetch('/api/investors');
      const data = await res.json();
      setInvestors(data);
    } catch (error) {
      toast.error('Failed to fetch investors');
    } finally {
      setLoading(false);
    }
  };

  const handleAddInvestor = async () => {
    try {
      const res = await fetch('/api/investors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          investmentAmount: parseFloat(formData.investmentAmount) || 0,
          currentValue: parseFloat(formData.investmentAmount) * 1.1 || 0,
          roi: 10,
          joinDate: new Date().toISOString().split('T')[0],
          profilePicture: '/next.svg',
          portfolio: [{ company: 'Pushpak O2', percentage: 100, invested: parseFloat(formData.investmentAmount) || 0, current: (parseFloat(formData.investmentAmount) || 0) * 1.1 }],
          communicationLog: [],
          documents: [],
          lastContact: new Date().toISOString().split('T')[0],
          nextFollowUp: '',
          tags: [],
        }),
      });
      if (res.ok) {
        toast.success('Investor added successfully');
        fetchInvestors();
        setIsAddDialogOpen(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          investmentAmount: '',
          type: 'individual',
          riskProfile: 'moderate',
          investmentStage: 'seed',
          status: 'active',
          role: 'investor',
          notes: '',
        });
      } else {
        const data = await res.json();
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to add investor');
    }
  };

  const handleEditInvestor = async () => {
    try {
      const res = await fetch(`/api/investors/${selectedInvestor._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          investmentAmount: parseFloat(formData.investmentAmount) || 0,
        }),
      });
      if (res.ok) {
        toast.success('Investor updated successfully');
        fetchInvestors();
        setIsEditDialogOpen(false);
        setSelectedInvestor(null);
      } else {
        const data = await res.json();
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to update investor');
    }
  };

  const handleDeleteInvestor = async () => {
    try {
      const res = await fetch(`/api/investors/${selectedInvestor._id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Investor deleted successfully');
        fetchInvestors();
        setIsDeleteDialogOpen(false);
        setSelectedInvestor(null);
      } else {
        toast.error('Failed to delete investor');
      }
    } catch (error) {
      toast.error('Failed to delete investor');
    }
  };

  const openEditDialog = (investor) => {
    setSelectedInvestor(investor);
    setFormData({
      name: investor.name,
      email: investor.email,
      phone: investor.phone,
      investmentAmount: investor.investmentAmount?.toString() || '',
      type: investor.type,
      riskProfile: investor.riskProfile,
      investmentStage: investor.investmentStage,
      status: investor.status,
      role: investor.role,
      notes: investor.notes,
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (investor) => {
    setSelectedInvestor(investor);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (investor) => {
    setSelectedInvestor(investor);
    setIsDeleteDialogOpen(true);
  };

  const closeDialogs = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsViewDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedInvestor(null);
  };
  if (loading) {
    return <div className="text-center py-8">Loading investors...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Investors Management</h2>
        <button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Investor
        </button>
      </div>

      <InvestorsTable
        investors={investors}
        onView={openViewDialog}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
      />

      <InvestorsStats investors={investors} />

      <AddInvestorDialog
        isOpen={isAddDialogOpen}
        onClose={closeDialogs}
        onSubmit={handleAddInvestor}
        formData={formData}
        setFormData={setFormData}
      />

      <EditInvestorDialog
        isOpen={isEditDialogOpen}
        onClose={closeDialogs}
        onSubmit={handleEditInvestor}
        formData={formData}
        setFormData={setFormData}
      />

      <ViewInvestorDialog
        isOpen={isViewDialogOpen}
        onClose={closeDialogs}
        investor={selectedInvestor}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDialogs}
        onConfirm={handleDeleteInvestor}
        title="Delete Investor"
        itemName={selectedInvestor?.name}
        itemType="investor"
      />
    </div>
  );
}