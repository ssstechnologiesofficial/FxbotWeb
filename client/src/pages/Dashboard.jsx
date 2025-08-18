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
            {/* Top Stats Cards - Match the UI from screenshot */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              
              {/* Total Balance Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">💰</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">$0.00</p>
                  <p className="text-sm text-gray-500">Total Balance</p>
                  <button className="text-blue-500 text-sm font-medium hover:text-blue-600">
                    Deposit Now! →
                  </button>
                </div>
              </div>

              {/* Wallet Balance Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">💳</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">$0.00</p>
                  <p className="text-sm text-gray-500">Wallet Balance</p>
                  <button className="text-blue-500 text-sm font-medium hover:text-blue-600">
                    Deposit Now! →
                  </button>
                </div>
              </div>

              {/* Today's Referral Commission Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">${(referralData?.stats?.totalEarnings || 0).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Today's Referral Commission</p>
                </div>
              </div>

              {/* Document Status Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">📋</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-green-600">Verified</p>
                  <p className="text-sm text-gray-500">Document Status</p>
                </div>
              </div>
            </div>

            {/* Second Row Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              
              {/* Your Downline */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">👥</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">{referralData?.stats?.totalReferrals || 0}</p>
                  <p className="text-sm text-gray-500">Your Downline</p>
                </div>
              </div>

              {/* Email Update Status */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">✉️</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-red-600">Pending</p>
                  <p className="text-sm text-gray-500">Update Email</p>
                  <button className="text-blue-500 text-sm font-medium hover:text-blue-600">
                    Update Now! ↗️
                  </button>
                </div>
              </div>

              {/* Empty slots for layout consistency */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 opacity-50">
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">More features</p>
                  <p className="text-sm text-gray-400">Coming soon...</p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 opacity-50">
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">Additional</p>
                  <p className="text-sm text-gray-400">Features...</p>
                </div>
              </div>
            </div>

            {/* FCX Trade Referral Program Section */}
            <div className="bg-gray-800 rounded-2xl p-6 text-white mb-8">
              <h2 className="text-xl font-bold mb-2">FCX Trade REFERRAL PROGRAM</h2>
              <p className="text-gray-300 mb-4">
                Spread the word on and keep earning, even when you aren't trading. More the people you refer, more you earn.
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Share Your Referral Link</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={`https://fxbot.com/register/${referralData?.ownSponsorId || user?.ownSponsorId || ''}`}
                    readOnly
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-l-lg px-4 py-2 text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(`https://fxbot.com/register/${referralData?.ownSponsorId || user?.ownSponsorId}`)}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg text-sm font-medium"
                    data-testid="button-copy-referral-link"
                  >
                    📋
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium">Your Sponsor ID: <span className="text-blue-400 font-bold">{referralData?.ownSponsorId || user?.ownSponsorId || 'Loading...'}</span></p>
              </div>
            </div>

            {/* Trade Accounts Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
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
                      <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Account Id</th>
                      <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Balance</th>
                      <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Platform name</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm">20255</td>
                      <td className="py-3 px-4 text-sm">0</td>
                      <td className="py-3 px-4 text-sm">MT4</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Referral Statistics */}
            {referralData?.stats && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Multi-Level Referral Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map(level => (
                    <div key={level} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {referralData.stats[`level${level}Count`] || 0}
                      </div>
                      <div className="text-sm text-gray-500 mb-1">Level {level}</div>
                      <div className="text-xs text-green-600">
                        ${(referralData.stats[`level${level}Earnings`] || 0).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Investment Simulation Tool */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Simulation</h3>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={simulateAmount}
                  onChange={(e) => setSimulateAmount(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-32"
                  placeholder="Amount"
                  min="0"
                  step="100"
                />
                <button
                  onClick={simulateInvestment}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  data-testid="button-simulate-investment"
                >
                  Simulate Investment
                </button>
                <p className="text-sm text-gray-600">
                  Test reward distribution for referral network
                </p>
              </div>
            </div>

            {/* Referral List */}
            {referralData?.children && referralData.children.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Direct Referrals</h3>
                <div className="space-y-3">
                  {referralData.children.map((child, index) => (
                    <div key={child.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                          {child.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{child.name}</div>
                          <div className="text-sm text-gray-500">{child.email}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Joined {new Date(child.registeredAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {referralData?.children && referralData.children.length === 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No referrals yet</h3>
                <p className="text-gray-500 mb-4">
                  Share your sponsor ID <strong>{referralData?.ownSponsorId}</strong> with others to start building your network
                </p>
                <button
                  onClick={() => copyToClipboard(referralData?.ownSponsorId || user?.ownSponsorId)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Copy Your Sponsor ID
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}