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
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Referral Network</h1>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-blue-100">Total Referrals</h3>
                    <div className="text-2xl font-bold mt-1">{user?.referralCount || 0}</div>
                  </div>
                  <svg className="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-xs text-blue-100 mt-2">All levels combined</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-green-100">Total Earnings</h3>
                    <div className="text-2xl font-bold mt-1">${(user?.totalEarnings || 0).toFixed(2)}</div>
                  </div>
                  <svg className="w-8 h-8 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <p className="text-xs text-green-100 mt-2">From all referrals</p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-purple-100">Your Sponsor ID</h3>
                    <div className="text-lg font-bold mt-1 font-mono">{user?.ownSponsorId}</div>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(user?.ownSponsorId || '');
                      alert('Sponsor ID copied to clipboard!');
                    }}
                    className="w-8 h-8 text-purple-200 hover:text-white transition-colors"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-purple-100 mt-2">Share to invite users</p>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-orange-100">Network Depth</h3>
                    <div className="text-2xl font-bold mt-1">5 Levels</div>
                  </div>
                  <svg className="w-8 h-8 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                </div>
                <p className="text-xs text-orange-100 mt-2">Maximum earning depth</p>
              </div>
            </div>

            {/* Multi-Level Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Multi-Level Referral Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map(level => {
                  const count = user?.[`level${level}Count`] || 0;
                  const earnings = user?.[`level${level}Earnings`] || 0;
                  const commission = level === 1 ? '1.5%' : level === 2 ? '1.0%' : level === 3 ? '0.75%' : level === 4 ? '0.5%' : '0.25%';
                  
                  return (
                    <div key={level} className={`text-center p-4 rounded-lg border-2 transition-all hover:shadow-lg ${
                      count > 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                        count > 0 ? 'bg-blue-500 text-white' : 'bg-gray-400 text-white'
                      }`}>
                        <span className="font-bold">{level}</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">{count}</div>
                      <div className="text-sm text-gray-500 mb-2">Level {level} Users</div>
                      <div className={`text-xs font-medium mb-1 ${earnings > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                        ${earnings.toFixed(2)} earned
                      </div>
                      <div className="text-xs text-blue-600 font-medium">
                        {commission} commission
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct Referrals */}
            {referralData?.children && referralData.children.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Your Direct Referrals (Level 1)
                </h2>
                <div className="space-y-4">
                  {referralData.children.map((child, index) => (
                    <div key={child._id || child.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:shadow-md transition-shadow">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-md">
                          {child.firstName && child.lastName 
                            ? `${child.firstName[0]}${child.lastName[0]}`
                            : child.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {child.firstName && child.lastName 
                              ? `${child.firstName} ${child.lastName}`
                              : child.name || 'Unknown User'}
                          </div>
                          <div className="text-sm text-gray-500">{child.email}</div>
                          <div className="text-xs text-blue-600 font-medium">Level 1 - 1.5% commission</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          Joined {new Date(child.createdAt || child.registeredAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                          child.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {child.isActive ? 'Active Member' : 'Inactive'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {(!referralData?.children || referralData.children.length === 0) && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Build Your Referral Network</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Start earning commissions by inviting others to join FXBOT. Share your unique sponsor ID to begin building your referral tree.
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
                  <div className="text-sm font-medium text-gray-700 mb-2">Your Sponsor ID</div>
                  <div className="text-2xl font-bold text-blue-600 font-mono mb-3">
                    {user?.ownSponsorId}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(user?.ownSponsorId || '');
                      alert('Sponsor ID copied to clipboard!');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    data-testid="button-copy-sponsor-id"
                  >
                    Copy Sponsor ID
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  Share this ID with others to invite them to your referral network
                </div>
              </div>
            )}

            {/* Referral Program Info */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-semibold mb-4">How Our Referral Program Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-lg mb-1">Level 1</div>
                  <div className="opacity-90">1.5% Commission</div>
                  <div className="text-xs opacity-75">Direct referrals</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg mb-1">Level 2</div>
                  <div className="opacity-90">1.0% Commission</div>
                  <div className="text-xs opacity-75">Referrals of referrals</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg mb-1">Level 3</div>
                  <div className="opacity-90">0.75% Commission</div>
                  <div className="text-xs opacity-75">Third level down</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg mb-1">Level 4</div>
                  <div className="opacity-90">0.5% Commission</div>
                  <div className="text-xs opacity-75">Fourth level down</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg mb-1">Level 5</div>
                  <div className="opacity-90">0.25% Commission</div>
                  <div className="text-xs opacity-75">Fifth level down</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}