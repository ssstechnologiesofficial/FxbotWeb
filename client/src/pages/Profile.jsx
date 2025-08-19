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
          <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 bg-slate-50">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Hero Profile Header */}
            <div className="relative bg-white rounded-xl p-6 shadow-lg border border-slate-200 overflow-hidden">
              <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-slate-600 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-xl font-semibold text-white">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                      </span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      {user?.firstName} {user?.lastName}
                    </h1>
                    <p className="text-lg text-gray-600 mt-1">{user?.email}</p>
                    <div className="flex items-center mt-3 space-x-4">
                      <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        user?.role === 'admin' 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      }`}>
                        {user?.role === 'admin' ? '👑 Administrator' : '👤 Member'}
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        user?.isActive 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                          : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg'
                      }`}>
                        {user?.isActive ? '✨ Active' : '💤 Inactive'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="hidden lg:flex space-x-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {user?.referralCount || 0}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">Referrals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ${(user?.totalEarnings || 0).toFixed(0)}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">Earnings</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information Card */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 ml-4">Personal Information</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">First Name</label>
                      <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-100 text-gray-800 font-semibold hover:shadow-md transition-all">
                        {user?.firstName || 'Not provided'}
                      </div>
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Last Name</label>
                      <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-100 text-gray-800 font-semibold hover:shadow-md transition-all">
                        {user?.lastName || 'Not provided'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Email Address</label>
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-100 text-blue-800 font-semibold hover:shadow-md transition-all">
                      {user?.email || 'Not provided'}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Mobile Number</label>
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-100 text-green-800 font-semibold hover:shadow-md transition-all">
                      {user?.mobile || 'Not provided'}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Member Since</label>
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100 text-purple-800 font-semibold hover:shadow-md transition-all">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long', 
                        day: 'numeric'
                      }) : 'Unknown'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Details Card */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 ml-4">Account Details</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Your Sponsor ID</label>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border-2 border-green-200 text-green-800 font-bold text-lg font-mono tracking-wider hover:shadow-md transition-all">
                        {user?.ownSponsorId || 'Loading...'}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(user?.ownSponsorId || '');
                          alert('🎉 Sponsor ID copied to clipboard!');
                        }}
                        className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                        data-testid="button-copy-sponsor-id"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 font-medium">💡 Share this ID to invite others and earn commissions</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Referral Count</label>
                      <div className="p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl border-2 border-blue-200 text-center hover:shadow-md transition-all">
                        <div className="text-3xl font-bold text-blue-700 mb-1">{user?.referralCount || 0}</div>
                        <div className="text-xs text-blue-600 font-medium">Active Referrals</div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Total Earnings</label>
                      <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border-2 border-purple-200 text-center hover:shadow-md transition-all">
                        <div className="text-3xl font-bold text-purple-700 mb-1">${(user?.totalEarnings || 0).toFixed(2)}</div>
                        <div className="text-xs text-purple-600 font-medium">Commission Earned</div>
                      </div>
                    </div>
                  </div>
                  
                  {user?.role === 'admin' && (
                    <div className="relative p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 hover:shadow-md transition-all">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <span className="text-yellow-800 font-bold text-lg">👑 Administrator Access</span>
                      </div>
                      <p className="text-yellow-700 font-medium">You have full access to the admin dashboard and system management features. Use your powers wisely! 🚀</p>
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