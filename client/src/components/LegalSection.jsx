import { FileText, Shield, AlertTriangle, UserCheck, CreditCard, Scale } from 'lucide-react';

export default function LegalSection() {
  const legalPages = [
    {
      icon: FileText,
      title: "Terms & Conditions",
      description: "Complete terms of service",
      href: "#terms"
    },
    {
      icon: Shield,
      title: "Privacy Policy",
      description: "How we protect your data",
      href: "#privacy"
    },
    {
      icon: AlertTriangle,
      title: "Risk Disclaimer",
      description: "Investment risk information",
      href: "#risk"
    },
    {
      icon: UserCheck,
      title: "AML & KYC Policy",
      description: "Compliance procedures",
      href: "#aml"
    },
    {
      icon: CreditCard,
      title: "Refund Policy",
      description: "Withdrawal procedures",
      href: "#refund"
    },
    {
      icon: Scale,
      title: "Compliance",
      description: "Regulatory information",
      href: "#compliance"
    }
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Legal <span className="text-gold">Information</span></h2>
          <p className="text-xl text-secondary">Important legal documents and policies</p>
        </div>

        <div className="grid grid-cols-1 gap-6 legal-grid" style={{ maxWidth: '64rem', margin: '0 auto' }}>
          {legalPages.map((page, index) => {
            const IconComponent = page.icon;
            return (
              <a 
                key={index}
                href={page.href} 
                className="card p-6 text-center legal-link animate-fadeIn"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  border: '1px solid rgba(255, 215, 0, 0.1)',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                  transition: 'all 0.3s ease'
                }}
              >
                <IconComponent 
                  className="legal-icon mb-4 mx-auto text-gold transition-transform" 
                  style={{ width: '3rem', height: '3rem' }}
                />
                <h3 className="text-lg font-semibold mb-2 transition-colors">{page.title}</h3>
                <p className="text-secondary text-sm">{page.description}</p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
