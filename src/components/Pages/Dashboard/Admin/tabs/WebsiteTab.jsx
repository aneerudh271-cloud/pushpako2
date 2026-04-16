import BlogsManagement from '../components/BlogsManagement';
import UserManagement from '../components/UserManagement';
import FleetManagement from '../components/FleetManagement';
import TechnologyManagement from '../components/TechnologyManagement';
import AboutUsManagement from '../components/AboutUsManagement';
import ServicesManagement from '../components/ServicesManagement';
import TeamManagement from '../components/TeamManagement';
import FooterManagement from '../components/FooterManagement';

export default function WebsiteTab({ activeSubTab, setActiveSubTab }) {
  const renderSubTab = () => {
    switch (activeSubTab) {
      case 'blogs':
        return <BlogsManagement />;
      case 'users':
        return <UserManagement />;
      case 'fleet':
        return <FleetManagement />;
      case 'technology':
        return <TechnologyManagement />;
      case 'about':
        return <AboutUsManagement />;
      case 'footer':
        return <FooterManagement />;
      case 'services':
        return <ServicesManagement />;
      case 'team':
        return <TeamManagement />;
      default:
        return <BlogsManagement />;
    }
  };

  return (
    <div>
      {renderSubTab()}
    </div>
  );
}