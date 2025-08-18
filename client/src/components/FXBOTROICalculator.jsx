import { useState } from 'react';
import { Calculator, DollarSign } from 'lucide-react';

export default function FXBOTROICalculator() {
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [selectedPlan, setSelectedPlan] = useState('fs-income');

  const calculateROI = () => {
    if (selectedPlan === 'fs-income') {
      return (investmentAmount * 0.06).toFixed(2);
    } else if (selectedPlan === 'dri-income') {
      return (investmentAmount * 0.06).toFixed(2);
    }
    return '0.00';
  };

  const plans = [
    { id: 'fs-income', name: 'FS Income (6% Monthly)', rate: '6%' },
    { id: 'smartline', name: 'SmartLine Income', rate: '1.5%' },
    { id: 'dri-income', name: 'DRI Income', rate: '6%' },
    { id: 'das-income', name: 'DAS Income', rate: 'Variable' }
  ];

  return (
    <div className="fxbot-card fxbot-card-gold w-full max-w-md bg-white">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-gold rounded-fxbot flex items-center justify-center shadow-fxbot-gold">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold fxbot-text-blue">Live ROI Calculator</h3>
          <p className="text-sm fxbot-text-secondary">Calculate your returns</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Investment Amount */}
        <div>
          <label className="fxbot-label">Investment Amount ($)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 fxbot-text-light" />
            <input
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(Number(e.target.value))}
              className="fxbot-input pl-10"
              min="250"
              step="50"
            />
          </div>
        </div>
        
        {/* Plan Selection */}
        <div>
          <label className="fxbot-label">Select Plan</label>
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="fxbot-input"
          >
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Results */}
        <div className="bg-gradient-blue rounded-fxbot p-6 text-white text-center">
          <p className="text-sm opacity-90 mb-2">Monthly Returns</p>
          <div className="text-3xl font-bold mb-1">
            ${calculateROI()}
          </div>
          <p className="text-xs opacity-80">
            Based on {plans.find(p => p.id === selectedPlan)?.name}
          </p>
        </div>
        
        {/* Plan Features */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="fxbot-text-secondary">Minimum Investment:</span>
            <span className="font-semibold fxbot-text-blue">$250</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="fxbot-text-secondary">Lock Period:</span>
            <span className="font-semibold fxbot-text-blue">6 months</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="fxbot-text-secondary">Payout:</span>
            <span className="font-semibold fxbot-text-blue">Monthly</span>
          </div>
        </div>
        
        {/* CTA */}
        <button className="w-full fxbot-btn fxbot-btn-primary">
          Start Investing Today
        </button>
      </div>
    </div>
  );
}