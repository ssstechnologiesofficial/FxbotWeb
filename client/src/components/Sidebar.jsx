import { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  User, 
  Wallet, 
  Users, 
  DollarSign, 
  CreditCard, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Target
} from 'lucide-react';

const Sidebar = ({ user, onLogout }) => {
  const [location, setLocation] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
    { id: 'fund', label: 'Fund', icon: Wallet, path: '/fund' },
    { id: 'referral-tree', label: 'Referral Tree', icon: Users, path: '/referral-tree' },
    { id: 'deposit', label: 'Deposit', icon: DollarSign, path: '/deposit' },
    { id: 'withdrawal', label: 'Withdrawal', icon: CreditCard, path: '/withdrawal' }
  ];

  const handleNavigation = (path) => {
    setLocation(path);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div style={{
      width: isCollapsed ? '4rem' : '16rem',
      height: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease',
      position: 'relative'
    }}>
      {/* Logo Section */}
      <div style={{
        padding: isCollapsed ? '1rem 0.5rem' : '1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        minHeight: '4rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
          }}>
            <Target style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
          </div>
          {!isCollapsed && (
            <div>
              <h1 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: 'white',
                margin: 0,
                letterSpacing: '0.02em'
              }}>
                FXBOT
              </h1>
              <p style={{
                fontSize: '0.75rem',
                color: '#94a3b8',
                margin: 0,
                fontWeight: '500'
              }}>
                Trading Platform
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Button */}
      <button
        onClick={toggleSidebar}
        style={{
          position: 'absolute',
          top: '1.25rem',
          right: '-0.75rem',
          width: '1.5rem',
          height: '1.5rem',
          backgroundColor: '#f59e0b',
          border: 'none',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          zIndex: 10,
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#d97706';
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#f59e0b';
          e.target.style.transform = 'scale(1)';
        }}
      >
        {isCollapsed ? (
          <ChevronRight style={{ width: '0.75rem', height: '0.75rem', color: 'white' }} />
        ) : (
          <ChevronLeft style={{ width: '0.75rem', height: '0.75rem', color: 'white' }} />
        )}
      </button>

      {/* User Profile */}
      {user && (
        <div style={{
          padding: isCollapsed ? '1rem 0.5rem' : '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: 'white',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}>
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          {!isCollapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'white',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {user.firstName} {user.lastName}
              </p>
              <p style={{
                fontSize: '0.75rem',
                color: '#94a3b8',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {user.email}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Navigation Menu */}
      <nav style={{
        flex: 1,
        padding: '1rem 0',
        overflowY: 'auto'
      }}>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }}>
          {menuItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  style={{
                    width: '100%',
                    padding: isCollapsed ? '0.75rem' : '0.75rem 1.5rem',
                    backgroundColor: isActive ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                    border: 'none',
                    borderLeft: isActive ? '3px solid #f59e0b' : '3px solid transparent',
                    color: isActive ? '#f59e0b' : '#94a3b8',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? '600' : '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    gap: '0.75rem',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                      e.target.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#94a3b8';
                    }
                  }}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    flexShrink: 0
                  }} />
                  {!isCollapsed && (
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.label}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div style={{
        padding: isCollapsed ? '1rem 0.5rem' : '1rem 1.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            padding: isCollapsed ? '0.75rem' : '0.75rem 1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '0.5rem',
            color: '#ef4444',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
            e.target.style.borderColor = 'rgba(239, 68, 68, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            e.target.style.borderColor = 'rgba(239, 68, 68, 0.3)';
          }}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut style={{
            width: '1rem',
            height: '1rem'
          }} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;