'use client';
import { useState, useEffect } from 'react';
import { LogOut, Lock, Mail, Key, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut, useSession, signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import HackathonsTab from './tabs/HackathonsTab';
import ParticipationsTab from './tabs/ParticipationsTab';
import SubmissionsTab from './tabs/SubmissionsTab';
import CouponsTab from './tabs/CouponsTab';

export default function HackathonManagerDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('hackathons');

    // Role Check: Allow both Hackathon Managers AND Admins
    const isAuthorized = session?.user?.role === 'hackathon_manager' || session?.user?.role === 'admin';

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/manager-login');
        } else if (status === 'authenticated' && !isAuthorized) {
            // If logged in but wrong role, show access denied or redirect
            // For now, let's toast and redirect home or to their own dashboard
            toast.error("Unauthorized access");
            if (session?.user?.role === 'admin') {
                // Admins ARE authorized by isAuthorized check, so this branch won't hit for them
            } else if (session?.user?.role === 'hackathon_user') {
                router.replace('/dashboards/student');
            } else {
                router.replace(`/dashboards/investors/${session.user.id}`);
            }
        }
    }, [status, session, router, isAuthorized]);

    if (status === 'loading' || status === 'unauthenticated' || (session && !isAuthorized)) {
        return (
            <div className="min-h-screen bg-[#060B18] flex items-center justify-center text-white">
                <Loader2 className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    // Authorized View
    const renderActiveTab = () => {
        switch (activeTab) {
            case 'hackathons':
                return <HackathonsTab />;
            case 'participations':
                return <ParticipationsTab />;
            case 'submissions':
                return <SubmissionsTab />;
            case 'coupons':
                return <CouponsTab />;
            default:
                return <HackathonsTab />;
        }
    };

    return (
        <div className="min-h-screen bg-[#060B18] text-white p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold">Hackathon Manager</h1>
                        <p className="text-gray-400 mt-1">Welcome, {session.user.name}</p>
                    </div>
                    <button
                        onClick={async () => {
                            try {
                                await signOut({ callbackUrl: '/sign-in' }); // Explicit redirect
                                toast.success('Logged out successfully');
                            } catch (error) {
                                toast.error('Logout failed');
                            }
                        }}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>

                <div className="mb-6">
                    <nav className="flex space-x-1 bg-gray-800 p-1 rounded-lg inline-flex">
                        {[
                            { id: 'hackathons', label: 'Hackathons' },
                            { id: 'participations', label: 'Participations' },
                            { id: 'submissions', label: 'Submissions' },
                            { id: 'coupons', label: 'Coupons' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    {renderActiveTab()}
                </div>
            </div>
        </div>
    );
}