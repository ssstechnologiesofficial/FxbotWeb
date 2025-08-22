import { useState, useEffect } from 'react';
import { Clock, Target, DollarSign, Users, TrendingUp } from 'lucide-react';

export default function DasCountdown({ userId }) {
  const [countdownData, setCountdownData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (userId) {
      fetchCountdownData();
    }
  }, [userId]);

  useEffect(() => {
    if (!countdownData?.isEnrolled) return;

    const timer = setInterval(() => {
      updateTimeLeft();
    }, 1000);

    return () => clearInterval(timer);
  }, [countdownData]);

  const fetchCountdownData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/das/countdown/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCountdownData(data);
      } else {
        console.error('Failed to fetch countdown data');
        setCountdownData({ isEnrolled: false });
      }
    } catch (error) {
      console.error('Error fetching countdown data:', error);
      setCountdownData({ isEnrolled: false });
    } finally {
      setLoading(false);
    }
  };

  const updateTimeLeft = () => {
    if (!countdownData?.isEnrolled || !countdownData.startDate) return;

    const now = new Date().getTime();
    const startDate = new Date(countdownData.startDate).getTime();
    const endDate = startDate + (90 * 24 * 60 * 60 * 1000); // 90 days from start
    const timeRemaining = Math.max(0, endDate - now);

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    setTimeLeft({ days, hours, minutes, seconds });
  };

  const getTaskStatus = (task, daysRemaining) => {
    if (task.isCompleted) return 'completed';
    if (daysRemaining <= 0) return 'expired';
    return 'in-progress';
  };

  const getStatusBadge = (status) => {
    const baseStyle = {
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500'
    };

    if (status === 'completed') {
      return (
        <span style={{
          ...baseStyle,
          backgroundColor: '#dcfce7',
          color: '#166534'
        }}>
          Completed
        </span>
      );
    } else if (status === 'expired') {
      return (
        <span style={{
          ...baseStyle,
          backgroundColor: '#fee2e2',
          color: '#991b1b'
        }}>
          Expired
        </span>
      );
    } else {
      return (
        <span style={{
          ...baseStyle,
          backgroundColor: '#fef3c7',
          color: '#92400e'
        }}>
          In Progress
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{
          width: '2rem',
          height: '2rem',
          border: '2px solid #e5e7eb',
          borderTop: '2px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}></div>
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading DAS countdown...</p>
      </div>
    );
  }

  if (!countdownData?.isEnrolled) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: '0.75rem',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.5rem 0' }}>
          DAS Program Not Active
        </h3>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Enroll in the DAS program to start earning monthly rewards.
        </p>
      </div>
    );
  }

  const daysRemaining = Math.max(0, timeLeft.days);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Clock style={{ width: '1.5rem', height: '1.5rem', color: '#f59e0b' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
          DAS Program Countdown
        </h2>
      </div>

      {/* Countdown Timer */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        marginBottom: '2rem',
        padding: '1.5rem',
        backgroundColor: '#fef3c7',
        borderRadius: '0.75rem',
        border: '1px solid #fcd34d'
      }}>
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hours', value: timeLeft.hours },
          { label: 'Minutes', value: timeLeft.minutes },
          { label: 'Seconds', value: timeLeft.seconds }
        ].map((item, index) => (
          <div key={index} style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#92400e',
              lineHeight: 1
            }}>
              {item.value.toString().padStart(2, '0')}
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#92400e',
              marginTop: '0.25rem'
            }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.5rem'
      }}>
        <span style={{ fontSize: '0.875rem', color: '#374151' }}>
          Program started: {new Date(countdownData.startDate).toLocaleDateString()}
        </span>
        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
          {daysRemaining} days remaining
        </span>
      </div>

      {/* Achievement Tasks */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
          Achievement Tasks
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {countdownData.progress?.map((task, index) => {
            const referralProgress = (task.current.referrals / task.requirements.referrals) * 100;
            const volumeProgress = (task.current.volume / task.requirements.volume) * 100;
            const status = getTaskStatus(task, daysRemaining);
            
            return (
              <div key={index} style={{
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '2px solid',
                borderColor: status === 'completed' ? '#22c55e' : status === 'expired' ? '#ef4444' : '#e5e7eb',
                backgroundColor: status === 'completed' ? '#f0fdf4' : status === 'expired' ? '#fef2f2' : '#ffffff',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                    Task {task.taskNumber}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <DollarSign style={{ width: '1rem', height: '1rem', color: '#f59e0b' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#f59e0b' }}>
                      ${task.monthlyReward}/month
                    </span>
                  </div>
                  {getStatusBadge(status)}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Referrals</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                      {task.current.referrals || 0}/{task.requirements.referrals}
                    </span>
                  </div>
                  <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '0.5rem' }}>
                    <div 
                      style={{ 
                        backgroundColor: status === 'completed' ? '#22c55e' : status === 'expired' ? '#ef4444' : '#f59e0b',
                        height: '0.5rem', 
                        borderRadius: '9999px', 
                        transition: 'all 0.3s ease',
                        width: `${Math.min(referralProgress, 100)}%`
                      }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Volume</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                      ${(task.current.volume || 0).toLocaleString()}/${(task.requirements.volume/1000)}k
                    </span>
                  </div>
                  <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '0.5rem' }}>
                    <div 
                      style={{ 
                        backgroundColor: status === 'completed' ? '#22c55e' : status === 'expired' ? '#ef4444' : '#f59e0b',
                        height: '0.5rem', 
                        borderRadius: '9999px', 
                        transition: 'all 0.3s ease',
                        width: `${Math.min(volumeProgress, 100)}%`
                      }}
                    />
                  </div>
                </div>
                
                {task.isCompleted && (
                  <div style={{ 
                    marginTop: '1rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    color: '#22c55e' 
                  }}>
                    <Target style={{ width: '1rem', height: '1rem' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Completed!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}