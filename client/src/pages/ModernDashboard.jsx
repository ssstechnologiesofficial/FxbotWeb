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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enhanced Referral Program Card with Glassmorphism */}
            <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
              </div>
              
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Referral Program</h3>
                      <p className="text-gray-600 text-sm">Earn commissions from 5 levels</p>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center shadow-lg">
                    View Tree <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>

                {/* Enhanced Sponsor ID Section */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 mb-8 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm mb-2 font-medium">Your Sponsor ID</p>
                      <p className="text-3xl font-bold text-white drop-shadow-sm">{user?.ownSponsorId}</p>
                      <p className="text-blue-200 text-xs mt-1">Share this ID to earn commissions</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(user?.ownSponsorId)}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-4 py-3 rounded-xl flex items-center text-sm font-medium transition-all duration-200 shadow-lg hover:scale-105"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy ID
                    </button>
                  </div>
                </div>

                {/* Enhanced Commission Tiers with Gradients */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900">Commission Structure</h4>
                    <div className="text-sm text-gray-600">
                      Total: <span className="font-semibold text-gray-900">{referralData?.stats?.totalReferrals || 0} referrals</span>
                    </div>
                  </div>
                  {referralTiers.map((tier, index) => (
                    <div key={tier.level} className={`relative overflow-hidden rounded-xl p-4 bg-gradient-to-r ${
                      index === 0 ? 'from-red-500 to-pink-500' :
                      index === 1 ? 'from-orange-500 to-yellow-500' :
                      index === 2 ? 'from-yellow-500 to-green-500' :
                      index === 3 ? 'from-green-500 to-blue-500' :
                      'from-blue-500 to-purple-500'
                    } text-white shadow-lg hover:shadow-xl transform hover:scale-102 transition-all duration-200`}>
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-4">
                            <span className="font-bold text-sm">{tier.level}</span>
                          </div>
                          <div>
                            <span className="font-semibold">Level {tier.level} Commission</span>
                            <p className="text-white/80 text-xs">Direct referral earnings</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{tier.rate}</div>
                          <div className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                            {tier.count} active
                          </div>
                        </div>
                      </div>
                      
                      {/* Animated background pattern */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white rounded-full blur-xl"></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Investment Simulation Tool */}
                <div className="mt-8 bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Commission Calculator</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white/60 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">${(referralData?.stats?.totalEarnings || 0).toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Total Earned</div>
                    </div>
                    <div className="text-center p-4 bg-white/60 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{referralData?.stats?.totalReferrals || 0}</div>
                      <div className="text-sm text-gray-600">Active Referrals</div>
                    </div>
                    <div className="text-center p-4 bg-white/60 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">5</div>
                      <div className="text-sm text-gray-600">Commission Levels</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Quick Actions with Animations */}
            <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              
              <div className="space-y-4">
                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1">
                  <DollarSign className="w-5 h-5 mr-3" />
                  Deposit Funds
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
                
                <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1">
                  <ArrowUpFromLine className="w-5 h-5 mr-3" />
                  Withdraw Funds
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
                
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1">
                  <Eye className="w-5 h-5 mr-3" />
                  View Transactions
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
                
                <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1">
                  <TrendingUp className="w-5 h-5 mr-3" />
                  Start Trading
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
              </div>

              {/* Enhanced Recent Activity */}
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                  Recent Activity
                  <div className="w-2 h-2 bg-green-400 rounded-full ml-2 animate-pulse"></div>
                </h4>
                <div className="space-y-3">
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                          <DollarSign className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Account Verified</div>
                          <div className="text-xs text-gray-500">2 hours ago</div>
                        </div>
                      </div>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Profile Updated</div>
                          <div className="text-xs text-gray-500">1 day ago</div>
                        </div>
                      </div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="text-center py-4 text-gray-500">
                    <div className="text-xs">View all activity →</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Trading Accounts Table */}
          <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Trading Accounts</h3>
                  <p className="text-blue-100 text-sm mt-1">Manage your forex trading accounts</p>
                </div>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-200 border border-white/30">
                  Add Account
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Account</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Balance</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">P&L Today</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  <tr className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                          <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">Primary Account</div>
                          <div className="text-sm text-gray-500">Main trading account</div>
                          <div className="text-xs text-gray-400 mt-1">Account #: MT4-001234</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="text-lg font-bold text-gray-900">$0.00</div>
                      <div className="text-sm text-gray-500">Available: $0.00</div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="text-lg font-semibold text-green-600">+$0.00</div>
                      <div className="text-sm text-gray-500">(0.00%)</div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1.5 rounded-lg transition-all duration-200 text-xs">
                        View Details
                      </button>
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs">
                        Settings
                      </button>
                    </td>
                  </tr>
                  
                  {/* Demo account row */}
                  <tr className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-all duration-200">
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">Demo Account</div>
                          <div className="text-sm text-gray-500">Practice trading</div>
                          <div className="text-xs text-gray-400 mt-1">Account #: DEMO-001234</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="text-lg font-bold text-gray-900">$10,000.00</div>
                      <div className="text-sm text-gray-500">Available: $9,850.00</div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="text-lg font-semibold text-green-600">+$150.00</div>
                      <div className="text-sm text-gray-500">(1.5%)</div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                          Demo
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-3 py-1.5 rounded-lg transition-all duration-200 text-xs">
                        Practice
                      </button>
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs">
                        Reset
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Table Footer with Summary */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Total Accounts: <span className="font-semibold text-gray-900">2</span>
                </div>
                <div className="text-sm text-gray-600">
                  Combined Balance: <span className="font-semibold text-gray-900">$10,000.00</span>
                </div>
                <div className="text-sm text-gray-600">
                  Total P&L: <span className="font-semibold text-green-600">+$150.00 (1.5%)</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ModernDashboard;