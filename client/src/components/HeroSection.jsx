import ROICalculator from './ROICalculator';

export default function HeroSection() {
  const scrollToPackages = () => {
    const element = document.getElementById('packages');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="pt-16 min-h-screen flex items-center relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Financial charts and trading screens" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left animate-fadeIn">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Grow Your</span>
              <span className="text-gold block">Wealth</span>
              <span className="text-white">Not Just Your Hopes</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Choose a Forex Package with <span className="text-gold font-semibold">FXBOT</span> That Works While You Sleep — With Full Transparency & Weekly Profits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={scrollToPackages}
                className="px-8 py-4 bg-gradient-to-r from-gold to-gold-dark text-dark-bg font-semibold rounded-lg hover:opacity-90 transition-opacity text-lg"
              >
                Start Investing
              </button>
              <button 
                onClick={scrollToPackages}
                className="px-8 py-4 border-2 border-gold text-gold font-semibold rounded-lg hover:bg-gold hover:text-dark-bg transition-colors text-lg"
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
