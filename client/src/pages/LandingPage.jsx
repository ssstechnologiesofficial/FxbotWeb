import React, { useState } from 'react';
import { Link } from 'wouter';
import { 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  Target,
  Globe
} from 'lucide-react';

function LandingPage() {
  const [selectedPlan, setSelectedPlan] = useState('fs-income');
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [referralCount, setReferralCount] = useState(10);

  const plans = [
    {
      id: 'fs-income',
      name: 'FS Income (FixSix)',
      subtitle: '6% Monthly',
      minimum: '$250',
      return: '6% Monthly until 2x',
      duration: '~17 months',
      payout: 'Monthly',
      description: 'Earn a fixed 6% monthly return on your invested capital until your investment doubles (2x). Backed by company reserves and trading profits.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'smartline',
      name: 'SmartLine Income',
      subtitle: '5 Levels',
      levels: [
        { level: 1, rate: '1.5%' },
        { level: 2, rate: '1.0%' },
        { level: 3, rate: '0.75%' },
        { level: 4, rate: '0.50%' },
        { level: 5, rate: '0.25%' }
      ],
      description: 'Multi-level affiliate income distribution plan to reward partners for expanding our investor community across 5 levels.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'dri-income',
      name: 'DRI Income',
      subtitle: '6% Direct',
      commission: '6% Direct Referral',
      frequency: 'Every Investment',
      cap: 'Unlimited',
      example: '$1,000 referral = $60 commission',
      description: 'Earn 6% commission on every investment made by your direct referrals. Commission credited for each new investment, no limit on referrals.',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'das-income',
      name: 'DAS Income',
      subtitle: 'Monthly Salary',
      tiers: [
        { tier: 1, salary: '$300/month', requirements: '10 referrals, $20K volume, 60 days' },
        { tier: 2, salary: '$1,000/month', requirements: '15 referrals, $50K volume, 90 days' },
        { tier: 3, salary: '2% CTO Share', requirements: '$100K volume, 180 days' }
      ],
      description: 'Monthly salary income based on direct referral performance and business generation. Fixed rewards for committed promoters.',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Safe & Transparent',
      description: 'All investments backed by professional trading strategies with full transparency and regular reporting.'
    },
    {
      icon: TrendingUp,
      title: 'Daily Profit Tracking',
      description: 'Real-time monitoring of your investments with detailed analytics and performance metrics.'
    },
    {
      icon: Award,
      title: 'Professional Team',
      description: 'Experienced trading professionals with over 10 years of forex market expertise.'
    }
  ];

  const testimonials = [
    {
      name: 'John Smith',
      text: 'FXBOT has been delivering consistent returns for over 8 months. Their transparency and professional approach gives me complete confidence in my investments.',
      rating: 5
    },
    {
      name: 'Sarah Johnson',
      text: 'The FS Income plan is exactly what I needed - reliable 6% monthly returns. The team\'s expertise in forex trading really shows in the results.',
      rating: 5
    },
    {
      name: 'Michael Brown',
      text: 'I\'ve tried many investment platforms, but FXBOT stands out with their professional approach and consistent performance. Highly recommended!',
      rating: 5
    }
  ];

  const calculateROI = () => {
    if (selectedPlan === 'fs-income') {
      return (investmentAmount * 0.06).toFixed(2);
    } else if (selectedPlan === 'dri-income') {
      return (referralCount * investmentAmount * 0.06).toFixed(2);
    }
    return '0.00';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Navigation */}
      <nav style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
        padding: '1rem 0',
        zIndex: 50
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '0.75rem'
            }}>
              <TrendingUp style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>FXBOT</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/login">
              <button style={{
                padding: '0.5rem 1rem',
                color: '#6b7280',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontWeight: '500'
              }}>
                Login
              </button>
            </Link>
            <Link href="/register">
              <button style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                color: 'white',
                padding: '0.5rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}>
                Start Investing
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            color: '#111827',
            margin: '0 0 1rem 0',
            lineHeight: '1.1'
          }}>
            Grow Your <span style={{ 
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Wealth</span><br />
            Not Just Your Hopes
          </h1>
          
          <p style={{
            fontSize: '1.25rem',
            color: '#6b7280',
            margin: '0 0 2rem 0',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Choose a Forex Package with FXBOT That Works While You Sleep — With Full Transparency & Weekly Profits.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register">
              <button style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                color: 'white',
                padding: '0.875rem 2rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1.125rem',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s ease'
              }}>
                Start Investing
                <ArrowRight style={{ width: '1.25rem', height: '1.25rem', marginLeft: '0.5rem' }} />
              </button>
            </Link>
            <button style={{
              background: 'white',
              color: '#374151',
              padding: '0.875rem 2rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1.125rem'
            }}>
              View Plans
            </button>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section style={{ padding: '4rem 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '1rem',
            padding: '2rem',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              margin: '0 0 2rem 0',
              textAlign: 'center'
            }}>
              Live ROI Calculator
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '2rem',
              alignItems: 'center'
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '600', 
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Investment Amount ($)
                </label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
                
                <div style={{ marginTop: '1rem' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Plan
                  </label>
                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="fs-income">FS Income (6% Monthly)</option>
                    <option value="dri-income">DRI Income</option>
                  </select>
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  borderRadius: '1rem',
                  padding: '2rem',
                  color: 'white'
                }}>
                  <h4 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    margin: '0 0 1rem 0',
                    opacity: 0.9
                  }}>
                    Monthly Returns
                  </h4>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 'bold', 
                    margin: '0 0 0.5rem 0' 
                  }}>
                    ${calculateROI()}
                  </div>
                  <p style={{ 
                    opacity: 0.8, 
                    fontSize: '0.875rem',
                    margin: 0
                  }}>
                    Based on {selectedPlan === 'fs-income' ? 'FS Income (6% Monthly)' : 'DRI Income'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose FXBOT */}
      <section style={{ padding: '4rem 0', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#111827',
              margin: '0 0 1rem 0'
            }}>
              Why Choose FXBOT?
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#6b7280',
              margin: 0
            }}>
              Professional trading solutions with complete transparency
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '2rem' 
          }}>
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    padding: '2rem',
                    textAlign: 'center',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(229, 231, 235, 0.5)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{
                    width: '4rem',
                    height: '4rem',
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    borderRadius: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem'
                  }}>
                    <IconComponent style={{ width: '2rem', height: '2rem', color: 'white' }} />
                  </div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: '#111827',
                    margin: '0 0 1rem 0'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Investment Packages */}
      <section style={{ padding: '4rem 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#111827',
              margin: '0 0 1rem 0'
            }}>
              Investment Packages
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#6b7280',
              margin: 0
            }}>
              Diversified Forex investment plans tailored to different risk profiles
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  padding: '2rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  border: '2px solid rgba(229, 231, 235, 0.5)',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(229, 231, 235, 0.5)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{
                  background: `linear-gradient(135deg, ${plan.color.split(' ')[1]}, ${plan.color.split(' ')[3]})`,
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  color: 'white',
                  textAlign: 'center'
                }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    margin: '0 0 0.25rem 0'
                  }}>
                    {plan.name}
                  </h3>
                  <p style={{ fontSize: '1rem', margin: 0, opacity: 0.9 }}>
                    {plan.subtitle}
                  </p>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  {plan.minimum && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: '600', color: '#374151' }}>Minimum: </span>
                      <span style={{ color: '#6b7280' }}>{plan.minimum}</span>
                    </div>
                  )}
                  {plan.return && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: '600', color: '#374151' }}>Return: </span>
                      <span style={{ color: '#6b7280' }}>{plan.return}</span>
                    </div>
                  )}
                  {plan.duration && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: '600', color: '#374151' }}>Duration: </span>
                      <span style={{ color: '#6b7280' }}>{plan.duration}</span>
                    </div>
                  )}
                  {plan.levels && (
                    <div style={{ marginBottom: '1rem' }}>
                      {plan.levels.map((level, idx) => (
                        <div key={idx} style={{ marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: '600', color: '#374151' }}>Level {level.level}: </span>
                          <span style={{ color: '#6b7280' }}>{level.rate}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {plan.tiers && (
                    <div style={{ marginBottom: '1rem' }}>
                      {plan.tiers.map((tier, idx) => (
                        <div key={idx} style={{ marginBottom: '0.5rem' }}>
                          <div style={{ fontWeight: '600', color: '#374151' }}>Tier {tier.tier}: {tier.salary}</div>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{tier.requirements}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.5',
                  margin: '0 0 2rem 0',
                  fontSize: '0.875rem'
                }}>
                  {plan.description}
                </p>
                
                <Link href="/register">
                  <button style={{
                    width: '100%',
                    background: `linear-gradient(135deg, ${plan.color.split(' ')[1]}, ${plan.color.split(' ')[3]})`,
                    color: 'white',
                    padding: '0.875rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}>
                    Choose Plan
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '4rem 0', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#111827',
              margin: '0 0 1rem 0'
            }}>
              What Our Investors Say
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#6b7280',
              margin: 0
            }}>
              Real experiences from our satisfied clients
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '2rem' 
          }}>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  padding: '2rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(229, 231, 235, 0.5)'
                }}
              >
                <div style={{ display: 'flex', marginBottom: '1rem' }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} style={{ width: '1rem', height: '1rem', color: '#fbbf24', fill: '#fbbf24' }} />
                  ))}
                </div>
                <p style={{
                  color: '#374151',
                  lineHeight: '1.6',
                  margin: '0 0 1rem 0',
                  fontStyle: 'italic'
                }}>
                  "{testimonial.text}"
                </p>
                <div style={{ fontWeight: '600', color: '#111827' }}>
                  {testimonial.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '4rem 0',
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            margin: '0 0 1rem 0'
          }}>
            Ready to Start Your Investment Journey?
          </h2>
          <p style={{
            fontSize: '1.125rem',
            margin: '0 0 2rem 0',
            opacity: 0.9
          }}>
            Join thousands of satisfied investors who trust FXBOT for consistent returns and professional forex trading.
          </p>
          <Link href="/register">
            <button style={{
              background: 'white',
              color: '#3b82f6',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1.125rem',
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'all 0.2s ease'
            }}>
              Get Started Today
              <ArrowRight style={{ width: '1.25rem', height: '1.25rem', marginLeft: '0.5rem' }} />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#111827', color: 'white', padding: '3rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  borderRadius: '0.375rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '0.5rem'
                }}>
                  <TrendingUp style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>FXBOT</span>
              </div>
              <p style={{ color: '#9ca3af', lineHeight: '1.6', margin: 0 }}>
                Professional Forex investment solutions with transparent strategies and consistent returns.
              </p>
            </div>
            
            <div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                Contact Info
              </h4>
              <div style={{ color: '#9ca3af', lineHeight: '1.8' }}>
                <div>support@fxbot.co.in</div>
                <div>Mon - Fri: 9:00 AM - 6:00 PM IST</div>
                <div>Bay View Tower, Business Bay, Dubai, UAE</div>
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                Quick Links
              </h4>
              <div style={{ color: '#9ca3af', lineHeight: '1.8' }}>
                <div><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms & Conditions</a></div>
                <div><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a></div>
                <div><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Risk Disclaimer</a></div>
                <div><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Contact Support</a></div>
              </div>
            </div>
          </div>
          
          <div style={{
            borderTop: '1px solid #374151',
            paddingTop: '2rem',
            textAlign: 'center',
            color: '#9ca3af'
          }}>
            <p style={{ margin: 0 }}>
              © 2025 FXBOT. All rights reserved. Investment involves risk and past performance is not indicative of future results.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;