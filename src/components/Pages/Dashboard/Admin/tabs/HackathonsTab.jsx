'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, AlertCircle, CheckCircle, FileText, Github, Figma, Youtube, Link as LinkIcon, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HackathonsTab() {
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingHackathon, setEditingHackathon] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        overview: '',
        description: '',
        bannerImage: '',
        logo: '',
        startDate: '',
        endDate: '',
        registrationDeadline: '',
        submissionDeadline: '',
        teamType: 'SOLO',
        minTeamSize: 1,
        maxTeamSize: 1,
        rules: [],
        eligibility: [],
        allowedTechnologies: [],
        totalPrizePool: '',
        firstPrize: '',
        secondPrize: '',
        thirdPrize: '',
        additionalPrizes: [],
        judgingCriteria: [],
        resourceLinks: [],
        status: 'UPCOMING',
        isPublished: false
    });

    const [uploading, setUploading] = useState({ banner: false, logo: false });

    useEffect(() => {
        fetchHackathons();
    }, []);

    const fetchHackathons = async () => {
        try {
            const response = await fetch('/api/hackathons');
            const data = await response.json();
            if (response.ok) {
                setHackathons(data.hackathons);
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Failed to fetch hackathons');
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (title) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setFormData({
            ...formData,
            title,
            slug: generateSlug(title)
        });
    };

    const handleFileUpload = async (file, type) => {
        if (!file) return;

        setUploading(prev => ({ ...prev, [type]: true }));

        try {
            const response = await fetch(`/api/upload?filename=${file.name}`, {
                method: 'POST',
                body: file
            });

            const data = await response.json();

            if (response.ok) {
                setFormData(prev => ({
                    ...prev,
                    [type === 'banner' ? 'bannerImage' : 'logo']: data.url
                }));
                toast.success(`${type === 'banner' ? 'Banner' : 'Logo'} uploaded successfully`);
            } else {
                toast.error(data.error || 'Upload failed');
            }
        } catch (error) {
            toast.error('Upload failed');
        } finally {
            setUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const timeline = {
            startDate: new Date(formData.startDate),
            endDate: new Date(formData.endDate),
            registrationDeadline: new Date(formData.registrationDeadline),
            submissionDeadline: new Date(formData.submissionDeadline)
        };

        const teamSettings = {
            teamType: formData.teamType,
            minTeamSize: formData.minTeamSize,
            maxTeamSize: formData.maxTeamSize
        };

        const prizes = {
            totalPrizePool: formData.totalPrizePool,
            firstPrize: formData.firstPrize,
            secondPrize: formData.secondPrize,
            thirdPrize: formData.thirdPrize,
            additionalPrizes: formData.additionalPrizes
        };

        const payload = {
            title: formData.title,
            slug: formData.slug,
            overview: formData.overview,
            description: formData.description,
            bannerImage: formData.bannerImage,
            logo: formData.logo,
            timeline,
            teamSettings,
            rules: formData.rules,
            eligibility: formData.eligibility,
            allowedTechnologies: formData.allowedTechnologies,
            prizes,
            judgingCriteria: formData.judgingCriteria,
            resourceLinks: formData.resourceLinks,
            status: formData.status,
            isPublished: formData.isPublished
        };

        try {
            const url = editingHackathon ? `/api/hackathons/${editingHackathon._id}` : '/api/hackathons';
            const method = editingHackathon ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(editingHackathon ? 'Hackathon updated' : 'Hackathon created');
                fetchHackathons();
                resetForm();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this hackathon?')) return;

        try {
            const response = await fetch(`/api/hackathons/${id}`, { method: 'DELETE' });
            if (response.ok) {
                toast.success('Hackathon deleted');
                fetchHackathons();
            } else {
                const data = await response.json();
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            slug: '',
            overview: '',
            description: '',
            bannerImage: '',
            logo: '',
            startDate: '',
            endDate: '',
            registrationDeadline: '',
            submissionDeadline: '',
            teamType: 'SOLO',
            minTeamSize: 1,
            maxTeamSize: 1,
            rules: [],
            eligibility: [],
            allowedTechnologies: [],
            totalPrizePool: '',
            firstPrize: '',
            secondPrize: '',
            thirdPrize: '',
            additionalPrizes: [],
            judgingCriteria: [],
            resourceLinks: [],
            status: 'UPCOMING',
            isPublished: false
        });
        setEditingHackathon(null);
        setShowCreateForm(false);
    };

    const startEdit = (hackathon) => {
        setFormData({
            title: hackathon.title || '',
            slug: hackathon.slug || '',
            overview: hackathon.overview || '',
            description: hackathon.description || '',
            bannerImage: hackathon.bannerImage || '',
            logo: hackathon.logo || '',
            startDate: hackathon.timeline?.startDate ? new Date(hackathon.timeline.startDate).toISOString().split('T')[0] : '',
            endDate: hackathon.timeline?.endDate ? new Date(hackathon.timeline.endDate).toISOString().split('T')[0] : '',
            registrationDeadline: hackathon.timeline?.registrationDeadline ? new Date(hackathon.timeline.registrationDeadline).toISOString().split('T')[0] : '',
            submissionDeadline: hackathon.timeline?.submissionDeadline ? new Date(hackathon.timeline.submissionDeadline).toISOString().split('T')[0] : '',
            teamType: hackathon.teamSettings?.teamType || 'SOLO',
            minTeamSize: hackathon.teamSettings?.minTeamSize || 1,
            maxTeamSize: hackathon.teamSettings?.maxTeamSize || 1,
            rules: hackathon.rules || [],
            eligibility: hackathon.eligibility || [],
            allowedTechnologies: hackathon.allowedTechnologies || [],
            totalPrizePool: hackathon.prizes?.totalPrizePool || '',
            firstPrize: hackathon.prizes?.firstPrize || '',
            secondPrize: hackathon.prizes?.secondPrize || '',
            thirdPrize: hackathon.prizes?.thirdPrize || '',
            additionalPrizes: hackathon.prizes?.additionalPrizes || [],
            judgingCriteria: hackathon.judgingCriteria?.map(c => ({ title: c.title, weight: c.weight, description: c.description || '' })) || [],
            resourceLinks: hackathon.resourceLinks?.map(r => ({ title: r.title, url: r.url, type: r.type || 'OTHER' })) || [],
            status: hackathon.status || 'UPCOMING',
            isPublished: hackathon.isPublished || false
        });
        setEditingHackathon(hackathon);
        setShowCreateForm(true);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Hackathons</h2>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                >
                    <Plus size={18} />
                    Create Hackathon
                </button>
            </div>

            {showCreateForm && (
                <form onSubmit={handleSubmit} className="bg-gray-700 p-6 rounded-lg mb-6 max-h-96 overflow-y-auto">
                    <h3 className="text-xl font-bold mb-4">
                        {editingHackathon ? 'Edit Hackathon' : 'Create New Hackathon'}
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Hackathon Title *</label>
                                <input
                                    type="text"
                                    placeholder="Enter hackathon title"
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    className="w-full p-2 bg-gray-600 rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Slug (Auto-generated)</label>
                                <input
                                    type="text"
                                    placeholder="Slug will be generated"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full p-2 bg-gray-600 rounded"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Banner Image Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Banner Image</label>
                                <div className="space-y-3">
                                    {formData.bannerImage && (
                                        <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-600 group">
                                            <img src={formData.bannerImage} alt="Banner Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, bannerImage: '' })}
                                                className="absolute top-2 right-2 bg-red-600 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e.target.files[0], 'banner')}
                                                className="hidden"
                                                id="banner-upload"
                                                disabled={uploading.banner}
                                            />
                                            <label
                                                htmlFor="banner-upload"
                                                className={`flex-1 cursor-pointer bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 p-3 rounded-lg text-center text-sm font-medium text-blue-400 flex items-center justify-center gap-2 transition-all ${uploading.banner ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {uploading.banner ? (
                                                    <span className="animate-pulse">Uploading...</span>
                                                ) : (
                                                    <>
                                                        <Plus size={16} /> Upload New Banner
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                        <input
                                            type="url"
                                            placeholder="Or paste image URL"
                                            value={formData.bannerImage}
                                            onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                                            className="w-full p-2 bg-gray-600/50 rounded-lg text-sm border border-gray-600 focus:border-blue-500 outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Logo Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Logo</label>
                                <div className="space-y-3">
                                    {formData.logo && (
                                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-600 group mx-auto md:mx-0">
                                            <img src={formData.logo} alt="Logo Preview" className="w-full h-full object-contain bg-black/20" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, logo: '' })}
                                                className="absolute top-2 right-2 bg-red-600 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e.target.files[0], 'logo')}
                                                className="hidden"
                                                id="logo-upload"
                                                disabled={uploading.logo}
                                            />
                                            <label
                                                htmlFor="logo-upload"
                                                className={`flex-1 cursor-pointer bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 p-3 rounded-lg text-center text-sm font-medium text-purple-400 flex items-center justify-center gap-2 transition-all ${uploading.logo ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {uploading.logo ? (
                                                    <span className="animate-pulse">Uploading...</span>
                                                ) : (
                                                    <>
                                                        <Plus size={16} /> Upload New Logo
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                        <input
                                            type="url"
                                            placeholder="Or paste logo URL"
                                            value={formData.logo}
                                            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                            className="w-full p-2 bg-gray-600/50 rounded-lg text-sm border border-gray-600 focus:border-purple-500 outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Overview</label>
                            <textarea
                                placeholder="Brief overview of the hackathon"
                                value={formData.overview}
                                onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                className="w-full p-2 bg-gray-600 rounded resize-none"
                                rows={1}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description *</label>
                            <textarea
                                placeholder="Detailed description of the hackathon"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                className="w-full p-2 bg-gray-600 rounded resize-none"
                                rows={1}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Start Date *</label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="w-full p-2 bg-gray-600 rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">End Date *</label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className="w-full p-2 bg-gray-600 rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Registration Deadline *</label>
                                <input
                                    type="date"
                                    value={formData.registrationDeadline}
                                    onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                                    className="w-full p-2 bg-gray-600 rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Submission Deadline *</label>
                                <input
                                    type="date"
                                    value={formData.submissionDeadline}
                                    onChange={(e) => setFormData({ ...formData, submissionDeadline: e.target.value })}
                                    className="w-full p-2 bg-gray-600 rounded"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Team Type</label>
                                <select
                                    value={formData.teamType}
                                    onChange={(e) => setFormData({ ...formData, teamType: e.target.value })}
                                    className="w-full p-2 bg-gray-600 rounded"
                                >
                                    <option value="SOLO">Individual (SOLO)</option>
                                    <option value="TEAM">Team Based</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Min Team Size</label>
                                <input
                                    type="number"
                                    placeholder="1"
                                    value={formData.minTeamSize}
                                    onChange={(e) => setFormData({ ...formData, minTeamSize: parseInt(e.target.value) || 1 })}
                                    className="w-full p-2 bg-gray-600 rounded"
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Max Team Size</label>
                                <input
                                    type="number"
                                    placeholder="5"
                                    value={formData.maxTeamSize}
                                    onChange={(e) => setFormData({ ...formData, maxTeamSize: parseInt(e.target.value) || 1 })}
                                    className="w-full p-2 bg-gray-600 rounded"
                                    min="1"
                                />
                            </div>
                        </div>

                        {/* Rules - Dynamic List */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Rules</label>
                            <div className="space-y-2">
                                {formData.rules.map((rule, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder={`Rule ${index + 1}`}
                                            value={rule}
                                            onChange={(e) => {
                                                const newRules = [...formData.rules];
                                                newRules[index] = e.target.value;
                                                setFormData({ ...formData, rules: newRules });
                                            }}
                                            className="flex-1 p-2 bg-gray-600 rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newRules = formData.rules.filter((_, i) => i !== index);
                                                setFormData({ ...formData, rules: newRules });
                                            }}
                                            className="text-red-400 hover:text-red-300 px-2"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rules: [...formData.rules, ''] })}
                                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium mt-2"
                                >
                                    <Plus size={14} /> Add Rule
                                </button>
                            </div>
                        </div>

                        {/* Eligibility - Dynamic List */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Eligibility Criteria</label>
                            <div className="space-y-2">
                                {formData.eligibility.map((item, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder={`Eligibility Requirement ${index + 1}`}
                                            value={item}
                                            onChange={(e) => {
                                                const newEligibility = [...formData.eligibility];
                                                newEligibility[index] = e.target.value;
                                                setFormData({ ...formData, eligibility: newEligibility });
                                            }}
                                            className="flex-1 p-2 bg-gray-600 rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newEligibility = formData.eligibility.filter((_, i) => i !== index);
                                                setFormData({ ...formData, eligibility: newEligibility });
                                            }}
                                            className="text-red-400 hover:text-red-300 px-2"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, eligibility: [...formData.eligibility, ''] })}
                                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium mt-2"
                                >
                                    <Plus size={14} /> Add Eligibility Criteria
                                </button>
                            </div>
                        </div>

                        {/* Allowed Technologies - Dynamic List */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Allowed Technologies</label>
                            <div className="space-y-2">
                                {formData.allowedTechnologies.map((tech, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder={`Technology (e.g., React)`}
                                            value={tech}
                                            onChange={(e) => {
                                                const newTech = [...formData.allowedTechnologies];
                                                newTech[index] = e.target.value;
                                                setFormData({ ...formData, allowedTechnologies: newTech });
                                            }}
                                            className="flex-1 p-2 bg-gray-600 rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newTech = formData.allowedTechnologies.filter((_, i) => i !== index);
                                                setFormData({ ...formData, allowedTechnologies: newTech });
                                            }}
                                            className="text-red-400 hover:text-red-300 px-2"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, allowedTechnologies: [...formData.allowedTechnologies, ''] })}
                                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium mt-2"
                                >
                                    <Plus size={14} /> Add Technology
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Prize Structure</label>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs mb-1">Total Prize Pool (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="10000"
                                        value={formData.totalPrizePool}
                                        onChange={(e) => setFormData({ ...formData, totalPrizePool: e.target.value })}
                                        className="w-full p-2 bg-gray-600 rounded"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs mb-1">1st Prize (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="5000"
                                        value={formData.firstPrize}
                                        onChange={(e) => setFormData({ ...formData, firstPrize: e.target.value })}
                                        className="w-full p-2 bg-gray-600 rounded"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs mb-1">2nd Prize (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="3000"
                                        value={formData.secondPrize}
                                        onChange={(e) => setFormData({ ...formData, secondPrize: e.target.value })}
                                        className="w-full p-2 bg-gray-600 rounded"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs mb-1">3rd Prize (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="2000"
                                        value={formData.thirdPrize}
                                        onChange={(e) => setFormData({ ...formData, thirdPrize: e.target.value })}
                                        className="w-full p-2 bg-gray-600 rounded"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Judging Criteria - Professional UI */}
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="block text-sm font-medium">Judging Criteria</label>
                                <div className="text-right">
                                    {(() => {
                                        const totalWeight = formData.judgingCriteria.reduce((sum, c) => sum + (parseInt(c.weight) || 0), 0);
                                        const isValid = totalWeight === 100;
                                        return (
                                            <div className={`text-sm font-semibold flex items-center gap-2 ${isValid ? 'text-green-400' : 'text-orange-400'}`}>
                                                {isValid ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                                Total Weight: {totalWeight}%
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>

                            {/* Weight Progress Bar */}
                            <div className="w-full h-2 bg-gray-600 rounded-full mb-4 overflow-hidden flex">
                                {formData.judgingCriteria.map((criteria, i) => (
                                    <div
                                        key={i}
                                        style={{ width: `${Math.min(criteria.weight || 0, 100)}%` }}
                                        className={`h-full ${['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500'][i % 5]} transition-all`}
                                        title={`${criteria.title}: ${criteria.weight}%`}
                                    />
                                ))}
                            </div>

                            <div className="space-y-3">
                                {formData.judgingCriteria.map((criteria, index) => (
                                    <div key={index} className="bg-gray-600/50 border border-gray-600 rounded-lg p-4 space-y-3">
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    placeholder="Criteria Title (e.g., Innovation)"
                                                    value={criteria.title}
                                                    onChange={(e) => {
                                                        const newCriteria = [...formData.judgingCriteria];
                                                        newCriteria[index].title = e.target.value;
                                                        setFormData({ ...formData, judgingCriteria: newCriteria });
                                                    }}
                                                    className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 outline-none"
                                                />
                                            </div>
                                            <div className="w-24">
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        placeholder="%"
                                                        value={criteria.weight}
                                                        onChange={(e) => {
                                                            const newCriteria = [...formData.judgingCriteria];
                                                            newCriteria[index].weight = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                                                            setFormData({ ...formData, judgingCriteria: newCriteria });
                                                        }}
                                                        className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 outline-none pr-6"
                                                    />
                                                    <span className="absolute right-2 top-2 text-gray-400 text-sm">%</span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newCriteria = formData.judgingCriteria.filter((_, i) => i !== index);
                                                    setFormData({ ...formData, judgingCriteria: newCriteria });
                                                }}
                                                className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded transition-colors h-10 w-10 flex items-center justify-center"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <div>
                                            <textarea
                                                placeholder="Description of what this criteria entails..."
                                                value={criteria.description || ''}
                                                onChange={(e) => {
                                                    const newCriteria = [...formData.judgingCriteria];
                                                    newCriteria[index].description = e.target.value;
                                                    setFormData({ ...formData, judgingCriteria: newCriteria });
                                                }}
                                                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-sm focus:border-blue-500 outline-none resize-none"
                                                rows={2}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, judgingCriteria: [...formData.judgingCriteria, { title: '', weight: 0, description: '' }] })}
                                    className="w-full py-2 border border-dashed border-gray-500 text-gray-400 hover:border-blue-400 hover:text-blue-400 rounded-lg flex items-center justify-center gap-2 transition-all font-medium text-sm"
                                >
                                    <Plus size={16} /> Add New Criteria
                                </button>
                            </div>
                        </div>

                        {/* Resource Links - Professional UI */}
                        <div>
                            <label className="block text-sm font-medium mb-3">Resource Links</label>
                            <div className="space-y-3">
                                {formData.resourceLinks.map((resource, index) => (
                                    <div key={index} className="bg-gray-600/50 border border-gray-600 rounded-lg p-4 flex gap-4 items-start">
                                        <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0 text-gray-400">
                                            {resource.type === 'GITHUB' && <Github size={24} />}
                                            {resource.type === 'DESIGN' && <Figma size={24} />}
                                            {resource.type === 'VIDEO' && <Youtube size={24} />}
                                            {resource.type === 'DOCUMENTATION' && <FileText size={24} />}
                                            {resource.type === 'OTHER' && <LinkIcon size={24} />}
                                        </div>

                                        <div className="flex-1 space-y-3">
                                            <div className="flex gap-4">
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        placeholder="Resource Title (e.g., API Docs)"
                                                        value={resource.title}
                                                        onChange={(e) => {
                                                            const newResources = [...formData.resourceLinks];
                                                            newResources[index].title = e.target.value;
                                                            setFormData({ ...formData, resourceLinks: newResources });
                                                        }}
                                                        className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 outline-none"
                                                    />
                                                </div>
                                                <div className="w-40">
                                                    <select
                                                        value={resource.type || 'OTHER'}
                                                        onChange={(e) => {
                                                            const newResources = [...formData.resourceLinks];
                                                            newResources[index].type = e.target.value;
                                                            setFormData({ ...formData, resourceLinks: newResources });
                                                        }}
                                                        className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 outline-none"
                                                    >
                                                        <option value="OTHER">General Link</option>
                                                        <option value="GITHUB">GitHub Repo</option>
                                                        <option value="DOCUMENTATION">Documentation</option>
                                                        <option value="DESIGN">Design File</option>
                                                        <option value="VIDEO">Video Tutorial</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <input
                                                    type="url"
                                                    placeholder="URL (https://...)"
                                                    value={resource.url}
                                                    onChange={(e) => {
                                                        const newResources = [...formData.resourceLinks];
                                                        newResources[index].url = e.target.value;
                                                        setFormData({ ...formData, resourceLinks: newResources });
                                                    }}
                                                    className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-sm font-mono text-blue-400 focus:border-blue-500 outline-none"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newResources = formData.resourceLinks.filter((_, i) => i !== index);
                                                setFormData({ ...formData, resourceLinks: newResources });
                                            }}
                                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded transition-colors h-10 w-10 flex items-center justify-center"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, resourceLinks: [...formData.resourceLinks, { title: '', url: '', type: 'OTHER' }] })}
                                    className="w-full py-2 border border-dashed border-gray-500 text-gray-400 hover:border-blue-400 hover:text-blue-400 rounded-lg flex items-center justify-center gap-2 transition-all font-medium text-sm"
                                >
                                    <Plus size={16} /> Add Resource Link
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full p-2 bg-gray-600 rounded"
                                >
                                    <option value="UPCOMING">Upcoming</option>
                                    <option value="LIVE">Live</option>
                                    <option value="ENDED">Ended</option>
                                </select>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isPublished"
                                    checked={formData.isPublished}
                                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                    className="mr-2"
                                />
                                <label htmlFor="isPublished" className="text-sm font-medium">Publish Hackathon</label>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-gray-600">
                            <button type="submit" className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-medium">
                                {editingHackathon ? 'Update Hackathon' : 'Create Hackathon'}
                            </button>
                            <button type="button" onClick={resetForm} className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded">
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            )}

            <div className="overflow-x-auto">
                <table className="w-full bg-gray-700 rounded-lg">
                    <thead>
                        <tr className="bg-gray-600">
                            <th className="p-3 text-left">Title</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Start Date</th>
                            <th className="p-3 text-left">End Date</th>
                            <th className="p-3 text-left">Created By</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hackathons.map((hackathon) => (
                            <tr key={hackathon._id} className="border-t border-gray-600">
                                <td className="p-3">{hackathon.title}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs ${hackathon.status === 'LIVE' ? 'bg-green-600' :
                                        hackathon.status === 'ENDED' ? 'bg-red-600' : 'bg-yellow-600'
                                        }`}>
                                        {hackathon.status}
                                    </span>
                                </td>
                                <td className="p-3">{hackathon.timeline?.startDate ? new Date(hackathon.timeline.startDate).toLocaleDateString() : 'N/A'}</td>
                                <td className="p-3">{hackathon.timeline?.endDate ? new Date(hackathon.timeline.endDate).toLocaleDateString() : 'N/A'}</td>
                                <td className="p-3">{hackathon.createdBy?.name || 'N/A'}</td>
                                <td className="p-3">
                                    <button
                                        onClick={() => startEdit(hackathon)}
                                        className="text-blue-400 hover:text-blue-300 mr-2"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(hackathon._id)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}