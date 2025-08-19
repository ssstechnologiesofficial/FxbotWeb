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

        <main className="flex-1 overflow-y-auto p-4 bg-slate-50">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Overview Cards */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-semibold text-slate-800 mb-2">Referral Network</h1>
                <p className="text-slate-600 text-sm">Track your multi-level referral network and commission earnings</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-1">Total Referrals</p>
                      <p className="text-xl font-semibold text-slate-900">{referralData?.referralCount || 0}</p>
                      <p className="text-xs text-slate-500">Active network</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 616 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-1">Total Earnings</p>
                      <p className="text-xl font-semibold text-slate-900">${(referralData?.totalEarnings || 0).toFixed(2)}</p>
                      <p className="text-xs text-slate-500">From all referrals</p>
                    </div>
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-1">Your Sponsor ID</p>
                      <p className="text-base font-mono font-semibold text-slate-900">{referralData?.ownSponsorId}</p>
                      <p className="text-xs text-slate-500">Share to invite</p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(referralData?.ownSponsorId || '');
                        alert('Sponsor ID copied to clipboard!');
                      }}
                      className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center hover:bg-purple-200 transition-colors"
                    >
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-1">Network Depth</p>
                      <p className="text-xl font-semibold text-slate-900">5 Levels</p>
                      <p className="text-xs text-slate-500">Maximum earning depth</p>
                    </div>
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Level Commission Structure */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-800 ml-3">5-Level Commission Structure</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map(level => {
                  const count = referralData?.[`level${level}Count`] || 0;
                  const earnings = referralData?.[`level${level}Earnings`] || 0;
                  const commission = level === 1 ? '1.5%' : level === 2 ? '1.0%' : level === 3 ? '0.75%' : level === 4 ? '0.5%' : '0.25%';
                  
                  return (
                    <div key={level} className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-sm font-semibold text-slate-700">{level}</span>
                      </div>
                      <h3 className="text-sm font-medium text-slate-600 mb-2">Level {level}</h3>
                      <div className="text-lg font-semibold text-slate-900 mb-1">{count}</div>
                      <div className="text-xs text-slate-500 mb-2">Referrals</div>
                      <div className="bg-white border border-slate-200 rounded p-2">
                        <div className="text-sm font-semibold text-slate-900">${earnings.toFixed(2)}</div>
                        <div className="text-xs text-slate-500">{commission} commission</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct Referrals List */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 616 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-800 ml-3">Your Direct Referrals</h2>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {referralData?.referrals && referralData.referrals.length > 0 ? (
                  referralData.referrals.map((referral, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {referral.firstName?.charAt(0)}{referral.lastName?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900">{referral.firstName} {referral.lastName}</h3>
                          <p className="text-sm text-slate-600">{referral.email}</p>
                          <p className="text-xs text-slate-500">ID: {referral.ownSponsorId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          referral.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {referral.isActive ? 'Active' : 'Inactive'}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Joined: {new Date(referral.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 616 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No Direct Referrals Yet</h3>
                    <p className="text-slate-600">Share your sponsor ID to start building your network!</p>
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