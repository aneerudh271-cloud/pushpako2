'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

// Import Tabs
import OverviewTab from './tabs/OverviewTab';
import InvestorsTab from './tabs/InvestorsTab';
import HackathonsTab from './tabs/HackathonsTab';
import ManagersTab from './tabs/ManagersTab';
import WebsiteTab from './tabs/WebsiteTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import ParticipationsTab from '../HackathonManager/tabs/ParticipationsTab';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State Management
  const [activeMainTab, setActiveMainTab] = useState('overview');
  const [activeSubTab, setActiveSubTab] = useState('blogs');
  const [expandedSections, setExpandedSections] = useState({
    website: false
  });

  // Authorization Check
  if (status === 'loading') {
    return <div className="min-h-screen bg-[#060B18] text-white flex items-center justify-center">Loading...</div>;
  }

  if (!session || session.user.role !== 'admin') {
    if (typeof window !== 'undefined') {
      router.push('/sign-in');
    }
    return null;
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderActiveTab = () => {
    switch (activeMainTab) {
      case 'overview':
        return <OverviewTab />;
      case 'investors':
        return <InvestorsTab />;
      case 'hackathons':
        return <HackathonsTab />;
      case 'participations':
        return <ParticipationsTab />;
      case 'managers':
        return <ManagersTab />;
      case 'website':
        return <WebsiteTab activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />;
      case 'analytics':
        return <AnalyticsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#060B18] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <button
            onClick={async () => {
              try {
                await fetch('/api/auth/logout', { method: 'POST' });
                toast.success('Logged out successfully');
                signOut({ callbackUrl: '/sign-in' });
              } catch (error) {
                toast.error('Logout failed');
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Main Navigation Tabs */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-8">
          <button
            onClick={() => setActiveMainTab('overview')}
            className={`px-4 py-2 rounded-lg ${activeMainTab === 'overview' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveMainTab('investors')}
            className={`px-4 py-2 rounded-lg ${activeMainTab === 'investors' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition`}
          >
            Investors Management
          </button>
          <button
            onClick={() => setActiveMainTab('hackathons')}
            className={`px-4 py-2 rounded-lg ${activeMainTab === 'hackathons' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition`}
          >
            Hackathons Management
          </button>
          <button
            onClick={() => setActiveMainTab('managers')}
            className={`px-4 py-2 rounded-lg ${activeMainTab === 'managers' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition`}
          >
            Managers Management
          </button>
          <button
            onClick={() => setActiveMainTab('participations')}
            className={`px-4 py-2 rounded-lg ${activeMainTab === 'participations' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition`}
          >
            Participations
          </button>
          <button
            onClick={() => {
              setActiveMainTab('website');
              toggleSection('website');
            }}
            className={`px-4 py-2 rounded-lg ${activeMainTab === 'website' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition flex items-center gap-2`}
          >
            Website Management
            {expandedSections.website ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setActiveMainTab('analytics')}
            className={`px-4 py-2 rounded-lg ${activeMainTab === 'analytics' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition`}
          >
            Analytics
          </button>
        </div>

        {/* Website Management Sub-tabs */}
        {activeMainTab === 'website' && expandedSections.website && (
          <div className="flex flex-wrap gap-2 md:gap-4 mb-8 ml-4">
            <button
              onClick={() => setActiveSubTab('blogs')}
              className={`px-3 py-1 text-sm rounded-lg ${activeSubTab === 'blogs' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition`}
            >
              Blogs Management
            </button>
            <button
              onClick={() => setActiveSubTab('users')}
              className={`px-3 py-1 text-sm rounded-lg ${activeSubTab === 'users' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveSubTab('fleet')}
              className={`px-3 py-1 text-sm rounded-lg ${activeSubTab === 'fleet' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition`}
            >
              Fleet Management
            </button>
            <button
              onClick={() => setActiveSubTab('technology')}
              className={`px-3 py-1 text-sm rounded-lg ${activeSubTab === 'technology' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition`}
            >
              Technology Management
            </button>
            <button
              onClick={() => setActiveSubTab('about')}
              className={`px-3 py-1 text-sm rounded-lg ${activeSubTab === 'about' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition`}
            >
              About Us Management
            </button>
            <button
              onClick={() => setActiveSubTab('footer')}
              className={`px-3 py-1 text-sm rounded-lg ${activeSubTab === 'footer' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition`}
            >
              Footer Us Management
            </button>
            <button
              onClick={() => setActiveSubTab('services')}
              className={`px-3 py-1 text-sm rounded-lg ${activeSubTab === 'services' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition`}
            >
              Services Management
            </button>
            <button
              onClick={() => setActiveSubTab('team')}
              className={`px-3 py-1 text-sm rounded-lg ${activeSubTab === 'team' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition`}
            >
              Team Management
            </button>
          </div>
        )}

        {/* Render Active Tab Content */}
        {renderActiveTab()}
      </div>
    </div>
  );
}