'use client';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Thompson',
    role: 'Homeowner, Sydney',
    rating: 5,
    text: 'LuminaClean transformed our home! The AR room scanner gave us an instant quote, and the team arrived the same day. Absolutely phenomenal service - worth every penny!',
    service: 'Residential Clean',
    image: '👩',
  },
  {
    name: 'Michael Chen',
    role: 'Facility Manager, Melbourne',
    rating: 5,
    text: 'We manage 15 office buildings and LuminaClean handles them all flawlessly. Their commercial team is professional, reliable, and the pricing is transparent. Highly recommend!',
    service: 'Commercial Clean',
    image: '👨‍💼',
  },
  {
    name: 'Emma Williams',
    role: 'NDIS Participant, Brisbane',
    rating: 5,
    text: 'As an NDIS participant, finding reliable cleaning support was stressful until I found LuminaClean. Their team understands my needs and always treats my home with respect.',
    service: 'NDIS Support',
    image: '👩‍🦽',
  },
  {
    name: 'David Martinez',
    role: 'Strata Committee Chair, Perth',
    rating: 5,
    text: 'Our 120-lot strata scheme has never looked better. LuminaClean\'s dedicated account manager understands our unique needs and the quality is consistently excellent.',
    service: 'Strata Cleaning',
    image: '👨‍💼',
  },
  {
    name: 'Jessica Lee',
    role: 'Airbnb Host, Gold Coast',
    rating: 5,
    text: 'Game changer for my Airbnb business! The automated turnover cleaning between guests means I get 5-star reviews consistently. The smart lock integration is brilliant.',
    service: 'Airbnb Turnover',
    image: '👩‍💻',
  },
  {
    name: 'Robert Anderson',
    role: 'Real Estate Agent, Adelaide',
    rating: 5,
    text: 'We use LuminaClean for all our pre-sale cleans. Properties sell faster when they look spotless. Their team understands the urgency and delivers every single time.',
    service: 'Real Estate Clean',
    image: '🧑‍💼',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 px-6 bg-black/30 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-400">Trusted by thousands across Australia</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-cyan-500/50 transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl">{testimonial.image}</div>
                <div>
                  <h3 className="font-bold text-lg">{testimonial.name}</h3>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="relative">
                <Quote className="w-8 h-8 text-purple-500/30 absolute -top-2 -left-2" />
                <p className="text-gray-300 pl-6 italic">&ldquo;{testimonial.text}&rdquo;</p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <span className="text-sm text-cyan-400 font-medium">{testimonial.service}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-xl px-8 py-4 rounded-2xl border border-white/10">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-2xl font-bold">4.9/5</span>
            <span className="text-gray-400">from 2,847 reviews</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
