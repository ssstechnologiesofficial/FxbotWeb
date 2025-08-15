import AffiliateCalculator from './AffiliateCalculator';

export default function InvestmentPackages() {
  const packages = [
    {
      name: "FS Income (FixSix)",
      badge: "6% Monthly",
      color: "gold",
      details: {
        minimum: "$250",
        return: "6% Monthly until 2x",
        duration: "~17 months",
        payout: "Monthly"
      },
      description: "Earn a fixed 6% monthly return on your invested capital until your investment doubles (2x). Backed by company reserves and trading profits.",
      buttonClass: "bg-gradient-to-r from-gold to-gold-dark text-dark-bg"
    },
    {
      name: "SmartLine Income",
      badge: "5 Levels",
      color: "blue-custom",
      levels: [
        { level: 1, percentage: "1.5%" },
        { level: 2, percentage: "1.0%" },
        { level: 3, percentage: "0.75%" },
        { level: 4, percentage: "0.50%" },
        { level: 5, percentage: "0.25%" }
      ],
      description: "Multi-level affiliate income distribution plan to reward partners for expanding our investor community across 5 levels.",
      buttonClass: "bg-gradient-to-r from-blue-custom to-blue-dark text-white"
    },
    {
      name: "DRI Income",
      badge: "6% Direct",
      color: "green-400",
      details: {
        commission: "6% Direct Referral",
        frequency: "Every Investment",
        cap: "Unlimited"
      },
      example: "$1,000 referral = $60 commission",
      description: "Earn 6% commission on every investment made by your direct referrals. Commission credited for each new investment, no limit on referrals.",
      buttonClass: "bg-gradient-to-r from-green-400 to-green-500 text-white"
    },
    {
      name: "DAS Income",
      badge: "Monthly Salary",
      color: "purple-400",
      tiers: [
        { name: "Tier 1", amount: "$100/month", requirements: "5 referrals, $10K volume, 30 days" },
        { name: "Tier 2", amount: "$300/month", requirements: "10 referrals, $20K volume, 60 days" },
        { name: "Tier 3", amount: "$1000/month", requirements: "15 referrals, $50K volume, 90 days" }
      ],
      description: "Monthly salary income based on direct referral performance and business generation. Fixed rewards for committed promoters.",
      buttonClass: "bg-gradient-to-r from-purple-400 to-purple-500 text-white"
    }
  ];

  return (
    <section id="packages" className="section">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Investment <span className="text-gold">Packages</span></h2>
          <p className="text-xl text-secondary">Diversified Forex investment plans tailored to different risk profiles</p>
        </div>
        
        {/* Package Grid */}
        <div className="grid grid-cols-1 gap-8 mb-16 package-grid">
          {packages.map((pkg, index) => (
            <div 
              key={index}
              className="package-card animate-fadeIn"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                borderColor: pkg.color === 'gold' ? 'rgba(255, 215, 0, 0.2)' : 
                            pkg.color === 'blue-custom' ? 'rgba(59, 130, 246, 0.2)' :
                            pkg.color === 'green-400' ? 'rgba(34, 197, 94, 0.2)' :
                            'rgba(168, 85, 247, 0.2)'
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" style={{
                  color: pkg.color === 'gold' ? 'var(--primary-gold)' : 
                        pkg.color === 'blue-custom' ? '#3b82f6' :
                        pkg.color === 'green-400' ? '#22c55e' :
                        '#a855f7'
                }}>{pkg.name}</h3>
                <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{
                  backgroundColor: pkg.color === 'gold' ? 'rgba(255, 215, 0, 0.1)' : 
                                  pkg.color === 'blue-custom' ? 'rgba(59, 130, 246, 0.1)' :
                                  pkg.color === 'green-400' ? 'rgba(34, 197, 94, 0.1)' :
                                  'rgba(168, 85, 247, 0.1)',
                  color: pkg.color === 'gold' ? 'var(--primary-gold)' : 
                        pkg.color === 'blue-custom' ? '#3b82f6' :
                        pkg.color === 'green-400' ? '#22c55e' :
                        '#a855f7'
                }}>
                  {pkg.badge}
                </span>
              </div>
              
              <div className="package-details mb-6" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pkg.details && Object.entries(pkg.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-secondary capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="font-semibold" style={{
                      color: key === 'return' && pkg.color === 'gold' ? 'var(--primary-gold)' : 'inherit'
                    }}>{value}</span>
                  </div>
                ))}
                
                {pkg.levels && pkg.levels.map((level) => (
                  <div key={level.level} className="flex justify-between">
                    <span className="text-secondary">Level {level.level}:</span>
                    <span className="font-semibold" style={{
                      color: level.level === 1 && pkg.color === 'blue-custom' ? '#3b82f6' : 'inherit'
                    }}>
                      {level.percentage}
                    </span>
                  </div>
                ))}
                
                {pkg.tiers && pkg.tiers.map((tier, tierIndex) => (
                  <div key={tierIndex} className="p-3 rounded" style={{
                    backgroundColor: pkg.color === 'purple-400' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(255, 255, 255, 0.05)'
                  }}>
                    <div className="font-semibold" style={{
                      color: pkg.color === 'purple-400' ? '#a855f7' : 'var(--primary-gold)'
                    }}>{tier.name}: {tier.amount}</div>
                    <div className="text-sm text-secondary">{tier.requirements}</div>
                  </div>
                ))}
                
                {pkg.example && (
                  <div className="p-3 rounded" style={{
                    backgroundColor: pkg.color === 'green-400' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)'
                  }}>
                    <div className="text-sm text-secondary">Example:</div>
                    <div className="font-semibold" style={{
                      color: pkg.color === 'green-400' ? '#22c55e' : 'var(--primary-gold)'
                    }}>{pkg.example}</div>
                  </div>
                )}
              </div>
              
              <p className="text-secondary mb-6">{pkg.description}</p>
              
              <button className="btn w-full font-semibold" style={{
                background: pkg.color === 'gold' ? 'linear-gradient(135deg, var(--primary-gold), var(--hover-gold))' :
                           pkg.color === 'blue-custom' ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' :
                           pkg.color === 'green-400' ? 'linear-gradient(135deg, #22c55e, #16a34a)' :
                           'linear-gradient(135deg, #a855f7, #7c3aed)',
                color: pkg.color === 'gold' ? 'var(--dark-bg)' : 'white'
              }}>
                Choose Plan
              </button>
            </div>
          ))}
        </div>

        {/* Re-Top-Up Rule Note */}
        <div className="card p-6 mb-8" style={{ borderColor: 'rgba(255, 215, 0, 0.2)' }}>
          <h3 className="text-xl font-bold text-gold mb-4">Important Notice</h3>
          <div className="notice-content text-secondary" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p><strong>Re-Top-Up Rule:</strong> When a user's investment package reaches 2x returns (full payout completed), they must re-top-up their account with a minimum of $250 to continue receiving future ROI payouts and stay eligible for referral rewards.</p>
            <p><strong>Lock Period:</strong> All packages are locked for a minimum of 6 months to ensure optimal trading strategies.</p>
          </div>
        </div>

        {/* Affiliate Income Calculator */}
        <AffiliateCalculator />
      </div>
    </section>
  );
}
