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
    <div style={{
      width: '256px',
      background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)'
    }}>
      {/* Logo Section */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid rgba(55, 65, 81, 0.5)',
        background: 'rgba(59, 130, 246, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '0.75rem',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
          }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem' }}>FX</span>
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.05em' }}>FXBOT</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                border: 'none',
                cursor: 'pointer',
                background: item.active 
                  ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
                  : 'transparent',
                color: item.active ? 'white' : '#d1d5db',
                boxShadow: item.active ? '0 4px 12px rgba(59, 130, 246, 0.4)' : 'none',
                transform: item.active ? 'translateX(4px)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!item.active) {
                  e.target.style.background = 'rgba(55, 65, 81, 0.6)';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateX(2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!item.active) {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#d1d5db';
                  e.target.style.transform = 'none';
                }
              }}
            >
              <IconComponent style={{
                width: '1.25rem',
                height: '1.25rem',
                marginRight: '0.75rem',
                color: item.active ? 'white' : '#9ca3af'
              }} />
              <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>{item.label}</span>
              {item.active && (
                <ChevronRight style={{ width: '1rem', height: '1rem', marginLeft: 'auto', color: 'white' }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid rgba(55, 65, 81, 0.5)',
        background: 'rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '0.75rem',
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)'
          }}>
            <span style={{ color: 'white', fontWeight: '600', fontSize: '0.875rem' }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'white', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.firstName} {user?.lastName}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email}
            </p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            color: '#d1d5db',
            background: 'transparent',
            border: 'none',
            borderRadius: '0.5rem',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#dc2626';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = '#d1d5db';
          }}
        >
          <LogOut style={{ width: '1rem', height: '1rem', marginRight: '0.75rem' }} />
          <span style={{ fontWeight: '500' }}>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ModernSidebar;