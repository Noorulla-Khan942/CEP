import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  Calendar, 
  BarChart3, 
  Home, 
  Menu,
  X,
  UserCheck,
  MessageSquare,
  Settings
} from 'lucide-react';
import { toggleSidebar } from '../../store/slices/uiSlice.js';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen } = useSelector(state => state.ui);
  const { user } = useSelector(state => state.auth);

  const getMenuItems = (role) => {
    const baseItems = [
      { icon: Home, label: 'Dashboard', path: '/dashboard' },
    ];

    switch (role) {
      case 'admin':
        return [
          ...baseItems,
          { icon: Users, label: 'Candidates', path: '/candidates' },
          { icon: Building2, label: 'Companies', path: '/companies' },
          { icon: Calendar, label: 'Interviews', path: '/interviews' },
          { icon: BarChart3, label: 'Reports', path: '/reports' },
          { icon: Settings, label: 'Settings', path: '/settings' },
        ];
      case 'recruiter':
        return [
          ...baseItems,
          { icon: Users, label: 'Candidates', path: '/candidates' },
          { icon: Building2, label: 'Companies', path: '/companies' },
          { icon: Calendar, label: 'Interviews', path: '/interviews' },
          { icon: MessageSquare, label: 'Messages', path: '/messages' },
        ];
      case 'company':
        return [
          ...baseItems,
          { icon: UserCheck, label: 'Assigned Candidates', path: '/assigned-candidates' },
          { icon: Calendar, label: 'Interviews', path: '/interviews' },
          { icon: MessageSquare, label: 'Feedback', path: '/feedback' },
        ];
      case 'candidate':
        return [
          ...baseItems,
          { icon: UserCheck, label: 'My Profile', path:"/candidate/profile" },
          { icon: Calendar, label: 'My Interviews', path:"/candidate/interview" },
          { icon: MessageSquare, label: 'Messages', path: "/candidate/messages" },
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems(user?.role);

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      dispatch(toggleSidebar());
    }
  };

  return (
    <>
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CEP</span>
            </div>
            <span className="font-bold text-gray-900">Platform</span>
          </div>
          
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-medium text-sm">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`sidebar-item w-full ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;