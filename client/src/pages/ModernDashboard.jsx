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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <ModernSidebar user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.firstName}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg">
                <span className="text-sm font-medium">Pro Account</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${card.gradient} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        card.changeType === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {card.change}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
                    <p className="text-gray-600 text-sm">{card.title}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Referral Program Card */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Users className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Referral Program</h3>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              {/* Sponsor ID Section */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Your Sponsor ID</p>
                    <p className="text-xl font-bold text-gray-900">{user?.ownSponsorId}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(user?.ownSponsorId)}
                    className="bg-white hover:bg-gray-50 border border-gray-300 px-4 py-2 rounded-lg flex items-center text-sm font-medium text-gray-700 transition-colors duration-200"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </button>
                </div>
              </div>

              {/* Commission Tiers */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Commission Structure</h4>
                {referralTiers.map((tier) => (
                  <div key={tier.level} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 ${tier.color} rounded-full mr-3`}></div>
                      <span className="text-sm font-medium text-gray-900">Level {tier.level}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-semibold text-gray-900">{tier.rate}</span>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                        {tier.count} referrals
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Deposit Funds
                </button>
                <button className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center">
                  <ArrowUpFromLine className="w-4 h-4 mr-2" />
                  Withdraw
                </button>
                <button className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center">
                  <Eye className="w-4 h-4 mr-2" />
                  View Transactions
                </button>
              </div>

              {/* Recent Activity */}
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h4>
                <div className="space-y-3">
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No recent activity</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trading Accounts Table */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Trading Accounts</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P&L</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <DollarSign className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Primary Account</div>
                          <div className="text-sm text-gray-500">Main trading account</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$0.00</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+$0.00 (0%)</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">View Details</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ModernDashboard;