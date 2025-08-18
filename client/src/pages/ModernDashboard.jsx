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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-lg text-gray-700">Loading dashboard...</div>
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
    <div className="flex min-h-screen bg-gray-50">
      <ModernSidebar user={user} onLogout={handleLogout} />
      
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600">
            Track your FXBOT investments and referral earnings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Referral Program Card */}
          <div className="lg:col-span-2 bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Referral Program
                  </h3>
                  <p className="text-gray-600 text-sm">
                    SmartLine Income - 5 Level Commission
                  </p>
                </div>
              </div>
            </div>

            {/* Sponsor ID Section */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-2">
                    Your Sponsor ID
                  </p>
                  <p className="text-2xl font-bold mb-1">
                    {user?.ownSponsorId}
                  </p>
                  <p className="text-blue-200 text-xs">
                    Share this ID to earn commissions
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(user?.ownSponsorId)}
                  className="bg-white/20 hover:bg-white/30 border border-white/30 text-white px-4 py-3 rounded-lg flex items-center text-sm font-medium transition-all duration-200"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy ID
                </button>
              </div>
            </div>

            {/* Commission Structure */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                Commission Structure
              </h4>
              <div className="space-y-3">
                {referralTiers.map((tier, index) => {
                  const colorClasses = [
                    'border-l-red-500 bg-red-50 text-red-700',
                    'border-l-orange-500 bg-orange-50 text-orange-700',
                    'border-l-yellow-500 bg-yellow-50 text-yellow-700',
                    'border-l-green-500 bg-green-50 text-green-700',
                    'border-l-blue-500 bg-blue-50 text-blue-700'
                  ];
                  const badgeColors = [
                    'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500'
                  ];
                  
                  return (
                    <div
                      key={tier.level}
                      className={`flex items-center justify-between p-4 ${colorClasses[index]} border-l-4 rounded-lg`}
                    >
                      <div className="flex items-center">
                        <div className={`w-8 h-8 ${badgeColors[index]} text-white rounded-md flex items-center justify-center mr-3 text-sm font-bold`}>
                          {tier.level}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">
                            Level {tier.level}
                          </span>
                          <p className="text-gray-600 text-xs">
                            {tier.rate} commission
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          {tier.count}
                        </div>
                        <div className="text-xs text-gray-600">
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
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 h-fit">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Quick Actions
            </h3>
            
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center hover:-translate-y-0.5 hover:shadow-lg">
                <DollarSign className="w-5 h-5 mr-2" />
                Invest Now
              </button>
              
              <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center hover:-translate-y-0.5 hover:shadow-lg">
                <Wallet className="w-5 h-5 mr-2" />
                View Portfolio
              </button>
              
              <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center hover:-translate-y-0.5 hover:shadow-lg">
                <Users className="w-5 h-5 mr-2" />
                Referral Tree
              </button>
            </div>

            {/* Package Info */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                FS Income Package
              </h4>
              <p className="text-xs text-gray-600 mb-2">
                6% Monthly ROI until 2x returns
              </p>
              <div className="text-xs text-green-600 font-semibold">
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