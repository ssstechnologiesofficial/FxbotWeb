export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Register & KYC",
      description: "Sign up on our platform and complete your KYC verification to activate your account securely."
    },
    {
      number: 2,
      title: "Choose Plan",
      description: "Select from our range of tailored Forex investment packages based on your goals and risk profile."
    },
    {
      number: 3,
      title: "Fund Account",
      description: "Deposit your investment amount using our secure payment gateways with multiple options."
    },
    {
      number: 4,
      title: "Receive ROI",
      description: "Start earning returns as per your chosen plan with fixed ROI or profit sharing distributions."
    },
    {
      number: 5,
      title: "Withdraw",
      description: "Withdraw your profits or matured funds directly to your bank account as per your plan's policy."
    }
  ];

  return (
    <section id="how-it-works" className="section">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">How It <span className="text-gold">Works</span></h2>
          <p className="text-xl text-secondary">Simple steps to start your Forex investment journey</p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 how-it-works-grid">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="text-center relative animate-fadeIn step-card"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="step-number gradient-gold rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold" style={{
                width: '5rem',
                height: '5rem',
                color: 'var(--dark-bg)'
              }}>
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-secondary">{step.description}</p>
              
              {/* Connector line (hidden on mobile, shown on desktop except for last step) */}
              {index < steps.length - 1 && (
                <div className="step-connector" style={{
                  display: 'none',
                  position: 'absolute',
                  top: '2.5rem',
                  right: '-1rem',
                  width: '2rem',
                  height: '2px',
                  backgroundColor: 'var(--primary-gold)',
                  transform: 'translateX(100%)'
                }}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
