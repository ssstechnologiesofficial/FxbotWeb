export default function AboutSection() {
  const teamMembers = [
    {
      name: "Michael Marcus",
      position: "Founder & CEO",
      description: "With over 10 years in the Forex trading and investment management industry, Michael brings deep expertise in high-frequency trading, portfolio structuring, and global financial compliance.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400"
    },
    {
      name: "Lucy Baldwin",
      position: "Chief Operations Officer",
      description: "An operations specialist with extensive experience in financial services administration, KYC compliance, and client relations. She oversees daily business processes.",
      image: "https://images.unsplash.com/photo-1494790108755-2616c5e94cfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400"
    },
    {
      name: "Richards Dennis",
      position: "Head of Trading & Risk Management",
      description: "Leads the trading team, specialising in market analytics, algorithmic strategy design, and risk control protocols, ensuring capital protection objectives.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400"
    }
  ];

  const tradingApproach = [
    "Multi-strategy portfolios combining technical analysis, fundamental insights, and AI-driven algorithmic systems.",
    "Strict capital preservation principles, limiting exposure per trade to a small percentage of total managed funds.",
    "Diversified currency pair selection, reducing concentration risk and enhancing ROI potential.",
    "Automated stop loss and take profit mechanisms to protect client capital in volatile market conditions.",
    "Daily and weekly risk assessments conducted by our trading and compliance team to adapt strategies proactively."
  ];

  return (
    <section id="about" className="py-20 bg-dark-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">About <span className="text-gold">FXBOT</span></h2>
          <p className="text-xl text-gray-300">Professional Forex Investment Solutions Provider</p>
        </div>

        {/* Company Introduction */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="animate-slideIn">
            <h3 className="text-3xl font-bold mb-6">Company Introduction</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              FXBOT is a globally oriented Forex investment and trading solutions provider, dedicated to delivering consistent returns to clients through professionally managed strategies. We combine advanced market analytics, automated algorithmic systems, and experienced fund management to achieve superior risk-adjusted returns in the Forex markets.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Established with the vision to simplify Forex investing for individuals and institutions alike, we prioritise transparency, professional execution, and robust risk management in every trade and investment decision.
            </p>
          </div>
          <div className="animate-fadeIn">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Modern professional office environment" 
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-dark-card p-8 rounded-2xl border border-gold/20 animate-fadeIn">
            <h3 className="text-2xl font-bold text-gold mb-4">Our Mission</h3>
            <p className="text-gray-300 leading-relaxed">
              To empower investors globally by providing secure, innovative, and performance-driven Forex investment solutions while upholding the highest standards of transparency and client trust.
            </p>
          </div>
          <div className="bg-dark-card p-8 rounded-2xl border border-blue-custom/20 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-2xl font-bold text-blue-custom mb-4">Our Vision</h3>
            <p className="text-gray-300 leading-relaxed">
              To be recognised as a leading trusted Forex investment management company, known for consistent results, ethical practices, and technological excellence in global financial markets.
            </p>
          </div>
        </div>

        {/* Trading Approach */}
        <div className="bg-dark-card p-8 rounded-2xl border border-gold/20 mb-20 animate-fadeIn">
          <h3 className="text-3xl font-bold text-gold mb-6">Trading & Risk Management Approach</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {tradingApproach.slice(0, 3).map((approach, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300">{approach}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {tradingApproach.slice(3).map((approach, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300">{approach}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leadership Team */}
        <div>
          <h3 className="text-3xl font-bold text-center mb-12">Leadership <span className="text-gold">Team</span></h3>
          <div className="grid lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-dark-card p-8 rounded-2xl border border-gold/10 hover:border-gold/30 transition-colors text-center animate-fadeIn"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <img 
                  src={member.image} 
                  alt={`${member.name} - ${member.position}`} 
                  className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                />
                <h4 className="text-xl font-bold mb-2">{member.name}</h4>
                <p className="text-gold font-semibold mb-4">{member.position}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Licensing */}
        <div className="mt-20 bg-dark-card p-8 rounded-2xl border border-gold/20 text-center animate-fadeIn">
          <h3 className="text-2xl font-bold text-gold mb-4">Licensing & Registration</h3>
          <p className="text-gray-300 leading-relaxed">
            FXBOT is incorporated under St. Vincent & the Grenadines, with registration number HE-543752. We operate as an international investment solutions provider, complying with local and international business regulations, anti-money laundering standards, and KYC policies to maintain client security and operational integrity.
          </p>
        </div>
      </div>
    </section>
  );
}
