'use client';
import { motion } from 'framer-motion';
import { useState, Suspense, useCallback } from 'react';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, MapPin, CreditCard, Loader2 } from 'lucide-react';

function BookContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillPrice = searchParams.get('price');

  const [formData, setFormData] = useState({
    serviceType: 'residential',
    postcode: '',
    address: '',
    scheduledAt: '',
    notes: '',
  });
  const [step, setStep] = useState(1);
  const [quote, setQuote] = useState<number | null>(prefillPrice ? parseInt(prefillPrice) : null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  const createJob = trpc.createJob.useMutation();

  const utils = trpc.useUtils();

  const handleGetQuote = useCallback(async () => {
    setQuoteLoading(true);
    try {
      const result = await utils.getQuote.fetch({ postcode: formData.postcode, serviceType: formData.serviceType });
      setQuote(result.price);
      setStep(2);
    } catch (error) {
      console.error('Quote error:', error);
    } finally {
      setQuoteLoading(false);
    }
  }, [formData.postcode, formData.serviceType, utils]);

  const handleBook = useCallback(async () => {
    if (!quote) return;
    try {
      const result = await createJob.mutateAsync({
        serviceType: formData.serviceType,
        postcode: formData.postcode,
        address: formData.address,
        scheduledAt: formData.scheduledAt,
        price: quote,
        metadata: { notes: formData.notes },
      });
      
      // Store job details in localStorage for confirmation page
      localStorage.setItem(`job_${result.jobId}`, JSON.stringify({
        id: result.jobId,
        serviceType: formData.serviceType,
        status: 'pending',
        postcode: formData.postcode,
        date: formData.scheduledAt,
        time: formData.scheduledAt.split('T')[1] || 'TBD',
        address: formData.address,
        phone: '',
        email: '',
        bedrooms: 0,
        bathrooms: 0,
        sqm: 0,
        frequency: 'one-time',
        price: quote.toString(),
        createdAt: new Date().toISOString(),
      }));
      
      router.push(`/booking-confirmation/${result.jobId}`);
    } catch (error) {
      console.error('Booking error:', error);
    }
  }, [quote, formData, createJob, router]);

  return (
    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Service Type</label>
            <select
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="residential" className="bg-black">Residential</option>
              <option value="commercial" className="bg-black">Commercial</option>
              <option value="airbnb" className="bg-black">Airbnb</option>
              <option value="strata" className="bg-black">Strata</option>
              <option value="ndis" className="bg-black">NDIS</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              <MapPin className="inline w-4 h-4 mr-2" />
              Postcode
            </label>
            <input
              type="text"
              value={formData.postcode}
              onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
              placeholder="2000"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <Button onClick={handleGetQuote} disabled={!formData.postcode || quoteLoading} className="w-full py-6 text-lg">
            {quoteLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get Instant Quote'}
          </Button>
        </motion.div>
      )}

      {step === 2 && quote !== null && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="text-center p-6 bg-green-500/10 rounded-2xl border border-green-500/30">
            <div className="text-4xl font-black text-green-400 mb-2">${quote}</div>
            <div className="text-gray-400">Instant Quote</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              <Calendar className="inline w-4 h-4 mr-2" />
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 George St, Sydney NSW 2000"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Special instructions, pets, parking, etc."
              rows={3}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <Button onClick={handleBook} disabled={!formData.address || !formData.scheduledAt || createJob.isPending} className="w-full py-6 text-lg">
            {createJob.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CreditCard className="inline w-5 h-5 mr-2" /> Pay & Book Now</>}
          </Button>
        </motion.div>
      )}
    </div>
  );
}

export default function BookPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-cyan-950">
      <Navigation />
      <div className="max-w-3xl mx-auto px-6 py-20 pt-32">
        <motion.h1 initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl font-bold text-center bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-12">
          Book Your Clean
        </motion.h1>
        <Suspense fallback={<div className="text-center text-gray-400 py-12">Loading booking form...</div>}>
          <BookContent />
        </Suspense>
      </div>
    </motion.div>
  );
}
