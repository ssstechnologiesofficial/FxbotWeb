import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '../components/Sidebar';

// Brand New Enhanced Dashboard Component - Force Fresh Load
function DashboardEnhanced() {
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

  // Handle authentication errors
  if (userError) {
    console.error('User authentication error:', userError);
    // If not authenticated, redirect to login
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
          <div className="text-lg text-gray-700">Loading enhanced dashboard...</div>
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    }}>
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* Sidebar */}
        <Sidebar user={user} onLogout={handleLogout} />

        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header with gradient */}
          <header style={{
            background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            padding: '1rem 1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h1 style={{ 
                fontSize: '1.875rem', 
                fontWeight: 'bold', 
                color: 'white',
                margin: 0
              }}>Enhanced Dashboard</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#bfdbfe' }}>Welcome,</span>
                  <span style={{ color: 'white', fontWeight: '600' }}>
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main style={{
            flex: 1,
            overflowY: 'auto',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            padding: '1.5rem'
          }}>
            {/* Top Stats Row - Enhanced with gradients and animations */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              
              {/* Total Balance Card */}
              <div style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #7c3aed 100%)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                transform: 'translateY(0)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px) scale(1.02)';
                e.target.style.boxShadow = '0 32px 64px -12px rgba(0, 0, 0, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p style={{ 
                    fontSize: '1.875rem', 
                    fontWeight: 'bold', 
                    color: 'white', 
                    marginBottom: '0.5rem',
                    margin: 0
                  }}>$0.00</p>
                  <p style={{ 
                    color: '#bfdbfe', 
                    fontSize: '0.875rem', 
                    marginBottom: '0.75rem',
                    margin: '0.5rem 0 0.75rem 0'
                  }}>Total Balance</p>
                  <button style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}>
                    Deposit Now! →
                  </button>
                </div>
              </div>

              {/* Wallet Balance Card */}
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                transform: 'translateY(0)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px) scale(1.02)';
                e.target.style.boxShadow = '0 32px 64px -12px rgba(0, 0, 0, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p style={{ 
                    fontSize: '1.875rem', 
                    fontWeight: 'bold', 
                    color: 'white', 
                    marginBottom: '0.5rem',
                    margin: 0
                  }}>$0.00</p>
                  <p style={{ 
                    color: '#a7f3d0', 
                    fontSize: '0.875rem', 
                    marginBottom: '0.75rem',
                    margin: '0.5rem 0 0.75rem 0'
                  }}>Wallet Balance</p>
                  <button style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}>
                    Deposit Now! →
                  </button>
                </div>
              </div>

              {/* Today's Referral Commission Card */}
              <div style={{
                background: 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #ec4899 100%)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                transform: 'translateY(0)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px) scale(1.02)';
                e.target.style.boxShadow = '0 32px 64px -12px rgba(0, 0, 0, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p style={{ 
                    fontSize: '1.875rem', 
                    fontWeight: 'bold', 
                    color: 'white', 
                    marginBottom: '0.5rem',
                    margin: 0
                  }}>${(referralData?.stats?.totalEarnings || 0).toFixed(2)}</p>
                  <p style={{ 
                    color: '#fed7aa', 
                    fontSize: '0.875rem',
                    margin: '0.5rem 0 0 0'
                  }}>Today's Referral Commission</p>
                </div>
              </div>

              {/* Document Status Card */}
              <div style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #10b981 50%, #14b8a6 100%)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                transform: 'translateY(0)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px) scale(1.02)';
                e.target.style.boxShadow = '0 32px 64px -12px rgba(0, 0, 0, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p style={{ 
                    fontSize: '1.875rem', 
                    fontWeight: 'bold', 
                    color: 'white', 
                    marginBottom: '0.5rem',
                    margin: 0
                  }}>Verified</p>
                  <p style={{ 
                    color: '#bbf7d0', 
                    fontSize: '0.875rem',
                    margin: '0.5rem 0 0 0'
                  }}>Document Status</p>
                </div>
              </div>

            </div>

            {/* Referral Program Section with Glassmorphism */}
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20 shadow-2xl relative overflow-hidden">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Referral Program Overview
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Your Referral Info */}
                  <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    <h4 className="text-white text-lg font-semibold mb-4">Your Sponsor ID</h4>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
                      <p className="text-white text-2xl font-bold">{user?.ownSponsorId || 'Loading...'}</p>
                    </div>
                    <button 
                      onClick={() => {
                        if (user?.ownSponsorId) {
                          navigator.clipboard.writeText(user.ownSponsorId);
                          alert('Sponsor ID copied to clipboard!');
                        }
                      }}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 border border-white/30 w-full"
                    >
                      Copy Sponsor ID
                    </button>
                  </div>

                  {/* Commission Structure */}
                  <div className="space-y-3">
                    <h4 className="text-gray-800 text-lg font-semibold mb-4">5-Tier Commission Structure</h4>
                    {[
                      { level: 1, rate: '1.5%', color: 'from-red-500 to-pink-500', count: referralData?.stats?.level1Count || 0 },
                      { level: 2, rate: '1.0%', color: 'from-orange-500 to-yellow-500', count: referralData?.stats?.level2Count || 0 },
                      { level: 3, rate: '0.75%', color: 'from-green-500 to-teal-500', count: referralData?.stats?.level3Count || 0 },
                      { level: 4, rate: '0.50%', color: 'from-blue-500 to-purple-500', count: referralData?.stats?.level4Count || 0 },
                      { level: 5, rate: '0.25%', color: 'from-purple-500 to-indigo-500', count: referralData?.stats?.level5Count || 0 }
                    ].map((tier) => (
                      <div key={tier.level} className={`bg-gradient-to-r ${tier.color} rounded-lg p-3 text-white transform hover:scale-105 transition-all duration-200`}>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Level {tier.level}</span>
                          <span className="font-bold">{tier.rate}</span>
                          <span className="bg-white/20 px-2 py-1 rounded text-sm">{tier.count} referrals</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Trade Accounts Section */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <h3 className="text-white text-xl font-bold">Trade Accounts</h3>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <th className="px-4 py-3 text-left text-gray-600 font-semibold">Account</th>
                        <th className="px-4 py-3 text-left text-gray-600 font-semibold">Balance</th>
                        <th className="px-4 py-3 text-left text-gray-600 font-semibold">Profit/Loss</th>
                        <th className="px-4 py-3 text-left text-gray-600 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 font-medium text-gray-900">Primary Account</td>
                        <td className="px-4 py-4 text-gray-700">$0.00</td>
                        <td className="px-4 py-4 text-green-600 font-medium">+$0.00</td>
                        <td className="px-4 py-4">
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Active</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardEnhanced;