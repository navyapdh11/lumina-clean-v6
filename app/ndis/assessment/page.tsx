'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { ArrowRight, Heart, Shield, CheckCircle, User, Phone, Mail, Info, FileText } from 'lucide-react';
import { useState } from 'react';

export default function NDISAssessmentPage() {
  const [formData, setFormData] = useState({
    participantName: '',
    ndisNumber: '',
    email: '',
    phone: '',
    planType: '',
    livingSituation: '',
    servicesNeeded: [] as string[],
    frequency: '',
    additionalNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ndis-assessment',
          ...formData,
          participantName: formData.participantName,
          ndisNumber: formData.ndisNumber,
          livingSituation: formData.livingSituation,
          services: formData.servicesNeeded,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setFormData({
          participantName: '',
          ndisNumber: '',
          email: '',
          phone: '',
          planType: '',
          livingSituation: '',
          servicesNeeded: [],
          frequency: '',
          additionalNotes: '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceOptions = [
    'Standard home cleaning',
    'Kitchen deep clean',
    'Bathroom sanitization',
    'Vacuuming & mopping',
    'Laundry assistance',
    'Window cleaning',
    'Carpet steam cleaning',
    'Garden maintenance',
    'Decluttering & organization',
    'High-intensity daily tasks',
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-cyan-950">
      <Navigation />
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 px-6 py-2 rounded-full mb-6">
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 font-medium">NDIS Registered Provider #4050012345</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-400 to-cyan-600 bg-clip-text text-transparent mb-6">
              Free NDIS Home Assessment
            </h1>
            <p className="text-xl text-gray-300">We&apos;ll assess your home and create a personalized cleaning support plan aligned with your NDIS goals.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Heart, title: 'Person-Centred', desc: 'Tailored to your needs & goals' },
              { icon: Shield, title: 'Compliant', desc: 'NDIS Practice Standards 2026' },
              { icon: FileText, title: 'Free Report', desc: 'Detailed assessment & plan' },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }} className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 text-center">
                <f.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h3 className="font-bold mb-1">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.form initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl p-10 rounded-3xl border border-white/10 space-y-6">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="text-gray-300 text-sm">
                <p className="font-bold mb-1">Your privacy matters</p>
                <p>All information is handled in accordance with NDIS Privacy Requirements and Australian Privacy Principles.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Participant Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="text" required value={formData.participantName} onChange={(e) => setFormData({ ...formData, participantName: e.target.value })} className="w-full bg-black/40 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors" placeholder="Your name" />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">NDIS Participant Number *</label>
                <input type="text" required value={formData.ndisNumber} onChange={(e) => setFormData({ ...formData, ndisNumber: e.target.value })} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors" placeholder="XXXXXXXXX" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-black/40 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors" placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Phone *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-black/40 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors" placeholder="04XX XXX XXX" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Living Situation *</label>
              <select required value={formData.livingSituation} onChange={(e) => setFormData({ ...formData, livingSituation: e.target.value })} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors">
                <option value="">Select...</option>
                <option value="alone">Living alone</option>
                <option value="family">Living with family</option>
                <option value="sda">Specialist Disability Accommodation (SDA)</option>
                <option value="group">Group home</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">NDIS Plan Type *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Self-Managed', 'Plan-Managed', 'NDIA-Managed', 'Not Sure'].map((type) => (
                  <button key={type} type="button" onClick={() => setFormData({ ...formData, planType: type })} className={`px-4 py-3 rounded-xl border transition-all ${formData.planType === type ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-black/30 border-white/20 text-gray-400 hover:border-white/40'}`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-3 font-medium">Services You Need</label>
              <div className="grid md:grid-cols-2 gap-3">
                {serviceOptions.map((service) => (
                  <label key={service} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.servicesNeeded.includes(service) ? 'bg-purple-500/20 border-purple-500' : 'bg-black/30 border-white/20 hover:border-white/40'}`}>
                    <input type="checkbox" checked={formData.servicesNeeded.includes(service)} onChange={(e) => {
                      if (e.target.checked) setFormData({ ...formData, servicesNeeded: [...formData.servicesNeeded, service] });
                      else setFormData({ ...formData, servicesNeeded: formData.servicesNeeded.filter((s: string) => s !== service) });
                    }} className="w-5 h-5 accent-purple-500" />
                    <span className="text-gray-300">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Preferred Frequency</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Weekly', 'Fortnightly', 'Monthly', 'One-off'].map((freq) => (
                  <button key={freq} type="button" onClick={() => setFormData({ ...formData, frequency: freq })} className={`px-4 py-3 rounded-xl border transition-all ${formData.frequency === freq ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-black/30 border-white/20 text-gray-400 hover:border-white/40'}`}>
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Additional Notes</label>
              <textarea value={formData.additionalNotes} onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })} rows={4} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors" placeholder="Tell us about your specific needs, accessibility requirements, or anything we should know..."></textarea>
            </div>

            <div className="flex items-start gap-3 text-gray-400 text-sm">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p>Our NDIS coordinator will contact you to arrange a free in-home or virtual assessment. All staff are NDIS Worker Screened and vaccinated.</p>
            </div>

            {submitStatus === 'success' && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center mb-4">
                <p className="text-green-400 font-medium">✅ Assessment request submitted successfully!</p>
                <p className="text-gray-400 text-sm mt-1">Our NDIS coordinator will contact you within 48 hours.</p>
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center mb-4">
                <p className="text-red-400 font-medium">❌ Submission failed</p>
                <p className="text-gray-400 text-sm mt-1">Please try again or call us at 1300-PERTHCLEAN</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 px-8 py-4 rounded-xl text-lg font-bold hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? 'Submitting...' : <>Request Free Assessment <ArrowRight className="w-5 h-5" /></>}
            </button>

            <div className="text-center text-gray-400 text-sm">
              Or call us directly: <a href="tel:1300737842" className="text-purple-400 hover:text-purple-300 font-bold">1300-PERTHCLEAN</a>
            </div>
          </motion.form>

          <div className="text-center mt-8">
            <Link href="/ndis" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center justify-center gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" /> Back to NDIS Services
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
