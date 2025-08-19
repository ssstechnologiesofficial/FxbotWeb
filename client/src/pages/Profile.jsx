import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const userResponse = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userResponse.data);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
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
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl font-bold">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h1>
                  <p className="text-white/80">{user?.email}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="text-sm">
                      <span className="text-white/80">Role:</span>
                      <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                        {user?.role === 'admin' ? 'Administrator' : 'Member'}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-white/80">Status:</span>
                      <span className="ml-2 px-2 py-1 bg-green-500/20 rounded-full text-xs font-medium">
                        {user?.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <div className="p-3 bg-gray-50 rounded-lg border text-gray-900 font-medium">
                        {user?.firstName || '-'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <div className="p-3 bg-gray-50 rounded-lg border text-gray-900 font-medium">
                        {user?.lastName || '-'}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="p-3 bg-gray-50 rounded-lg border text-gray-900 font-medium">
                      {user?.email || '-'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <div className="p-3 bg-gray-50 rounded-lg border text-gray-900 font-medium">
                      {user?.mobile || '-'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                    <div className="p-3 bg-gray-50 rounded-lg border text-gray-900 font-medium">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long', 
                        day: 'numeric'
                      }) : '-'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Account Details
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Sponsor ID</label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 p-3 bg-green-50 rounded-lg border border-green-200 text-green-900 font-bold font-mono">
                        {user?.ownSponsorId || '-'}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(user?.ownSponsorId || '');
                          alert('Sponsor ID copied to clipboard!');
                        }}
                        className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        data-testid="button-copy-sponsor-id"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Share this ID to invite others to join your referral network</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Referral Count</label>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-blue-900 font-bold text-2xl">
                      {user?.referralCount || 0}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Total users you've referred</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Earnings</label>
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-purple-900 font-bold text-2xl">
                      ${(user?.totalEarnings || 0).toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Lifetime referral commission earnings</p>
                  </div>
                  
                  {user?.role === 'admin' && (
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="text-amber-800 font-medium">Administrator Access</span>
                      </div>
                      <p className="text-sm text-amber-700 mt-1">You have full access to the admin dashboard and system management features.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}