'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Maximize2, Minimize2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HackathonsTab() {
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
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
        isPublished: false,
        organizedBy: '',
        venue: '',
        theme: '',
        registrationFee: 0,
        requireGenderBalance: false,
        minMale: 0,
        minFemale: 0,
        structure: []
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
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);

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
            maxTeamSize: formData.maxTeamSize,
            requireGenderBalance: formData.requireGenderBalance,
            minMale: formData.minMale,
            minFemale: formData.minFemale
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
            isPublished: formData.isPublished,
            organizedBy: formData.organizedBy,
            venue: formData.venue,
            theme: formData.theme,
            registrationFee: formData.registrationFee,
            structure: formData.structure
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
            isPublished: false,
            organizedBy: '',
            venue: '',
            theme: '',
            registrationFee: 0,
            requireGenderBalance: false,
            minMale: 0,
            minFemale: 0,
            structure: []
        });
        setEditingHackathon(null);
        setShowCreateForm(false);
        setIsFullScreen(false);
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
            judgingCriteria: hackathon.judgingCriteria || [],
            resourceLinks: hackathon.resourceLinks || [],
            status: hackathon.status || 'UPCOMING',
            isPublished: hackathon.isPublished || false,
            organizedBy: hackathon.organizedBy || '',
            venue: hackathon.venue || '',
            theme: hackathon.theme || '',
            registrationFee: hackathon.registrationFee || 0,
            requireGenderBalance: hackathon.teamSettings?.requireGenderBalance || false,
            minMale: hackathon.teamSettings?.minMale || 0,
            minFemale: hackathon.teamSettings?.minFemale || 0,
            structure: hackathon.structure || []
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
                <form
                    onSubmit={handleSubmit}
                    className={`transition-all duration-300 ${isFullScreen
                        ? 'fixed inset-0 z-[100] bg-[#1a1c21] overflow-y-auto p-4 md:p-12'
                        : 'bg-gray-700 p-6 rounded-lg mb-6 max-h-96 overflow-y-auto'
                        }`}
                >
                    <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                        <h3 className="text-2xl font-bold text-white">
                            {editingHackathon ? 'Edit Hackathon' : 'Create New Hackathon'}
                        </h3>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setIsFullScreen(!isFullScreen)}
                                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10"
                                title={isFullScreen ? "Exit Full Screen" : "Full Screen View"}
                            >
                                {isFullScreen ? <Minimize2 size={20} className="text-purple-400" /> : <Maximize2 size={20} className="text-purple-400" />}
                            </button>
                            {isFullScreen && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all border border-red-500/20"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white/5 p-4 rounded-xl border border-white/10 mt-6">
                            <div className="md:col-span-4">
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2 mb-4">Team & Participation Settings</h4>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Team Type</label>
                                <select
                                    value={formData.teamType}
                                    onChange={(e) => setFormData({ ...formData, teamType: e.target.value })}
                                    className="w-full p-2 bg-gray-600 rounded"
                                >
                                    <option value="SOLO">Solo Only</option>
                                    <option value="TEAM">Team Only</option>
                                </select>
                            </div>
                            {formData.teamType === 'TEAM' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Min Team Size</label>
                                        <input
                                            type="number"
                                            value={formData.minTeamSize}
                                            onChange={(e) => setFormData({ ...formData, minTeamSize: parseInt(e.target.value) || 1 })}
                                            className="w-full p-2 bg-gray-600 rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Max Team Size</label>
                                        <input
                                            type="number"
                                            value={formData.maxTeamSize}
                                            onChange={(e) => setFormData({ ...formData, maxTeamSize: parseInt(e.target.value) || 1 })}
                                            className="w-full p-2 bg-gray-600 rounded"
                                        />
                                    </div>
                                    <div className="md:col-span-1 pt-6 flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="requireGenderBalance"
                                            checked={formData.requireGenderBalance}
                                            onChange={(e) => setFormData({ ...formData, requireGenderBalance: e.target.checked })}
                                            className="w-4 h-4"
                                        />
                                        <label htmlFor="requireGenderBalance" className="text-sm font-medium">Require Gender Balance</label>
                                    </div>

                                    {formData.requireGenderBalance && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-blue-400">Min Male Members</label>
                                                <input
                                                    type="number"
                                                    value={formData.minMale}
                                                    onChange={(e) => setFormData({ ...formData, minMale: parseInt(e.target.value) || 0 })}
                                                    className="w-full p-2 bg-blue-900/10 border border-blue-500/20 rounded"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-pink-400">Min Female Members</label>
                                                <input
                                                    type="number"
                                                    value={formData.minFemale}
                                                    onChange={(e) => setFormData({ ...formData, minFemale: parseInt(e.target.value) || 0 })}
                                                    className="w-full p-2 bg-pink-900/10 border border-pink-500/20 rounded"
                                                />
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Banner Image</label>
                                <div className="space-y-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e.target.files[0], 'banner')}
                                        className="w-full p-2 bg-gray-600 rounded text-sm"
                                        disabled={uploading.banner}
                                    />
                                    {uploading.banner && <p className="text-blue-400 text-xs">Uploading...</p>}
                                    <input
                                        type="url"
                                        placeholder="Or enter image URL"
                                        value={formData.bannerImage}
                                        onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                                        className="w-full p-2 bg-gray-600 rounded text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Logo</label>
                                <div className="space-y-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e.target.files[0], 'logo')}
                                        className="w-full p-2 bg-gray-600 rounded text-sm"
                                        disabled={uploading.logo}
                                    />
                                    {uploading.logo && <p className="text-blue-400 text-xs">Uploading...</p>}
                                    <input
                                        type="url"
                                        placeholder="Or enter logo URL"
                                        value={formData.logo}
                                        onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                        className="w-full p-2 bg-gray-600 rounded text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Organized By</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Pushpako2"
                                    value={formData.organizedBy}
                                    onChange={(e) => setFormData({ ...formData, organizedBy: e.target.value })}
                                    className="w-full p-2 bg-gray-600 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Venue</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Jagran Lakecity University"
                                    value={formData.venue}
                                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                    className="w-full p-2 bg-gray-600 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Theme</label>
                                <input
                                    type="text"
                                    placeholder="e.g., SHIELD"
                                    value={formData.theme}
                                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                                    className="w-full p-2 bg-gray-600 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Registration Fee (₹)</label>
                                <input
                                    type="number"
                                    placeholder="2000"
                                    value={formData.registrationFee}
                                    onChange={(e) => setFormData({ ...formData, registrationFee: parseInt(e.target.value) || 0 })}
                                    className="w-full p-2 bg-gray-600 rounded"
                                />
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

                        <div>
                            <label className="block text-sm font-medium mb-1">Rules</label>
                            <textarea
                                placeholder="Enter each rule on a new line"
                                value={formData.rules.join('\n')}
                                onChange={(e) => setFormData({ ...formData, rules: e.target.value.split('\n').filter(r => r.trim()) })}
                                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                className="w-full p-2 bg-gray-600 rounded resize-none"
                                rows={1}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Eligibility Criteria</label>
                            <textarea
                                placeholder="Enter each eligibility requirement on a new line"
                                value={formData.eligibility.join('\n')}
                                onChange={(e) => setFormData({ ...formData, eligibility: e.target.value.split('\n').filter(r => r.trim()) })}
                                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                className="w-full p-2 bg-gray-600 rounded resize-none"
                                rows={1}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Allowed Technologies</label>
                            <textarea
                                placeholder="Enter each technology on a new line (e.g., React, Node.js, Python)"
                                value={formData.allowedTechnologies.join('\n')}
                                onChange={(e) => setFormData({ ...formData, allowedTechnologies: e.target.value.split('\n').filter(r => r.trim()) })}
                                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                className="w-full p-2 bg-gray-600 rounded resize-none"
                                rows={1}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Prize Structure</label>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs mb-1">Total Prize Pool ($)</label>
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
                                    <label className="block text-xs mb-1">1st Prize ($)</label>
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
                                    <label className="block text-xs mb-1">2nd Prize ($)</label>
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
                                    <label className="block text-xs mb-1">3rd Prize ($)</label>
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

                        <div>
                            <label className="block text-sm font-medium mb-1">Judging Criteria</label>
                            <textarea
                                placeholder="Enter criteria as 'Innovation:40', 'Technical:30', 'Presentation:30' (one per line)"
                                value={formData.judgingCriteria.map(c => `${c.title}:${c.weight}`).join('\n')}
                                onChange={(e) => setFormData({ ...formData, judgingCriteria: e.target.value.split('\n').filter(r => r.trim()).map(line => { const [title, weight] = line.split(':'); return { title: title?.trim(), weight: parseInt(weight) || 0 }; }).filter(c => c.title) })}
                                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                className="w-full p-2 bg-gray-600 rounded resize-none"
                                rows={1}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Resource Links</label>
                            <textarea
                                placeholder="Enter links as 'Documentation:https://docs.example.com', 'API Reference:https://api.example.com' (one per line)"
                                value={formData.resourceLinks.map(r => `${r.title}:${r.url}`).join('\n')}
                                onChange={(e) => setFormData({ ...formData, resourceLinks: e.target.value.split('\n').filter(r => r.trim()).map(line => { const [title, url] = line.split(':'); return { title: title?.trim(), url: url?.trim() }; }).filter(r => r.title && r.url) })}
                                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                className="w-full p-2 bg-gray-600 rounded resize-none"
                                rows={1}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Event Structure (Rounds)</label>
                            <div className="space-y-4">
                                {formData.structure.map((round, idx) => (
                                    <div key={idx} className="bg-gray-800 p-4 rounded-lg relative">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, structure: formData.structure.filter((_, i) => i !== idx) })}
                                            className="absolute top-2 right-2 text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                            <input
                                                placeholder="Round Name (e.g., Round 1: Pilot Round)"
                                                value={round.roundName}
                                                onChange={(e) => {
                                                    const newStructure = [...formData.structure];
                                                    newStructure[idx].roundName = e.target.value;
                                                    setFormData({ ...formData, structure: newStructure });
                                                }}
                                                className="w-full p-2 bg-gray-700 rounded"
                                            />
                                            <input
                                                placeholder="Elimination (e.g., 25% teams will be eliminated)"
                                                value={round.elimination}
                                                onChange={(e) => {
                                                    const newStructure = [...formData.structure];
                                                    newStructure[idx].elimination = e.target.value;
                                                    setFormData({ ...formData, structure: newStructure });
                                                }}
                                                className="w-full p-2 bg-gray-700 rounded"
                                            />
                                        </div>
                                        <textarea
                                            placeholder="Activities (one per line)"
                                            value={round.activities.join('\n')}
                                            onChange={(e) => {
                                                const newStructure = [...formData.structure];
                                                newStructure[idx].activities = e.target.value.split('\n').filter(a => a.trim());
                                                setFormData({ ...formData, structure: newStructure });
                                            }}
                                            className="w-full p-2 bg-gray-700 rounded mb-2"
                                            rows={2}
                                        />
                                        <textarea
                                            placeholder="Judging Criteria for this round (Title:Weight, e.g., Innovation:40) (one per line)"
                                            value={round.judgingCriteria?.map(c => `${c.title}:${c.weight}`).join('\n')}
                                            onChange={(e) => {
                                                const newStructure = [...formData.structure];
                                                newStructure[idx].judgingCriteria = e.target.value.split('\n').filter(r => r.trim()).map(line => {
                                                    const [title, weight] = line.split(':');
                                                    return { title: title?.trim(), weight: parseInt(weight) || 0 };
                                                }).filter(c => c.title);
                                                setFormData({ ...formData, structure: newStructure });
                                            }}
                                            className="w-full p-2 bg-gray-700 rounded"
                                            rows={2}
                                        />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, structure: [...formData.structure, { roundName: '', activities: [], elimination: '', judgingCriteria: [] }] })}
                                    className="w-full py-2 bg-gray-800 border border-dashed border-gray-600 rounded-lg text-sm text-gray-400 hover:text-white hover:border-white transition-all"
                                >
                                    + Add Round
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