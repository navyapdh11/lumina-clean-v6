'use client';

import { DFSDynamicMenu } from '@/components/DFSDynamicMenu';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  BarChart3, 
  Bot, 
  Database, 
  Users, 
  Settings,
  TrendingUp,
  DollarSign,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

const QUICK_LINKS = [
  { id: 'bookings', label: 'Bookings', href: '/dashboard/bookings', icon: Calendar, color: 'bg-blue-500' },
  { id: 'analytics', label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, color: 'bg-green-500' },
  { id: 'kairos', label: 'KAIROS Agent', href: '/dashboard/agents/kairos', icon: Bot, color: 'bg-purple-500' },
  { id: 'krites', label: 'Krites Cache', href: '/dashboard/agents/krites', icon: Database, color: 'bg-orange-500' },
  { id: 'customers', label: 'Customers', href: '/dashboard/customers', icon: Users, color: 'bg-cyan-500' },
  { id: 'settings', label: 'Settings', href: '/dashboard/settings', icon: Settings, color: 'bg-gray-500' },
];

export default function DashboardHomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DFSDynamicMenu userRole="admin" currentPath="/dashboard" />
      
      <div className="pt-20 pb-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-500">Welcome to Lumina Clean Enterprise</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-500">Today's Bookings</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">14</p>
            <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +3 from yesterday
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-500">Revenue (MTD)</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">$12,450</p>
            <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +18% vs last month
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Bot className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-gray-500">AI Agents</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">3 Active</p>
            <p className="text-sm text-gray-500 mt-1">KAIROS running</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-gray-500">Cache Hit Rate</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">84%</p>
            <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +5% this week
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {QUICK_LINKS.map((link, i) => {
              const Icon = link.icon;
              return (
                <Link key={link.id} href={link.href}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className={`w-10 h-10 ${link.color} rounded-lg flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-medium text-gray-900">{link.label}</p>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
