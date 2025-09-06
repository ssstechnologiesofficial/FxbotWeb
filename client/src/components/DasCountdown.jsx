import { useState, useEffect } from 'react';
import { Clock, Target, DollarSign, Users, TrendingUp } from 'lucide-react';

// Add CSS animation styles
const pulseKeyframes = `
  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(255, 215, 0, 0.6);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
    }
  }
`;

// Insert CSS into document head if not already present
if (typeof document !== 'undefined' && !document.querySelector('#das-pulse-animation')) {
  const style = document.createElement('style');
  style.id = 'das-pulse-animation';
  style.textContent = pulseKeyframes;
  document.head.appendChild(style);
}

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

  const handleEnrollment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/das/enroll', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('DAS enrollment successful:', data.message);
        
        // Refresh countdown data to show enrolled state
        await fetchCountdownData();
      } else {
        const errorData = await response.json();
        console.error('DAS enrollment failed:', errorData.error);
        alert(errorData.error || 'Failed to enroll in DAS program. Please try again.');
      }
    } catch (error) {
      console.error('Error enrolling in DAS:', error);
      alert('Network error. Please check your connection and try again.');
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
    
    // Check if task has expired based on its specific deadline
    const taskDeadlines = { 1: 30, 2: 60, 3: 90 };
    const taskDeadline = taskDeadlines[task.taskNumber];
    const daysElapsed = 90 - daysRemaining; // Days since enrollment
    
    if (daysElapsed > taskDeadline) return 'expired';
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

  // Achievement Badge Component
  const getAchievementBadge = (taskNumber, isCompleted) => {
    if (!isCompleted) return null;
    
    const badgeConfigs = {
      1: { 
        icon: '🏆', 
        title: 'Bronze Achiever',
        gradient: 'linear-gradient(135deg, #CD7F32, #E6B077)',
        shadowColor: 'rgba(205, 127, 50, 0.3)'
      },
      2: { 
        icon: '⭐', 
        title: 'Silver Achiever',
        gradient: 'linear-gradient(135deg, #C0C0C0, #E8E8E8)',
        shadowColor: 'rgba(192, 192, 192, 0.4)'
      },
      3: { 
        icon: '👑', 
        title: 'Gold Achiever',
        gradient: 'linear-gradient(135deg, #FFD700, #FFF700)',
        shadowColor: 'rgba(255, 215, 0, 0.4)'
      }
    };

    const config = badgeConfigs[taskNumber];
    
    return (
      <div style={{
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        width: '48px',
        height: '48px',
        background: config.gradient,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 4px 12px ${config.shadowColor}`,
        border: '2px solid white',
        fontSize: '18px',
        animation: 'pulse 2s infinite',
        zIndex: 10
      }}
      title={`${config.title} - Task ${taskNumber} Completed!`}
      >
        {config.icon}
      </div>
    );
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
        <p style={{ color: '#6b7280', margin: '0 0 1.5rem 0' }}>
          Enroll in the DAS program to start earning monthly rewards.
        </p>
        <button
          onClick={handleEnrollment}
          disabled={loading}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.75rem 1.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#2563eb';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#3b82f6';
            }
          }}
          data-testid="button-enroll-das"
        >
          {loading ? 'Enrolling...' : 'Enroll Now'}
        </button>
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
                position: 'relative',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '2px solid',
                borderColor: status === 'completed' ? '#22c55e' : status === 'expired' ? '#ef4444' : '#e5e7eb',
                backgroundColor: status === 'completed' ? '#f0fdf4' : status === 'expired' ? '#f5f5f5' : '#ffffff',
                transition: 'all 0.3s ease',
                opacity: status === 'expired' ? 0.5 : 1,
                filter: status === 'expired' ? 'grayscale(50%)' : 'none'
              }}>
                {/* Achievement Badge */}
                {getAchievementBadge(task.taskNumber, task.isCompleted)}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: 'bold', 
                    color: status === 'expired' ? '#9ca3af' : '#111827', 
                    margin: 0,
                    textDecoration: status === 'expired' ? 'line-through' : 'none'
                  }}>
                    Task {task.taskNumber} {status === 'expired' && '(EXPIRED)'}
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