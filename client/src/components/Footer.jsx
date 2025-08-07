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
    <footer className="bg-dark-bg border-t border-gold/20 py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <img src="/logo.png" alt="FXBOT Logo" className="h-8 w-auto mr-3" />
              <span className="text-2xl font-bold text-gold">FXBOT</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Professional Forex investment solutions provider dedicated to delivering consistent returns through advanced market analytics and experienced fund management.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a 
                    key={index}
                    href={social.href} 
                    className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center text-gold hover:bg-gold/20 transition-colors"
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
