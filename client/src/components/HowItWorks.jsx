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
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It <span className="text-gold">Works</span></h2>
          <p className="text-xl text-gray-300">Simple steps to start your Forex investment journey</p>
        </div>
        
        <div className="grid md:grid-cols-5 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="text-center relative animate-fadeIn"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center mx-auto mb-6 text-dark-bg text-2xl font-bold">
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-gray-300">{step.description}</p>
              
              {/* Connector line (hidden on mobile, shown on desktop except for last step) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 -right-4 w-8 h-0.5 bg-gold transform translate-x-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
