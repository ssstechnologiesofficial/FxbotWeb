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
    <section id="contact" className="py-20 bg-dark-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Contact <span className="text-gold">Us</span></h2>
          <p className="text-xl text-gray-300">Get in touch with our team for any inquiries</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="animate-slideIn">
            <h3 className="text-2xl font-bold mb-8">Get In Touch</h3>
            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{info.title}</h4>
                      <p className="text-gray-300">{info.details}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-dark-card p-8 rounded-2xl border border-gold/20 animate-fadeIn">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 bg-dark-secondary border border-gray-600 rounded-lg text-white focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 bg-dark-secondary border border-gray-600 rounded-lg text-white focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-dark-secondary border border-gray-600 rounded-lg text-white focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-dark-secondary border border-gray-600 rounded-lg text-white focus:border-gold focus:outline-none"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Investment Support">Investment Support</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Partnership">Partnership</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea 
                  rows="4" 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-dark-secondary border border-gray-600 rounded-lg text-white focus:border-gold focus:outline-none"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full py-3 bg-gradient-to-r from-gold to-gold-dark text-dark-bg font-semibold rounded-lg hover:opacity-90 transition-opacity"
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
