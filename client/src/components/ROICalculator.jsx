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
    <div className="bg-dark-card/80 backdrop-blur-sm p-8 rounded-2xl border border-gold/20 w-full max-w-md">
      <h3 className="text-2xl font-bold text-gold mb-6 text-center">Live ROI Calculator</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Investment Amount ($)</label>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            className="w-full p-3 bg-dark-secondary border border-gray-600 rounded-lg text-white focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Plan</label>
          <select 
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="w-full p-3 bg-dark-secondary border border-gray-600 rounded-lg text-white focus:border-gold focus:outline-none"
          >
            {Object.entries(plans).map(([key, planData]) => (
              <option key={key} value={key}>
                {planData.name}
              </option>
            ))}
          </select>
        </div>
        <div className="bg-dark-secondary p-4 rounded-lg border border-gold/20">
          <div className="text-center">
            <div className="text-sm text-gray-400">Monthly Returns</div>
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
