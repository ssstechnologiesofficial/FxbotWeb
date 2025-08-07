import ROICalculator from './ROICalculator';

export default function HeroSection() {
  const scrollToPackages = () => {
    const element = document.getElementById('packages');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="section min-h-screen flex items-center relative overflow-hidden" style={{ paddingTop: '4rem' }}>
      {/* Background Image */}
      <div className="absolute" style={{ 
        top: 0, left: 0, right: 0, bottom: 0, 
        opacity: 0.2, zIndex: 1 
      }}>
        <img 
          src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Financial charts and trading screens" 
          className="w-full h-full"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      
      <div className="container relative" style={{ zIndex: 10 }}>
        <div className="grid grid-cols-1 gap-8 items-center hero-grid">
          <div className="text-center hero-text animate-fadeIn">
            <h1 className="text-5xl font-bold mb-6 hero-title">
              <span className="text-primary">Grow Your</span>
              <span className="text-gold block">Wealth</span>
              <span className="text-primary">Not Just Your Hopes</span>
            </h1>
            <p className="text-xl text-secondary mb-8 hero-subtitle">
              Choose a Forex Package with <span className="text-gold font-semibold">FXBOT</span> That Works While You Sleep — With Full Transparency & Weekly Profits.
            </p>
            <div className="hero-buttons flex flex-col gap-4 justify-center">
              <button 
                onClick={scrollToPackages}
                className="btn btn-primary btn-lg gradient-gold font-semibold"
              >
                Start Investing
              </button>
              <button 
                onClick={scrollToPackages}
                className="btn btn-secondary btn-lg font-semibold"
                style={{ borderColor: 'var(--primary-gold)', color: 'var(--primary-gold)' }}
              >
                View Plans
              </button>
            </div>
          </div>
          
          <div className="flex justify-center animate-slideIn">
            <ROICalculator />
          </div>
        </div>
      </div>
    </section>
  );
}
