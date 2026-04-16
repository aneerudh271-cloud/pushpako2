'use client';
import { useState, useEffect } from 'react';
import { Trophy, Users, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function HackathonsTab() {
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHackathons();
    }, []);

    const fetchHackathons = async () => {
        try {
            const response = await fetch('/api/hackathons');
            const data = await response.json();
            if (response.ok) {
                setHackathons(data.hackathons);
            }
        } catch (error) {
            console.error('Failed to fetch hackathons');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-8">Loading hackathons...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Hackathons</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hackathons.map((hackathon) => (
                    <div key={hackathon._id} className="bg-gray-800 p-6 rounded-lg">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold">{hackathon.title}</h3>
                            <span className={`px-2 py-1 rounded text-xs ${hackathon.status === 'LIVE' ? 'bg-green-600' :
                                hackathon.status === 'ENDED' ? 'bg-red-600' : 'bg-yellow-600'
                                }`}>
                                {hackathon.status}
                            </span>
                        </div>

                        <div className="text-gray-300 mb-4 line-clamp-3">
                            <ReactMarkdown>
                                {hackathon.overview || hackathon.description}
                            </ReactMarkdown>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Calendar size={16} />
                                <span>Start: {hackathon.timeline?.startDate ? new Date(hackathon.timeline.startDate).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Calendar size={16} />
                                <span>End: {hackathon.timeline?.endDate ? new Date(hackathon.timeline.endDate).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>

                        {hackathon.status === 'ENDED' && (
                            <div className="border-t border-gray-700 pt-4">
                                <div className="flex items-center gap-2 text-yellow-400 mb-2">
                                    <Trophy size={16} />
                                    <span className="font-semibold">Results</span>
                                </div>
                                <p className="text-sm text-gray-300">Winners will be announced soon.</p>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Users size={16} />
                            <span>Organized by: {hackathon.createdBy?.name || 'Admin'}</span>
                        </div>
                    </div>
                ))}
            </div>

            {hackathons.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-400">No hackathons available at the moment.</p>
                </div>
            )}
        </div>
    );
}