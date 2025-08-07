import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-dark-bg border-b border-gold/20' : 'bg-dark-bg/95 backdrop-blur-sm border-b border-gold/20'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img src="/logo.png" alt="FXBOT Logo" className="h-10 w-auto" />
            <span className="ml-3 text-xl font-bold text-gold">FXBOT</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('home')} className="text-gray-300 hover:text-gold transition-colors">Home</button>
            <button onClick={() => scrollToSection('about')} className="text-gray-300 hover:text-gold transition-colors">About Us</button>
            <button onClick={() => scrollToSection('packages')} className="text-gray-300 hover:text-gold transition-colors">Investment Packages</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-gray-300 hover:text-gold transition-colors">How It Works</button>
            <button onClick={() => scrollToSection('faq')} className="text-gray-300 hover:text-gold transition-colors">FAQs</button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-gold transition-colors">Contact</button>
          </div>
          
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex space-x-4">
            <button className="px-4 py-2 text-white border border-gold rounded-lg hover:bg-gold hover:text-dark-bg transition-colors">
              Login
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-gold to-gold-dark text-dark-bg rounded-lg hover:opacity-90 transition-opacity">
              Register
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-dark-card border-t border-gold/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button onClick={() => scrollToSection('home')} className="block w-full text-left px-3 py-2 text-gray-300 hover:text-gold transition-colors">Home</button>
              <button onClick={() => scrollToSection('about')} className="block w-full text-left px-3 py-2 text-gray-300 hover:text-gold transition-colors">About Us</button>
              <button onClick={() => scrollToSection('packages')} className="block w-full text-left px-3 py-2 text-gray-300 hover:text-gold transition-colors">Investment Packages</button>
              <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left px-3 py-2 text-gray-300 hover:text-gold transition-colors">How It Works</button>
              <button onClick={() => scrollToSection('faq')} className="block w-full text-left px-3 py-2 text-gray-300 hover:text-gold transition-colors">FAQs</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left px-3 py-2 text-gray-300 hover:text-gold transition-colors">Contact</button>
              <div className="pt-4 space-y-2">
                <button className="w-full px-4 py-2 text-white border border-gold rounded-lg hover:bg-gold hover:text-dark-bg transition-colors">
                  Login
                </button>
                <button className="w-full px-4 py-2 bg-gradient-to-r from-gold to-gold-dark text-dark-bg rounded-lg hover:opacity-90 transition-opacity">
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
