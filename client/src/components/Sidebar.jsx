import React from 'react';
import { useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  User, 
  DollarSign, 
  GitBranch, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  LogOut,
  ChevronRight,
  CreditCard
} from 'lucide-react';

const Sidebar = ({ user, onLogout }) => {
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

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white w-64">
      {/* Logo/Header */}
      <div className="flex items-center px-6 py-4 border-b border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">FX</span>
          </div>
          <span className="text-xl font-semibold">FcX Trade</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.path)}
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group ${
                item.active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              data-testid={`nav-${item.id}`}
            >
              <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.active && (
                <ChevronRight className="w-4 h-4 ml-2 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="px-4 py-4 border-t border-gray-700">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
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
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
          data-testid="nav-logout"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;