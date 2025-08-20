import React, { useState, useEffect } from 'react';
import { Receipt, ArrowUpFromLine, ArrowDownToLine, TrendingUp, DollarSign, Wallet, Clock } from 'lucide-react';
import axios from 'axios';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, [page, filter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/user/transactions?page=${page}&filter=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTransactions(response.data.transactions);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit': return ArrowDownToLine;
      case 'withdrawal': return ArrowUpFromLine;
      case 'fs_income': return DollarSign;
      case 'dri_income': return TrendingUp;
      case 'smartline_income': return Wallet;
      case 'das_income': return Receipt;
      default: return Receipt;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'deposit': return '#10b981'; // green
      case 'withdrawal': return '#ef4444'; // red
      case 'fs_income': return '#f59e0b'; // amber
      case 'dri_income': return '#8b5cf6'; // purple
      case 'smartline_income': return '#06b6d4'; // cyan
      case 'das_income': return '#ec4899'; // pink
      default: return '#6b7280'; // gray
    }
  };

  const formatTransactionType = (type) => {
    switch (type) {
      case 'deposit': return 'Deposit';
      case 'withdrawal': return 'Withdrawal';
      case 'fs_income': return 'FS Income';
      case 'dri_income': return 'DRI Income';
      case 'smartline_income': return 'SmartLine Income';
      case 'das_income': return 'DAS Income';
      default: return type;
    }
  };

  if (loading && page === 1) {
    return (
      <div style={{ 
        padding: '2rem', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <div style={{ fontSize: '1.125rem', color: '#6b7280' }}>Loading transaction history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '2rem', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <div style={{ fontSize: '1.125rem', color: '#ef4444' }}>{error}</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: 'bold', 
          color: '#111827', 
          margin: '0 0 0.5rem 0' 
        }}>
          Transaction History
        </h1>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Complete log of all your investments and earnings
        </p>
      </div>

      {/* Filter Options */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        {['all', 'deposit', 'fs_income', 'dri_income', 'smartline_income', 'das_income', 'withdrawal'].map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              background: filter === filterType ? '#3b82f6' : 'white',
              color: filter === filterType ? 'white' : '#374151',
              fontSize: '0.875rem',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {filterType === 'all' ? 'All Transactions' : formatTransactionType(filterType)}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {transactions.length === 0 ? (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <Receipt size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p style={{ fontSize: '1.125rem', margin: 0 }}>No transactions found</p>
          </div>
        ) : (
          <div>
            {transactions.map((transaction) => {
              const IconComponent = getTransactionIcon(transaction.type);
              const color = getTransactionColor(transaction.type);
              
              return (
                <div
                  key={transaction._id}
                  style={{
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid #f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      backgroundColor: `${color}15`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconComponent size={20} style={{ color }} />
                    </div>
                    
                    <div>
                      <div style={{ 
                        fontWeight: '600', 
                        color: '#111827',
                        marginBottom: '0.25rem'
                      }}>
                        {formatTransactionType(transaction.type)}
                      </div>
                      <div style={{ 
                        fontSize: '0.875rem', 
                        color: '#6b7280',
                        marginBottom: '0.25rem'
                      }}>
                        {transaction.description}
                      </div>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: '#9ca3af',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <Clock size={12} />
                        {new Date(transaction.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '1.125rem',
                      fontWeight: 'bold',
                      color: transaction.type === 'withdrawal' ? '#ef4444' : '#10b981',
                      marginBottom: '0.25rem'
                    }}>
                      {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount.toFixed(2)}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: transaction.status === 'completed' ? '#10b981' : 
                             transaction.status === 'pending' ? '#f59e0b' : '#ef4444',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {transaction.status}
                    </div>
                    {transaction.referralLevel && (
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginTop: '0.125rem'
                      }}>
                        Level {transaction.referralLevel}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              background: page === 1 ? '#f9fafb' : 'white',
              color: page === 1 ? '#9ca3af' : '#374151',
              cursor: page === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          
          <span style={{ color: '#6b7280' }}>
            Page {page} of {totalPages}
          </span>
          
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              background: page === totalPages ? '#f9fafb' : 'white',
              color: page === totalPages ? '#9ca3af' : '#374151',
              cursor: page === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;