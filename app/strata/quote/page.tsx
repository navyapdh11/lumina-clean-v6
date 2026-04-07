'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { ArrowRight, Building, DollarSign, Calendar, Mail, Phone, CheckCircle, Info, Layers, Users, ClipboardList } from 'lucide-react';
import { useState } from 'react';

export default function StrataQuotePage() {
  const [formData, setFormData] = useState({
    strataName: '',
    contactName: '',
    role: '',
    email: '',
    phone: '',
    lotCount: '',
    floors: '',
    facilities: [] as string[],
    frequency: '',
    currentProvider: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Site audit request submitted! Our strata specialist will contact you within 24 hours to arrange a free on-site inspection.');
  };

  const facilityOptions = ['Foyer/Entrance', 'Elevator/Lift', 'Gym', 'Pool', 'Sauna/Spa', 'BBQ/Entertainment Area', 'Car Park', 'Garden/Pathways', 'Rubbish Room', 'Rooftop/Terrace', 'Storage Cage', 'Fire Stairs'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-cyan-950">
      <Navigation />
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-6">
              Free Strata Site Audit
            </h1>
            <p className="text-xl text-gray-300">Get a comprehensive cleaning assessment tailored to your strata scheme&apos;s needs. No obligation.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Building, title: 'From $450/location', desc: 'Transparent strata pricing' },
              { icon: Users, title: 'Dedicated Manager', desc: 'Single point of contact' },
              { icon: ClipboardList, title: 'Custom Plan', desc: 'Tailored to your scheme' },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }} className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 text-center">
                <f.icon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <h3 className="font-bold mb-1">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-cyan-400 mb-3 flex items-center gap-2">
              <Layers className="w-5 h-5" />
              What&apos;s Included in the Free Site Audit
            </h3>
            <div className="grid md:grid-cols-2 gap-3 text-gray-300 text-sm">
              {['On-site inspection by strata specialist', 'Detailed area-by-area assessment', 'Customized cleaning schedule proposal', 'Transparent pricing breakdown', 'Compliance & safety requirements review', 'Before/after photo documentation plan'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <motion.form initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl p-10 rounded-3xl border border-white/10 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Strata Plan Name *</label>
                <input type="text" required value={formData.strataName} onChange={(e) => setFormData({ ...formData, strataName: e.target.value })} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors" placeholder="SP 12345 - Oceanview Towers" />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Contact Name *</label>
                <input type="text" required value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors" placeholder="Jane Smith" />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Your Role *</label>
              <select required value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors">
                <option value="">Select...</option>
                <option value="chairperson">Chairperson</option>
                <option value="secretary">Secretary</option>
                <option value="treasurer">Treasurer</option>
                <option value="strata_manager">Strata Manager</option>
                <option value="committee">Committee Member</option>
                <option value="owner">Owner</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-black/40 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors" placeholder="jane@strata.com" />
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

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Number of Lots *</label>
                <input type="number" required value={formData.lotCount} onChange={(e) => setFormData({ ...formData, lotCount: e.target.value })} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors" placeholder="50" />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Number of Levels</label>
                <input type="number" value={formData.floors} onChange={(e) => setFormData({ ...formData, floors: e.target.value })} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors" placeholder="10" />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-3 font-medium">Facilities to Clean</label>
              <div className="grid md:grid-cols-3 gap-3">
                {facilityOptions.map((facility) => (
                  <label key={facility} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.facilities.includes(facility) ? 'bg-cyan-500/20 border-cyan-500' : 'bg-black/30 border-white/20 hover:border-white/40'}`}>
                    <input type="checkbox" checked={formData.facilities.includes(facility)} onChange={(e) => {
                      if (e.target.checked) setFormData({ ...formData, facilities: [...formData.facilities, facility] });
                      else setFormData({ ...formData, facilities: formData.facilities.filter((f: string) => f !== facility) });
                    }} className="w-5 h-5 accent-cyan-500" />
                    <span className="text-gray-300 text-sm">{facility}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Cleaning Frequency *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Daily', 'Weekly', 'Fortnightly', 'Monthly'].map((freq) => (
                  <button key={freq} type="button" onClick={() => setFormData({ ...formData, frequency: freq })} className={`px-4 py-3 rounded-xl border transition-all ${formData.frequency === freq ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-black/30 border-white/20 text-gray-400 hover:border-white/40'}`}>
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Current Cleaning Provider (if any)</label>
              <input type="text" value={formData.currentProvider} onChange={(e) => setFormData({ ...formData, currentProvider: e.target.value })} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors" placeholder="Company name or 'None'" />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Additional Details</label>
              <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={4} className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors" placeholder="Specific concerns, access requirements, AGM dates, or notes..."></textarea>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <p className="text-gray-300 text-sm">After the site audit, we&apos;ll provide a comprehensive proposal for your committee review. We can also present at your next AGM if required.</p>
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 rounded-xl text-lg font-bold hover:scale-[1.02] transition-transform flex items-center justify-center gap-3">
              Request Free Site Audit <ArrowRight className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No obligation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Free AGM presentation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Insured & compliant</span>
              </div>
            </div>
          </motion.form>

          <div className="text-center mt-8">
            <Link href="/strata" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" /> Back to Strata Services
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
