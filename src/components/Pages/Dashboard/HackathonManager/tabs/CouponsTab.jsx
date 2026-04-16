'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Ticket, Calendar, Users, Tags } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CouponsTab() {
    const [coupons, setCoupons] = useState([]);
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        minPurchase: 0,
        maxDiscount: '',
        expiryDate: '',
        usageLimit: 100,
        applicableHackathons: [],
        isActive: true
    });

    useEffect(() => {
        fetchCoupons();
        fetchHackathons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const res = await fetch('/api/coupons');
            const data = await res.json();
            if (res.ok) setCoupons(data.coupons);
        } catch (error) {
            toast.error('Failed to fetch coupons');
        } finally {
            setLoading(false);
        }
    };

    const fetchHackathons = async () => {
        try {
            const res = await fetch('/api/hackathons');
            const data = await res.json();
            if (res.ok) setHackathons(data.hackathons);
        } catch (error) {
            toast.error('Failed to fetch hackathons');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                toast.success('Coupon created');
                setShowCreateForm(false);
                fetchCoupons();
                setFormData({
                    code: '',
                    discountType: 'PERCENTAGE',
                    discountValue: '',
                    minPurchase: 0,
                    maxDiscount: '',
                    expiryDate: '',
                    usageLimit: 100,
                    applicableHackathons: [],
                    isActive: true
                });
            } else {
                const data = await res.json();
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Failed to create coupon');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Coupon deleted');
                fetchCoupons();
            }
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-400">Loading coupons...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Ticket className="text-purple-400" />
                    Coupon Management
                </h2>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl transition-all font-semibold"
                >
                    <Plus size={18} />
                    Create Coupon
                </button>
            </div>

            {showCreateForm && (
                <div className="bg-gray-800 border border-purple-500/20 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Coupon Code</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 focus:border-purple-500 outline-none"
                                placeholder="E.G. WELCOME50"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Discount Type</label>
                            <select
                                value={formData.discountType}
                                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 focus:border-purple-500 outline-none"
                            >
                                <option value="PERCENTAGE">Percentage (%)</option>
                                <option value="FLAT">Flat (₹)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Discount Value</label>
                            <input
                                type="number"
                                value={formData.discountValue}
                                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 focus:border-purple-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Expiry Date</label>
                            <input
                                type="date"
                                value={formData.expiryDate}
                                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 focus:border-purple-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Usage Limit</label>
                            <input
                                type="number"
                                value={formData.usageLimit}
                                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 focus:border-purple-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Min. Entry Fee (₹)</label>
                            <input
                                type="number"
                                value={formData.minPurchase}
                                onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 focus:border-purple-500 outline-none"
                            />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Applicable Hackathons (None = All)</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border border-gray-700 p-4 rounded-xl max-h-40 overflow-y-auto bg-gray-950/50">
                                {hackathons.map(h => (
                                    <label key={h._id} className="flex items-center gap-2 text-sm text-gray-300">
                                        <input
                                            type="checkbox"
                                            checked={formData.applicableHackathons.includes(h._id)}
                                            onChange={(e) => {
                                                const ids = e.target.checked
                                                    ? [...formData.applicableHackathons, h._id]
                                                    : formData.applicableHackathons.filter(id => id !== h._id);
                                                setFormData({ ...formData, applicableHackathons: ids });
                                            }}
                                            className="rounded border-gray-700 text-purple-600 focus:ring-purple-500"
                                        />
                                        <span className="truncate">{h.title}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-3 flex justify-end gap-3 pt-4 border-t border-gray-700">
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.length === 0 ? (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                        <Ticket size={48} className="mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400">No coupons active. Create one to start offering discounts.</p>
                    </div>
                ) : (
                    coupons.map((coupon) => (
                        <div key={coupon._id} className="bg-gray-800/50 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <button
                                    onClick={() => handleDelete(coupon._id)}
                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-purple-500/10 p-3 rounded-xl border border-purple-500/20">
                                    <Ticket className="text-purple-400" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-widest">{coupon.code}</h3>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${coupon.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                        {coupon.isActive ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Discount</span>
                                    <span className="text-white font-bold">
                                        {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`} OFF
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Usage</span>
                                    <span className="text-white font-medium">{coupon.usedCount} / {coupon.usageLimit}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Expires</span>
                                    <span className="text-white font-medium">
                                        {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'Never'}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <Tags size={12} className="text-purple-400" />
                                    <span>
                                        {coupon.applicableHackathons.length === 0
                                            ? 'Applicable to all hackathons'
                                            : `${coupon.applicableHackathons.length} specific hackathons`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
