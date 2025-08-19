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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching countdown data:', error);
      setCountdownData({ isEnrolled: false });
      setLoading(false);
    }
  };

  const handleEnrollment = async () => {
    try {
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
        // Refresh countdown data after enrollment
        fetchCountdownData();
      } else {
        console.error('Failed to enroll in DAS program');
      }
    } catch (error) {
      console.error('Error enrolling in DAS:', error);
    }
  };

  const updateTimeLeft = () => {
    if (!countdownData) return;

    const now = new Date().getTime();
    const endDate = new Date(countdownData.startDate);
    endDate.setDate(endDate.getDate() + 90);
    
    const distance = endDate.getTime() - now;

    if (distance > 0) {
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    } else {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    }
  };

  const getTaskStatus = (task, daysRemaining) => {
    if (task.isCompleted) return 'completed';
    if (daysRemaining <= 0) return 'expired';
    return 'in-progress';
  };

  const getStatusBadge = (status) => {
    const labels = {
      completed: '✓ Completed',
      'in-progress': '⏳ In Progress',
      expired: '⚠ Expired'
    };
    
    return (
      <span style={{
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '600',
        border: '1px solid',
        backgroundColor: status === 'completed' ? '#dcfce7' : status === 'in-progress' ? '#dbeafe' : '#fee2e2',
        color: status === 'completed' ? '#166534' : status === 'in-progress' ? '#1e40af' : '#991b1b',
        borderColor: status === 'completed' ? '#bbf7d0' : status === 'in-progress' ? '#bfdbfe' : '#fecaca'
      }}>
        {labels[status]}
      </span>
    );
  };

  const TaskCard = ({ task, isActive, daysRemaining }) => {
    const referralProgress = (task.current.referrals / task.requirements.referrals) * 100;
    const volumeProgress = (task.current.volume / task.requirements.volume) * 100;
    const status = getTaskStatus(task, daysRemaining);
    
    return (
      <div style={{
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
              {task.current.referrals}/{task.requirements.referrals}
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
              ${task.current.volume.toLocaleString()}/${task.requirements.volume.toLocaleString()}
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
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{
          width: '2rem',
          height: '2rem',
          border: '2px solid #e5e7eb',
          borderTop: '2px solid #f59e0b',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  if (!countdownData?.isEnrolled) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: '#1f2937',
        borderRadius: '0.75rem',
        border: '1px solid #374151',
        color: 'white'
      }}>
        <Target style={{ margin: '0 auto 1rem auto', color: '#f59e0b', width: '3rem', height: '3rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'white' }}>
          Join DAS Income Program
        </h2>
        <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
          Enroll in our Direct Achievement System to start earning monthly rewards
        </p>
        <button 
          style={{
            backgroundColor: '#f59e0b',
            color: 'white',
            fontWeight: '600',
            padding: '0.75rem 2rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={handleEnrollment}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#d97706';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f59e0b';
          }}
        >
          Enroll Now
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Countdown Timer */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(234, 179, 8, 0.1))',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        border: '1px solid rgba(245, 158, 11, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Clock style={{ width: '1.5rem', height: '1.5rem', color: '#f59e0b' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            DAS Program Countdown
          </h2>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{timeLeft.days}</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Days</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{timeLeft.hours}</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Hours</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{timeLeft.minutes}</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Minutes</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{timeLeft.seconds}</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Seconds</div>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: '0.875rem', 
          color: '#6b7280' 
        }}>
          <span>Program started: {new Date(countdownData.startDate).toLocaleDateString()}</span>
          <span>{countdownData.daysRemaining} days remaining</span>
        </div>
      </div>

      {/* Task Progress */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
          Achievement Tasks
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {countdownData.progress?.map((task, index) => {
            const isActive = countdownData.daysElapsed >= (index * 30) && 
                           countdownData.daysElapsed < ((index + 1) * 30) && 
                           !task.isCompleted;
            
            return (
              <TaskCard 
                key={task.taskNumber} 
                task={task} 
                isActive={isActive}
                daysRemaining={countdownData.daysRemaining}
              />
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div style={{
        backgroundColor: '#f8fafc',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        border: '1px solid #e5e7eb'
      }}>
        <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
          Program Summary
        </h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '1rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
              {countdownData.progress?.filter(task => task.isCompleted).length || 0}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Completed Tasks</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
              {countdownData.daysElapsed}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Days Elapsed</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>
              ${countdownData.progress?.reduce((sum, task) => task.isCompleted ? sum + task.monthlyReward : sum, 0) || 0}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Monthly Earnings</div>
          </div>
        </div>
      </div>
    </div>
  );
}