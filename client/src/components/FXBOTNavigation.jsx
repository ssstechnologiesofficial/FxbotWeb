import { useState, useEffect } from 'react';
import { Menu, X, TrendingUp } from 'lucide-react';
import { Link } from 'wouter';

export default function FXBOTNavigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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
    <nav className={`fxbot-nav fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-fxbot-md' : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <div className="fxbot-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-gold rounded-fxbot-sm flex items-center justify-center shadow-fxbot-gold">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold fxbot-text-blue">FXBOT</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')} 
              className="fxbot-nav-link text-sm font-medium transition-all duration-200 hover:fxbot-text-blue"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="fxbot-nav-link text-sm font-medium transition-all duration-200 hover:fxbot-text-blue"
            >
              About Us
            </button>
            <button 
              onClick={() => scrollToSection('packages')} 
              className="fxbot-nav-link text-sm font-medium transition-all duration-200 hover:fxbot-text-blue"
            >
              Investment Packages
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="fxbot-nav-link text-sm font-medium transition-all duration-200 hover:fxbot-text-blue"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('faq')} 
              className="fxbot-nav-link text-sm font-medium transition-all duration-200 hover:fxbot-text-blue"
            >
              FAQs
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="fxbot-nav-link text-sm font-medium transition-all duration-200 hover:fxbot-text-blue"
            >
              Contact
            </button>
          </div>
          
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <button className="fxbot-btn fxbot-btn-outline fxbot-btn-sm px-6">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="fxbot-btn fxbot-btn-primary fxbot-btn-sm px-6">
                Register
              </button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-fxbot-sm fxbot-text-blue hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-fxbot-lg">
            <div className="px-4 py-6 space-y-4">
              <button 
                onClick={() => scrollToSection('home')} 
                className="block w-full text-left px-4 py-3 text-base font-medium fxbot-text-secondary hover:fxbot-text-blue hover:bg-gray-50 rounded-fxbot-sm transition-all"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="block w-full text-left px-4 py-3 text-base font-medium fxbot-text-secondary hover:fxbot-text-blue hover:bg-gray-50 rounded-fxbot-sm transition-all"
              >
                About Us
              </button>
              <button 
                onClick={() => scrollToSection('packages')} 
                className="block w-full text-left px-4 py-3 text-base font-medium fxbot-text-secondary hover:fxbot-text-blue hover:bg-gray-50 rounded-fxbot-sm transition-all"
              >
                Investment Packages
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className="block w-full text-left px-4 py-3 text-base font-medium fxbot-text-secondary hover:fxbot-text-blue hover:bg-gray-50 rounded-fxbot-sm transition-all"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('faq')} 
                className="block w-full text-left px-4 py-3 text-base font-medium fxbot-text-secondary hover:fxbot-text-blue hover:bg-gray-50 rounded-fxbot-sm transition-all"
              >
                FAQs
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="block w-full text-left px-4 py-3 text-base font-medium fxbot-text-secondary hover:fxbot-text-blue hover:bg-gray-50 rounded-fxbot-sm transition-all"
              >
                Contact
              </button>
              
              <div className="pt-4 space-y-3 border-t border-gray-200">
                <Link href="/login">
                  <button className="w-full fxbot-btn fxbot-btn-outline">
                    Login
                  </button>
                </Link>
                <Link href="/register">
                  <button className="w-full fxbot-btn fxbot-btn-primary">
                    Register
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}