import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '../components/Sidebar';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [referralData, setReferralData] = useState(null);

  // Fetch user data
  const { data: userData, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false,
  });

  // Fetch referral data
  const { data: referralInfo, isLoading: referralLoading } = useQuery({
    queryKey: ['/api/user/referrals'],
    retry: false,
    enabled: !!userData,
  });

  useEffect(() => {
    if (userData) {
      console.log('User data:', userData);
      setUser(userData);
    }
  }, [userData]);

  useEffect(() => {
    if (referralInfo) {
      console.log('Referral data:', referralInfo);
      setReferralData(referralInfo);
    }
  }, [referralInfo]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const copyToClipboard = (text) => {
    if (text && typeof text === 'string') {
      navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    } else {
      console.error('Invalid text to copy:', text);
      alert('Unable to copy - invalid text');
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar user={user} onLogout={handleLogout} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Welcome,</span>
                  <span className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
            {/* Top Stats Row - Enhanced with gradients and animations */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              
              {/* Total Balance Card */}
              <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white mb-2">$0.00</p>
                  <p className="text-blue-100 text-sm mb-3">Total Balance</p>
                  <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 border border-white/30">
                    Deposit Now! →
                  </button>
                </div>
              </div>

              {/* Wallet Balance Card */}
              <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white mb-2">$0.00</p>
                  <p className="text-emerald-100 text-sm mb-3">Wallet Balance</p>
                  <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 border border-white/30">
                    Deposit Now! →
                  </button>
                </div>
              </div>

              {/* Today's Referral Commission Card */}
              <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white mb-2">${(referralData?.stats?.totalEarnings || 0).toFixed(2)}</p>
                  <p className="text-orange-100 text-sm">Today's Referral Commission</p>
                </div>
              </div>

              {/* Document Status Card */}
              <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white mb-2">Verified</p>
                  <p className="text-green-100 text-sm">Document Status</p>
                </div>
              </div>
            </div>

            {/* Multi-Level Referral Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              {/* Level 1 - 1.5% */}
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-sm">L1</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{referralData?.stats?.level1Count || 0}</p>
                  <p className="text-purple-200 text-xs mb-1">Level 1</p>
                  <p className="text-purple-200 text-xs font-medium">1.5% Commission</p>
                  <p className="text-white text-sm font-bold">${(referralData?.stats?.level1Earnings || 0).toFixed(2)}</p>
                </div>
              </div>

              {/* Level 2 - 1.0% */}
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-sm">L2</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{referralData?.stats?.level2Count || 0}</p>
                  <p className="text-blue-200 text-xs mb-1">Level 2</p>
                  <p className="text-blue-200 text-xs font-medium">1.0% Commission</p>
                  <p className="text-white text-sm font-bold">${(referralData?.stats?.level2Earnings || 0).toFixed(2)}</p>
                </div>
              </div>

              {/* Level 3 - 0.75% */}
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-sm">L3</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{referralData?.stats?.level3Count || 0}</p>
                  <p className="text-green-200 text-xs mb-1">Level 3</p>
                  <p className="text-green-200 text-xs font-medium">0.75% Commission</p>
                  <p className="text-white text-sm font-bold">${(referralData?.stats?.level3Earnings || 0).toFixed(2)}</p>
                </div>
              </div>

              {/* Level 4 - 0.50% */}
              <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-sm">L4</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{referralData?.stats?.level4Count || 0}</p>
                  <p className="text-yellow-200 text-xs mb-1">Level 4</p>
                  <p className="text-yellow-200 text-xs font-medium">0.50% Commission</p>
                  <p className="text-white text-sm font-bold">${(referralData?.stats?.level4Earnings || 0).toFixed(2)}</p>
                </div>
              </div>

              {/* Level 5 - 0.25% */}
              <div className="bg-gradient-to-br from-red-600 to-pink-600 rounded-xl p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-sm">L5</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{referralData?.stats?.level5Count || 0}</p>
                  <p className="text-red-200 text-xs mb-1">Level 5</p>
                  <p className="text-red-200 text-xs font-medium">0.25% Commission</p>
                  <p className="text-white text-sm font-bold">${(referralData?.stats?.level5Earnings || 0).toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Summary Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              
              {/* Your Downline Card */}
              <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white mb-2">{referralData?.stats?.totalReferrals || 0}</p>
                  <p className="text-indigo-100 text-sm mb-2">Total Network Size</p>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                    <p className="text-white text-xs">Total Earnings: <span className="font-bold">${(referralData?.stats?.totalEarnings || 0).toFixed(2)}</span></p>
                  </div>
                </div>
              </div>

              {/* Email Update Status Card */}
              <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white mb-2">Pending</p>
                  <p className="text-orange-100 text-sm mb-3">Email Verification</p>
                  <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 border border-white/30">
                    Update Now! ↗️
                  </button>
                </div>
              </div>
            </div>

            {/* FXBOT Referral Program Section - Enhanced with Glassmorphism */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              
              {/* FXBOT Referral Program with Glassmorphism */}
              <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-8 shadow-2xl overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-20 h-20 bg-blue-500 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
                  <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-pink-500 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">FXBOT REFERRAL PROGRAM</h2>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                    Spread the word and keep earning, even when you aren't trading. The more people you refer, the more you earn through our 5-tier commission system.
                  </p>
                  
                  {/* Commission Structure Display */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/20">
                    <h4 className="text-white font-semibold mb-3">Commission Structure</h4>
                    <div className="grid grid-cols-5 gap-2 text-center">
                      <div className="bg-purple-500/20 rounded p-2">
                        <p className="text-xs text-purple-300">L1</p>
                        <p className="text-white font-bold text-sm">1.5%</p>
                      </div>
                      <div className="bg-blue-500/20 rounded p-2">
                        <p className="text-xs text-blue-300">L2</p>
                        <p className="text-white font-bold text-sm">1.0%</p>
                      </div>
                      <div className="bg-green-500/20 rounded p-2">
                        <p className="text-xs text-green-300">L3</p>
                        <p className="text-white font-bold text-sm">0.75%</p>
                      </div>
                      <div className="bg-yellow-500/20 rounded p-2">
                        <p className="text-xs text-yellow-300">L4</p>
                        <p className="text-white font-bold text-sm">0.50%</p>
                      </div>
                      <div className="bg-red-500/20 rounded p-2">
                        <p className="text-xs text-red-300">L5</p>
                        <p className="text-white font-bold text-sm">0.25%</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Share Your Referral Link */}
                  <div className="mb-6">
                    <label className="block text-sm text-gray-300 mb-3 font-medium">SHARE YOUR REFERRAL LINK</label>
                    <div className="flex bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
                      <input
                        type="text"
                        value={`https://login.fxbot.com/affiliate/reg?id=${referralData?.ownSponsorId || user?.ownSponsorId || ''}`}
                        readOnly
                        className="flex-1 bg-transparent text-white px-4 py-3 text-sm outline-none"
                      />
                      <button
                        onClick={() => copyToClipboard(`https://login.fxbot.com/affiliate/reg?id=${referralData?.ownSponsorId || user?.ownSponsorId}`)}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 text-white font-medium transition-all duration-200 flex items-center"
                        data-testid="button-copy-referral-link"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </button>
                    </div>
                  </div>
                  
                  {/* Your Sponsor ID */}
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <p className="text-gray-300 text-sm mb-1">Your Sponsor ID</p>
                    <p className="text-white font-bold text-lg">{referralData?.ownSponsorId || user?.ownSponsorId}</p>
                  </div>
                </div>
              </div>

              {/* Trade Accounts - Enhanced */}
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Trade Accounts</h3>
                  </div>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg">
                    + Create Account
                  </button>
                </div>
                
                <div className="overflow-hidden rounded-2xl border border-gray-200">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Account ID</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Balance</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Platform</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">20255</td>
                        <td className="py-4 px-6 text-sm text-gray-700">$0.00</td>
                        <td className="py-4 px-6">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">MT4</span>
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

export default Dashboard;