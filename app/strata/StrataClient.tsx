'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { ArrowRight, Building, DollarSign, Users, Clock, CheckCircle } from 'lucide-react';

export default function StrataPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-cyan-950">
      <Navigation />
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-6xl md:text-8xl font-black bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-8">Strata & Body Corporate</motion.h1>
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">Specialized cleaning for strata schemes. Common areas, facilities, and grounds.</p>
          <div className="flex flex-col md:flex-row gap-6 justify-center mb-16">
            <Link href="/strata/quote" className="bg-gradient-to-r from-green-500 to-emerald-600 px-12 py-6 rounded-3xl text-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-3">📊 Free Site Audit <ArrowRight className="w-6 h-6" /></Link>
            <a href="tel:1300737842" className="bg-gradient-to-r from-cyan-500 to-blue-600 px-12 py-6 rounded-3xl text-xl font-bold hover:scale-105 transition-transform">📞 1300-PERTHCLEAN</a>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[
              { icon: DollarSign, title: '$450/location', desc: 'Starting from' },
              { icon: Clock, title: 'Flexible', desc: 'After-hours available' },
              { icon: Building, title: 'All Sizes', desc: '10-1000+ lots' },
              { icon: Users, title: 'Dedicated', desc: 'Account manager' },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }} className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                <f.icon className="w-10 h-10 text-cyan-400 mb-3" />
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="bg-white/5 backdrop-blur-xl p-12 rounded-3xl border border-white/10">
            <h2 className="text-4xl font-bold mb-8 text-center">What We Clean</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              {['Foyers & Entryways', 'Stairwells & Landings', 'Elevators & Lifts', 'Gymnasiums', 'Swimming Pools', 'Saunas & Spas', 'BBQ & Entertainment Areas', 'Gardens & Pathways', 'Car Parks & Driveways', 'Windows (Common Areas)', 'Light Fittings', 'Waste Bins & Recycling'].map((item, i) => (
                <motion.div key={item} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 bg-black/30 p-4 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
