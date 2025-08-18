import { Shield, TrendingUp, Users } from 'lucide-react';

export default function BenefitsSection() {
  const benefits = [
    {
      icon: Shield,
      title: "Safe & Transparent",
      description: "All investments backed by professional trading strategies with full transparency and regular reporting."
    },
    {
      icon: TrendingUp,
      title: "Daily Profit Tracking",
      description: "Real-time monitoring of your investments with detailed analytics and performance metrics."
    },
    {
      icon: Users,
      title: "Professional Team",
      description: "Experienced trading professionals with over 10 years of forex market expertise."
    }
  ];

  return (
    <section className="py-20 fxbot-bg-secondary">
      <div className="fxbot-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Why Choose <span className="fxbot-text-gold">FXBOT</span>?</h2>
          <p className="text-xl fxbot-text-secondary">Professional trading solutions with complete transparency</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div 
                key={index}
                className="fxbot-card text-center fxbot-animate-fadeInUp hover:fxbot-card-gold transition-all duration-300"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="fxbot-stat-icon fxbot-stat-icon-gold mx-auto mb-6">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 fxbot-text-blue">{benefit.title}</h3>
                <p className="fxbot-text-secondary leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
