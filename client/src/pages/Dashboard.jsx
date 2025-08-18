import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import axios from 'axios';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* User Info Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{user?.firstName?.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">User Information</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </dd>
                      <dd className="text-sm text-gray-500">{user?.email}</dd>
                      <dd className="text-sm text-gray-500">{user?.mobile}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Sponsor ID Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">ID</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Your Sponsor ID</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {referralData?.ownSponsorId}
                      </dd>
                      <dd className="text-sm text-gray-500">Share this ID to refer others</dd>
                    </dl>
                  </div>
                  <button
                    onClick={() => copyToClipboard(referralData?.ownSponsorId)}
                    className="ml-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs"
                    data-testid="button-copy-sponsor-id"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            {/* Referral Stats Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">#</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Referrals</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {referralData?.referralCount || 0}
                      </dd>
                      <dd className="text-sm text-gray-500">People you've referred</dd>
                    </dl>
                  </div>
                </div>
              </div>
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