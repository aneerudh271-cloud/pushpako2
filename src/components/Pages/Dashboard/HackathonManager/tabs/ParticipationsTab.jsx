'use client';
import { useState, useEffect, Fragment } from 'react';
import { Check, X, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ParticipationsTab() {
    const [hackathons, setHackathons] = useState([]);
    const [selectedHackathon, setSelectedHackathon] = useState('');
    const [participations, setParticipations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);

    useEffect(() => {
        fetchHackathons();
    }, []);

    useEffect(() => {
        if (selectedHackathon) {
            fetchParticipations();
        }
    }, [selectedHackathon]);

    const fetchHackathons = async () => {
        try {
            const response = await fetch('/api/hackathons');
            const data = await response.json();
            if (response.ok) {
                setHackathons(data.hackathons);
            }
        } catch (error) {
            toast.error('Failed to fetch hackathons');
        }
    };

    const fetchParticipations = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/participations?hackathonId=${selectedHackathon}`);
            const data = await response.json();
            if (response.ok) {
                setParticipations(data.participations);
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Failed to fetch participations');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (participationId) => {
        try {
            const response = await fetch(`/api/participations/${participationId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'approve' })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Participation approved');
                fetchParticipations();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Approval failed');
        }
    };

    const handleReject = async (participationId) => {
        if (!confirm('Are you sure you want to reject this participation?')) return;
        try {
            const response = await fetch(`/api/participations/${participationId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'reject' })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Participation rejected');
                fetchParticipations();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Rejection failed');
        }
    };

    const handleSendToken = async (participationId) => {
        try {
            const response = await fetch(`/api/participations/${participationId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'send-token' })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Access token sent to email');
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Failed to send token');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Participations</h2>

            <div className="mb-6">
                <select
                    value={selectedHackathon}
                    onChange={(e) => setSelectedHackathon(e.target.value)}
                    className="w-full md:w-64 p-2 bg-gray-600 rounded"
                >
                    <option value="">Select Hackathon</option>
                    {hackathons.map((hackathon) => (
                        <option key={hackathon._id} value={hackathon._id}>
                            {hackathon.title}
                        </option>
                    ))}
                </select>
            </div>

            {selectedHackathon && (
                <div className="overflow-x-auto">
                    <table className="w-full bg-gray-700 rounded-lg">
                        <thead>
                            <tr className="bg-gray-600">
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Phone</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Registered At</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-3 text-center">Loading...</td>
                                </tr>
                            ) : participations.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-3 text-center">No participations found</td>
                                </tr>
                            ) : (
                                participations.map((participation) => (
                                    <Fragment key={participation._id}>
                                        <tr className="border-t border-gray-600 hover:bg-white/5 transition-colors">
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    {participation.teamName && (
                                                        <button
                                                            onClick={() => setExpandedRow(expandedRow === participation._id ? null : participation._id)}
                                                            className="p-1 hover:bg-white/10 rounded transition-colors"
                                                        >
                                                            {expandedRow === participation._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                        </button>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-white">{participation.user?.name || 'Unknown User'}</p>
                                                        {participation.teamName && (
                                                            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Team: {participation.teamName}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex flex-col">
                                                    <span className="text-sm">{participation.user?.email || 'N/A'}</span>
                                                    <span className="text-[10px] text-gray-500 uppercase font-medium">{participation.user?.phone || ''}</span>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${participation.status === 'APPROVED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                    (participation.status === 'CODE_REQUESTED' || participation.status === 'PENDING') ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                        'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                                    }`}>
                                                    {participation.status}
                                                </span>
                                            </td>
                                            <td className="p-3 text-sm text-gray-400">{new Date(participation.registeredAt).toLocaleDateString()}</td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-3">
                                                    {(participation.status === 'REGISTERED' || participation.status === 'CODE_REQUESTED' || participation.status === 'PENDING') && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(participation._id)}
                                                                className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-all"
                                                                title="Approve"
                                                            >
                                                                <Check size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(participation._id)}
                                                                className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
                                                                title="Reject"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </>
                                                    )}
                                                    {participation.status === 'APPROVED' && (
                                                        <button
                                                            onClick={() => handleSendToken(participation._id)}
                                                            className={`p-2 rounded-lg transition-all ${participation.tokenSent ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'}`}
                                                            title={participation.tokenSent ? "Token Sent. Click to Resend." : "Send Access Token via Email"}
                                                        >
                                                            <Mail size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedRow === participation._id && participation.teamMembers && (
                                            <tr className="bg-white/5 border-t border-white/5">
                                                <td colSpan="5" className="p-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {participation.teamMembers.map((member, idx) => (
                                                            <div key={idx} className="bg-[#0a0c10] border border-white/5 rounded-xl p-4 space-y-2">
                                                                <div className="flex justify-between items-start">
                                                                    <h4 className="font-bold text-white text-sm">{member.name} {idx === 0 && <span className="text-[10px] text-blue-400 ml-1">(Lead)</span>}</h4>
                                                                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-gray-400">{member.role || 'Member'}</span>
                                                                </div>
                                                                <div className="text-xs text-gray-500 space-y-1">
                                                                    <p className="flex items-center gap-2"><Mail size={10} /> {member.email}</p>
                                                                    {member.phone && <p className="flex items-center gap-2 italic">{member.phone}</p>}
                                                                    <p className="uppercase font-bold text-[9px] tracking-widest text-gray-600">{member.gender} | {member.college || 'No College'}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}