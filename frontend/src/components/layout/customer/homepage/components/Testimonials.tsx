import { Star } from 'lucide-react'

export const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      review:
        'Amazing quality and fast shipping! The frames fit perfectly and look exactly like the photos.'
    },
    {
      name: 'Michael Chen',
      rating: 5,
      review:
        'Best online eyewear shopping experience. The virtual try-on feature is incredibly helpful.'
    },
    {
      name: 'Emma Davis',
      rating: 5,
      review:
        'Love my new glasses! Great customer service and the return policy gave me peace of mind.'
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold text-mint-1200 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-eyewear">Trusted by thousands of happy customers</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-mint-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary-500 text-primary-500" />
                ))}
              </div>
              <p className="text-gray-eyewear mb-4 italic">"{testimonial.review}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{testimonial.name[0]}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-mint-1200">{testimonial.name}</h4>
                  <p className="text-sm text-gray-eyewear">Verified Customer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
