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
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Legal <span className="text-gold">Information</span></h2>
          <p className="text-xl text-gray-300">Important legal documents and policies</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {legalPages.map((page, index) => {
            const IconComponent = page.icon;
            return (
              <a 
                key={index}
                href={page.href} 
                className="bg-dark-card p-6 rounded-xl border border-gold/10 hover:border-gold/30 transition-colors text-center group animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <IconComponent className="w-12 h-12 text-gold mb-4 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2 group-hover:text-gold transition-colors">{page.title}</h3>
                <p className="text-gray-300 text-sm">{page.description}</p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
