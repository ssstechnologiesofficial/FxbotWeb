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
    <section className="py-20 bg-dark-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose <span className="text-gold">FXBOT</span>?</h2>
          <p className="text-xl text-gray-300">Professional trading solutions with complete transparency</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div 
                key={index}
                className="text-center p-8 bg-dark-card rounded-2xl border border-gold/10 hover:border-gold/30 transition-colors animate-fadeIn"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <IconComponent className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
