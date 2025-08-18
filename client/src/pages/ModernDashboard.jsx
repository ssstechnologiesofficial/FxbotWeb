import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import ModernSidebar from '../components/ModernSidebar';
import { 
  DollarSign, 
  Wallet, 
  TrendingUp, 
  Users,
  Copy,
  ChevronRight
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
      setUser(userData);
    }
  }, [userData]);

  useEffect(() => {
    if (referrals) {
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
    alert('Sponsor ID copied to clipboard!');
  };

  // Handle authentication errors
  if (userError) {
    if (userError.message.includes('401')) {
      window.location.href = '/login';
      return null;
    }
  }

  // Show loading state
  if (userLoading || (!user && !userError)) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh', 
        backgroundColor: '#f8fafc' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '2px solid #e5e7eb',
            borderTop: '2px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <div style={{ fontSize: '1.125rem', color: '#374151' }}>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Investment',
      value: '$0.00',
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      title: 'Total Earnings',
      value: `$${(referralData?.stats?.totalEarnings || 0).toFixed(2)}`,
      icon: Wallet,
      color: 'from-green-500 to-green-600',
      bgColor: 'rgba(34, 197, 94, 0.1)'
    },
    {
      title: 'Active Referrals',
      value: referralData?.stats?.totalReferrals || 0,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'rgba(139, 92, 246, 0.1)'
    },
    {
      title: 'Monthly ROI',
      value: '6.00%',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'rgba(249, 115, 22, 0.1)'
    }
  ];

  const referralTiers = [
    { level: 1, rate: '1.5%', count: referralData?.stats?.level1Count || 0 },
    { level: 2, rate: '1.0%', count: referralData?.stats?.level2Count || 0 },
    { level: 3, rate: '0.75%', count: referralData?.stats?.level3Count || 0 },
    { level: 4, rate: '0.50%', count: referralData?.stats?.level4Count || 0 },
    { level: 5, rate: '0.25%', count: referralData?.stats?.level5Count || 0 }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-bg">
      <ModernSidebar user={user} onLogout={handleLogout} />
      
      <main className="flex-1 p-8">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 'bold', 
            color: '#111827', 
            margin: '0 0 0.5rem 0' 
          }}>
            Welcome back, {user?.firstName}!
          </h1>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Track your FXBOT investments and referral earnings
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '2rem' 
        }}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(229, 231, 235, 0.5)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  e.target.style.transform = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ 
                      color: '#6b7280', 
                      fontSize: '0.875rem', 
                      margin: '0 0 0.5rem 0',
                      fontWeight: '500'
                    }}>
                      {stat.title}
                    </p>
                    <p style={{ 
                      fontSize: '1.875rem', 
                      fontWeight: 'bold', 
                      color: '#111827',
                      margin: 0
                    }}>
                      {stat.value}
                    </p>
                  </div>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    background: stat.bgColor,
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconComponent style={{ width: '1.5rem', height: '1.5rem', color: '#3b82f6' }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 400px', 
          gap: '2rem',
          '@media (max-width: 1024px)': {
            gridTemplateColumns: '1fr'
          }
        }}>
          {/* Referral Program Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(229, 231, 235, 0.5)'
          }}>
            {/* Header */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: '2rem' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '0.75rem'
                }}>
                  <Users style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                </div>
                <div>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold', 
                    color: '#111827', 
                    margin: 0 
                  }}>
                    Referral Program
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                    SmartLine Income - 5 Level Commission
                  </p>
                </div>
              </div>
            </div>

            {/* Sponsor ID Section */}
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              marginBottom: '2rem',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontSize: '0.875rem', 
                    margin: '0 0 0.5rem 0',
                    fontWeight: '500'
                  }}>
                    Your Sponsor ID
                  </p>
                  <p style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    margin: '0 0 0.25rem 0' 
                  }}>
                    {user?.ownSponsorId}
                  </p>
                  <p style={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    fontSize: '0.75rem',
                    margin: 0
                  }}>
                    Share this ID to earn commissions
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(user?.ownSponsorId)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  <Copy style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                  Copy ID
                </button>
              </div>
            </div>

            {/* Commission Structure */}
            <div>
              <h4 style={{ 
                fontSize: '1.125rem', 
                fontWeight: 'bold', 
                color: '#111827', 
                margin: '0 0 1rem 0' 
              }}>
                Commission Structure
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {referralTiers.map((tier, index) => {
                  const colors = [
                    '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'
                  ];
                  
                  return (
                    <div
                      key={tier.level}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '0.5rem',
                        border: `2px solid ${colors[index]}20`,
                        borderLeft: `4px solid ${colors[index]}`
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                          width: '2rem',
                          height: '2rem',
                          backgroundColor: colors[index],
                          color: 'white',
                          borderRadius: '0.375rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '0.75rem',
                          fontSize: '0.875rem',
                          fontWeight: 'bold'
                        }}>
                          {tier.level}
                        </div>
                        <div>
                          <span style={{ fontWeight: '600', color: '#111827' }}>
                            Level {tier.level}
                          </span>
                          <p style={{ 
                            color: '#6b7280', 
                            fontSize: '0.75rem', 
                            margin: 0 
                          }}>
                            {tier.rate} commission
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ 
                          fontSize: '1.25rem', 
                          fontWeight: 'bold', 
                          color: '#111827' 
                        }}>
                          {tier.count}
                        </div>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          color: '#6b7280' 
                        }}>
                          referrals
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(229, 231, 235, 0.5)',
            height: 'fit-content'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: '#111827', 
              margin: '0 0 1.5rem 0' 
            }}>
              Quick Actions
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button style={{
                width: '100%',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: 'white',
                fontWeight: '600',
                padding: '0.875rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'none';
                e.target.style.boxShadow = 'none';
              }}
              >
                <DollarSign style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
                Invest Now
              </button>
              
              <button style={{
                width: '100%',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                fontWeight: '600',
                padding: '0.875rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'none';
                e.target.style.boxShadow = 'none';
              }}
              >
                <Wallet style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
                View Portfolio
              </button>
              
              <button style={{
                width: '100%',
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                color: 'white',
                fontWeight: '600',
                padding: '0.875rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'none';
                e.target.style.boxShadow = 'none';
              }}
              >
                <Users style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
                Referral Tree
              </button>
            </div>

            {/* Package Info */}
            <div style={{
              marginTop: '2rem',
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{ 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: '#111827', 
                margin: '0 0 0.5rem 0' 
              }}>
                FS Income Package
              </h4>
              <p style={{ 
                fontSize: '0.75rem', 
                color: '#6b7280', 
                margin: '0 0 0.5rem 0' 
              }}>
                6% Monthly ROI until 2x returns
              </p>
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#059669',
                fontWeight: '600'
              }}>
                Minimum: $250 • Duration: ~17 months
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ModernDashboard;