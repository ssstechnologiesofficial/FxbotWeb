import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { ObjectUploader } from '../components/ObjectUploader';

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

  // KYC Upload handlers
  const handleGetKycUploadParameters = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.post('/api/kyc/upload-url', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return {
      method: 'PUT',
      url: response.data.uploadURL,
    };
  };

  const handleKycUploadComplete = async (result) => {
    if (result.successful.length > 0) {
      const uploadedFile = result.successful[0];
      const fileUrl = uploadedFile.uploadURL;
      
      try {
        const token = localStorage.getItem('token');
        await axios.post('/api/kyc/submit', {
          documentUrl: fileUrl,
          fileName: uploadedFile.name,
          fileType: uploadedFile.type
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Refresh user data
        const userResponse = await axios.get('/api/auth/me', { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setUser(userResponse.data);
        
        alert('KYC document submitted successfully! It will be reviewed within 24 hours.');
      } catch (error) {
        console.error('Error submitting KYC document:', error);
        alert('Error submitting KYC document. Please try again.');
      }
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
          <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 bg-slate-50">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Profile Header Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-slate-600 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-xl font-semibold text-white">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                      {user?.firstName} {user?.lastName}
                    </h1>
                    <p className="text-slate-600 font-medium">{user?.email}</p>
                    <p className="text-slate-500 text-sm mt-1">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Active User
                  </div>
                  <p className="text-sm text-slate-500 mt-2">ID: {user?.ownSponsorId}</p>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Total Earnings</p>
                    <p className="text-xl font-semibold text-slate-900">${(user?.totalEarnings || 0).toFixed(2)}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Referrals</p>
                    <p className="text-xl font-semibold text-slate-900">{user?.referralCount || 0}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 616 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Account Type</p>
                    <p className="text-base font-semibold text-slate-900">{user?.role === 'admin' ? 'Administrator' : 'Member'}</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Status</p>
                    <p className="text-base font-semibold text-slate-900">{user?.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    user?.isActive ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <svg className={`w-5 h-5 ${user?.isActive ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800 ml-3">Personal Information</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">First Name</label>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium">
                        {user?.firstName || 'Not provided'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Last Name</label>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium">
                        {user?.lastName || 'Not provided'}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Email Address</label>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium">
                      {user?.email || 'Not provided'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Mobile Number</label>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium">
                      {user?.mobile || 'Not provided'}
                    </div>
                  </div>

                  {/* KYC Document Upload Section */}
                  <div className="border-t border-slate-200 pt-4 mt-6">
                    <label className="block text-sm font-medium text-slate-600 mb-3">KYC Document</label>
                    
                    {/* KYC Status Display */}
                    <div className="mb-4">
                      {user?.kycStatus === 'approved' ? (
                        <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-green-800 font-medium">Verified</span>
                        </div>
                      ) : user?.kycStatus === 'rejected' ? (
                        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-3">
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="text-red-800 font-medium">Document rejected - Please upload again</span>
                        </div>
                      ) : user?.kycStatus === 'pending' ? (
                        <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-yellow-800 font-medium">Under Review</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-slate-600 font-medium">No document uploaded</span>
                        </div>
                      )}
                    </div>

                    {/* Upload Button - Show only if not approved or if rejected */}
                    {user?.kycStatus !== 'approved' && (
                      <ObjectUploader
                        maxNumberOfFiles={1}
                        maxFileSize={5242880} // 5MB
                        acceptedFileTypes={['.pdf', '.jpg', '.jpeg', '.png']}
                        onGetUploadParameters={handleGetKycUploadParameters}
                        onComplete={handleKycUploadComplete}
                        buttonClassName="w-full"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span>Submit KYC Document</span>
                        </div>
                      </ObjectUploader>
                    )}

                    <p className="text-xs text-slate-500 mt-2">
                      Accepted formats: PDF, JPG, PNG. Max size: 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800 ml-3">Account Details</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">User ID</label>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-sm">
                      {user?._id || 'Not available'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Sponsor ID</label>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-sm">
                      {user?.ownSponsorId || 'Not available'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Referred By</label>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-sm">
                      {user?.parentSponsorId || 'Direct signup'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Registration Date</label>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Not available'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings Summary */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-800 ml-3">Earnings Summary</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map(level => {
                  const count = user?.[`level${level}Count`] || 0;
                  const earnings = user?.[`level${level}Earnings`] || 0;
                  const commission = level === 1 ? '1.5%' : level === 2 ? '1.0%' : level === 3 ? '0.75%' : level === 4 ? '0.5%' : '0.25%';
                  
                  return (
                    <div key={level} className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-sm font-semibold text-slate-700">{level}</span>
                      </div>
                      <h3 className="text-sm font-medium text-slate-600 mb-2">Level {level}</h3>
                      <div className="text-base font-semibold text-slate-900 mb-1">{count} users</div>
                      <div className="text-sm font-semibold text-green-600">${earnings.toFixed(2)}</div>
                      <div className="text-xs text-slate-500">{commission} rate</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}