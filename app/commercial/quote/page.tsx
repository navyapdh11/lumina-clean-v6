'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { ArrowRight, Building2, DollarSign, Calendar, Mail, Phone, CheckCircle, Info } from 'lucide-react';
import { useState } from 'react';

export default function CommercialQuotePage() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    propertyType: '',
    sqm: '',
    floors: '',
    frequency: '',
    services: [] as string[],
    message: '',
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
          type: 'commercial-quote',
          ...formData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setFormData({
          businessName: '',
          contactName: '',
          email: '',
          phone: '',
          propertyType: '',
          sqm: '',
          floors: '',
          frequency: '',
          services: [],
          message: '',
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

  const serviceOptions = ['Office cleaning', 'Carpet cleaning', 'Window cleaning', 'Floor stripping & sealing', 'High-pressure washing', 'Restroom sanitation', 'Kitchen/break room cleaning', 'Waste management'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-cyan-950">
      <Navigation />
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-6">
              Commercial Quote Request
            </h1>
            <p className="text-xl text-gray-300">Tell us about your space and we&apos;ll provide a detailed quote within 24 hours.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: DollarSign, title: 'From $0.65/sqm', desc: 'Competitive enterprise pricing' },
              { icon: Calendar, title: 'Flexible Schedule', desc: 'Daily, weekly, or custom frequency' },
              { icon: Building2, title: 'All Property Types', desc: 'Offices, retail, medical, education' },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }} className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 text-center">
                <f.icon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <h3 className="font-bold mb-1">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.form initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl p-10 rounded-3xl border border-white/10 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Business Name *</label>
                <input type="text" required value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors" placeholder="Your Business Pty Ltd" />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Contact Name *</label>
                <input type="text" required value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors" placeholder="John Smith" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-black/40 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors" placeholder="john@business.com" />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Phone *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-black/40 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors" placeholder="04XX XXX XXX" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Property Type *</label>
                <select required value={formData.propertyType} onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors">
                  <option value="">Select...</option>
                  <option value="office">Office</option>
                  <option value="retail">Retail</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="medical">Medical/Healthcare</option>
                  <option value="education">Education</option>
                  <option value="gym">Gym/Fitness</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Area (sqm) *</label>
                <input type="number" required value={formData.sqm} onChange={(e) => setFormData({ ...formData, sqm: e.target.value })} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors" placeholder="500" />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Number of Floors</label>
                <input type="number" value={formData.floors} onChange={(e) => setFormData({ ...formData, floors: e.target.value })} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors" placeholder="1" />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Cleaning Frequency *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Daily', '3x per week', 'Weekly', 'Fortnightly'].map((freq) => (
                  <button key={freq} type="button" onClick={() => setFormData({ ...formData, frequency: freq })} className={`px-4 py-3 rounded-xl border transition-all ${formData.frequency === freq ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-black/30 border-white/20 text-gray-400 hover:border-white/40'}`}>
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-3 font-medium">Services Required</label>
              <div className="grid md:grid-cols-2 gap-3">
                {serviceOptions.map((service) => (
                  <label key={service} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.services.includes(service) ? 'bg-cyan-500/20 border-cyan-500' : 'bg-black/30 border-white/20 hover:border-white/40'}`}>
                    <input type="checkbox" checked={formData.services.includes(service)} onChange={(e) => {
                      if (e.target.checked) setFormData({ ...formData, services: [...formData.services, service] });
                      else setFormData({ ...formData, services: formData.services.filter((s: string) => s !== service) });
                    }} className="w-5 h-5 accent-cyan-500" />
                    <span className="text-gray-300">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Additional Details</label>
              <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={4} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors" placeholder="Any special requirements, access details, or notes..."></textarea>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <p className="text-gray-300 text-sm">Our team will review your requirements and send a detailed quote within 24 hours. For urgent requests, call us at <span className="text-cyan-400 font-bold">1300-PERTHCLEAN</span>.</p>
            </div>

            {submitStatus === 'success' && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                <p className="text-green-400 font-medium">✅ Quote request submitted successfully!</p>
                <p className="text-gray-400 text-sm mt-1">Our team will contact you within 24 hours.</p>
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
                <p className="text-red-400 font-medium">❌ Submission failed</p>
                <p className="text-gray-400 text-sm mt-1">Please try again or call us at 1300-PERTHCLEAN</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 rounded-xl text-lg font-bold hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <>Submit Quote Request <ArrowRight className="w-5 h-5" /></>
              )}
            </button>

            <div className="flex items-center justify-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No obligation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Free site audit available</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>24hr response time</span>
              </div>
            </div>
          </motion.form>

          <div className="text-center mt-8">
            <Link href="/commercial" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" /> Back to Commercial Services
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
