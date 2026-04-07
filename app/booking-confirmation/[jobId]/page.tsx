'use client';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { CheckCircle, Calendar, ArrowRight, Phone, MapPin, Clock, DollarSign, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';

interface JobDetails {
  id: string;
  serviceType: string;
  status: string;
  postcode: string;
  date: string;
  time: string;
  address: string;
  phone: string;
  email: string;
  bedrooms: number;
  bathrooms: number;
  sqm: number;
  frequency: string;
  price: string;
  createdAt: string;
}

export default function BookingConfirmationPage() {
  const params = useParams();
  const jobId = params.jobId as string;
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to fetch job details from localStorage (set during booking)
    const storedJob = localStorage.getItem(`job_${jobId}`);
    if (storedJob) {
      setJob(JSON.parse(storedJob));
    }
    setLoading(false);
  }, [jobId]);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatServiceType = (type: string) => {
    const serviceNames: Record<string, string> = {
      residential: '🏠 Residential Cleaning',
      commercial: '🏢 Commercial Cleaning',
      ndis: '♿ NDIS Support',
      strata: '🏗️ Strata Cleaning',
      airbnb: '🏡 Airbnb Turnover',
      'real-estate': '🔑 Real Estate Cleaning',
    };
    return serviceNames[type] || type;
  };

  const formatFrequency = (freq: string) => {
    const freqNames: Record<string, string> = {
      'one-time': 'One-time',
      weekly: 'Weekly',
      fortnightly: 'Fortnightly',
      monthly: 'Monthly',
    };
    return freqNames[freq] || freq;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-cyan-950">
      <Navigation />
      <div className="max-w-4xl mx-auto px-6 py-20 pt-32">
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', duration: 0.8 }} className="text-center mb-12">
          <CheckCircle className="w-32 h-32 text-green-400 mx-auto mb-8" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-6">
            Booking Confirmed!
          </h1>
          <p className="text-2xl text-gray-300">
            Job ID: <span className="font-mono text-cyan-400">{jobId}</span>
          </p>
        </motion.div>

        {job && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Booking Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="bg-cyan-500/20 p-3 rounded-xl">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Date & Time</p>
                  <p className="text-white font-medium">{formatDate(job.date)} at {job.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-purple-500/20 p-3 rounded-xl">
                  <MapPin className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Service Type</p>
                  <p className="text-white font-medium">{formatServiceType(job.serviceType)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-500/20 p-3 rounded-xl">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Price</p>
                  <p className="text-white font-medium">${job.price} AUD</p>
                  {job.frequency && job.frequency !== 'one-time' && (
                    <p className="text-gray-400 text-xs">{formatFrequency(job.frequency)} service</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-pink-500/20 p-3 rounded-xl">
                  <Clock className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className="text-green-400 font-medium capitalize">{job.status}</p>
                </div>
              </div>

              {job.bedrooms > 0 && (
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500/20 p-3 rounded-xl">
                    <span className="text-blue-400">🛏️</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Property Details</p>
                    <p className="text-white font-medium">
                      {job.bedrooms} bed, {job.bathrooms} bath
                      {job.sqm && ` • ${job.sqm}m²`}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="bg-yellow-500/20 p-3 rounded-xl">
                  <MapPin className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Postcode</p>
                  <p className="text-white font-medium">{job.postcode}</p>
                </div>
              </div>
            </div>

            {(job.email || job.phone) && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
                <div className="flex flex-wrap gap-4">
                  {job.email && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Mail className="w-4 h-4 text-cyan-400" />
                      <span>{job.email}</span>
                    </div>
                  )}
                  {job.phone && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone className="w-4 h-4 text-purple-400" />
                      <span>{job.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {!loading && !job && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 mb-8 text-center">
            <p className="text-gray-300 text-lg">
              Your booking has been received. We&apos;ll send detailed confirmation shortly.
            </p>
          </motion.div>
        )}

        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 mb-12">
          <div className="flex items-center justify-center gap-3 text-lg text-gray-300">
            <Mail className="w-6 h-6 text-cyan-400" />
            <span>We&apos;ve sent a confirmation email with all details</span>
          </div>
        </motion.div>

        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-col md:flex-row gap-6 justify-center">
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
