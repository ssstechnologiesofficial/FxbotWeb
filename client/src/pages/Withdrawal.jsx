import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModernSidebar from '../components/ModernSidebar';
import { CheckCircle, AlertCircle, Lock, ArrowLeft, DollarSign, Shield, Mail } from 'lucide-react';

export default function Withdrawal() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1: Form, 2: OTP Verification, 3: Success
  
  // Form data
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('USDT TRC-20');
  const [walletAddress, setWalletAddress] = useState('');
  
  // OTP data
  const [withdrawalId, setWithdrawalId] = useState('');
  const [otp, setOtp] = useState('');
  const [withdrawalDetails, setWithdrawalDetails] = useState(null);
  
  // UI states
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const [userResponse, summaryResponse] = await Promise.all([
          axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/user/investment-summary', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        setUser(userResponse.data);
        setWalletBalance(summaryResponse.data.walletBalance || 0);
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!amount || parseFloat(amount) < 15) {
      newErrors.amount = 'Minimum withdrawal amount is $15';
    }
    
    if (parseFloat(amount) > walletBalance) {
      newErrors.amount = `Insufficient balance. Available: $${walletBalance.toFixed(2)}`;
    }
    
    if (!walletAddress) {
      newErrors.walletAddress = 'Wallet address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitWithdrawal = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    setErrors({});
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/withdrawal', {
        amount: parseFloat(amount),
        method,
        walletAddress
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setWithdrawalId(response.data.withdrawalId);
        setWithdrawalDetails(response.data.withdrawalDetails);
        setMessage(response.data.message);
        setStep(2);
      }
    } catch (error) {
      setErrors({ general: error.response?.data?.error || 'Failed to submit withdrawal request' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return;
    }
    
    setSubmitting(true);
    setErrors({});
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/withdrawal/verify-otp', {
        withdrawalId,
        otp
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setMessage(response.data.message);
        setStep(3);
      }
    } catch (error) {
      setErrors({ otp: error.response?.data?.error || 'Failed to verify OTP' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewWithdrawal = () => {
    setStep(1);
    setAmount('');
    setWalletAddress('');
    setOtp('');
    setWithdrawalId('');
    setWithdrawalDetails(null);
    setErrors({});
    setMessage('');
  };

  const calculateServiceCharge = (amount) => {
    const amt = parseFloat(amount) || 0;
    return amt * 0.05;
  };

  const calculateNetAmount = (amount) => {
    const amt = parseFloat(amount) || 0;
    return amt - calculateServiceCharge(amt);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <ModernSidebar />
        <main style={{ flex: 1, marginLeft: '240px', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              border: '2px solid #e5e7eb',
              borderTop: '2px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <div style={{ fontSize: '1.125rem', color: '#374151' }}>Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <ModernSidebar />
      <main style={{ flex: 1, marginLeft: '240px', padding: '2rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.5rem 0' }}>
              Withdrawal Request
            </h1>
            <p style={{ color: '#6b7280', margin: 0 }}>
              {step === 1 && 'Request funds from your wallet balance'}
              {step === 2 && 'Verify your identity with OTP'}
              {step === 3 && 'Withdrawal request submitted successfully'}
            </p>
          </div>

          {/* Step Indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '2rem', height: '2rem', borderRadius: '50%',
                backgroundColor: step >= 1 ? '#3b82f6' : '#e5e7eb',
                color: step >= 1 ? 'white' : '#9ca3af',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.875rem', fontWeight: '600'
              }}>1</div>
              <div style={{ width: '2rem', height: '2px', backgroundColor: step >= 2 ? '#3b82f6' : '#e5e7eb' }}></div>
              <div style={{
                width: '2rem', height: '2rem', borderRadius: '50%',
                backgroundColor: step >= 2 ? '#3b82f6' : '#e5e7eb',
                color: step >= 2 ? 'white' : '#9ca3af',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.875rem', fontWeight: '600'
              }}>2</div>
              <div style={{ width: '2rem', height: '2px', backgroundColor: step >= 3 ? '#3b82f6' : '#e5e7eb' }}></div>
              <div style={{
                width: '2rem', height: '2rem', borderRadius: '50%',
                backgroundColor: step >= 3 ? '#10b981' : '#e5e7eb',
                color: step >= 3 ? 'white' : '#9ca3af',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.875rem', fontWeight: '600'
              }}>✓</div>
            </div>
          </div>

          {/* Wallet Balance */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <DollarSign size={32} style={{ color: '#10b981', margin: '0 auto 0.5rem' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', margin: '0 0 0.25rem 0' }}>
              Available Balance
            </h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
              ${walletBalance.toFixed(2)}
            </div>
          </div>

          {/* Step Content */}
          {step === 1 && (
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '2rem'
            }}>
              <form onSubmit={handleSubmitWithdrawal}>
                {/* Amount Input */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    Withdrawal Amount (Minimum $15)
                  </label>
                  <input
                    type="number"
                    min="15"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: errors.amount ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '1rem'
                    }}
                    placeholder="Enter amount to withdraw"
                  />
                  {errors.amount && (
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {errors.amount}
                    </p>
                  )}
                  {amount && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      Service charge (5%): ${calculateServiceCharge(amount).toFixed(2)}
                      <br />
                      You will receive: ${calculateNetAmount(amount).toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Method Selection */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    Withdrawal Method
                  </label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="USDT TRC-20">USDT TRC-20</option>
                    <option value="USDT ERC-20">USDT ERC-20</option>
                    <option value="Bitcoin">Bitcoin</option>
                  </select>
                </div>

                {/* Wallet Address */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: errors.walletAddress ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '1rem'
                    }}
                    placeholder="Enter your wallet address"
                  />
                  {errors.walletAddress && (
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {errors.walletAddress}
                    </p>
                  )}
                </div>

                {/* Error Message */}
                {errors.general && (
                  <div style={{ 
                    backgroundColor: '#fef2f2', 
                    border: '1px solid #fecaca', 
                    borderRadius: '0.375rem', 
                    padding: '1rem', 
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <AlertCircle size={20} style={{ color: '#ef4444' }} />
                    <span style={{ color: '#dc2626', fontSize: '0.875rem' }}>{errors.general}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    backgroundColor: submitting ? '#9ca3af' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {submitting ? 'Processing...' : 'Submit Withdrawal Request'}
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '2rem'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Mail size={48} style={{ color: '#3b82f6', margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', margin: '0 0 0.5rem 0' }}>
                  OTP Sent to Your Email
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                  We've sent a 6-digit verification code to {user?.email}
                </p>
                <p style={{ fontSize: '0.875rem', color: '#ef4444' }}>
                  OTP expires in 10 minutes
                </p>
              </div>

              {withdrawalDetails && (
                <div style={{
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  padding: '1rem',
                  marginBottom: '2rem'
                }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', margin: '0 0 0.75rem 0' }}>
                    Withdrawal Summary
                  </h4>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.5' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span>Requested Amount:</span>
                      <span>${withdrawalDetails.requestedAmount.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span>Service Charge (5%):</span>
                      <span>-${withdrawalDetails.serviceCharge.toFixed(2)}</span>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid #d1d5db', margin: '0.5rem 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', color: '#374151' }}>
                      <span>You will receive:</span>
                      <span>${withdrawalDetails.netAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleVerifyOTP}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    Enter 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: errors.otp ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '1.125rem',
                      textAlign: 'center',
                      letterSpacing: '0.25rem'
                    }}
                    placeholder="000000"
                  />
                  {errors.otp && (
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {errors.otp}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{
                      flex: 1,
                      padding: '0.875rem',
                      backgroundColor: 'white',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <ArrowLeft size={16} />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || otp.length !== 6}
                    style={{
                      flex: 2,
                      padding: '0.875rem',
                      backgroundColor: (submitting || otp.length !== 6) ? '#9ca3af' : '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: (submitting || otp.length !== 6) ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Shield size={16} />
                    {submitting ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 3 && (
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <CheckCircle size={64} style={{ color: '#10b981', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#10b981', margin: '0 0 1rem 0' }}>
                Withdrawal Request Submitted!
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '2rem', lineHeight: '1.5' }}>
                Your withdrawal request has been successfully submitted for admin approval.
                You will receive an email notification once the admin reviews your request.
              </p>
              
              <div style={{
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '0.375rem',
                padding: '1rem',
                marginBottom: '2rem'
              }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#0369a1', margin: '0 0 0.5rem 0' }}>
                  What's Next?
                </h4>
                <ul style={{ fontSize: '0.875rem', color: '#374151', textAlign: 'left', paddingLeft: '1.25rem', margin: 0 }}>
                  <li>Admin will review your withdrawal request</li>
                  <li>You'll receive an email with the decision</li>
                  <li>If approved, funds will be processed within 24-48 hours</li>
                  <li>Track your request in the Transaction History</li>
                </ul>
              </div>

              <button
                onClick={handleNewWithdrawal}
                style={{
                  padding: '0.875rem 1.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Make Another Withdrawal
              </button>
            </div>
          )}

          {/* Success Message */}
          {message && step !== 3 && (
            <div style={{ 
              backgroundColor: '#f0f9ff', 
              border: '1px solid #bae6fd', 
              borderRadius: '0.375rem', 
              padding: '1rem', 
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle size={20} style={{ color: '#0369a1' }} />
              <span style={{ color: '#0369a1', fontSize: '0.875rem' }}>{message}</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}