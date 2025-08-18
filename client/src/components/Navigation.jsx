import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'wouter';

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
    <nav className={`fixed z-50 w-full transition ${
      isScrolled ? 'bg-dark border-b' : 'bg-dark border-b'
    }`} style={{
      top: 0,
      borderBottomColor: 'rgba(255, 215, 0, 0.2)'
    }}>
      <div className="container">
        <div className="flex items-center justify-between" style={{ height: '4rem' }}>
          <div className="flex items-center">
            <img src="/logo.png" alt="FXBOT Logo" style={{ height: '2.5rem', width: 'auto' }} />
            <span className="text-xl font-bold text-gold" style={{ marginLeft: '0.75rem' }}>FXBOT</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="desktop-nav" style={{ display: 'flex', gap: '2rem' }}>
            <button onClick={() => scrollToSection('home')} className="nav-link text-secondary transition-colors">Home</button>
            <button onClick={() => scrollToSection('about')} className="nav-link text-secondary transition-colors">About Us</button>
            <button onClick={() => scrollToSection('packages')} className="nav-link text-secondary transition-colors">Investment Packages</button>
            <button onClick={() => scrollToSection('how-it-works')} className="nav-link text-secondary transition-colors">How It Works</button>
            <button onClick={() => scrollToSection('faq')} className="nav-link text-secondary transition-colors">FAQs</button>
            <button onClick={() => scrollToSection('contact')} className="nav-link text-secondary transition-colors">Contact</button>
          </div>
          
          {/* Desktop Auth Buttons */}
          <div className="auth-buttons" style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/login" className="btn btn-secondary">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary">
              Register
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="mobile-menu-btn">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-primary"
              style={{ background: 'none', border: 'none', padding: '0.5rem' }}
            >
              {isMobileMenuOpen ? <X style={{ width: '1.5rem', height: '1.5rem' }} /> : <Menu style={{ width: '1.5rem', height: '1.5rem' }} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu bg-card border-t" style={{ borderTopColor: 'rgba(255, 215, 0, 0.2)' }}>
            <div className="px-2 py-4" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <button onClick={() => scrollToSection('home')} className="mobile-nav-link block w-full text-left px-4 py-2 text-secondary transition-colors">Home</button>
              <button onClick={() => scrollToSection('about')} className="mobile-nav-link block w-full text-left px-4 py-2 text-secondary transition-colors">About Us</button>
              <button onClick={() => scrollToSection('packages')} className="mobile-nav-link block w-full text-left px-4 py-2 text-secondary transition-colors">Investment Packages</button>
              <button onClick={() => scrollToSection('how-it-works')} className="mobile-nav-link block w-full text-left px-4 py-2 text-secondary transition-colors">How It Works</button>
              <button onClick={() => scrollToSection('faq')} className="mobile-nav-link block w-full text-left px-4 py-2 text-secondary transition-colors">FAQs</button>
              <button onClick={() => scrollToSection('contact')} className="mobile-nav-link block w-full text-left px-4 py-2 text-secondary transition-colors">Contact</button>
              <div className="pt-4" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link href="/login" className="btn btn-secondary w-full">
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary w-full">
                  Register
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
