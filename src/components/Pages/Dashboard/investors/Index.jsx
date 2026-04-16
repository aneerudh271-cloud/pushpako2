'use client';
import { useState } from 'react';
import HeaderBar from './HeaderBar';
import NavigationTabs from './NavigationTabs';
import PortfolioTab from './PortfolioTab';
import PerformanceTab from './PerformanceTab';
import HackathonsTab from './HackathonsTab';
import NewsTab from './NewsTab';
import ReportsTab from './ReportsTab';
import ProfileTab from './ProfileTab';

import FirstLoginContact from './FirstLoginContact';

export default function InvestorDashboard({ investor }) {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showFirstLogin, setShowFirstLogin] = useState(investor.isFirstLogin === true);
  console.log(sessionStorage.getItem('user'));
  const handleProfileAction = (action) => {
    if (action === 'view' || action === 'edit') {
      setActiveTab('profile');
      setIsEditingProfile(action === 'edit');
    }
  };

  const handleOnboardingComplete = () => {
    setShowFirstLogin(false);
  };

  return (
    <div className="min-h-screen bg-[#060B18] text-white p-2 sm:p-4 md:p-6 relative">
      <div className="max-w-7xl mx-auto">
        <HeaderBar investor={investor} onProfileAction={handleProfileAction} />
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content based on active tab */}
        <div className="mt-6">
          {activeTab === 'profile' && <ProfileTab investor={investor} isEditing={isEditingProfile} />}
          {activeTab === 'portfolio' && <PortfolioTab investor={investor} />}
          {activeTab === 'performance' && <PerformanceTab />}
          {activeTab === 'hackathons' && <HackathonsTab />}
          {activeTab === 'news' && <NewsTab />}
          {activeTab === 'reports' && <ReportsTab />}
        </div>
      </div>

      {showFirstLogin && (
        <FirstLoginContact investor={investor} onComplete={handleOnboardingComplete} />
      )}
    </div>
  );
}