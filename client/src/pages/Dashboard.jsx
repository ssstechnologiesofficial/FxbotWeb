import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [simulateAmount, setSimulateAmount] = useState('1000');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        // Get user data
        const userResponse = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userResponse.data);

        // Get referral data
        const referralResponse = await axios.get('/api/user/referrals', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReferralData(referralResponse.data);
        
        // Debug: log the data to console
        console.log('User data:', userResponse.data);
        console.log('Referral data:', referralResponse.data);

      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        } else {
          setError('Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const copyToClipboard = (text) => {
    if (!text || text === 'undefined') {
      alert('Sponsor ID not available yet. Please refresh the page.');
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      alert('Sponsor ID copied to clipboard!');
    }).catch(() => {
      // Fallback for browsers that don't support clipboard API
      prompt('Copy this sponsor ID:', text);
    });
  };

  const simulateInvestment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/user/simulate-investment', 
        { amount: parseFloat(simulateAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert(`Investment of $${simulateAmount} processed! Rewards distributed to ${response.data.rewards.length} levels.`);
      
      // Refresh data
      const referralResponse = await axios.get('/api/user/referrals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReferralData(referralResponse.data);
    } catch (error) {
      alert('Failed to process investment simulation');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="w-64 bg-gray-900"></div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="w-64 bg-gray-900"></div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Link href="/" className="text-blue-600 hover:underline">Go Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar user={user} onLogout={handleLogout} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, {user?.firstName}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            {/* Top Stats Cards - Enhanced with gradients and better design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              
              {/* Total Balance Card */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-white">$0.00</p>
                  <p className="text-blue-100 text-sm">Total Balance</p>
                  <button className="text-white text-sm font-medium hover:text-blue-100 bg-white/10 px-3 py-1 rounded-lg mt-2 hover:bg-white/20 transition-all">
                    Deposit Now! →
                  </button>
                </div>
              </div>

              {/* Wallet Balance Card */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-white">$0.00</p>
                  <p className="text-purple-100 text-sm">Wallet Balance</p>
                  <button className="text-white text-sm font-medium hover:text-purple-100 bg-white/10 px-3 py-1 rounded-lg mt-2 hover:bg-white/20 transition-all">
                    Deposit Now! →
                  </button>
                </div>
              </div>

              {/* Today's Referral Commission Card */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-white">${(referralData?.stats?.totalEarnings || 0).toFixed(2)}</p>
                  <p className="text-orange-100 text-sm">Today's Commission</p>
                </div>
              </div>

              {/* Document Status Card */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-white">Verified</p>
                  <p className="text-green-100 text-sm">Document Status</p>
                </div>
              </div>
            </div>

            {/* Second Row Cards - Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              
              {/* Your Downline */}
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-white">{referralData?.stats?.totalReferrals || 0}</p>
                  <p className="text-indigo-100 text-sm">Your Downline</p>
                </div>
              </div>

              {/* Email Update Status */}
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-bold text-white">Pending</p>
                  <p className="text-red-100 text-sm">Update Email</p>
                  <button className="text-white text-sm font-medium hover:text-red-100 bg-white/10 px-3 py-1 rounded-lg mt-2 hover:bg-white/20 transition-all">
                    Update Now! ↗️
                  </button>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-bold text-white">Quick Actions</p>
                  <p className="text-teal-100 text-sm">Trade & Invest</p>
                </div>
              </div>
              
              {/* Performance Card */}
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-bold text-white">+15.2%</p>
                  <p className="text-yellow-100 text-sm">This Month</p>
                </div>
              </div>
            </div>

            {/* FCX Trade Referral Program Section - Enhanced */}
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl p-8 text-white mb-8 shadow-2xl border border-gray-700">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    FCX Trade REFERRAL PROGRAM
                  </h2>
                  <p className="text-gray-400 text-sm">Earn up to 1.5% commission on 5 levels</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Spread the word and keep earning, even when you aren't trading. The more people you refer, the more you earn through our multi-level commission system.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
                  <label className="block text-sm font-medium mb-3 text-blue-300">Share Your Referral Link</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={`https://fxbot.com/register/${referralData?.ownSponsorId || user?.ownSponsorId || ''}`}
                      readOnly
                      className="flex-1 bg-black/30 border border-gray-600 rounded-l-lg px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => copyToClipboard(`https://fxbot.com/register/${referralData?.ownSponsorId || user?.ownSponsorId}`)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-3 rounded-r-lg text-sm font-medium transition-all duration-200 flex items-center"
                      data-testid="button-copy-referral-link"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
                  <label className="block text-sm font-medium mb-3 text-green-300">Your Sponsor ID</label>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent font-mono">
                      {referralData?.ownSponsorId || user?.ownSponsorId || 'Loading...'}
                    </span>
                    <button
                      onClick={() => copyToClipboard(referralData?.ownSponsorId || user?.ownSponsorId)}
                      className="bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 px-3 py-2 rounded-lg text-sm font-medium text-green-300 transition-all duration-200"
                    >
                      Copy ID
                    </button>
                  </div>
                </div>
              </div>

              {/* Commission Structure */}
              <div className="grid grid-cols-5 gap-3 mb-4">
                {[
                  { level: 1, rate: '1.5%', color: 'from-green-500 to-green-600' },
                  { level: 2, rate: '1.0%', color: 'from-blue-500 to-blue-600' },
                  { level: 3, rate: '0.75%', color: 'from-purple-500 to-purple-600' },
                  { level: 4, rate: '0.5%', color: 'from-orange-500 to-orange-600' },
                  { level: 5, rate: '0.25%', color: 'from-red-500 to-red-600' }
                ].map((item) => (
                  <div key={item.level} className="text-center">
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <span className="text-white font-bold text-sm">{item.level}</span>
                    </div>
                    <div className="text-xs text-gray-300">Level {item.level}</div>
                    <div className="text-xs font-medium text-white">{item.rate}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trade Accounts Section - Enhanced */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Trade Accounts</h3>
                </div>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Account
                </button>
              </div>
              
              <div className="overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-1">
                  <table className="w-full bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      <tr>
                        <th className="text-left py-4 px-6 text-sm font-semibold">Account Id</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold">Balance</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold">Platform</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">20255</td>
                        <td className="py-4 px-6 text-sm text-gray-700">$0.00</td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            MT4
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Active
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Referral Statistics - Enhanced */}
            {referralData?.stats && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Multi-Level Referral Statistics</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {[
                    { level: 1, color: 'from-green-500 to-green-600', rate: '1.5%' },
                    { level: 2, color: 'from-blue-500 to-blue-600', rate: '1.0%' },
                    { level: 3, color: 'from-purple-500 to-purple-600', rate: '0.75%' },
                    { level: 4, color: 'from-orange-500 to-orange-600', rate: '0.5%' },
                    { level: 5, color: 'from-red-500 to-red-600', rate: '0.25%' }
                  ].map(({ level, color, rate }) => (
                    <div key={level} className={`text-center p-4 bg-gradient-to-br ${color} rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}>
                      <div className="text-3xl font-bold text-white mb-1">
                        {referralData.stats[`level${level}Count`] || 0}
                      </div>
                      <div className="text-sm text-white/80 mb-2">Level {level}</div>
                      <div className="text-xs text-white/90 font-medium mb-1">
                        ${(referralData.stats[`level${level}Earnings`] || 0).toFixed(2)}
                      </div>
                      <div className="text-xs text-white/70 bg-white/10 px-2 py-1 rounded-full">
                        {rate} commission
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Investment Simulation Tool - Enhanced */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 shadow-lg border border-green-200 mb-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Investment Simulation</h3>
                  <p className="text-sm text-gray-600">Test reward distribution for your referral network</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500 text-lg">$</span>
                    <input
                      type="number"
                      value={simulateAmount}
                      onChange={(e) => setSimulateAmount(e.target.value)}
                      className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-lg pl-8 pr-3 py-2 transition-colors"
                      placeholder="1000"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>
                
                <div>
                  <button
                    onClick={simulateInvestment}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
                    data-testid="button-simulate-investment"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Run Simulation
                  </button>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Total Network Reward</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${((parseFloat(simulateAmount) || 0) * 0.04).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white/70 backdrop-blur rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">Expected Distribution:</div>
                <div className="grid grid-cols-5 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-medium text-green-600">${((parseFloat(simulateAmount) || 0) * 0.015).toFixed(2)}</div>
                    <div className="text-gray-500">Level 1 (1.5%)</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-blue-600">${((parseFloat(simulateAmount) || 0) * 0.01).toFixed(2)}</div>
                    <div className="text-gray-500">Level 2 (1.0%)</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-purple-600">${((parseFloat(simulateAmount) || 0) * 0.0075).toFixed(2)}</div>
                    <div className="text-gray-500">Level 3 (0.75%)</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-orange-600">${((parseFloat(simulateAmount) || 0) * 0.005).toFixed(2)}</div>
                    <div className="text-gray-500">Level 4 (0.5%)</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-red-600">${((parseFloat(simulateAmount) || 0) * 0.0025).toFixed(2)}</div>
                    <div className="text-gray-500">Level 5 (0.25%)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Referral List - Enhanced */}
            {referralData?.children && referralData.children.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Your Direct Referrals</h3>
                </div>
                <div className="space-y-3">
                  {referralData.children.map((child, index) => (
                    <div key={child.id} className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-lg">
                          {child.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{child.name}</div>
                          <div className="text-sm text-gray-600">{child.email}</div>
                          <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full mt-1 inline-block">
                            Level 1 Referral
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">
                          Joined {new Date(child.registeredAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          Active Member
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State - Enhanced */}
            {referralData?.children && referralData.children.length === 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg border border-blue-200 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Building Your Network</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Share your sponsor ID <span className="font-bold text-blue-600">{referralData?.ownSponsorId}</span> with others to start earning commissions on 5 levels
                </p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => copyToClipboard(referralData?.ownSponsorId || user?.ownSponsorId)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Sponsor ID
                  </button>
                  <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Share Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}