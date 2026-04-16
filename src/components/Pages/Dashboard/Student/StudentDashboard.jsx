'use client';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Trophy, Clock, CheckCircle, AlertCircle, LogOut, User, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function StudentDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [participations, setParticipations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedCard, setExpandedCard] = useState(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/sign-in');
        }
        if (session?.user) {
            fetchParticipations();
        }
    }, [session, status]);

    const fetchParticipations = async () => {
        try {
            // We need a new API endpoint to get the current user's participations
            // Currently /api/participations is for admins to see hackathon entrants
            // We'll create /api/users/me/participations
            const response = await fetch('/api/users/me/participations');
            if (response.ok) {
                const data = await response.json();
                setParticipations(data.participations);
            }
        } catch (error) {
            console.error('Failed to fetch participations', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* Header */}
            <div className="border-b border-white/10 bg-[#0f1115]">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                            Pushpak O2
                        </Link>
                        <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-medium text-gray-400 border border-white/5">
                            Student Portal
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                                {session?.user?.name?.[0] || 'U'}
                            </div>
                            <span className="hidden md:block text-sm font-medium">{session?.user?.name}</span>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: '/sign-in' })}
                            className="p-2 text-gray-400 hover:text-white transition"
                            title="Sign Out"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Profile Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-[#0f1115] border border-white/10 rounded-xl p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <User className="text-blue-500" size={20} /> Profile
                        </h2>
                        <div className="space-y-2 text-sm text-gray-400">
                            <p><span className="text-gray-500">Name:</span> {session?.user?.name}</p>
                            <p><span className="text-gray-500">Email:</span> {session?.user?.email}</p>
                            <p><span className="text-gray-500">Role:</span> Participant</p>
                        </div>
                    </div>

                    <div className="bg-[#0f1115] border border-white/10 rounded-xl p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Trophy className="text-yellow-500" size={20} /> Stats
                        </h2>
                        <div className="flex gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">{participations.length}</p>
                                <p className="text-xs text-gray-500">Participations</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-500">
                                    {participations.filter(p => p.status === 'SUBMITTED').length}
                                </p>
                                <p className="text-xs text-gray-500">Submissions</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-xl p-6 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-lg mb-1">Explore Hackathons</h3>
                            <p className="text-xs text-blue-200 mb-4">Find new challenges to test your skills.</p>
                            <Link href="/hackathons" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition">
                                Browse Hackathons
                            </Link>
                        </div>
                        <Trophy className="text-blue-500/50" size={64} />
                    </div>
                </div>

                {/* Applications History */}
                <h2 className="text-2xl font-bold mb-6">My Participations</h2>

                {participations.length === 0 ? (
                    <div className="text-center py-12 bg-[#0f1115] rounded-xl border border-white/5">
                        <AlertCircle className="mx-auto text-gray-600 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-gray-400 mb-2">No Participations Yet</h3>
                        <p className="text-gray-500 mb-6">You haven't registered for any hackathons yet.</p>
                        <Link href="/hackathons" className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition">
                            Find a Hackathon
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {participations.map((p) => (
                            <div key={p._id} className="bg-[#0f1115] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition group">
                                <div className="h-32 relative">
                                    <Image
                                        src={p.hackathon?.bannerImage || '/images/placeholder-hackathon.jpg'}
                                        alt={p.hackathon?.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] to-transparent" />
                                    <div className="absolute bottom-4 left-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${p.status === 'APPROVED' ? 'bg-green-500 text-black' :
                                            p.status === 'PENDING' ? 'bg-yellow-500 text-black' :
                                                p.status === 'SUBMITTED' ? 'bg-purple-500 text-white' :
                                                    p.status === 'REJECTED' ? 'bg-red-500 text-white' :
                                                        'bg-gray-500 text-white'
                                            }`}>
                                            {p.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold mb-2 line-clamp-1">{p.hackathon?.title}</h3>
                                    <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} /> {new Date(p.registeredAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <Link
                                            href={`/hackathons/${p.hackathon?.slug}`}
                                            className="block w-full text-center py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-sm font-medium transition"
                                        >
                                            View Hackathon
                                        </Link>

                                        {p.teamName && (
                                            <div className="border-t border-white/5 pt-3">
                                                <button
                                                    onClick={() => setExpandedCard(expandedCard === p._id ? null : p._id)}
                                                    className="w-full flex justify-between items-center text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                                                >
                                                    <span>Team: {p.teamName}</span>
                                                    {expandedCard === p._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                </button>

                                                <AnimatePresence>
                                                    {expandedCard === p._id && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="mt-3 space-y-2">
                                                                {p.teamMembers?.map((member, idx) => (
                                                                    <div key={idx} className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                                                                        <div>
                                                                            <p className="text-xs font-medium text-white">{member.name}</p>
                                                                            <p className="text-[10px] text-gray-500">{member.role || 'Member'}</p>
                                                                        </div>
                                                                        {idx === 0 && <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded-full border border-blue-500/20">Lead</span>}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
