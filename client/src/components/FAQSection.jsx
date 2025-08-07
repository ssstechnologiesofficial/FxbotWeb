import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "How are returns generated?",
      answer: "Returns are generated through Forex trading activities managed by our professional trading team using a combination of technical analysis, market strategies, and algorithmic systems to achieve consistent performance."
    },
    {
      question: "Is my capital guaranteed?",
      answer: "While certain plans offer fixed returns backed by company reserves and trading profits, all investments carry some level of market risk. Please read each plan's terms and disclaimers carefully before investing."
    },
    {
      question: "How do withdrawals work?",
      answer: "Withdrawals can be requested directly through your dashboard. Depending on your chosen plan, profits are either paid out monthly or as a lumpsum at maturity. Processing time is generally within 24-48 business hours."
    },
    {
      question: "What are the risks involved?",
      answer: "Forex trading involves market risks including partial or total loss of capital in high-risk plans. Even fixed-return plans carry operational and execution risks. We recommend investing amounts within your risk tolerance and understanding each plan's structure fully."
    },
    {
      question: "What is the re-top-up rule after 2x completion?",
      answer: "When a user's investment package reaches 2x returns (full payout completed), they must re-top-up their account with a minimum of $250 to continue receiving future ROI payouts and stay eligible for referral rewards and level income."
    },
    {
      question: "Are packages locked for a minimum period?",
      answer: "Yes, all investment packages are locked for a minimum period of 6 months to ensure optimal trading strategies and consistent returns for our investors."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section id="faq" className="section">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Frequently Asked <span className="text-gold">Questions</span></h2>
          <p className="text-xl text-secondary">Get answers to common questions about FXBOT</p>
        </div>

        <div className="faq-container" style={{ maxWidth: '64rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="card border animate-fadeIn"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                borderColor: 'rgba(255, 215, 0, 0.1)' 
              }}
            >
              <button 
                className="faq-button w-full p-6 text-left flex justify-between items-center transition-colors"
                onClick={() => toggleFAQ(index)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit'
                }}
              >
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                {openFAQ === index ? (
                  <ChevronUp style={{ width: '1.25rem', height: '1.25rem', color: 'var(--primary-gold)' }} />
                ) : (
                  <ChevronDown style={{ width: '1.25rem', height: '1.25rem', color: 'var(--primary-gold)' }} />
                )}
              </button>
              {openFAQ === index && (
                <div className="p-6 pt-0 border-t" style={{ borderTopColor: '#555' }}>
                  <p className="text-secondary">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
