import { CheckCircle, TrendingUp, Users, Award, Target } from 'lucide-react';
import { Link } from 'wouter';

export default function FXBOTInvestmentPackages() {
  const packages = [
    {
      id: 'fs-income',
      name: "FS Income (FixSix)",
      badge: "6% Monthly",
      icon: TrendingUp,
      color: "gold",
      gradient: "from-fxbot-gold to-fxbot-gold-light",
      shadowColor: "shadow-fxbot-gold",
      details: {
        minimum: "$250",
        return: "6% Monthly until 2x",
        duration: "~17 months",
        payout: "Monthly"
      },
      features: [
        "Fixed 6% monthly returns",
        "Backed by company reserves",
        "Professional trading strategies",
        "Full transparency"
      ],
      description: "Earn a fixed 6% monthly return on your invested capital until your investment doubles (2x). Backed by company reserves and trading profits.",
      popular: true
    },
    {
      id: 'smartline',
      name: "SmartLine Income",
      badge: "5 Levels",
      icon: Users,
      color: "blue",
      gradient: "from-fxbot-blue to-fxbot-blue-light",
      shadowColor: "shadow-fxbot-blue",
      levels: [
        { level: 1, percentage: "1.5%" },
        { level: 2, percentage: "1.0%" },
        { level: 3, percentage: "0.75%" },
        { level: 4, percentage: "0.50%" },
        { level: 5, percentage: "0.25%" }
      ],
      features: [
        "Multi-level income distribution",
        "5-tier commission structure",
        "Unlimited earning potential",
        "Community building rewards"
      ],
      description: "Multi-level affiliate income distribution plan to reward partners for expanding our investor community across 5 levels."
    },
    {
      id: 'dri-income',
      name: "DRI Income",
      badge: "6% Direct",
      icon: Award,
      color: "green",
      gradient: "from-green-500 to-green-600",
      shadowColor: "shadow-green-500/20",
      details: {
        commission: "6% Direct Referral",
        frequency: "Every Investment",
        cap: "Unlimited",
        example: "$1,000 referral = $60 commission"
      },
      features: [
        "6% direct commission",
        "Instant payouts",
        "No referral limits",
        "Easy to understand"
      ],
      description: "Earn 6% commission on every investment made by your direct referrals. Commission credited for each new investment, no limit on referrals."
    },
    {
      id: 'das-income',
      name: "DAS Income",
      badge: "Monthly Salary",
      icon: Target,
      color: "purple",
      gradient: "from-purple-500 to-purple-600",
      shadowColor: "shadow-purple-500/20",
      tiers: [
        { name: "Tier 1", amount: "$300/month", requirements: "10 referrals, $20K volume, 60 days" },
        { name: "Tier 2", amount: "$1,000/month", requirements: "15 referrals, $50K volume, 90 days" },
        { name: "Tier 3", amount: "2% CTO Share", requirements: "$100K volume, 180 days" }
      ],
      features: [
        "Fixed monthly salary",
        "Performance-based tiers",
        "Executive-level rewards",
        "Long-term stability"
      ],
      description: "Monthly salary income based on direct referral performance and business generation. Fixed rewards for committed promoters."
    }
  ];

  return (
    <section id="packages" className="py-20 bg-gray-50">
      <div className="fxbot-container">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Investment <span className="fxbot-text-gold">Packages</span>
          </h2>
          <p className="text-xl fxbot-text-secondary max-w-3xl mx-auto leading-relaxed">
            Diversified Forex investment plans tailored to different risk profiles and investment goals
          </p>
        </div>
        
        {/* Package Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {packages.map((pkg, index) => {
            const IconComponent = pkg.icon;
            const isGold = pkg.color === 'gold';
            const isBlue = pkg.color === 'blue';
            
            return (
              <div 
                key={pkg.id}
                className={`fxbot-card relative overflow-hidden ${
                  isGold ? 'fxbot-card-gold' : isBlue ? 'fxbot-card-blue' : ''
                } ${pkg.popular ? 'ring-2 ring-fxbot-gold' : ''}`}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {/* Popular Badge */}
                {pkg.popular && (
                  <div className="absolute -top-1 -right-1">
                    <div className="bg-gradient-gold text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}
                
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-${pkg.color} rounded-fxbot flex items-center justify-center ${pkg.shadowColor}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${
                        isGold ? 'fxbot-text-gold' : isBlue ? 'fxbot-text-blue' : 
                        pkg.color === 'green' ? 'text-green-600' : 'text-purple-600'
                      }`}>
                        {pkg.name}
                      </h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        isGold ? 'bg-fxbot-gold/10 fxbot-text-gold' :
                        isBlue ? 'bg-fxbot-blue/10 fxbot-text-blue' :
                        pkg.color === 'green' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {pkg.badge}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Package Details */}
                <div className="space-y-4 mb-6">
                  {pkg.details && Object.entries(pkg.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="fxbot-text-secondary capitalize font-medium">
                        {key.replace(/([A-Z])/g, ' $1')}:
                      </span>
                      <span className={`font-semibold ${
                        key === 'return' && isGold ? 'fxbot-text-gold' : 'fxbot-text-blue'
                      }`}>
                        {key === 'example' ? (
                          <span className="text-sm">{value}</span>
                        ) : value}
                      </span>
                    </div>
                  ))}
                  
                  {pkg.levels && (
                    <div className="space-y-2">
                      {pkg.levels.map((level) => (
                        <div key={level.level} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                          <span className="fxbot-text-secondary font-medium">Level {level.level}:</span>
                          <span className={`font-semibold ${
                            level.level === 1 ? 'fxbot-text-blue' : 'fxbot-text-blue'
                          }`}>
                            {level.percentage}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {pkg.tiers && (
                    <div className="space-y-3">
                      {pkg.tiers.map((tier, tierIndex) => (
                        <div key={tierIndex} className="p-4 bg-gray-50 rounded-fxbot-sm">
                          <div className={`font-semibold mb-1 ${
                            pkg.color === 'purple' ? 'text-purple-600' : 'fxbot-text-gold'
                          }`}>
                            {tier.name}: {tier.amount}
                          </div>
                          <div className="text-sm fxbot-text-light">{tier.requirements}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Features */}
                <div className="mb-6">
                  <div className="grid grid-cols-1 gap-2">
                    {pkg.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className={`w-4 h-4 ${
                          isGold ? 'fxbot-text-gold' : isBlue ? 'fxbot-text-blue' :
                          pkg.color === 'green' ? 'text-green-500' : 'text-purple-500'
                        }`} />
                        <span className="text-sm fxbot-text-secondary">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Description */}
                <p className="fxbot-text-secondary mb-8 leading-relaxed">
                  {pkg.description}
                </p>
                
                {/* CTA Button */}
                <Link href="/register">
                  <button className={`w-full fxbot-btn font-semibold ${
                    isGold ? 'fxbot-btn-primary' : 
                    isBlue ? 'fxbot-btn-secondary' :
                    pkg.color === 'green' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/20 hover:shadow-green-500/30' :
                    'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-purple-500/20 hover:shadow-purple-500/30'
                  } transition-all duration-300`}>
                    Choose {pkg.name.split(' ')[0]} Plan
                  </button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Important Notice */}
        <div className="fxbot-card fxbot-card-gold bg-gradient-to-r from-fxbot-gold/5 to-fxbot-gold-light/5">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-gold rounded-fxbot-sm flex items-center justify-center shadow-fxbot-gold flex-shrink-0">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold fxbot-text-gold mb-4">Important Notice</h3>
              <div className="space-y-3 fxbot-text-secondary">
                <p>
                  <strong className="fxbot-text-blue">Re-Top-Up Rule:</strong> When a user's investment package reaches 2x returns (full payout completed), they must re-top-up their account with a minimum of $250 to continue receiving future ROI payouts and stay eligible for referral rewards.
                </p>
                <p>
                  <strong className="fxbot-text-blue">Lock Period:</strong> All packages are locked for a minimum of 6 months to ensure optimal trading strategies and consistent returns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}