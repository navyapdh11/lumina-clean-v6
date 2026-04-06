'use client';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { CheckCircle, Calendar, ArrowRight, Phone } from 'lucide-react';

export default function BookingConfirmationPage() {
  const params = useParams();
  const jobId = params.jobId as string;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-cyan-950">
      <Navigation />
      <div className="max-w-3xl mx-auto px-6 py-20 pt-32 text-center">
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', duration: 0.8 }}>
          <CheckCircle className="w-32 h-32 text-green-400 mx-auto mb-8" />
        </motion.div>
        <motion.h1 initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-6">
          Booking Confirmed!
        </motion.h1>
        <motion.p initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-2xl text-gray-300 mb-8">
          Job ID: <span className="font-mono text-cyan-400">{jobId}</span>
        </motion.p>
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 mb-12">
          <div className="flex items-center justify-center gap-3 text-lg text-gray-300">
            <Calendar className="w-6 h-6 text-cyan-400" />
            <span>We&apos;ve sent a confirmation email with all details</span>
          </div>
        </motion.div>
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-col md:flex-row gap-6 justify-center">
          <Link href="/" className="bg-gradient-to-r from-cyan-500 to-blue-600 px-12 py-6 rounded-3xl text-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-3">
            Back to Home <ArrowRight className="w-6 h-6" />
          </Link>
          <a href="tel:1300586462" className="bg-gradient-to-r from-purple-500 to-pink-600 px-12 py-6 rounded-3xl text-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-3">
            📞 Call Us <Phone className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}
