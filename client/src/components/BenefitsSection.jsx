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
    <section className="section bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Why Choose <span className="text-gold">FXBOT</span>?</h2>
          <p className="text-xl text-secondary">Professional trading solutions with complete transparency</p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 benefits-grid">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div 
                key={index}
                className="card text-center p-8 animate-fadeIn hover-lift"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="benefit-icon" style={{
                  width: '4rem',
                  height: '4rem',
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}>
                  <IconComponent style={{ width: '2rem', height: '2rem', color: 'var(--primary-gold)' }} />
                </div>
                <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
                <p className="text-secondary">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
