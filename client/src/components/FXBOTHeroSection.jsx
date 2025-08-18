import { ArrowRight, TrendingUp, Shield, Users } from 'lucide-react';
import { Link } from 'wouter';
import FXBOTROICalculator from './FXBOTROICalculator';

export default function FXBOTHeroSection() {
  const scrollToPackages = () => {
    const element = document.getElementById('packages');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Safe & Transparent',
      description: 'Professional trading with full transparency'
    },
    {
      icon: TrendingUp,
      title: 'Daily Tracking',
      description: 'Real-time profit monitoring'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: '10+ years forex experience'
    }
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center bg-gradient-bg overflow-hidden pt-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-fxbot-blue/5 via-transparent to-fxbot-gold/5"></div>
      
      <div className="fxbot-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="fxbot-text-blue">Grow Your</span>
                <br />
                <span className="fxbot-text-gold">Wealth</span>
                <br />
                <span className="fxbot-text-blue">Not Just Your Hopes</span>
              </h1>
              
              <p className="text-lg md:text-xl fxbot-text-secondary max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Choose a Forex Package with <span className="fxbot-text-gold font-semibold">FXBOT</span> That Works While You Sleep — With Full Transparency & Weekly Profits.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/register">
                <button className="fxbot-btn fxbot-btn-primary fxbot-btn-lg group">
                  Start Investing
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <button 
                onClick={scrollToPackages}
                className="fxbot-btn fxbot-btn-outline fxbot-btn-lg"
              >
                View Plans
              </button>
            </div>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-center space-x-3 justify-center lg:justify-start">
                    <div className="w-10 h-10 bg-gradient-blue rounded-fxbot-sm flex items-center justify-center shadow-fxbot-blue">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold fxbot-text-blue text-sm">{feature.title}</h4>
                      <p className="text-xs fxbot-text-light">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* ROI Calculator */}
          <div className="flex justify-center lg:justify-end">
            <FXBOTROICalculator />
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-fxbot-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-fxbot-blue/10 rounded-full blur-3xl"></div>
    </section>
  );
}