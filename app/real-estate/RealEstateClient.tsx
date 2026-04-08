'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { ArrowRight, Home, DollarSign, Clock, Award, CheckCircle, Camera, Sparkles } from 'lucide-react';

export default function RealEstatePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-cyan-950">
      <Navigation />
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-6xl md:text-8xl font-black bg-gradient-to-r from-emerald-400 to-cyan-600 bg-clip-text text-transparent mb-8">
            Real Estate Cleaning
          </motion.h1>
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">Pre-sale presentation cleans & bond-back guaranteed end-of-lease cleaning.</p>
          <div className="flex flex-col md:flex-row gap-6 justify-center mb-16">
            <Link href="/book" className="bg-gradient-to-r from-emerald-500 to-cyan-600 px-12 py-6 rounded-3xl text-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-3">
              📅 Book Clean <ArrowRight className="w-6 h-6" />
            </Link>
            <a href="tel:1300737842" className="bg-gradient-to-r from-cyan-500 to-blue-600 px-12 py-6 rounded-3xl text-xl font-bold hover:scale-105 transition-transform">📞 1300-PERTHCLEAN</a>
          </div>
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white/5 backdrop-blur-xl p-10 rounded-3xl border border-white/10">
              <div className="flex items-center gap-4 mb-6">
                <Home className="w-12 h-12 text-emerald-400" />
                <h2 className="text-3xl font-bold">Pre-Sale Cleans</h2>
              </div>
              <p className="text-gray-300 mb-6 text-lg">Make your listing stand out with a spotless presentation. Perfect for open homes and photography.</p>
              <ul className="space-y-3">
                {['Deep clean all surfaces', 'Window cleaning (inside & out)', 'Carpet steam cleaning', 'Pressure washing (exterior)', 'Garden tidying', 'Garage sweep & organize'].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 bg-emerald-500/20 px-6 py-3 rounded-xl">
                <span className="text-emerald-400 font-bold">From $299</span>
              </div>
            </motion.div>
            <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-white/5 backdrop-blur-xl p-10 rounded-3xl border border-white/10">
              <div className="flex items-center gap-4 mb-6">
                <DollarSign className="w-12 h-12 text-cyan-400" />
                <h2 className="text-3xl font-bold">End of Lease</h2>
              </div>
              <p className="text-gray-300 mb-6 text-lg">Bond-back guarantee. We meet your property manager&apos;s checklist requirements.</p>
              <ul className="space-y-3">
                {['Full bond-back guarantee', 'Property manager approved checklist', 'Carpet cleaning included', 'Oven & rangehood deep clean', 'Window tracks & sills', 'Final inspection support'].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 bg-cyan-500/20 px-6 py-3 rounded-xl">
                <span className="text-cyan-400 font-bold">From $349</span>
              </div>
            </motion.div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {[
              { icon: Camera, title: 'Photo Ready', desc: 'Properties photographed at peak cleanliness' },
              { icon: Clock, title: '48hr Guarantee', desc: 'Fast turnaround for urgent listings' },
              { icon: Award, title: 'Agent Approved', desc: 'Trusted by 200+ real estate agencies' },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }} className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                <f.icon className="w-10 h-10 text-cyan-400 mb-3" />
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-600/20 backdrop-blur-xl p-12 rounded-3xl border border-emerald-500/30">
            <h2 className="text-4xl font-bold mb-6">For Real Estate Agents</h2>
            <p className="text-xl text-gray-300 mb-8">Partner with us for reliable, consistent cleaning across your entire portfolio. Dedicated account manager, priority scheduling, and volume discounts.</p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              {[
                { title: 'Volume Discounts', desc: '10+ properties/month? Get exclusive rates' },
                { title: 'Priority Scheduling', desc: 'Same-day & next-day availability' },
                { title: 'Dedicated Account Mgr', desc: 'Single point of contact for all jobs' },
              ].map((item, i) => (
                <motion.div key={item.title} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 + i * 0.1 }} className="bg-black/30 p-6 rounded-xl">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    {item.title}
                  </h3>
                  <p className="text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
