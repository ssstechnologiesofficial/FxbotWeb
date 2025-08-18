import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '../components/Sidebar';

function DashboardNew() {
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
            {/* Top Stats Row - Match reference design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              
              {/* Total Balance Card */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">💰</span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">$0.00</p>
                  <p className="text-sm text-gray-500 mb-2">Total Balance</p>
                  <button className="text-blue-500 text-sm font-medium hover:text-blue-600">
                    Deposit Now! →
                  </button>
                </div>
              </div>

              {/* Wallet Balance Card */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">💳</span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">$0.00</p>
                  <p className="text-sm text-gray-500 mb-2">Wallet Balance</p>
                  <button className="text-blue-500 text-sm font-medium hover:text-blue-600">
                    Deposit Now! →
                  </button>
                </div>
              </div>

              {/* Today's Referral Commission Card */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">${(referralData?.stats?.totalEarnings || 0).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Today's Referral Commission</p>
                </div>
              </div>

              {/* Document Status Card */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">📋</span>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-600 mb-1">Verified</p>
                  <p className="text-sm text-gray-500">Document Status</p>
                </div>
              </div>
            </div>

            {/* Second Row Cards - Match reference design */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              
              {/* Your Downline Card */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">👥</span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{referralData?.stats?.totalReferrals || 0}</p>
                  <p className="text-sm text-gray-500">Your Downline</p>
                </div>
              </div>

              {/* Email Update Status Card */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">✉️</span>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-bold text-red-600 mb-1">Pending</p>
                  <p className="text-sm text-gray-500 mb-2">Update Email</p>
                  <button className="text-blue-500 text-sm font-medium hover:text-blue-600">
                    Update Now! ↗️
                  </button>
                </div>
              </div>
            </div>

            {/* FXBOT Referral Program Section - Match reference design */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              
              {/* FXBOT Referral Program */}
              <div className="bg-gray-800 rounded-lg p-6 text-white">
                <h2 className="text-lg font-bold text-white mb-2">FXBOT REFERRAL PROGRAM</h2>
                <p className="text-gray-300 text-sm mb-4">
                  Spread the word on and keep earning, even when you aren't trading. More the people you refer, more you earn.
                </p>
                
                {/* Dropdown for STP */}
                <div className="mb-4">
                  <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white">
                    <option>STP</option>
                  </select>
                </div>
                
                {/* Share Your Referral Link */}
                <div className="mb-4">
                  <label className="block text-sm text-gray-300 mb-2">SHARE YOUR REFERRAL LINK</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={`https://login.fxbot.com/affiliate/reg?id=${referralData?.ownSponsorId || user?.ownSponsorId || ''}`}
                      readOnly
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-l px-3 py-2 text-xs text-gray-300"
                    />
                    <button
                      onClick={() => copyToClipboard(`https://login.fxbot.com/affiliate/reg?id=${referralData?.ownSponsorId || user?.ownSponsorId}`)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-r text-xs"
                      data-testid="button-copy-referral-link"
                    >
                      📋
                    </button>
                  </div>
                </div>
              </div>

              {/* Trade Accounts */}
              <div className="bg-white rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Trade Accounts</h3>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    + Create Account
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">Account Id</th>
                        <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">Balance</th>
                        <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">Platform name</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 px-2 text-sm">20255</td>
                        <td className="py-2 px-2 text-sm">0</td>
                        <td className="py-2 px-2 text-sm">MT4</td>
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

export default DashboardNew;