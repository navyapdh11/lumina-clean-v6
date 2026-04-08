import { Metadata } from 'next';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { ArrowRight, Key, Clock, Shield, Sparkles, CheckCircle, Calendar, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Airbnb Turnover Cleaning | LuminaClean — Smart Host Cleaning',
  description: 'Automated Airbnb turnover cleaning between guests. Smart lock integration, 2-4 hour turnaround, photo documentation. From $120.',
  openGraph: {
    title: 'Airbnb Turnover Cleaning | LuminaClean',
    description: 'Automated cleaning between guests with smart lock integration. From $120.',
    type: 'website',
  },
};

export default function AirbnbPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-cyan-950">
      <Navigation />
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-6xl md:text-8xl font-black bg-gradient-to-r from-orange-400 to-pink-600 bg-clip-text text-transparent mb-8">
            Airbnb Turnover Cleaning
          </motion.h1>
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">Automated cleaning between guests. Smart lock integration. 5-star reviews guaranteed.</p>
          <div className="flex flex-col md:flex-row gap-6 justify-center mb-16">
            <Link href="/book" className="bg-gradient-to-r from-orange-500 to-pink-600 px-12 py-6 rounded-3xl text-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-3">
              📅 Schedule Turnover <ArrowRight className="w-6 h-6" />
            </Link>
            <a href="tel:1300586462" className="bg-gradient-to-r from-cyan-500 to-blue-600 px-12 py-6 rounded-3xl text-xl font-bold hover:scale-105 transition-transform">📞 1300-LUMINA</a>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[
              { icon: Key, title: 'Smart Lock', desc: 'Auto-access via smart locks' },
              { icon: Clock, title: 'Fast Turnaround', desc: '2-4 hour cleaning windows' },
              { icon: Shield, title: 'Damage Check', desc: 'Photo documentation included' },
              { icon: Star, title: '5-Star Ready', desc: 'Hotel-quality standards' },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }} className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                <f.icon className="w-10 h-10 text-orange-400 mb-3" />
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="bg-white/5 backdrop-blur-xl p-12 rounded-3xl border border-white/10 mb-20">
            <h2 className="text-4xl font-bold mb-8 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '1', title: 'Guest Checks Out', desc: 'We get notified via your Airbnb calendar integration' },
                { step: '2', title: 'Team Dispatched', desc: 'AI-optimized routing ensures fastest arrival' },
                { step: '3', title: 'Deep Clean Complete', desc: 'Full turnover cleaning with photo report sent to you' },
              ].map((item, i) => (
                <motion.div key={item.step} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 + i * 0.2 }} className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4 mx-auto">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl p-12 rounded-3xl border border-white/10">
            <h2 className="text-4xl font-bold mb-8 text-center">Turnover Checklist</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              {['Strip all beds & replace linens', 'Full bathroom sanitization', 'Kitchen deep clean (all appliances)', 'Vacuum & mop all floors', 'Restock toilet paper & supplies', 'Check & report any damages', 'Smart lock re-lock confirmation', 'Photo report sent to host', 'Restock welcome pack (optional)', 'Pool/spa check (if applicable)'].map((item, i) => (
                <motion.div key={item} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-lg text-gray-300">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="mt-20 bg-gradient-to-r from-orange-500/20 to-pink-600/20 backdrop-blur-xl p-12 rounded-3xl border border-orange-500/30">
            <h2 className="text-4xl font-bold mb-6">Integrate with Your Calendar</h2>
            <p className="text-xl text-gray-300 mb-8">Connect your Airbnb calendar and we&apos;ll auto-schedule cleanings between guests.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="bg-black/40 px-6 py-3 rounded-xl flex items-center gap-3">
                <Calendar className="w-5 h-5 text-orange-400" />
                <span>Airbnb</span>
              </div>
              <div className="bg-black/40 px-6 py-3 rounded-xl flex items-center gap-3">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span>Booking.com</span>
              </div>
              <div className="bg-black/40 px-6 py-3 rounded-xl flex items-center gap-3">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span>VRBO</span>
              </div>
              <div className="bg-black/40 px-6 py-3 rounded-xl flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-pink-400" />
                <span>Direct API</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
