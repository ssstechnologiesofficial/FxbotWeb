import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

export default function Deposit() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('crypto');

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

  const handleDeposit = (e) => {
    e.preventDefault();
    alert(`Deposit of $${amount} via ${method} initiated. This is a demo - no actual transaction will occur.`);
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
          <h1 className="text-2xl font-bold text-gray-900">Deposit</h1>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Make a Deposit</h2>
              
              <form onSubmit={handleDeposit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deposit Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500 text-lg">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2"
                      placeholder="0.00"
                      min="10"
                      step="0.01"
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Minimum deposit: $10</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="crypto">Cryptocurrency</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Deposit Information</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Deposits are processed within 1-24 hours</li>
                    <li>• No fees for cryptocurrency deposits</li>
                    <li>• 3% processing fee for card payments</li>
                    <li>• All deposits are secured with bank-level encryption</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                  data-testid="button-submit-deposit"
                >
                  Proceed to Deposit
                </button>
              </form>
            </div>

            {/* Recent Deposits */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Deposits</h3>
              <div className="text-center py-8 text-gray-500">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">📄</span>
                </div>
                <p>No deposits yet</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}