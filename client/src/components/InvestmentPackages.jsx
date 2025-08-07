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
        { name: "Tier 1", amount: "$300/month", requirements: "10 referrals, $20K volume, 60 days" },
        { name: "Tier 2", amount: "$1,000/month", requirements: "15 referrals, $50K volume, 90 days" },
        { name: "Tier 3", amount: "2% CTO Share", requirements: "$100K volume, 180 days" }
      ],
      description: "Monthly salary income based on direct referral performance and business generation. Fixed rewards for committed promoters.",
      buttonClass: "bg-gradient-to-r from-purple-400 to-purple-500 text-white"
    }
  ];

  return (
    <section id="packages" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Investment <span className="text-gold">Packages</span></h2>
          <p className="text-xl text-gray-300">Diversified Forex investment plans tailored to different risk profiles</p>
        </div>
        
        {/* Package Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {packages.map((pkg, index) => (
            <div 
              key={index}
              className={`bg-dark-card p-8 rounded-2xl border border-${pkg.color}/20 hover:border-${pkg.color}/40 transition-colors animate-fadeIn`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold text-${pkg.color}`}>{pkg.name}</h3>
                <span className={`bg-${pkg.color}/10 text-${pkg.color} px-3 py-1 rounded-full text-sm font-semibold`}>
                  {pkg.badge}
                </span>
              </div>
              
              <div className="space-y-4 mb-6">
                {pkg.details && Object.entries(pkg.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className={`font-semibold ${key === 'return' ? `text-${pkg.color}` : ''}`}>{value}</span>
                  </div>
                ))}
                
                {pkg.levels && pkg.levels.map((level) => (
                  <div key={level.level} className="flex justify-between">
                    <span className="text-gray-300">Level {level.level}:</span>
                    <span className={`font-semibold ${level.level === 1 ? `text-${pkg.color}` : ''}`}>
                      {level.percentage}
                    </span>
                  </div>
                ))}
                
                {pkg.tiers && pkg.tiers.map((tier, tierIndex) => (
                  <div key={tierIndex} className={`bg-${pkg.color}/10 p-3 rounded-lg`}>
                    <div className={`font-semibold text-${pkg.color}`}>{tier.name}: {tier.amount}</div>
                    <div className="text-sm text-gray-300">{tier.requirements}</div>
                  </div>
                ))}
                
                {pkg.example && (
                  <div className={`bg-${pkg.color}/10 p-3 rounded-lg`}>
                    <div className="text-sm text-gray-300">Example:</div>
                    <div className={`text-${pkg.color} font-semibold`}>{pkg.example}</div>
                  </div>
                )}
              </div>
              
              <p className="text-gray-300 mb-6">{pkg.description}</p>
              
              <button className={`w-full py-3 ${pkg.buttonClass} font-semibold rounded-lg hover:opacity-90 transition-opacity`}>
                Choose Plan
              </button>
            </div>
          ))}
        </div>

        {/* Re-Top-Up Rule Note */}
        <div className="bg-dark-card p-6 rounded-2xl border border-gold/20 mb-8">
          <h3 className="text-xl font-bold text-gold mb-4">Important Notice</h3>
          <div className="space-y-2 text-gray-300">
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
