import { Facebook, Twitter, Linkedin, Send } from 'lucide-react';

export default function Footer() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickLinks = [
    { name: "Home", section: "home" },
    { name: "About Us", section: "about" },
    { name: "Investment Packages", section: "packages" },
    { name: "How It Works", section: "how-it-works" },
    { name: "FAQs", section: "faq" },
    { name: "Contact", section: "contact" }
  ];

  const legalLinks = [
    { name: "Terms & Conditions", href: "#terms" },
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Risk Disclaimer", href: "#risk" },
    { name: "AML & KYC Policy", href: "#aml" },
    { name: "Refund Policy", href: "#refund" }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Linkedin, href: "#" },
    { icon: Send, href: "#" }
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-16">
      <div className="fxbot-container">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <img src="/logo.png" alt="FXBOT Logo" className="h-8 w-auto mr-3" />
              <span className="text-2xl font-bold fxbot-text-gold">FXBOT</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Professional Forex investment solutions provider dedicated to delivering consistent returns through advanced market analytics and experienced fund management.
            </p>
            <div className="flex" style={{ gap: '1rem' }}>
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a 
                    key={index}
                    href={social.href} 
                    className="social-link rounded transition-colors"
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary-gold)'
                    }}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button 
                    onClick={() => scrollToSection(link.section)}
                    className="text-gray-300 hover:text-gold transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-gold transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 FXBOT. All rights reserved. | Registered in St. Vincent & the Grenadines (HE-543752)
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Risk Warning: Trading Forex involves substantial risk and may not be suitable for all investors.
          </p>
        </div>
      </div>
    </footer>
  );
}
