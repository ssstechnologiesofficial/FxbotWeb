import { useState } from 'react';
import { Mail, Phone, Clock, MapPin } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      subject: 'General Inquiry',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "support@fxbot.co.in"
    },
    {
      icon: Phone,
      title: "Phone",
      details: "+1 (555) 123-4567"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Mon - Fri: 9:00 AM - 6:00 PM IST"
    },
    {
      icon: MapPin,
      title: "Address",
      details: "Bay View Tower, Business Bay, Dubai, UAE"
    }
  ];

  return (
    <section id="contact" className="section bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Contact <span className="text-gold">Us</span></h2>
          <p className="text-xl text-secondary">Get in touch with our team for any inquiries</p>
        </div>

        <div className="grid grid-cols-1 gap-8 contact-grid">
          <div className="animate-slideIn">
            <h3 className="text-2xl font-bold mb-8">Get In Touch</h3>
            <div className="contact-info" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <div key={index} className="flex items-center" style={{ gap: '1rem' }}>
                    <div className="contact-icon-wrapper" style={{
                      width: '3rem',
                      height: '3rem',
                      backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      borderRadius: 'var(--border-radius)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconComponent style={{ width: '1.5rem', height: '1.5rem', color: 'var(--primary-gold)' }} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{info.title}</h4>
                      <p className="text-secondary">{info.details}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card p-8 animate-fadeIn" style={{ borderColor: 'rgba(255, 215, 0, 0.2)' }}>
            <form onSubmit={handleSubmit} className="contact-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="grid grid-cols-1 gap-6 form-row">
                <div>
                  <label className="form-label">First Name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Subject</label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Investment Support">Investment Support</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Partnership">Partnership</option>
                </select>
              </div>
              <div>
                <label className="form-label">Message</label>
                <textarea 
                  rows="4" 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  style={{ resize: 'vertical' }}
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="btn w-full font-semibold"
                style={{
                  background: 'linear-gradient(135deg, var(--primary-gold), var(--hover-gold))',
                  color: 'var(--dark-bg)'
                }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
