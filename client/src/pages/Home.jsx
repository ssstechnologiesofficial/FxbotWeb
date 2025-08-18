import FXBOTNavigation from "@/components/FXBOTNavigation";
import FXBOTHeroSection from "@/components/FXBOTHeroSection";
import BenefitsSection from "@/components/BenefitsSection";
import FXBOTInvestmentPackages from "@/components/FXBOTInvestmentPackages";
import AboutSection from "@/components/AboutSection";
import HowItWorks from "@/components/HowItWorks";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-inter">
      <FXBOTNavigation />
      <FXBOTHeroSection />
      <BenefitsSection />
      <FXBOTInvestmentPackages />
      <AboutSection />
      <HowItWorks />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      
      {/* Legal Pages Section */}
      <section className="py-20 bg-gray-50">
        <div className="fxbot-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Legal <span className="fxbot-text-gold">Information</span></h2>
            <p className="text-xl fxbot-text-secondary">Important legal documents and policies</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <a href="#terms" className="fxbot-card text-center hover:fxbot-card-gold transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-gold rounded-fxbot mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 fxbot-text-blue">Terms & Conditions</h3>
              <p className="fxbot-text-secondary text-sm">Complete terms of service</p>
            </a>
            <a href="#privacy" className="fxbot-card text-center hover:fxbot-card-blue transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-blue rounded-fxbot mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 fxbot-text-blue">Privacy Policy</h3>
              <p className="fxbot-text-secondary text-sm">How we protect your data</p>
            </a>
            <a href="#risk" className="fxbot-card text-center hover:fxbot-card-gold transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-gold rounded-fxbot mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 fxbot-text-blue">Risk Disclaimer</h3>
              <p className="fxbot-text-secondary text-sm">Investment risk information</p>
            </a>
            <a href="#aml" className="fxbot-card text-center hover:fxbot-card-blue transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-blue rounded-fxbot mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 fxbot-text-blue">AML & KYC Policy</h3>
              <p className="fxbot-text-secondary text-sm">Compliance procedures</p>
            </a>
            <a href="#refund" className="fxbot-card text-center hover:fxbot-card-gold transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-gold rounded-fxbot mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 fxbot-text-blue">Refund Policy</h3>
              <p className="fxbot-text-secondary text-sm">Withdrawal procedures</p>
            </a>
            <a href="#compliance" className="fxbot-card text-center hover:fxbot-card-blue transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-blue rounded-fxbot mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 fxbot-text-blue">Compliance</h3>
              <p className="fxbot-text-secondary text-sm">Regulatory information</p>
            </a>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
