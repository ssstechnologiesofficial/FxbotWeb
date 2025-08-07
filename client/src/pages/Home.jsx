import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import BenefitsSection from "@/components/BenefitsSection";
import InvestmentPackages from "@/components/InvestmentPackages";
import AboutSection from "@/components/AboutSection";
import HowItWorks from "@/components/HowItWorks";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-bg text-white font-inter">
      <Navigation />
      <HeroSection />
      <BenefitsSection />
      <InvestmentPackages />
      <AboutSection />
      <HowItWorks />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      
      {/* Legal Pages Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Legal <span className="text-gold">Information</span></h2>
            <p className="text-xl text-gray-300">Important legal documents and policies</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <a href="#terms" className="bg-dark-card p-6 rounded-xl border border-gold/10 hover:border-gold/30 transition-colors text-center">
              <i className="fas fa-file-contract text-3xl text-gold mb-4"></i>
              <h3 className="text-lg font-semibold mb-2">Terms & Conditions</h3>
              <p className="text-gray-300 text-sm">Complete terms of service</p>
            </a>
            <a href="#privacy" className="bg-dark-card p-6 rounded-xl border border-gold/10 hover:border-gold/30 transition-colors text-center">
              <i className="fas fa-shield-alt text-3xl text-gold mb-4"></i>
              <h3 className="text-lg font-semibold mb-2">Privacy Policy</h3>
              <p className="text-gray-300 text-sm">How we protect your data</p>
            </a>
            <a href="#risk" className="bg-dark-card p-6 rounded-xl border border-gold/10 hover:border-gold/30 transition-colors text-center">
              <i className="fas fa-exclamation-triangle text-3xl text-gold mb-4"></i>
              <h3 className="text-lg font-semibold mb-2">Risk Disclaimer</h3>
              <p className="text-gray-300 text-sm">Investment risk information</p>
            </a>
            <a href="#aml" className="bg-dark-card p-6 rounded-xl border border-gold/10 hover:border-gold/30 transition-colors text-center">
              <i className="fas fa-user-shield text-3xl text-gold mb-4"></i>
              <h3 className="text-lg font-semibold mb-2">AML & KYC Policy</h3>
              <p className="text-gray-300 text-sm">Compliance procedures</p>
            </a>
            <a href="#refund" className="bg-dark-card p-6 rounded-xl border border-gold/10 hover:border-gold/30 transition-colors text-center">
              <i className="fas fa-money-bill-wave text-3xl text-gold mb-4"></i>
              <h3 className="text-lg font-semibold mb-2">Refund Policy</h3>
              <p className="text-gray-300 text-sm">Withdrawal procedures</p>
            </a>
            <a href="#compliance" className="bg-dark-card p-6 rounded-xl border border-gold/10 hover:border-gold/30 transition-colors text-center">
              <i className="fas fa-balance-scale text-3xl text-gold mb-4"></i>
              <h3 className="text-lg font-semibold mb-2">Compliance</h3>
              <p className="text-gray-300 text-sm">Regulatory information</p>
            </a>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
