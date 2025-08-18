import React from 'react';
import { useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  User, 
  CreditCard, 
  GitBranch, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  LogOut,
  ChevronRight
} from 'lucide-react';

const ModernSidebar = ({ user, onLogout }) => {
  const [location, navigate] = useLocation();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      active: location === '/dashboard'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/profile',
      active: location === '/profile'
    },
    {
      id: 'fund',
      label: 'Fund',
      icon: CreditCard,
      path: '/fund',
      active: location === '/fund'
    },
    {
      id: 'referral-tree',
      label: 'Referral Tree',
      icon: GitBranch,
      path: '/referral-tree',
      active: location === '/referral-tree'
    },
    {
      id: 'deposit',
      label: 'Deposit',
      icon: ArrowDownToLine,
      path: '/deposit',
      active: location === '/deposit'
    },
    {
      id: 'withdrawal',
      label: 'Withdrawal',
      icon: ArrowUpFromLine,
      path: '/withdrawal',
      active: location === '/withdrawal'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">FX</span>
          </div>
          <span className="text-xl font-bold">FXBOT</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                item.active
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <IconComponent className={`w-5 h-5 mr-3 ${item.active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
              <span className="font-medium">{item.label}</span>
              {item.active && (
                <ChevronRight className="w-4 h-4 ml-auto text-white" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-semibold text-sm">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-2 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200"
        >
          <LogOut className="w-4 h-4 mr-3" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ModernSidebar;