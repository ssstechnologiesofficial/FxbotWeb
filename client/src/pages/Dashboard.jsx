import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import axios from 'axios';

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
    navigator.clipboard.writeText(text).then(() => {
      alert('Sponsor ID copied to clipboard!');
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/" className="text-blue-600 hover:underline">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img src="/logo.png" alt="FXBOT" className="h-8 w-8 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">FXBOT Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.firstName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                data-testid="button-logout"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* User Info Card */}
            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{user?.firstName?.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{user?.firstName} {user?.lastName}</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <p className="text-sm text-gray-500">{user?.mobile}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sponsor ID Card */}
            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200">
              <div className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">ID</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Your Sponsor ID</h3>
                  <p className="text-2xl font-bold text-green-600 mb-2">{referralData?.ownSponsorId}</p>
                  <button
                    onClick={() => copyToClipboard(referralData?.ownSponsorId)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    data-testid="button-copy-sponsor-id"
                  >
                    Copy ID
                  </button>
                </div>
              </div>
            </div>

            {/* Total Referrals Card */}
            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">#</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Referrals</h3>
                <p className="text-3xl font-bold text-purple-600">{referralData?.stats?.totalReferrals || 0}</p>
                <p className="text-sm text-gray-500">All levels combined</p>
              </div>
            </div>

            {/* Total Earnings Card */}
            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">$</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Earnings</h3>
                <p className="text-3xl font-bold text-yellow-600">${(referralData?.stats?.totalEarnings || 0).toFixed(2)}</p>
                <p className="text-sm text-gray-500">From all referrals</p>
              </div>
            </div>
          </div>

          {/* Multi-Level Referral Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {[1, 2, 3, 4, 5].map(level => {
              const count = referralData?.stats?.[`level${level}Count`] || 0;
              const earnings = referralData?.stats?.[`level${level}Earnings`] || 0;
              const rates = { 1: '1.5%', 2: '1.0%', 3: '0.75%', 4: '0.50%', 5: '0.25%' };
              const colors = {
                1: 'from-red-500 to-red-600',
                2: 'from-orange-500 to-orange-600', 
                3: 'from-yellow-500 to-yellow-600',
                4: 'from-green-500 to-green-600',
                5: 'from-blue-500 to-blue-600'
              };
              
              return (
                <div key={level} className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200">
                  <div className="p-4 text-center">
                    <div className={`w-10 h-10 bg-gradient-to-r ${colors[level]} rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <span className="text-white font-bold text-sm">{level}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Level {level}</h4>
                    <p className="text-xs text-gray-500 mb-2">{rates[level]} reward</p>
                    <p className="text-lg font-bold text-gray-900">{count}</p>
                    <p className="text-xs text-gray-500">referrals</p>
                    <p className="text-sm font-semibold text-green-600">${earnings.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">earned</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Investment Simulator */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-200 mb-8">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Reward System</h3>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Simulate Investment Amount ($)
                  </label>
                  <input
                    type="number"
                    value={simulateAmount}
                    onChange={(e) => setSimulateAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter amount"
                    min="1"
                  />
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={simulateInvestment}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    data-testid="button-simulate-investment"
                  >
                    Simulate Investment
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                This will distribute rewards to your upline (parents) based on the reward percentages
              </p>
            </div>
          </div>

          {/* Referrals Table */}
          {referralData?.children && referralData.children.length > 0 && (
            <div className="mt-8">
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Your Referrals</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    People who registered using your sponsor ID
                  </p>
                </div>
                <ul className="divide-y divide-gray-200">
                  {referralData.children.map((child, index) => (
                    <li key={child.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {child.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{child.name}</div>
                            <div className="text-sm text-gray-500">{child.email}</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          Joined {new Date(child.registeredAt).toLocaleDateString()}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Empty State */}
          {referralData?.children && referralData.children.length === 0 && (
            <div className="mt-8">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No referrals yet</h3>
                  <p className="text-gray-500 mb-4">
                    Share your sponsor ID <strong>{referralData?.ownSponsorId}</strong> with others to start building your network
                  </p>
                  <button
                    onClick={() => copyToClipboard(referralData?.ownSponsorId)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Copy Your Sponsor ID
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}