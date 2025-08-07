import { useState, useEffect } from 'react';

export default function AffiliateCalculator() {
  const [referralCount, setReferralCount] = useState(10);
  const [averageInvestment, setAverageInvestment] = useState(1000);
  const [commissionType, setCommissionType] = useState('dri');
  const [projectedCommission, setProjectedCommission] = useState(600);

  const commissionTypes = {
    dri: { name: "DRI Income (6%)", rate: 0.06 },
    level1: { name: "SmartLine Level 1 (1.5%)", rate: 0.015 },
    level2: { name: "SmartLine Level 2 (1.0%)", rate: 0.01 },
    level3: { name: "SmartLine Level 3 (0.75%)", rate: 0.0075 },
    level4: { name: "SmartLine Level 4 (0.50%)", rate: 0.005 },
    level5: { name: "SmartLine Level 5 (0.25%)", rate: 0.0025 }
  };

  const calculateCommission = () => {
    const selectedType = commissionTypes[commissionType];
    if (selectedType) {
      const commission = referralCount * averageInvestment * selectedType.rate;
      setProjectedCommission(commission);
    }
  };

  useEffect(() => {
    calculateCommission();
  }, [referralCount, averageInvestment, commissionType]);

  return (
    <div className="bg-dark-card p-8 rounded-2xl border border-gold/20">
      <h3 className="text-2xl font-bold text-gold mb-6 text-center">Affiliate Income Calculator</h3>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Number of Direct Referrals</label>
            <input 
              type="number" 
              value={referralCount}
              onChange={(e) => setReferralCount(Number(e.target.value) || 0)}
              className="w-full p-3 bg-dark-secondary border border-gray-600 rounded-lg text-white focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Average Investment Amount ($)</label>
            <input 
              type="number" 
              value={averageInvestment}
              onChange={(e) => setAverageInvestment(Number(e.target.value) || 0)}
              className="w-full p-3 bg-dark-secondary border border-gray-600 rounded-lg text-white focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Commission Type</label>
            <select 
              value={commissionType}
              onChange={(e) => setCommissionType(e.target.value)}
              className="w-full p-3 bg-dark-secondary border border-gray-600 rounded-lg text-white focus:border-gold focus:outline-none"
            >
              {Object.entries(commissionTypes).map(([key, type]) => (
                <option key={key} value={key}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="bg-dark-secondary p-6 rounded-lg border border-gold/20 text-center">
            <div className="text-sm text-gray-400 mb-2">Projected Commission</div>
            <div className="text-4xl font-bold text-gold mb-2">
              ${projectedCommission.toFixed(2)}
            </div>
            <div className="text-sm text-gray-400 mb-4">
              Based on {referralCount} referrals × ${averageInvestment} × {(commissionTypes[commissionType].rate * 100).toFixed(2)}%
            </div>
            <button 
              onClick={calculateCommission}
              className="px-6 py-2 bg-gradient-to-r from-gold to-gold-dark text-dark-bg font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Calculate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
