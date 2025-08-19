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
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeposits: 0,
    pendingDeposits: 0,
    totalVolume: 0
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
        const [usersResponse, depositsResponse] = await Promise.all([
          axios.get('/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/admin/deposits', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setUsers(usersResponse.data);
        setDeposits(depositsResponse.data);

        // Calculate stats
        const totalDeposits = depositsResponse.data.length;
        const pendingDeposits = depositsResponse.data.filter(d => d.status === 'pending').length;
        const totalVolume = depositsResponse.data
          .filter(d => d.status === 'confirmed')
          .reduce((sum, d) => sum + d.amount, 0);

        setStats({
          totalUsers: usersResponse.data.length,
          totalDeposits,
          pendingDeposits,
          totalVolume
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

  const handleDepositAction = async (depositId, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/admin/deposits/${depositId}/${action}`, {}, {
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

    } catch (error) {
      console.error('Error updating deposit:', error);
      alert('Error updating deposit status');
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

          {/* Tabs */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <button
                onClick={() => setActiveTab('overview')}
                style={{
                  padding: '1rem 1.5rem',
                  backgroundColor: activeTab === 'overview' ? '#f59e0b' : 'transparent',
                  color: activeTab === 'overview' ? 'white' : '#6b7280',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('deposits')}
                style={{
                  padding: '1rem 1.5rem',
                  backgroundColor: activeTab === 'deposits' ? '#f59e0b' : 'transparent',
                  color: activeTab === 'deposits' ? 'white' : '#6b7280',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Deposits
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {activeTab === 'overview' && (
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
                        {users.map((userData, index) => (
                          <tr key={userData._id} style={{
                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                          }}>
                            <td style={{
                              padding: '0.75rem',
                              borderBottom: '1px solid #e5e7eb'
                            }}>
                              {userData.firstName} {userData.lastName}
                            </td>
                            <td style={{
                              padding: '0.75rem',
                              borderBottom: '1px solid #e5e7eb'
                            }}>
                              {userData.email}
                            </td>
                            <td style={{
                              padding: '0.75rem',
                              borderBottom: '1px solid #e5e7eb',
                              fontFamily: 'monospace',
                              color: '#3b82f6'
                            }}>
                              {userData.ownSponsorId}
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
                              {new Date(userData.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
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
                              {deposit.status === 'pending' && (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button
                                    onClick={() => handleDepositAction(deposit._id, 'approve')}
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
                                    onClick={() => handleDepositAction(deposit._id, 'reject')}
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
                                  No actions
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}