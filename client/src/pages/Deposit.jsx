import { useState, useEffect } from 'react';
import { Copy, Upload, CheckCircle, DollarSign, Wallet, QrCode } from 'lucide-react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { ObjectUploader } from '../components/ObjectUploader';
const qrCodeImage = '/QR_1755789504506.jpeg';

export default function Deposit() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState(250);
  const [uploadedScreenshotUrl, setUploadedScreenshotUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const walletAddress = "TDdjYG9Jhz1G68AzgZqWFL75iEbsRD1FSH";
  const walletType = "TRC";

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleGetUploadParameters = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/deposit/upload-url', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const data = await response.json();
      return { url: data.uploadURL };
    } catch (error) {
      console.error('Error getting upload URL:', error);
      throw error;
    }
  };

  const handleUploadComplete = (result) => {
    if (result.successful && result.successful.length > 0) {
      setUploadedScreenshotUrl(result.successful[0].uploadURL);
    }
  };

  const handleAmountChange = (event) => {
    const value = parseInt(event.target.value);
    if (value >= 250 && value % 250 === 0) {
      setDepositAmount(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!uploadedScreenshotUrl) {
      alert('Please upload a payment screenshot before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/deposit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: depositAmount,
          walletType: walletType,
          walletAddress: walletAddress,
          screenshotUrl: uploadedScreenshotUrl
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Deposit request submitted successfully! Our admin will review and confirm your transaction within 24 hours.');
        setUploadedScreenshotUrl(null);
        setDepositAmount(250);
        // Reset the uploader component
        window.location.reload();
      } else {
        alert(data.error || 'Failed to submit deposit request. Please try again.');
      }
    } catch (error) {
      console.error('Deposit submission error:', error);
      alert('Error submitting deposit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateAmountOptions = () => {
    const options = [];
    for (let i = 250; i <= 2500; i += 250) {
      options.push(
        <option key={i} value={i}>
          ${i}
        </option>
      );
    }
    return options;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f3f4f6' }}>
        <div style={{ width: '16rem', backgroundColor: '#1f2937' }}></div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '2px solid #e5e7eb',
            borderTop: '2px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f3f4f6' }}>
      <Sidebar user={user} onLogout={handleLogout} />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 1.5rem'
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#111827',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <DollarSign style={{ width: '1.5rem', height: '1.5rem', color: '#f59e0b' }} />
            Deposit
          </h1>
        </header>

        <main style={{
          flex: 1,
          overflowY: 'auto',
          backgroundColor: '#f9fafb',
          padding: '1.5rem'
        }}>
          <div style={{ 
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                Make a Deposit
              </h2>
              <p style={{ 
                color: '#6b7280',
                fontSize: '1rem',
                marginBottom: '1rem'
              }}>
                Add funds to your FXBOT trading account using USDT TRC-20
              </p>
              
              {/* Remark */}
              <div style={{
                backgroundColor: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                fontSize: '0.875rem',
                color: '#92400e'
              }}>
                <strong>Remark:</strong> Please ensure you only transfer the same selected type of digital asset.
              </div>
            </div>

      <form onSubmit={handleSubmit}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Left Column - Form */}
          <div style={{ 
            backgroundColor: '#ffffff',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e5e7eb'
          }}>
            {/* Payment Method */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Payment Method
              </label>
              <div style={{
                backgroundColor: '#f3f4f6',
                border: '2px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Wallet style={{ width: '1.25rem', height: '1.25rem', color: '#f59e0b' }} />
                USDT TRC-20
              </div>
            </div>

            {/* Deposit Amount */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Deposit Amount (USD)
              </label>
              <select
                value={depositAmount}
                onChange={handleAmountChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  backgroundColor: '#ffffff',
                  color: '#111827',
                  cursor: 'pointer'
                }}
              >
                {generateAmountOptions()}
              </select>
              <p style={{ 
                fontSize: '0.75rem',
                color: '#6b7280',
                marginTop: '0.25rem'
              }}>
                Minimum $250. Deposits must be in multiples of $250
              </p>
            </div>

            {/* Wallet Type */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Wallet Type
              </label>
              <div style={{
                backgroundColor: '#f3f4f6',
                border: '2px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#111827'
              }}>
                {walletType}
              </div>
            </div>

            {/* Wallet Address */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Wallet Address
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <input
                  type="text"
                  value={walletAddress}
                  readOnly
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    backgroundColor: '#f9fafb',
                    color: '#111827'
                  }}
                />
                <button
                  type="button"
                  onClick={copyToClipboard}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: copied ? '#22c55e' : '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {copied ? (
                    <>
                      <CheckCircle style={{ width: '1rem', height: '1rem' }} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy style={{ width: '1rem', height: '1rem' }} />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* File Upload */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ 
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Upload Payment Screenshot *
              </label>
              <ObjectUploader
                maxNumberOfFiles={1}
                maxFileSize={10485760}
                onGetUploadParameters={handleGetUploadParameters}
                onComplete={handleUploadComplete}
                acceptedFileTypes="image/*"
              />
              <p style={{ 
                fontSize: '0.75rem',
                color: '#6b7280',
                marginTop: '0.25rem'
              }}>
                Upload a clear screenshot of your payment transaction for admin verification
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !uploadedScreenshotUrl}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: (!uploadedScreenshotUrl || isSubmitting) ? '#9ca3af' : '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: (!uploadedScreenshotUrl || isSubmitting) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting && uploadedScreenshotUrl) {
                  e.target.style.backgroundColor = '#d97706';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting && uploadedScreenshotUrl) {
                  e.target.style.backgroundColor = '#f59e0b';
                }
              }}
              data-testid="button-submit-deposit"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Deposit Request'}
            </button>
          </div>

          {/* Right Column - QR Code */}
          <div style={{ 
            backgroundColor: '#ffffff',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              <QrCode style={{ width: '1.5rem', height: '1.5rem', color: '#f59e0b' }} />
              <h3 style={{ 
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#111827',
                margin: 0
              }}>
                Wallet QR Code
              </h3>
            </div>
            
            <div style={{
              backgroundColor: '#f9fafb',
              border: '2px solid #e5e7eb',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px'
            }}>
              <img 
                src={qrCodeImage} 
                alt="USDT TRC-20 Wallet QR Code" 
                style={{ 
                  maxWidth: '200px', 
                  maxHeight: '200px', 
                  width: 'auto', 
                  height: 'auto',
                  borderRadius: '0.5rem'
                }}
                data-testid="img-qr-code"
              />
            </div>

            <p style={{ 
              fontSize: '0.875rem',
              color: '#6b7280',
              marginBottom: '1rem'
            }}>
              Scan this QR code to send USDT TRC-20 to our wallet
            </p>

            <div style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '0.5rem',
              padding: '1rem',
              fontSize: '0.875rem',
              color: '#92400e'
            }}>
              <strong>Important:</strong>
              <ul style={{ margin: '0.5rem 0', paddingLeft: '1.25rem' }}>
                <li>Only send USDT TRC-20 to this address</li>
                <li>Minimum deposit: $250</li>
                <li>Upload payment screenshot for verification</li>
                <li>Processing time: 1-24 hours</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
          </div>
        </main>
      </div>
    </div>
  );
}