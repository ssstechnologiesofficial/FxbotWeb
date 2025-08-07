import { Star } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "John Smith",
      review: "FXBOT has been delivering consistent returns for over 8 months. Their transparency and professional approach gives me complete confidence in my investments.",
      image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100"
    },
    {
      name: "Sarah Johnson",
      review: "The FS Income plan is exactly what I needed - reliable 6% monthly returns. The team's expertise in forex trading really shows in the results.",
      image: "https://images.unsplash.com/photo-1494790108755-2616c5e94cfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100"
    },
    {
      name: "Michael Brown",
      review: "I've tried many investment platforms, but FXBOT stands out with their professional approach and consistent performance. Highly recommended!",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100"
    }
  ];

  return (
    <section className="section bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">What Our <span className="text-gold">Investors</span> Say</h2>
          <p className="text-xl text-secondary">Real experiences from our satisfied clients</p>
        </div>

        <div className="grid grid-cols-1 gap-8 testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="card p-8 border animate-fadeIn"
              style={{ 
                animationDelay: `${index * 0.2}s`,
                borderColor: 'rgba(255, 215, 0, 0.1)' 
              }}
            >
              <div className="flex items-center mb-6" style={{ gap: '1rem' }}>
                <img 
                  src={testimonial.image} 
                  alt={`${testimonial.name} testimonial`} 
                  className="rounded-full"
                  style={{ 
                    width: '4rem', 
                    height: '4rem', 
                    objectFit: 'cover' 
                  }}
                />
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <div className="flex text-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} style={{ width: '1rem', height: '1rem', fill: 'currentColor' }} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-secondary" style={{ fontStyle: 'italic' }}>"{testimonial.review}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
