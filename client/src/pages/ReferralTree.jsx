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
          <h1 className="text-2xl font-bold text-gray-900">Referral Tree</h1>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Multi-Level Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Multi-Level Referral Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map(level => (
                  <div key={level} className="text-center p-4 bg-gray-50 rounded-lg border">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">{level}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {referralData?.stats?.[`level${level}Count`] || 0}
                    </div>
                    <div className="text-sm text-gray-500 mb-2">Level {level} Users</div>
                    <div className="text-xs text-green-600 font-medium">
                      ${(referralData?.stats?.[`level${level}Earnings`] || 0).toFixed(2)} earned
                    </div>
                    <div className="text-xs text-blue-600">
                      {level === 1 && '1.5%'} {level === 2 && '1.0%'} {level === 3 && '0.75%'} {level === 4 && '0.5%'} {level === 5 && '0.25%'} commission
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Referrals */}
            {referralData?.children && referralData.children.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Direct Referrals (Level 1)</h2>
                <div className="space-y-4">
                  {referralData.children.map((child, index) => (
                    <div key={child.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                          {child.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{child.name}</div>
                          <div className="text-sm text-gray-500">{child.email}</div>
                          <div className="text-xs text-blue-600">Level 1 - 1.5% commission</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          Joined {new Date(child.registeredAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-green-600 font-medium">
                          Active Member
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {(!referralData?.children || referralData.children.length === 0) && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌳</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Referral Tree Yet</h3>
                <p className="text-gray-500 mb-4">
                  Start building your referral network by sharing your sponsor ID: <strong>{referralData?.ownSponsorId || user?.ownSponsorId}</strong>
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(referralData?.ownSponsorId || user?.ownSponsorId);
                    alert('Sponsor ID copied to clipboard!');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  Copy Sponsor ID
                </button>
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