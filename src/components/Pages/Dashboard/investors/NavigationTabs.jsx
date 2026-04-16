export default function NavigationTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { key: 'portfolio', label: 'Portfolio' },
    { key: 'performance', label: 'Company Performance' },
    { key: 'hackathons', label: 'Hackathons' },
    { key: 'news', label: 'News & Updates' },
    { key: 'reports', label: 'Financial Reports' },
    { key: 'profile', label: 'Profile' },
  ];

  return (
    <div className="flex flex-wrap gap-2 md:gap-4 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`px-4 py-2 rounded-lg transition ${activeTab === tab.key ? 'bg-blue-600' : 'bg-gray-700 hover:bg-blue-500'
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}