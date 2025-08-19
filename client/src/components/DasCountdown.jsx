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
    fetchCountdownData();
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
      const response = await fetch(`/api/das/countdown/${userId}`);
      const data = await response.json();
      setCountdownData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching countdown data:', error);
      setLoading(false);
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

  const TaskCard = ({ task, isActive }) => {
    const referralProgress = (task.current.referrals / task.requirements.referrals) * 100;
    const volumeProgress = (task.current.volume / task.requirements.volume) * 100;
    
    return (
      <div className={`p-6 rounded-xl border transition-all duration-300 ${
        isActive 
          ? 'border-gold bg-gradient-to-br from-gold/5 to-gold/10' 
          : task.isCompleted 
            ? 'border-green-500/30 bg-green-500/5'
            : 'border-gray-700 bg-gray-800/50'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Task {task.taskNumber}</h3>
          <div className="flex items-center gap-2">
            {task.isCompleted ? (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                Completed
              </span>
            ) : task.canComplete ? (
              <span className="px-3 py-1 bg-gold/20 text-gold rounded-full text-sm">
                Can Complete
              </span>
            ) : (
              <span className="px-3 py-1 bg-gray-600/20 text-gray-400 rounded-full text-sm">
                In Progress
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Referrals Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gold" />
                <span className="text-sm text-gray-300">Referrals</span>
              </div>
              <span className="text-sm font-semibold">
                {task.current.referrals}/{task.requirements.referrals}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-gold to-yellow-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, referralProgress)}%` }}
              ></div>
            </div>
          </div>

          {/* Volume Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gold" />
                <span className="text-sm text-gray-300">Volume</span>
              </div>
              <span className="text-sm font-semibold">
                ${task.current.volume.toLocaleString()}/${task.requirements.volume.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, volumeProgress)}%` }}
              ></div>
            </div>
          </div>

          {/* Reward */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-700">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">Monthly Reward</span>
            </div>
            <span className="text-lg font-bold text-green-400">
              ${task.monthlyReward}/month
            </span>
          </div>

          {/* Days requirement */}
          <div className="text-center text-sm text-gray-400">
            Complete within {task.requirements.days} days
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!countdownData?.isEnrolled) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-8 text-center border border-gray-700">
        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-gold" />
        </div>
        <h3 className="text-xl font-bold mb-2">Join DAS Income Program</h3>
        <p className="text-gray-400 mb-6">
          Enroll in our Direct Achievement System to start earning monthly rewards
        </p>
        <button 
          onClick={() => enrollInDas()}
          className="btn btn-primary"
        >
          Enroll Now
        </button>
      </div>
    );
  }

  const enrollInDas = async () => {
    try {
      const response = await fetch('/api/das/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      if (response.ok) {
        fetchCountdownData();
      }
    } catch (error) {
      console.error('Error enrolling in DAS:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Countdown Timer */}
      <div className="bg-gradient-to-r from-gold/10 to-yellow-500/10 rounded-xl p-6 border border-gold/20">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6 text-gold" />
          <h2 className="text-2xl font-bold">DAS Program Countdown</h2>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gold">{timeLeft.days}</div>
            <div className="text-sm text-gray-400">Days</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gold">{timeLeft.hours}</div>
            <div className="text-sm text-gray-400">Hours</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gold">{timeLeft.minutes}</div>
            <div className="text-sm text-gray-400">Minutes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gold">{timeLeft.seconds}</div>
            <div className="text-sm text-gray-400">Seconds</div>
          </div>
        </div>

        <div className="mt-4 flex justify-between text-sm text-gray-400">
          <span>Program started: {new Date(countdownData.startDate).toLocaleDateString()}</span>
          <span>{countdownData.daysRemaining} days remaining</span>
        </div>
      </div>

      {/* Task Progress */}
      <div>
        <h3 className="text-xl font-bold mb-4">Achievement Tasks</h3>
        <div className="grid gap-6">
          {countdownData.progress?.map((task, index) => {
            const isActive = countdownData.daysElapsed >= (index * 30) && 
                           countdownData.daysElapsed < ((index + 1) * 30) && 
                           !task.isCompleted;
            
            return (
              <TaskCard 
                key={task.taskNumber} 
                task={task} 
                isActive={isActive}
              />
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-4">Progress Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gold">
              {countdownData.progress?.filter(t => t.isCompleted).length || 0}
            </div>
            <div className="text-sm text-gray-400">Tasks Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              ${countdownData.progress?.filter(t => t.isCompleted).reduce((sum, t) => sum + t.monthlyReward, 0) || 0}
            </div>
            <div className="text-sm text-gray-400">Monthly Earnings</div>
          </div>
        </div>
      </div>
    </div>
  );
}