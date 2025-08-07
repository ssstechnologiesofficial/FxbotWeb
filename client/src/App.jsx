import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import BenefitsSection from "./components/BenefitsSection";
import InvestmentPackages from "./components/InvestmentPackages";
import AboutSection from "./components/AboutSection";
import HowItWorks from "./components/HowItWorks";
import TestimonialsSection from "./components/TestimonialsSection";
import FAQSection from "./components/FAQSection";
import ContactSection from "./components/ContactSection";
import LegalSection from "./components/LegalSection";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navigation />
      <HeroSection />
      <BenefitsSection />
      <InvestmentPackages />
      <AboutSection />
      <HowItWorks />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <LegalSection />
      <Footer />
    </div>
  );
}

export default App;
