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
          <h1 className="text-2xl font-bold text-gray-900">Withdrawal</h1>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-green-100">Total Earnings</h3>
                    <div className="text-2xl font-bold mt-1">${(user?.totalEarnings || 0).toFixed(2)}</div>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-blue-100">Available Balance</h3>
                    <div className="text-2xl font-bold mt-1">${(user?.totalEarnings || 0).toFixed(2)}</div>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-blue-100 mt-2">Ready for withdrawal</p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-purple-100">Referral Count</h3>
                    <div className="text-2xl font-bold mt-1">{user?.referralCount || 0}</div>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-purple-100 mt-2">Active referrals</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Withdrawal Request Form */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Request Withdrawal
                </h2>
                
                <form onSubmit={handleWithdrawal} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Withdrawal Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500 text-lg">$</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="0.00"
                        min="50"
                        step="0.01"
                        required
                        disabled={submitting}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Minimum withdrawal: $50</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Withdrawal Method</label>
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                      disabled={submitting}
                    >
                      <option value="crypto">USDT TRC-20</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="upi">UPI Payment</option>
                    </select>
                  </div>

                  {method === 'crypto' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">USDT TRC-20 Wallet Address</label>
                      <input
                        type="text"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono"
                        placeholder="Enter your USDT TRC-20 wallet address"
                        required
                        disabled={submitting}
                      />
                      <p className="text-sm text-gray-500 mt-1">Double-check your wallet address - transactions cannot be reversed</p>
                    </div>
                  )}

                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h3 className="font-medium text-amber-900 mb-2">Withdrawal Information</h3>
                    <ul className="text-sm text-amber-800 space-y-1">
                      <li>• Withdrawals are processed within 1-3 business days</li>
                      <li>• Processing fee: $5 for crypto, $10 for bank/UPI</li>
                      <li>• Minimum withdrawal amount: $50</li>
                      <li>• Identity verification may be required for large amounts</li>
                      <li>• Ensure wallet address is correct - we are not responsible for wrong addresses</li>
                    </ul>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || (user?.totalEarnings || 0) < 50}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      submitting || (user?.totalEarnings || 0) < 50
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                    data-testid="button-submit-withdrawal"
                  >
                    {submitting ? 'Processing...' : 'Request Withdrawal'}
                  </button>
                  
                  {(user?.totalEarnings || 0) < 50 && (
                    <p className="text-sm text-red-600 text-center">
                      Insufficient balance. You need at least $50 to make a withdrawal.
                    </p>
                  )}
                </form>
              </div>

              {/* Recent Withdrawals */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h10a2 2 0 002-2V7a2 2 0 00-2-2H9m0 0V3m0 2v6" />
                  </svg>
                  Withdrawal History
                </h3>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {withdrawals.length > 0 ? (
                    withdrawals.map((withdrawal) => (
                      <div key={withdrawal._id} className="p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-gray-900">
                            ${withdrawal.amount.toFixed(2)}
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            withdrawal.status === 'completed' ? 'bg-green-100 text-green-800' :
                            withdrawal.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            withdrawal.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>Method: {withdrawal.method === 'crypto' ? 'USDT TRC-20' : withdrawal.method}</div>
                          <div>Date: {new Date(withdrawal.createdAt).toLocaleDateString()}</div>
                          {withdrawal.transactionHash && (
                            <div className="font-mono text-xs">TX: {withdrawal.transactionHash}</div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h10a2 2 0 002-2V7a2 2 0 00-2-2H9m0 0V3m0 2v6" />
                        </svg>
                      </div>
                      <p>No withdrawals yet</p>
                      <p className="text-sm mt-1">Your withdrawal history will appear here</p>
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