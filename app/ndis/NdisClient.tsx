'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { ArrowRight, Shield, CheckCircle, Heart, Award } from 'lucide-react';

export default function NDISPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-cyan-950">
      <Navigation />
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-6xl md:text-8xl font-black bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-8">NDIS Cleaning Services</motion.h1>
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">Registered NDIS provider. Compliant, compassionate, and reliable support for your home.</p>
          <div className="flex flex-col md:flex-row gap-6 justify-center mb-16">
            <Link href="/ndis/assessment" className="bg-gradient-to-r from-green-500 to-emerald-600 px-12 py-6 rounded-3xl text-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-3">📋 Free Assessment <ArrowRight className="w-6 h-6" /></Link>
            <a href="tel:1300737842" className="bg-gradient-to-r from-cyan-500 to-blue-600 px-12 py-6 rounded-3xl text-xl font-bold hover:scale-105 transition-transform">📞 1300-PERTHCLEAN</a>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[
              { icon: Award, title: 'NDIS Registered', desc: 'Provider #4050012345' },
              { icon: Shield, title: 'Compliant', desc: '2026 Practice Standards' },
              { icon: Heart, title: 'Compassionate', desc: 'Trauma-informed care' },
              { icon: CheckCircle, title: 'Vetted', desc: 'NDIS Worker Screened' },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }} className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                <f.icon className="w-10 h-10 text-cyan-400 mb-3" />
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="bg-white/5 backdrop-blur-xl p-12 rounded-3xl border border-white/10 text-left">
            <h2 className="text-4xl font-bold mb-8 text-center">NDIS Compliance Framework</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {['Core Module: Rights & Responsibilities', 'Core Module: Provider Governance', 'Core Module: Risk Management', 'Core Module: Incident Management', 'Supplementary: High-Intensity Daily Tasks', 'Supplementary: Specialist Disability Accommodation', 'Work Health & Safety Act 2011', 'Fair Work Act 2009 Compliance'].map((item, i) => (
                <motion.div key={item} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3">
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
