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
    <div className="card p-8" style={{ borderColor: 'rgba(255, 215, 0, 0.2)' }}>
      <h3 className="text-2xl font-bold text-gold mb-6 text-center">Affiliate Income Calculator</h3>
      <div className="grid grid-cols-1 gap-8 affiliate-grid">
        <div className="form-section" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Number of Direct Referrals</label>
            <input 
              type="number" 
              value={referralCount}
              onChange={(e) => setReferralCount(Number(e.target.value) || 0)}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Average Investment Amount ($)</label>
            <input 
              type="number" 
              value={averageInvestment}
              onChange={(e) => setAverageInvestment(Number(e.target.value) || 0)}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Commission Type</label>
            <select 
              value={commissionType}
              onChange={(e) => setCommissionType(e.target.value)}
              className="form-input"
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
          <div className="card p-6 text-center" style={{ 
            backgroundColor: 'var(--card-secondary)',
            borderColor: 'rgba(255, 215, 0, 0.2)'
          }}>
            <div className="text-sm text-secondary mb-2">Projected Commission</div>
            <div className="text-4xl font-bold text-gold mb-2">
              ${projectedCommission.toFixed(2)}
            </div>
            <div className="text-sm text-secondary mb-4">
              Based on {referralCount} referrals × ${averageInvestment} × {(commissionTypes[commissionType].rate * 100).toFixed(2)}%
            </div>
            <button 
              onClick={calculateCommission}
              className="btn"
              style={{
                padding: '0.5rem 1.5rem',
                background: 'linear-gradient(135deg, var(--primary-gold), var(--hover-gold))',
                color: 'var(--dark-bg)'
              }}
            >
              Calculate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
