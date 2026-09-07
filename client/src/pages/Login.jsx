import React, { useState } from 'react';
import { Link } from 'wouter';
import axios from 'axios';
import '../styles/login.css';
import { trackEvent } from '../lib/analytics';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await axios.post(`${apiUrl}/api/auth/login`, formData);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        trackEvent('login_success', {
          role: response.data.user.isAdmin ? 'admin' : 'user'
        });
        
        if (response.data.user.isAdmin) {
          window.location.href = '/admin';
        } else {
          window.location.href = '/dashboard';
        }
      }
    } catch (error) {
      trackEvent('login_failed', {
        reason: 'invalid_credentials'
      });
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <img src="/logo.png" alt="FXBOT" style={{ height: '6rem', width: 'auto' }} />
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2>Sign In</h2>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              data-testid="input-email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                data-testid="input-password"
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  padding: '0.25rem'
                }}
                data-testid="button-toggle-password"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="form-actions">
            <Link href="/forgot-password" className="forgot-password-link" data-testid="link-forgot-password">
              Forgot your password?
            </Link>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
            data-testid="button-login"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <Link href="/register" className="link" data-testid="link-register">
              Create account here
            </Link>
          </p>
        </div>
        
        <div className="back-to-home">
          <Link href="/" data-testid="link-home">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}