import React, { useState } from 'react';
import { Link } from 'wouter';
import axios from 'axios';
import '../styles/login.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      
      if (response.data.success) {
        setMessage(response.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="logo">
          <img src="/logo.png" alt="FXBOT" />
          <h1>FXBOT</h1>
        </div>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <h2>Reset Password</h2>
          <p className="description">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          {!message && (
            <>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  data-testid="input-email"
                />
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
                data-testid="button-reset"
              >
                {loading ? 'Sending...' : 'Send Reset Instructions'}
              </button>
            </>
          )}
        </form>

        <div className="back-to-login">
          <Link href="/login" data-testid="link-login">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}