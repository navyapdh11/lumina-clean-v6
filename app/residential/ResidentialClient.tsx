'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { ArrowRight, Sparkles, Clock, Shield, CheckCircle } from 'lucide-react';

export default function ResidentialClient() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-cyan-950">
      <Navigation />
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-6xl md:text-8xl font-black bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-8">
            Residential Cleaning
          </motion.h1>
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">AI-powered pricing. Same-day service. 100% satisfaction guarantee.</p>
          <div className="flex flex-col md:flex-row gap-6 justify-center mb-16">
            <Link href="/residential/ar-scanner" className="bg-gradient-to-r from-green-500 to-emerald-600 px-12 py-6 rounded-3xl text-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-3">
              📱 Scan Your Room (AR) <ArrowRight className="w-6 h-6" />
            </Link>
            <Link href="/book" className="bg-gradient-to-r from-cyan-500 to-blue-600 px-12 py-6 rounded-3xl text-xl font-bold hover:scale-105 transition-transform">📅 Book Now</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              { icon: Sparkles, title: 'AI Pricing', desc: 'Instant quotes via AR scan' },
              { icon: Clock, title: 'Same-Day', desc: 'Available today in most postcodes' },
              { icon: Shield, title: 'Insured', desc: '$20M public liability' },
            ].map((feature, i) => (
              <motion.div key={feature.title} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }} className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                <feature.icon className="w-12 h-12 text-cyan-400 mb-4" />
                <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="bg-white/5 backdrop-blur-xl p-12 rounded-3xl border border-white/10">
            <h2 className="text-4xl font-bold mb-8">What&apos;s Included</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              {['All floors vacuumed & mopped', 'Dusting all surfaces', 'Kitchen: benches, sink, exterior appliances', 'Bathrooms: toilet, shower, sink, mirrors', 'Bedrooms: made beds, tidy surfaces', 'Living areas: vacuum, dust, organize', 'Windows: interior glass (ground floor)', 'Bin emptying & replacement'].map((item) => (
                <motion.div key={item} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.05 }} className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-lg text-gray-300">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
