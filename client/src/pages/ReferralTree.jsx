import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

export default function ReferralTree() {
  const [user, setUser] = useState(null);
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const [userResponse, referralResponse] = await Promise.all([
          axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/user/referrals', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setUser(userResponse.data);
        setReferralData(referralResponse.data);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="w-64 bg-gray-900"></div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6" style={{ 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' 
        }}>
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Hero Header */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                  🌟 Referral Network Tree
                </h1>
                <p className="text-gray-600 text-lg">Track your multi-level referral network and commission earnings</p>
              </div>
              
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="relative bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-sm"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-blue-100 mb-2">👥 Total Referrals</h3>
                      <div className="text-3xl font-bold mb-1">{referralData?.referralCount || 0}</div>
                      <div className="text-xs text-blue-100">Active network</div>
                    </div>
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="relative bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-sm"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-green-100 mb-2">💰 Total Earnings</h3>
                      <div className="text-3xl font-bold mb-1">${(referralData?.totalEarnings || 0).toFixed(2)}</div>
                      <div className="text-xs text-green-100">From all referrals</div>
                    </div>
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="relative bg-gradient-to-br from-purple-400 via-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-sm"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-purple-100 mb-2">🆔 Your Sponsor ID</h3>
                      <div className="text-lg font-bold mb-1 font-mono">{referralData?.ownSponsorId}</div>
                      <div className="text-xs text-purple-100">Share to invite users</div>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(referralData?.ownSponsorId || '');
                        alert('🎉 Sponsor ID copied to clipboard!');
                      }}
                      className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg hover:bg-white/30 transition-colors"
                    >
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="relative bg-gradient-to-br from-orange-400 via-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-sm"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-orange-100 mb-2">🌐 Network Depth</h3>
                      <div className="text-3xl font-bold mb-1">5 Levels</div>
                      <div className="text-xs text-orange-100">Maximum earning depth</div>
                    </div>
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Multi-Level Commission Breakdown */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-0 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 ml-4">📊 5-Level Commission Structure</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {[1, 2, 3, 4, 5].map(level => {
                  const count = referralData?.[`level${level}Count`] || 0;
                  const earnings = referralData?.[`level${level}Earnings`] || 0;
                  const commission = level === 1 ? '1.5%' : level === 2 ? '1.0%' : level === 3 ? '0.75%' : level === 4 ? '0.5%' : '0.25%';
                  const colors = [
                    'from-red-400 to-pink-500',
                    'from-orange-400 to-yellow-500', 
                    'from-green-400 to-emerald-500',
                    'from-blue-400 to-cyan-500',
                    'from-purple-400 to-indigo-500'
                  ];
                  
                  return (
                    <div key={level} className={`relative bg-gradient-to-br ${colors[level-1]} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
                      <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-sm"></div>
                      <div className="relative text-center">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-lg">
                          <span className="text-xl font-bold">{level}</span>
                        </div>
                        <h3 className="text-sm font-semibold mb-2 opacity-90">Level {level}</h3>
                        <div className="text-2xl font-bold mb-1">{count}</div>
                        <div className="text-xs opacity-80 mb-3">Referrals</div>
                        <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                          <div className="text-sm font-semibold">${earnings.toFixed(2)}</div>
                          <div className="text-xs opacity-80">{commission} commission</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct Referrals List */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-0 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 ml-4">👥 Your Direct Referrals</h2>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {referralData?.referrals && referralData.referrals.length > 0 ? (
                  referralData.referrals.map((referral, index) => (
                    <div key={index} className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border-2 border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-102">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">
                              {referral.firstName?.charAt(0)}{referral.lastName?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800 text-lg">{referral.firstName} {referral.lastName}</h3>
                            <p className="text-gray-600 font-medium">{referral.email}</p>
                            <p className="text-sm text-gray-500">ID: {referral.ownSponsorId}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                            referral.isActive 
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
                              : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                          }`}>
                            {referral.isActive ? '✅ Active' : '💤 Inactive'}
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            Joined: {new Date(referral.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 616 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Direct Referrals Yet</h3>
                    <p className="text-gray-600 font-medium">Share your sponsor ID to start building your network!</p>
                    <p className="text-sm text-gray-500 mt-2">Your referrals will appear here once they register</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}