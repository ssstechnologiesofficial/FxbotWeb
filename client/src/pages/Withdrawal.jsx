import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

export default function Withdrawal() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('crypto');
  const [walletAddress, setWalletAddress] = useState('');
  const [withdrawals, setWithdrawals] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const [userResponse, withdrawalsResponse] = await Promise.all([
          axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/withdrawals', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] }))
        ]);
        
        setUser(userResponse.data);
        setWithdrawals(withdrawalsResponse.data);
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

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const withdrawalData = {
        amount: parseFloat(amount),
        method,
        walletAddress: method === 'crypto' ? walletAddress : undefined
      };

      await axios.post('/api/withdrawal', withdrawalData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Withdrawal request submitted successfully! It will be processed within 1-3 business days.');
      
      // Reset form
      setAmount('');
      setWalletAddress('');
      setMethod('crypto');
      
      // Refresh withdrawals list
      const withdrawalsResponse = await axios.get('/api/withdrawals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWithdrawals(withdrawalsResponse.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit withdrawal request. Please try again.');
    } finally {
      setSubmitting(false);
    }
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
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar user={user} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Withdrawal Request</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 bg-slate-50">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Balance Overview */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-semibold text-slate-800 mb-2">Withdrawal Center</h1>
                <p className="text-slate-600 text-sm">Manage your earnings and request withdrawals securely</p>
              </div>

              {/* Balance Cards - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-1">Total Earnings</p>
                      <p className="text-xl font-semibold text-slate-900">${(user?.totalEarnings || 0).toFixed(2)}</p>
                      <p className="text-xs text-slate-500">All time commission</p>
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
                      <p className="text-sm font-medium text-slate-600 mb-1">Available Balance</p>
                      <p className="text-xl font-semibold text-slate-900">${(user?.totalEarnings || 0).toFixed(2)}</p>
                      <p className="text-xs text-slate-500">Ready for withdrawal</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 sm:col-span-2 xl:col-span-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-1">Referral Network</p>
                      <p className="text-xl font-semibold text-slate-900">{user?.referralCount || 0}</p>
                      <p className="text-xs text-slate-500">Active referrals</p>
                    </div>
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 616 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Withdrawal Request Form */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800 ml-3">Request Withdrawal</h2>
                </div>

                <form onSubmit={handleWithdrawal} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Withdrawal Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-600 text-sm">$</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg pl-8 pr-3 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                        placeholder="0.00"
                        min="50"
                        step="0.01"
                        required
                        disabled={submitting}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Minimum withdrawal: $50</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Withdrawal Method</label>
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                      required
                      disabled={submitting}
                    >
                      <option value="crypto">USDT TRC-20 (Recommended)</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="upi">UPI Payment</option>
                    </select>
                  </div>

                  {method === 'crypto' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">USDT TRC-20 Wallet Address</label>
                      <input
                        type="text"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                        placeholder="TXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        required
                        disabled={submitting}
                      />
                      <p className="text-xs text-red-600 mt-1">Double-check your address - transactions cannot be reversed!</p>
                    </div>
                  )}

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-blue-900 mb-2 text-sm">
                      Withdrawal Information
                    </h3>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Processed within 1-3 business days</li>
                      <li>• Service Charge: 5% of requested amount</li>
                      <li>• Minimum amount: $50</li>
                      <li>• KYC verification may be required</li>
                      <li>• Verify wallet address carefully</li>
                    </ul>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || (user?.totalEarnings || 0) < 50}
                    className={`w-full py-3 rounded-lg text-sm font-medium transition-colors ${
                      submitting || (user?.totalEarnings || 0) < 50
                        ? 'bg-slate-400 cursor-not-allowed text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                    data-testid="button-submit-withdrawal"
                  >
                    {submitting ? 'Processing...' : 'Request Withdrawal'}
                  </button>

                  {(user?.totalEarnings || 0) < 50 && (
                    <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-red-700 font-medium text-sm">
                        Insufficient balance - You need at least $50 to withdraw
                      </p>
                    </div>
                  )}
                </form>
              </div>

              {/* Recent Withdrawals */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h10a2 2 0 002-2V7a2 2 0 00-2-2H9m0 0V3m0 2v6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 ml-3">Withdrawal History</h3>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {withdrawals.length > 0 ? (
                    withdrawals.map((withdrawal, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-900">${withdrawal.amount?.toFixed(2)}</h3>
                            <p className="text-sm text-slate-600">{withdrawal.method?.toUpperCase()}</p>
                            <p className="text-xs text-slate-500">{new Date(withdrawal.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            withdrawal.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : withdrawal.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {withdrawal.status}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h10a2 2 0 002-2V7a2 2 0 00-2-2H9m0 0V3m0 2v6" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-slate-900 mb-2">No Withdrawal History</h3>
                      <p className="text-slate-600">Your withdrawal requests will appear here</p>
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