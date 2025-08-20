import { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  UserCheck,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Search,
  Filter
} from 'lucide-react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [kycSubmissions, setKycSubmissions] = useState([]);
  const [userHistory, setUserHistory] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeposits: 0,
    pendingDeposits: 0,
    totalVolume: 0,
    totalWithdrawals: 0,
    pendingWithdrawals: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        // Fetch user data
        const userResponse = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!userResponse.data.isAdmin) {
          alert('Access denied. Admin privileges required.');
          window.location.href = '/dashboard';
          return;
        }
        
        setUser(userResponse.data);

        // Fetch admin data
        const [usersResponse, depositsResponse, withdrawalsResponse, kycResponse] = await Promise.all([
          axios.get('/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/admin/deposits', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/admin/withdrawals', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/admin/kyc', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setUsers(usersResponse.data);
        setDeposits(depositsResponse.data);
        setWithdrawals(withdrawalsResponse.data);
        setKycSubmissions(kycResponse.data);

        // Calculate stats
        const totalDeposits = depositsResponse.data.length;
        const pendingDeposits = depositsResponse.data.filter(d => d.status === 'pending').length;
        const totalVolume = depositsResponse.data
          .filter(d => d.status === 'confirmed')
          .reduce((sum, d) => sum + d.amount, 0);

        const totalWithdrawals = withdrawalsResponse.data.length;
        const pendingWithdrawals = withdrawalsResponse.data.filter(w => w.status === 'pending_admin').length;

        setStats({
          totalUsers: usersResponse.data.length,
          totalDeposits,
          pendingDeposits,
          totalVolume,
          totalWithdrawals,
          pendingWithdrawals
        });

      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        console.error('Error fetching admin data:', error);
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

  // KYC Management Functions
  const handleViewKycDocument = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/kyc/document/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error viewing KYC document:', error);
      alert('Failed to load KYC document. Please try again.');
    }
  };

  const handleKycApproval = async (userId, action) => {
    try {
      const token = localStorage.getItem('token');
      let reason = null;
      
      if (action === 'reject') {
        reason = prompt('Please provide a reason for rejection:');
        if (!reason) return; // User cancelled
      }
      
      const endpoint = action === 'approve' ? 
        `/api/admin/kyc/${userId}/approve` : 
        `/api/admin/kyc/${userId}/reject`;
      
      await axios.post(endpoint, { reason }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh KYC and users data
      const [usersResponse, kycResponse] = await Promise.all([
        axios.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/admin/kyc', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setUsers(usersResponse.data);
      setKycSubmissions(kycResponse.data);
      
      alert(`KYC document ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing KYC document:`, error);
      alert(`Failed to ${action} KYC document. Please try again.`);
    }
  };

  const handleDepositAction = async (depositId, action, notes) => {
    if (!notes?.trim()) {
      alert('Please provide notes for this action');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/admin/deposits/${depositId}/action`, {
        action,
        notes: notes.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh deposits
      const depositsResponse = await axios.get('/api/admin/deposits', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeposits(depositsResponse.data);
      
      // Update stats
      const totalDeposits = depositsResponse.data.length;
      const pendingDeposits = depositsResponse.data.filter(d => d.status === 'pending').length;
      const totalVolume = depositsResponse.data
        .filter(d => d.status === 'confirmed')
        .reduce((sum, d) => sum + d.amount, 0);

      setStats(prev => ({
        ...prev,
        totalDeposits,
        pendingDeposits,
        totalVolume
      }));

      alert(`Deposit ${action}d successfully!`);
    } catch (error) {
      console.error('Error updating deposit:', error);
      alert('Error updating deposit status');
    }
  };

  const handleViewDepositScreenshot = (deposit) => {
    if (!deposit.screenshotPath) {
      alert('No screenshot available for this deposit');
      return;
    }
    
    // Open screenshot in new window/tab for admin review
    const token = localStorage.getItem('token');
    const screenshotUrl = `/deposits/screenshot${deposit.screenshotPath}?auth=${token}`;
    window.open(screenshotUrl, '_blank', 'width=800,height=600');
  };

  const handleWithdrawalAction = async (withdrawalId, action, notes) => {
    if (!notes?.trim()) {
      alert('Please provide notes for this action');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/admin/withdrawals/${withdrawalId}/action`, {
        action,
        notes: notes.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh withdrawals
      const withdrawalsResponse = await axios.get('/api/admin/withdrawals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWithdrawals(withdrawalsResponse.data);

      // Update stats
      const pendingWithdrawals = withdrawalsResponse.data.filter(w => w.status === 'pending_admin').length;
      setStats(prev => ({
        ...prev,
        pendingWithdrawals
      }));

      alert(`Withdrawal ${action}d successfully!`);
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      alert('Error processing withdrawal action');
    }
  };

  const handleUserSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      alert('Please enter an email or mobile number');
      return;
    }

    setSearchLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/admin/user-history/${encodeURIComponent(searchTerm)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserHistory(response.data);
    } catch (error) {
      console.error('Error searching user:', error);
      alert('User not found or error occurred');
      setUserHistory(null);
    } finally {
      setSearchLoading(false);
    }
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
            <UserCheck style={{ width: '1.5rem', height: '1.5rem', color: '#f59e0b' }} />
            Admin Dashboard
          </h1>
        </header>

        <main style={{
          flex: 1,
          overflowY: 'auto',
          backgroundColor: '#f9fafb',
          padding: '1.5rem'
        }}>
          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Total Users</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                    {stats.totalUsers}
                  </p>
                </div>
                <Users style={{ width: '2.5rem', height: '2.5rem', color: '#3b82f6' }} />
              </div>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Total Deposits</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                    {stats.totalDeposits}
                  </p>
                </div>
                <DollarSign style={{ width: '2.5rem', height: '2.5rem', color: '#10b981' }} />
              </div>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Pending Deposits</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                    {stats.pendingDeposits}
                  </p>
                </div>
                <Clock style={{ width: '2.5rem', height: '2.5rem', color: '#f59e0b' }} />
              </div>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Total Volume</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                    ${stats.totalVolume.toLocaleString()}
                  </p>
                </div>
                <TrendingUp style={{ width: '2.5rem', height: '2.5rem', color: '#8b5cf6' }} />
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              borderBottom: '1px solid #e5e7eb',
              overflowX: 'auto'
            }}>
              {[
                { id: 'users', label: 'User List' },
                { id: 'kyc', label: 'KYC Status' },
                { id: 'deposits', label: 'Deposit Requests' },
                { id: 'withdrawals', label: 'Withdrawal Requests' },
                { id: 'investments', label: 'Investments' },
                { id: 'engagement', label: 'Engagement' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '1rem 1.5rem',
                    backgroundColor: activeTab === tab.id ? '#f59e0b' : 'transparent',
                    color: activeTab === tab.id ? 'white' : '#6b7280',
                    border: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ padding: '1.5rem' }}>
              {activeTab === 'users' && (
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '1rem'
                  }}>
                    User Management
                  </h3>
                  
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '0.875rem'
                    }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f9fafb' }}>
                          <th style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            borderBottom: '1px solid #e5e7eb'
                          }}>Name</th>
                          <th style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            borderBottom: '1px solid #e5e7eb'
                          }}>Email</th>
                          <th style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            borderBottom: '1px solid #e5e7eb'
                          }}>Sponsor ID</th>
                          <th style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            borderBottom: '1px solid #e5e7eb'
                          }}>Referrals</th>
                          <th style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            borderBottom: '1px solid #e5e7eb'
                          }}>DAS Status</th>
                          <th style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            borderBottom: '1px solid #e5e7eb'
                          }}>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length === 0 ? (
                          <tr>
                            <td colSpan="6" style={{
                              padding: '2rem',
                              textAlign: 'center',
                              color: '#6b7280'
                            }}>
                              No users found
                            </td>
                          </tr>
                        ) : (
                          users.map((userData, index) => (
                            <tr key={userData._id} style={{
                              backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                            }}>
                              <td style={{
                                padding: '0.75rem',
                                borderBottom: '1px solid #e5e7eb'
                              }}>
                                {userData.firstName && userData.lastName 
                                  ? `${userData.firstName} ${userData.lastName}` 
                                  : userData.email || 'N/A'}
                              </td>
                              <td style={{
                                padding: '0.75rem',
                                borderBottom: '1px solid #e5e7eb'
                              }}>
                                {userData.email || 'N/A'}
                              </td>
                              <td style={{
                                padding: '0.75rem',
                                borderBottom: '1px solid #e5e7eb',
                                fontFamily: 'monospace',
                                color: '#3b82f6'
                              }}>
                                {userData.ownSponsorId || 'N/A'}
                              </td>
                              <td style={{
                                padding: '0.75rem',
                                borderBottom: '1px solid #e5e7eb'
                              }}>
                                {userData.referralCount || 0}
                              </td>
                              <td style={{
                                padding: '0.75rem',
                                borderBottom: '1px solid #e5e7eb'
                              }}>
                                <span style={{
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '0.25rem',
                                  fontSize: '0.75rem',
                                  fontWeight: '600',
                                  backgroundColor: userData.isEnrolledInDas ? '#dcfce7' : '#f3f4f6',
                                  color: userData.isEnrolledInDas ? '#166534' : '#6b7280'
                                }}>
                                  {userData.isEnrolledInDas ? 'Enrolled' : 'Not Enrolled'}
                                </span>
                              </td>
                              <td style={{
                                padding: '0.75rem',
                                borderBottom: '1px solid #e5e7eb',
                                color: '#6b7280'
                              }}>
                                {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'kyc' && (
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '1rem'
                  }}>
                    KYC Document Management
                  </h3>
                  
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '0.875rem'
                    }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f9fafb' }}>
                          <th style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            borderBottom: '1px solid #e5e7eb'
                          }}>User</th>
                          <th style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            borderBottom: '1px solid #e5e7eb'
                          }}>Status</th>
                          <th style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            borderBottom: '1px solid #e5e7eb'
                          }}>Document</th>
                          <th style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            borderBottom: '1px solid #e5e7eb'
                          }}>Submitted</th>
                          <th style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            borderBottom: '1px solid #e5e7eb'
                          }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {kycSubmissions.length === 0 ? (
                          <tr>
                            <td colSpan="5" style={{
                              padding: '2rem',
                              textAlign: 'center',
                              color: '#6b7280'
                            }}>
                              No KYC submissions found
                            </td>
                          </tr>
                        ) : (
                          kycSubmissions.map((userData, index) => (
                          <tr key={userData._id} style={{
                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                          }}>
                            <td style={{
                              padding: '0.75rem',
                              borderBottom: '1px solid #e5e7eb'
                            }}>
                              <div>
                                <div style={{ fontWeight: '600' }}>
                                  {userData.firstName} {userData.lastName}
                                </div>
                                <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                                  {userData.email}
                                </div>
                              </div>
                            </td>
                            <td style={{
                              padding: '0.75rem',
                              borderBottom: '1px solid #e5e7eb'
                            }}>
                              <span style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.25rem',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                backgroundColor: 
                                  userData.kycStatus === 'approved' ? '#dcfce7' :
                                  userData.kycStatus === 'rejected' ? '#fef2f2' :
                                  '#fef3c7',
                                color: 
                                  userData.kycStatus === 'approved' ? '#166534' :
                                  userData.kycStatus === 'rejected' ? '#dc2626' :
                                  '#d97706'
                              }}>
                                {userData.kycStatus === 'approved' ? 'Approved' :
                                 userData.kycStatus === 'rejected' ? 'Rejected' :
                                 'Pending'}
                              </span>
                            </td>
                            <td style={{
                              padding: '0.75rem',
                              borderBottom: '1px solid #e5e7eb'
                            }}>
                              <button
                                onClick={() => handleViewKycDocument(userData._id)}
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  backgroundColor: '#3b82f6',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '0.25rem',
                                  fontSize: '0.75rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}
                              >
                                <Eye size={12} />
                                View
                              </button>
                            </td>
                            <td style={{
                              padding: '0.75rem',
                              borderBottom: '1px solid #e5e7eb',
                              color: '#6b7280',
                              fontSize: '0.75rem'
                            }}>
                              {userData.kycSubmittedAt ? 
                                new Date(userData.kycSubmittedAt).toLocaleDateString() : 
                                'N/A'}
                            </td>
                            <td style={{
                              padding: '0.75rem',
                              borderBottom: '1px solid #e5e7eb'
                            }}>
                              {userData.kycStatus === 'pending' && (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button
                                    onClick={() => handleKycApproval(userData._id, 'approve')}
                                    style={{
                                      padding: '0.25rem 0.5rem',
                                      backgroundColor: '#10b981',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '0.25rem',
                                      fontSize: '0.75rem',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.25rem'
                                    }}
                                  >
                                    <CheckCircle size={12} />
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleKycApproval(userData._id, 'reject')}
                                    style={{
                                      padding: '0.25rem 0.5rem',
                                      backgroundColor: '#ef4444',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '0.25rem',
                                      fontSize: '0.75rem',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.25rem'
                                    }}
                                  >
                                    <XCircle size={12} />
                                    Reject
                                  </button>
                                </div>
                              )}
                              {userData.kycStatus === 'approved' && (
                                <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: '600' }}>
                                  Approved
                                </span>
                              )}
                              {userData.kycStatus === 'rejected' && (
                                <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: '600' }}>
                                  Rejected
                                </span>
                              )}
                            </td>
                          </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'deposits' && (
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '1rem'
                  }}>
                    Deposit Management
                  </h3>
                  
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '0.875rem'
                    }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f9fafb' }}>
                          <th style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            borderBottom: '1px solid #e5e7eb'
                          }}>User</th>
                          <th style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            borderBottom: '1px solid #e5e7eb'
                          }}>Amount</th>
                          <th style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            borderBottom: '1px solid #e5e7eb'
                          }}>Method</th>
                          <th style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            borderBottom: '1px solid #e5e7eb'
                          }}>Status</th>
                          <th style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            borderBottom: '1px solid #e5e7eb'
                          }}>Date</th>
                          <th style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            borderBottom: '1px solid #e5e7eb'
                          }}>Screenshot</th>
                          <th style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            borderBottom: '1px solid #e5e7eb'
                          }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deposits.map((deposit, index) => (
                          <tr key={deposit._id} style={{
                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                          }}>
                            <td style={{
                              padding: '0.75rem',
                              borderBottom: '1px solid #e5e7eb'
                            }}>
                              {deposit.userId?.firstName} {deposit.userId?.lastName}
                              <br />
                              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                {deposit.userId?.email}
                              </span>
                            </td>
                            <td style={{
                              padding: '0.75rem',
                              borderBottom: '1px solid #e5e7eb',
                              fontWeight: '600',
                              color: '#111827'
                            }}>
                              ${deposit.amount}
                            </td>
                            <td style={{
                              padding: '0.75rem',
                              borderBottom: '1px solid #e5e7eb'
                            }}>
                              {deposit.paymentMethod}
                            </td>
                            <td style={{
                              padding: '0.75rem',
                              borderBottom: '1px solid #e5e7eb'
                            }}>
                              <span style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.25rem',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                backgroundColor: deposit.status === 'confirmed' ? '#dcfce7' : 
                                                deposit.status === 'pending' ? '#fef3c7' : '#fee2e2',
                                color: deposit.status === 'confirmed' ? '#166534' : 
                                       deposit.status === 'pending' ? '#92400e' : '#dc2626'
                              }}>
                                {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                              </span>
                            </td>
                            <td style={{
                              padding: '0.75rem',
                              borderBottom: '1px solid #e5e7eb',
                              color: '#6b7280'
                            }}>
                              {new Date(deposit.createdAt).toLocaleDateString()}
                            </td>
                            <td style={{
                              padding: '0.75rem',
                              borderBottom: '1px solid #e5e7eb'
                            }}>
                              {deposit.screenshotPath ? (
                                <button
                                  onClick={() => handleViewDepositScreenshot(deposit)}
                                  style={{
                                    padding: '0.25rem 0.5rem',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.25rem',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                  }}
                                >
                                  <Eye style={{ width: '0.75rem', height: '0.75rem' }} />
                                  View
                                </button>
                              ) : (
                                <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                                  No screenshot
                                </span>
                              )}
                            </td>
                            <td style={{
                              padding: '0.75rem',
                              borderBottom: '1px solid #e5e7eb'
                            }}>
                              {deposit.status === 'pending' && (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button
                                    onClick={() => {
                                      const notes = prompt('Please provide notes for approval:');
                                      if (notes) handleDepositAction(deposit._id, 'approve', notes);
                                    }}
                                    style={{
                                      padding: '0.25rem 0.5rem',
                                      backgroundColor: '#10b981',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '0.25rem',
                                      fontSize: '0.75rem',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.25rem'
                                    }}
                                  >
                                    <CheckCircle style={{ width: '0.75rem', height: '0.75rem' }} />
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => {
                                      const notes = prompt('Please provide notes for rejection:');
                                      if (notes) handleDepositAction(deposit._id, 'reject', notes);
                                    }}
                                    style={{
                                      padding: '0.25rem 0.5rem',
                                      backgroundColor: '#ef4444',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '0.25rem',
                                      fontSize: '0.75rem',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.25rem'
                                    }}
                                  >
                                    <XCircle style={{ width: '0.75rem', height: '0.75rem' }} />
                                    Reject
                                  </button>
                                </div>
                              )}
                              {deposit.status !== 'pending' && (
                                <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                                  {deposit.adminNotes && (
                                    <span style={{ fontSize: '0.75rem', fontStyle: 'italic' }}>
                                      {deposit.adminNotes}
                                    </span>
                                  )}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'withdrawals' && (
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '1rem'
                  }}>
                    Withdrawal Management
                  </h3>
                  
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '0.875rem'
                    }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f9fafb' }}>
                          <th style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            borderBottom: '1px solid #e5e7eb'
                          }}>User</th>
                          <th style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            borderBottom: '1px solid #e5e7eb'
                          }}>Requested</th>
                          <th style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            borderBottom: '1px solid #e5e7eb'
                          }}>Service Charge</th>
                          <th style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            borderBottom: '1px solid #e5e7eb'
                          }}>Net Amount</th>
                          <th style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            borderBottom: '1px solid #e5e7eb'
                          }}>Method & Address</th>
                          <th style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            borderBottom: '1px solid #e5e7eb'
                          }}>Status</th>
                          <th style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            borderBottom: '1px solid #e5e7eb'
                          }}>Date</th>
                          <th style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            borderBottom: '1px solid #e5e7eb'
                          }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {withdrawals.length === 0 ? (
                          <tr>
                            <td colSpan="8" style={{
                              padding: '2rem',
                              textAlign: 'center',
                              color: '#6b7280'
                            }}>
                              No withdrawal requests found
                            </td>
                          </tr>
                        ) : (
                          withdrawals.map((withdrawal, index) => (
                            <tr key={withdrawal._id} style={{
                              backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                            }}>
                              <td style={{
                                padding: '0.75rem',
                                borderBottom: '1px solid #e5e7eb'
                              }}>
                                <div>
                                  <div style={{ fontWeight: '600' }}>
                                    {withdrawal.user?.name || 'Unknown User'}
                                  </div>
                                  <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                                    {withdrawal.user?.email || 'No email'}
                                  </div>
                                  <div style={{ color: '#3b82f6', fontSize: '0.75rem' }}>
                                    {withdrawal.user?.sponsorId || 'No ID'}
                                  </div>
                                </div>
                              </td>
                              <td style={{
                                padding: '0.75rem',
                                borderBottom: '1px solid #e5e7eb',
                                fontWeight: '600',
                                color: '#111827'
                              }}>
                                ${withdrawal.requestedAmount}
                              </td>
                              <td style={{
                                padding: '0.75rem',
                                borderBottom: '1px solid #e5e7eb',
                                color: '#ef4444',
                                fontWeight: '500'
                              }}>
                                -${withdrawal.serviceCharge}
                              </td>
                              <td style={{
                                padding: '0.75rem',
                                borderBottom: '1px solid #e5e7eb',
                                fontWeight: '600',
                                color: '#059669'
                              }}>
                                ${withdrawal.netAmount || withdrawal.amount}
                              </td>
                              <td style={{
                                padding: '0.75rem',
                                borderBottom: '1px solid #e5e7eb'
                              }}>
                                <div>
                                  <div style={{ fontWeight: '500' }}>
                                    {withdrawal.method}
                                  </div>
                                  <div style={{ 
                                    color: '#6b7280', 
                                    fontSize: '0.75rem',
                                    wordBreak: 'break-all'
                                  }}>
                                    {withdrawal.walletAddress}
                                  </div>
                                </div>
                              </td>
                              <td style={{
                                padding: '0.75rem',
                                borderBottom: '1px solid #e5e7eb'
                              }}>
                                <span style={{
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '0.25rem',
                                  fontSize: '0.75rem',
                                  fontWeight: '600',
                                  backgroundColor: 
                                    withdrawal.status === 'approved' ? '#dcfce7' :
                                    withdrawal.status === 'rejected' ? '#fef2f2' :
                                    withdrawal.status === 'pending_admin' ? '#fef3c7' :
                                    '#f3f4f6',
                                  color: 
                                    withdrawal.status === 'approved' ? '#166534' :
                                    withdrawal.status === 'rejected' ? '#dc2626' :
                                    withdrawal.status === 'pending_admin' ? '#d97706' :
                                    '#6b7280'
                                }}>
                                  {withdrawal.status === 'approved' ? 'Approved' :
                                   withdrawal.status === 'rejected' ? 'Rejected' :
                                   withdrawal.status === 'pending_admin' ? 'Pending Admin' :
                                   withdrawal.status === 'pending_otp' ? 'Awaiting OTP' :
                                   'Unknown'}
                                </span>
                                {withdrawal.otpVerified && (
                                  <div style={{ 
                                    fontSize: '0.75rem', 
                                    color: '#059669', 
                                    marginTop: '0.25rem' 
                                  }}>
                                    OTP Verified
                                  </div>
                                )}
                              </td>
                              <td style={{
                                padding: '0.75rem',
                                borderBottom: '1px solid #e5e7eb',
                                color: '#6b7280',
                                fontSize: '0.75rem'
                              }}>
                                <div>
                                  {new Date(withdrawal.createdAt).toLocaleDateString()}
                                </div>
                                <div>
                                  {new Date(withdrawal.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                              </td>
                              <td style={{
                                padding: '0.75rem',
                                borderBottom: '1px solid #e5e7eb'
                              }}>
                                {withdrawal.status === 'pending_admin' && (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <button
                                      onClick={() => {
                                        const notes = prompt('Enter approval notes:');
                                        if (notes) handleWithdrawalAction(withdrawal._id, 'approve', notes);
                                      }}
                                      style={{
                                        padding: '0.25rem 0.5rem',
                                        backgroundColor: '#10b981',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.25rem',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.25rem'
                                      }}
                                    >
                                      <CheckCircle size={12} />
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => {
                                        const notes = prompt('Enter rejection reason:');
                                        if (notes) handleWithdrawalAction(withdrawal._id, 'reject', notes);
                                      }}
                                      style={{
                                        padding: '0.25rem 0.5rem',
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.25rem',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.25rem'
                                      }}
                                    >
                                      <XCircle size={12} />
                                      Reject
                                    </button>
                                  </div>
                                )}
                                {withdrawal.status !== 'pending_admin' && (
                                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                    {withdrawal.adminNotes && (
                                      <div style={{
                                        backgroundColor: '#f9fafb',
                                        padding: '0.5rem',
                                        borderRadius: '0.25rem',
                                        maxWidth: '200px'
                                      }}>
                                        <strong>Notes:</strong><br />
                                        {withdrawal.adminNotes}
                                      </div>
                                    )}
                                    {withdrawal.adminActionBy && (
                                      <div style={{ marginTop: '0.25rem', fontSize: '0.75rem' }}>
                                        By: {withdrawal.adminActionBy.name}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'investments' && (
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '1rem'
                  }}>
                    Investment Tracking
                  </h3>
                  <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                    Investment tracking system coming soon...
                  </p>
                </div>
              )}

              {activeTab === 'engagement' && (
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '1rem'
                  }}>
                    User Engagement Analytics
                  </h3>
                  
                  {/* Search Section */}
                  <div style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '1rem'
                    }}>
                      Search User by Email or Mobile
                    </h4>
                    
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center'
                    }}>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <Search style={{
                          position: 'absolute',
                          left: '0.75rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '1rem',
                          height: '1rem',
                          color: '#6b7280'
                        }} />
                        <input
                          type="text"
                          placeholder="Enter email or mobile number..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                      </div>
                      <button
                        onClick={() => handleUserSearch(searchTerm)}
                        style={{
                          padding: '0.75rem 1.5rem',
                          backgroundColor: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#d97706'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#f59e0b'}
                      >
                        Search
                      </button>
                    </div>
                  </div>

                  {/* User History Display */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                    minHeight: '300px',
                    padding: '1.5rem'
                  }}>
                    {searchLoading ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
                        <div style={{
                          width: '2rem',
                          height: '2rem',
                          border: '2px solid #e5e7eb',
                          borderTop: '2px solid #f59e0b',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></div>
                      </div>
                    ) : userHistory ? (
                      <div>
                        {/* User Info */}
                        <div style={{
                          backgroundColor: '#f9fafb',
                          borderRadius: '0.5rem',
                          padding: '1rem',
                          marginBottom: '1.5rem',
                          border: '1px solid #e5e7eb'
                        }}>
                          <h4 style={{
                            fontSize: '1.125rem',
                            fontWeight: 'bold',
                            color: '#111827',
                            marginBottom: '0.5rem'
                          }}>
                            {userHistory.firstName} {userHistory.lastName}
                          </h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div>
                              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Email</p>
                              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                                {userHistory.email}
                              </p>
                            </div>
                            <div>
                              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Mobile</p>
                              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                                {userHistory.mobile || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Sponsor ID</p>
                              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#3b82f6', margin: 0 }}>
                                {userHistory.ownSponsorId}
                              </p>
                            </div>
                            <div>
                              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>DAS Status</p>
                              <span style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.25rem',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                backgroundColor: userHistory.isEnrolledInDas ? '#dcfce7' : '#f3f4f6',
                                color: userHistory.isEnrolledInDas ? '#166534' : '#6b7280'
                              }}>
                                {userHistory.isEnrolledInDas ? 'Enrolled' : 'Not Enrolled'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Income Summary Cards */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '1rem',
                          marginBottom: '1.5rem'
                        }}>
                          <div style={{
                            backgroundColor: '#f0f9ff',
                            borderRadius: '0.5rem',
                            padding: '1rem',
                            border: '1px solid #bae6fd'
                          }}>
                            <h5 style={{ fontSize: '0.875rem', color: '#0369a1', margin: '0 0 0.5rem 0' }}>FS Income</h5>
                            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                              ${userHistory.fsIncome || 0}
                            </p>
                          </div>
                          <div style={{
                            backgroundColor: '#f0fdf4',
                            borderRadius: '0.5rem',
                            padding: '1rem',
                            border: '1px solid #bbf7d0'
                          }}>
                            <h5 style={{ fontSize: '0.875rem', color: '#059669', margin: '0 0 0.5rem 0' }}>Smart Line Income</h5>
                            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                              ${userHistory.smartLineIncome || 0}
                            </p>
                          </div>
                          <div style={{
                            backgroundColor: '#fef7ff',
                            borderRadius: '0.5rem',
                            padding: '1rem',
                            border: '1px solid #e9d5ff'
                          }}>
                            <h5 style={{ fontSize: '0.875rem', color: '#7c3aed', margin: '0 0 0.5rem 0' }}>DRI Income</h5>
                            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                              ${userHistory.driIncome || 0}
                            </p>
                          </div>
                          <div style={{
                            backgroundColor: '#fffbeb',
                            borderRadius: '0.5rem',
                            padding: '1rem',
                            border: '1px solid #fed7aa'
                          }}>
                            <h5 style={{ fontSize: '0.875rem', color: '#d97706', margin: '0 0 0.5rem 0' }}>DAS Monthly Earnings</h5>
                            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                              ${userHistory.dasMonthlyEarnings || 0}
                            </p>
                          </div>
                        </div>

                        {/* Investment History */}
                        <div>
                          <h5 style={{
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: '#111827',
                            marginBottom: '1rem'
                          }}>
                            Investment History
                          </h5>
                          <div style={{
                            backgroundColor: '#f9fafb',
                            borderRadius: '0.5rem',
                            padding: '1rem',
                            textAlign: 'center'
                          }}>
                            <p style={{ color: '#6b7280', margin: 0 }}>
                              Total Investment Volume: <strong>${userHistory.totalInvestmentVolume || 0}</strong>
                            </p>
                            <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
                              Detailed investment history will be available once investment tracking is implemented.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '250px'
                      }}>
                        <div style={{ textAlign: 'center', color: '#6b7280' }}>
                          <FileText style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', opacity: 0.5 }} />
                          <p style={{ fontSize: '1rem', fontWeight: '500' }}>
                            Enter a user's email or mobile number to view their complete history
                          </p>
                          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                            View: Investment History • FS Income • Smart Line Income • DRI Income • DAS Status
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}