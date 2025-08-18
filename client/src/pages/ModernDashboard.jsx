import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import ModernSidebar from '../components/ModernSidebar';
import { 
  DollarSign, 
  Wallet, 
  TrendingUp, 
  Shield,
  Users,
  Copy,
  Eye,
  ChevronRight,
  ArrowUpFromLine
} from 'lucide-react';

function ModernDashboard() {
  const [user, setUser] = useState(null);
  const [referralData, setReferralData] = useState(null);

  // Fetch user data
  const { data: userData, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false,
  });

  // Fetch referral data
  const { data: referrals, isLoading: referralsLoading, error: referralsError } = useQuery({
    queryKey: ['/api/user/referrals'],
    retry: false,
    enabled: !!userData
  });

  useEffect(() => {
    if (userData) {
      console.log('User data:', userData);
      setUser(userData);
    }
  }, [userData]);

  useEffect(() => {
    if (referrals) {
      console.log('Referral data:', referrals);
      setReferralData(referrals);
    }
  }, [referrals]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
    alert('Sponsor ID copied to clipboard!');
  };

  // Handle authentication errors
  if (userError) {
    console.error('User authentication error:', userError);
    if (userError.message.includes('401')) {
      window.location.href = '/login';
      return null;
    }
  }

  // Show loading state
  if (userLoading || (!user && !userError)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-lg text-gray-700">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="text-lg text-gray-700">Redirecting to login...</div>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Balance',
      value: '$0.00',
      icon: DollarSign,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      change: '+0%',
      changeType: 'positive'
    },
    {
      title: 'Wallet Balance',
      value: '$0.00',
      icon: Wallet,
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
      change: '+0%',
      changeType: 'positive'
    },
    {
      title: 'Referral Commission',
      value: `$${(referralData?.stats?.totalEarnings || 0).toFixed(2)}`,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      change: '+0%',
      changeType: 'positive'
    },
    {
      title: 'Account Status',
      value: 'Verified',
      icon: Shield,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      change: 'Active',
      changeType: 'positive'
    }
  ];

  const referralTiers = [
    { level: 1, rate: '1.5%', color: 'bg-red-500', count: referralData?.stats?.level1Count || 0 },
    { level: 2, rate: '1.0%', color: 'bg-orange-500', count: referralData?.stats?.level2Count || 0 },
    { level: 3, rate: '0.75%', color: 'bg-yellow-500', count: referralData?.stats?.level3Count || 0 },
    { level: 4, rate: '0.50%', color: 'bg-green-500', count: referralData?.stats?.level4Count || 0 },
    { level: 5, rate: '0.25%', color: 'bg-blue-500', count: referralData?.stats?.level5Count || 0 }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f3f4f6 0%, #dbeafe 50%, #e0e7ff 100%)',
      display: 'flex'
    }}>
      {/* Sidebar */}
      <ModernSidebar user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{
          background: 'white',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid #e5e7eb',
          padding: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Dashboard</h1>
              <p style={{ color: '#6b7280', marginTop: '0.25rem', margin: 0 }}>Welcome back, {user?.firstName}!</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem'
              }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Pro Account</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          {/* Enhanced Stats Cards with Gradients and Animations */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {statsCards.map((card, index) => {
              const IconComponent = card.icon;
              const gradients = {
                'from-blue-500 to-blue-600': 'linear-gradient(135deg, #3b82f6, #2563eb)',
                'from-purple-500 to-purple-600': 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                'from-orange-500 to-orange-600': 'linear-gradient(135deg, #f97316, #ea580c)',
                'from-green-500 to-green-600': 'linear-gradient(135deg, #10b981, #059669)'
              };
              
              return (
                <div 
                  key={index} 
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '1rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    background: gradients[card.gradient] || 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: 'scale(1)',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05) translateY(-8px)';
                    e.target.style.boxShadow = '0 25px 25px -5px rgba(0, 0, 0, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1) translateY(0)';
                    e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  {/* Animated Background Pattern */}
                  <div style={{ position: 'absolute', inset: 0, opacity: 0.2 }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '6rem',
                      height: '6rem',
                      background: 'white',
                      borderRadius: '50%',
                      filter: 'blur(2rem)',
                      transform: 'translate(2rem, -2rem)'
                    }}></div>
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '8rem',
                      height: '8rem',
                      background: 'white',
                      borderRadius: '50%',
                      filter: 'blur(3rem)',
                      transform: 'translate(-2rem, 2rem)'
                    }}></div>
                  </div>
                  
                  <div style={{ position: 'relative', padding: '1.5rem', color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{
                        width: '3.5rem',
                        height: '3.5rem',
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}>
                        <IconComponent style={{ width: '1.75rem', height: '1.75rem', color: 'white' }} />
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          background: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(10px)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          border: '1px solid rgba(255, 255, 255, 0.3)'
                        }}>
                          {card.change}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem', filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))' }}>{card.value}</h3>
                      <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem', fontWeight: '500' }}>{card.title}</p>
                      <button style={{
                        marginTop: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced Referral Program Card - Full Width */}
          <div style={{
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #f0f9ff 0%, white 50%, #f0fdfa 100%)',
            borderRadius: '1rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            {/* Animated Background Elements */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '10rem',
                height: '10rem',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
                borderRadius: '50%',
                filter: 'blur(3rem)',
                animation: 'pulse 4s ease-in-out infinite'
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '8rem',
                height: '8rem',
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(99, 102, 241, 0.2))',
                borderRadius: '50%',
                filter: 'blur(3rem)',
                animation: 'pulse 4s ease-in-out infinite 1s'
              }}></div>
            </div>
            
            <div style={{ position: 'relative', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '1rem',
                    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)'
                  }}>
                    <Users style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Referral Program</h3>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Earn commissions from 5 levels</p>
                  </div>
                </div>
                <button style={{
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'none'}
                >
                  View Tree <ChevronRight style={{ width: '1rem', height: '1rem', marginLeft: '0.25rem' }} />
                </button>
              </div>

              {/* Enhanced Sponsor ID Section */}
              <div style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                borderRadius: '1rem',
                padding: '1.5rem',
                marginBottom: '2rem',
                boxShadow: '0 25px 50px rgba(59, 130, 246, 0.25)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ color: '#dbeafe', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '500', margin: 0 }}>Your Sponsor ID</p>
                    <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))', margin: '0.5rem 0' }}>{user?.ownSponsorId}</p>
                    <p style={{ color: '#ddd6fe', fontSize: '0.75rem', margin: 0 }}>Share this ID to earn commissions</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(user?.ownSponsorId)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.transform = 'none';
                    }}
                  >
                    <Copy style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                    Copy ID
                  </button>
                </div>
              </div>

              {/* Enhanced Commission Tiers with Gradients */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Commission Structure</h4>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Total: <span style={{ fontWeight: '600', color: '#111827' }}>{referralData?.stats?.totalReferrals || 0} referrals</span>
                  </div>
                </div>
                {referralTiers.map((tier, index) => {
                  const gradients = [
                    'linear-gradient(135deg, #ef4444, #ec4899)',
                    'linear-gradient(135deg, #f97316, #eab308)',
                    'linear-gradient(135deg, #eab308, #22c55e)',
                    'linear-gradient(135deg, #22c55e, #3b82f6)',
                    'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                  ];
                  
                  return (
                    <div key={tier.level} style={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      background: gradients[index],
                      color: 'white',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.02)';
                      e.target.style.boxShadow = '0 20px 35px rgba(0, 0, 0, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'none';
                      e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
                    }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{
                            width: '2rem',
                            height: '2rem',
                            background: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '1rem'
                          }}>
                            <span style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{tier.level}</span>
                          </div>
                          <div>
                            <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>Level {tier.level} Commission</span>
                            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.75rem', margin: 0 }}>Direct referral earnings</p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{tier.rate}</div>
                          <div style={{
                            fontSize: '0.75rem',
                            background: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(10px)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '9999px'
                          }}>
                            {tier.count} active
                          </div>
                        </div>
                      </div>
                      
                      {/* Animated background pattern */}
                      <div style={{ position: 'absolute', inset: 0, opacity: 0.2 }}>
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: '4rem',
                          height: '4rem',
                          background: 'white',
                          borderRadius: '50%',
                          filter: 'blur(1.5rem)'
                        }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModernDashboard;
