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
      alert('Error submitting withdrawal request: ' + (error.response?.data?.error || 'Please try again'));
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
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Withdrawal Request</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-6" style={{ 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' 
        }}>
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Hero Balance Header */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                  💰 Withdrawal Center
                </h1>
                <p className="text-gray-600 text-lg">Manage your earnings and request withdrawals securely</p>
              </div>
              
              {/* Balance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-sm"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-green-100 mb-2">💵 Total Earnings</h3>
                      <div className="text-3xl font-bold mb-1">${(user?.totalEarnings || 0).toFixed(2)}</div>
                      <div className="text-xs text-green-100">All time commission</div>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="relative bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-sm"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-blue-100 mb-2">🏦 Available Balance</h3>
                      <div className="text-3xl font-bold mb-1">${(user?.totalEarnings || 0).toFixed(2)}</div>
                      <div className="text-xs text-blue-100">Ready for withdrawal</div>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="relative bg-gradient-to-br from-purple-400 via-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-sm"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-purple-100 mb-2">👥 Referral Network</h3>
                      <div className="text-3xl font-bold mb-1">{user?.referralCount || 0}</div>
                      <div className="text-xs text-purple-100">Active referrals</div>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Withdrawal Request Form */}
              <div className="bg-white rounded-3xl p-8 shadow-2xl border-0 hover:shadow-3xl transition-all duration-300">
                <div className="flex items-center mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 ml-4">🚀 Request Withdrawal</h2>
                </div>
                
                <form onSubmit={handleWithdrawal} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">💸 Withdrawal Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-4 text-gray-600 text-xl font-bold">$</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-2xl pl-12 pr-4 py-4 text-xl font-bold focus:ring-4 focus:ring-red-200 focus:border-red-500 transition-all bg-gradient-to-r from-gray-50 to-white hover:shadow-lg"
                        placeholder="0.00"
                        min="50"
                        step="0.01"
                        required
                        disabled={submitting}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2 font-medium">💡 Minimum withdrawal: $50</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">🏦 Withdrawal Method</label>
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-4 text-lg font-semibold focus:ring-4 focus:ring-red-200 focus:border-red-500 transition-all bg-gradient-to-r from-gray-50 to-white hover:shadow-lg"
                      required
                      disabled={submitting}
                    >
                      <option value="crypto">🪙 USDT TRC-20 (Recommended)</option>
                      <option value="bank">🏦 Bank Transfer</option>
                      <option value="upi">📱 UPI Payment</option>
                    </select>
                  </div>

                  {method === 'crypto' && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">🔐 USDT TRC-20 Wallet Address</label>
                      <input
                        type="text"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-2xl px-4 py-4 font-mono text-sm focus:ring-4 focus:ring-red-200 focus:border-red-500 transition-all bg-gradient-to-r from-gray-50 to-white hover:shadow-lg"
                        placeholder="TXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        required
                        disabled={submitting}
                      />
                      <p className="text-sm text-red-600 mt-2 font-medium">⚠️ Double-check your address - transactions cannot be reversed!</p>
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border-2 border-amber-200 shadow-lg">
                    <h3 className="font-bold text-amber-900 mb-3 flex items-center">
                      <span className="mr-2">ℹ️</span>
                      Withdrawal Information
                    </h3>
                    <ul className="text-sm text-amber-800 space-y-2 font-medium">
                      <li className="flex items-center"><span className="mr-2">⏱️</span>Processed within 1-3 business days</li>
                      <li className="flex items-center"><span className="mr-2">💰</span>Fee: $5 (crypto) / $10 (bank/UPI)</li>
                      <li className="flex items-center"><span className="mr-2">📊</span>Minimum amount: $50</li>
                      <li className="flex items-center"><span className="mr-2">🔍</span>KYC verification may be required</li>
                      <li className="flex items-center"><span className="mr-2">⚠️</span>Verify wallet address carefully</li>
                    </ul>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || (user?.totalEarnings || 0) < 50}
                    className={`w-full py-4 rounded-2xl text-xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 ${
                      submitting || (user?.totalEarnings || 0) < 50
                        ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed text-white'
                        : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white'
                    }`}
                    data-testid="button-submit-withdrawal"
                  >
                    {submitting ? '🔄 Processing...' : '🚀 Request Withdrawal'}
                  </button>
                  
                  {(user?.totalEarnings || 0) < 50 && (
                    <div className="text-center p-4 bg-red-50 rounded-2xl border-2 border-red-200">
                      <p className="text-red-700 font-bold">
                        💸 Insufficient balance - You need at least $50 to withdraw
                      </p>
                    </div>
                  )}
                </form>
              </div>

              {/* Recent Withdrawals */}
              <div className="bg-white rounded-3xl p-8 shadow-2xl border-0 hover:shadow-3xl transition-all duration-300">
                <div className="flex items-center mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h10a2 2 0 002-2V7a2 2 0 00-2-2H9m0 0V3m0 2v6" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 ml-4">📊 Withdrawal History</h3>
                </div>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {withdrawals.length > 0 ? (
                    withdrawals.map((withdrawal) => (
                      <div key={withdrawal._id} className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border-2 border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-102">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-2xl font-bold text-gray-800">
                            ${withdrawal.amount.toFixed(2)}
                          </div>
                          <div className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                            withdrawal.status === 'completed' ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' :
                            withdrawal.status === 'processing' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                            withdrawal.status === 'pending' ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white' :
                            'bg-gradient-to-r from-red-400 to-pink-500 text-white'
                          }`}>
                            {withdrawal.status === 'completed' ? '✅ Completed' :
                             withdrawal.status === 'processing' ? '🔄 Processing' :
                             withdrawal.status === 'pending' ? '⏳ Pending' :
                             '❌ Failed'}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1 font-medium">
                          <div className="flex items-center">
                            <span className="mr-2">💳</span>
                            Method: {withdrawal.method === 'crypto' ? '🪙 USDT TRC-20' : withdrawal.method}
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2">📅</span>
                            Date: {new Date(withdrawal.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          {withdrawal.transactionHash && (
                            <div className="flex items-center">
                              <span className="mr-2">🔗</span>
                              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                TX: {withdrawal.transactionHash}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h10a2 2 0 002-2V7a2 2 0 00-2-2H9m0 0V3m0 2v6" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">📝 No Withdrawal History</h3>
                      <p className="text-gray-600 font-medium">Your withdrawal requests will appear here once you make them</p>
                      <p className="text-sm text-gray-500 mt-2">Make your first withdrawal to get started!</p>
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