'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, User, Key, Mail, ShieldCheck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManagersTab() {
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchManagers();
    }, []);

    const fetchManagers = async () => {
        try {
            const response = await fetch('/api/admin/managers');
            const data = await response.json();
            if (response.ok) {
                setManagers(data.managers);
            } else {
                toast.error(data.error || 'Failed to fetch managers');
            }
        } catch (error) {
            toast.error('Error fetching managers');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await fetch('/api/admin/managers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (response.ok) {
                toast.success('Manager created successfully');
                setFormData({ name: '', email: '', password: '' });
                setShowCreateForm(false);
                fetchManagers();
            } else {
                toast.error(data.error || 'Creation failed');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this manager? This cannot be undone.')) return;

        try {
            const response = await fetch(`/api/admin/managers?id=${id}`, { method: 'DELETE' });
            if (response.ok) {
                toast.success('Manager deleted');
                setManagers(prev => prev.filter(m => m._id !== id));
            } else {
                const data = await response.json();
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Deletion failed');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-400">Loading managers...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Hackathon Managers</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage users with hackathon management privileges.</p>
                </div>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus size={18} />
                    Add Manager
                </button>
            </div>

            {showCreateForm && (
                <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl mb-8 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <ShieldCheck className="text-blue-400" size={20} />
                        Create New Manager
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-300">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 text-gray-500" size={18} />
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-10 pr-4 outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-300">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 text-gray-500" size={18} />
                                    <input
                                        type="email"
                                        placeholder="john@pushpako.com"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-10 pr-4 outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Initial Password</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-2.5 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    placeholder="Enter a strong password"
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-10 pr-4 outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Make sure to share these credentials securely with the manager.</p>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {submitting ? <Loader2 className="animate-spin" size={18} /> : null}
                                Create Account
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-900 text-gray-400 text-sm">
                        <tr>
                            <th className="text-left p-4">Name</th>
                            <th className="text-left p-4">Email</th>
                            <th className="text-left p-4">Role</th>
                            <th className="text-left p-4">Joined On</th>
                            <th className="text-right p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {managers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">
                                    No managers found. Create one to get started.
                                </td>
                            </tr>
                        ) : (
                            managers.map(manager => (
                                <tr key={manager._id} className="hover:bg-gray-700/50 transition-colors group">
                                    <td className="p-4">
                                        <div className="font-medium text-white">{manager.name}</div>
                                    </td>
                                    <td className="p-4 text-gray-300">{manager.email}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                            {manager.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-400 text-sm">
                                        {new Date(manager.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleDelete(manager._id)}
                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            title="Delete Manager"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
