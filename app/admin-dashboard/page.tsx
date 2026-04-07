'use client';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/navigation';
import { DollarSign, Users, TrendingUp, Target, BarChart3, Rocket } from 'lucide-react';

export default function AdminDashboard() {
  // tRPC requires a database context — show placeholder data when unavailable
  const metrics = { mrr: 0, activeLeads: 0, conversionRate: 0, pendingTenders: 0 };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 py-20 pt-32">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-12">
          LuminaClean Marketing Hub
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: DollarSign, label: 'MRR', value: metrics ? `$${(metrics.mrr / 1e6).toFixed(1)}M` : '...' },
            { icon: Users, label: 'Active Leads', value: metrics ? metrics.activeLeads.toLocaleString() : '...' },
            { icon: TrendingUp, label: 'Conversion', value: metrics ? `${(metrics.conversionRate * 100).toFixed(0)}%` : '...' },
            { icon: Target, label: 'Pending Tenders', value: metrics ? metrics.pendingTenders : '...' },
          ].map((stat) => (
            <motion.div key={stat.label} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
              <stat.icon className="w-8 h-8 text-cyan-400 mb-3" />
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="funnels" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl p-1 mb-8">
            <TabsTrigger value="funnels">Funnel Builder</TabsTrigger>
            <TabsTrigger value="ads">Ad Manager</TabsTrigger>
            <TabsTrigger value="seo">SEO Optimizer</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="deploy">Auto Deploy</TabsTrigger>
          </TabsList>

          <TabsContent value="funnels">
            <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/10">
              <h3 className="text-3xl font-bold mb-8">AI Funnel Builder</h3>
              <p className="text-gray-400 mb-8">Drag-drop sequences for Residential, Commercial, Strata, NDIS</p>
              <Button className="px-8 py-6 text-lg">Create New Funnel</Button>
            </div>
          </TabsContent>

          <TabsContent value="ads">
            <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/10">
              <h3 className="text-3xl font-bold mb-8">Ad Manager</h3>
              <p className="text-gray-400 mb-8">Google/LinkedIn auto-deploy + A/B testing</p>
              <Button className="px-8 py-6 text-lg bg-gradient-to-r from-green-500 to-emerald-600">Launch Campaign</Button>
            </div>
          </TabsContent>

          <TabsContent value="seo">
            <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/10">
              <h3 className="text-3xl font-bold mb-8">SEO/GEO Optimizer</h3>
              <p className="text-gray-400 mb-8">Auto-generate competitor-crushing content</p>
              <Button className="px-8 py-6 text-lg bg-gradient-to-r from-blue-500 to-cyan-600">Optimize All Pages</Button>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/10">
              <h3 className="text-3xl font-bold mb-8"><BarChart3 className="inline w-8 h-8 mr-3" />Real-Time Analytics</h3>
              <p className="text-gray-400 mb-4">MRR: ${metrics ? (metrics.mrr / 1e6).toFixed(1) : '...'}M | Leads: {metrics ? metrics.activeLeads.toLocaleString() : '...'} | Conversion: {metrics ? (metrics.conversionRate * 100).toFixed(0) : '...'}%</p>
            </div>
          </TabsContent>

          <TabsContent value="deploy">
            <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/10">
              <h3 className="text-3xl font-bold mb-8">AI Auto-Deploy</h3>
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 text-xl px-12 py-8">
                <Rocket className="inline w-6 h-6 mr-2" />
                Deploy All Campaigns (One-Click)
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}
