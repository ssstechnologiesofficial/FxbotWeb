import { useState, useEffect } from 'react';

export default function ROICalculator() {
  const [amount, setAmount] = useState(1000);
  const [plan, setPlan] = useState('fs');
  const [returns, setReturns] = useState(60);

  const plans = {
    fs: { name: "FS Income (6% Monthly)", rate: 0.06 },
    smart: { name: "SmartLine Income", rate: 0.015 },
    dri: { name: "Direct Referral Income", rate: 0.06 },
    das: { name: "Direct Achiever Salary", rate: 0.0 }
  };

  useEffect(() => {
    const selectedPlan = plans[plan];
    if (selectedPlan) {
      const calculatedReturns = amount * selectedPlan.rate;
      setReturns(calculatedReturns);
    }
  }, [amount, plan]);

  return (
    <div className="calc-container bg-card p-8 rounded-lg border w-full" style={{ 
      maxWidth: '28rem',
      backgroundColor: 'rgba(26, 26, 26, 0.8)',
      backdropFilter: 'blur(4px)',
      borderColor: 'rgba(255, 215, 0, 0.2)'
    }}>
      <h3 className="text-2xl font-bold text-gold mb-6 text-center">Live ROI Calculator</h3>
      <div className="calc-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label className="block text-sm font-medium mb-2">Investment Amount ($)</label>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            className="form-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Plan</label>
          <select 
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="form-input"
          >
            {Object.entries(plans).map(([key, planData]) => (
              <option key={key} value={key}>
                {planData.name}
              </option>
            ))}
          </select>
        </div>
        <div className="calc-results bg-secondary p-4 rounded border" style={{ 
          borderColor: 'rgba(255, 215, 0, 0.2)' 
        }}>
          <div className="text-center">
            <div className="text-sm text-muted">Monthly Returns</div>
            <div className="text-2xl font-bold text-gold">
              ${returns.toFixed(2)}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Based on {plans[plan].name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
