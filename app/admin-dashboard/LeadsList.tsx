'use client';

import { trpc } from '@/lib/trpc/client';
import { Users, Mail, Phone, Calendar, ExternalLink, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Lead {
  id: string;
  type: string;
  contactName: string;
  email: string;
  phone: string | null;
  businessName: string | null;
  status: string;
  source: string;
  createdAt: string;
}

export function LeadsList() {
  const { data: leads, isLoading } = trpc.getLeads.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <span className="ml-3 text-gray-400">Loading leads...</span>
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
        <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No leads yet</h3>
        <p className="text-gray-400">Leads will appear here when forms are submitted</p>
      </div>
    );
  }

  const formatType = (type: string) => {
    const types: Record<string, string> = {
      'commercial-quote': '🏢 Commercial Quote',
      'ndis-assessment': '♿ NDIS Assessment',
      'strata-audit': '🏗️ Strata Audit',
    };
    return types[type] || type;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-AU', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-green-500/20 text-green-400 border-green-500/30',
      contacted: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      qualified: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      converted: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      lost: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Lead</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Type</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Source</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead: Lead, i: number) => (
              <motion.tr
                key={lead.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium text-white">{lead.contactName}</div>
                    <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {lead.email}
                      </span>
                      {lead.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {lead.phone}
                        </span>
                      )}
                    </div>
                    {lead.businessName && (
                      <div className="text-xs text-gray-500 mt-1">{lead.businessName}</div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-300">
                  {formatType(lead.type)}
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-400 capitalize">
                  {lead.source.replace('-', ' ')}
                </td>
                <td className="py-4 px-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(lead.createdAt)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${lead.email}`}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Send email"
                    >
                      <Mail className="w-4 h-4 text-cyan-400" />
                    </a>
                    {lead.phone && (
                      <a
                        href={`tel:${lead.phone}`}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Call"
                      >
                        <Phone className="w-4 h-4 text-purple-400" />
                      </a>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10 text-sm text-gray-400">
        <span>{leads.length} lead{leads.length !== 1 ? 's' : ''} total</span>
        <span>
          {leads.filter((l: Lead) => l.status === 'new').length} new ·{' '}
          {leads.filter((l: Lead) => l.status === 'contacted').length} contacted ·{' '}
          {leads.filter((l: Lead) => l.status === 'qualified').length} qualified
        </span>
      </div>
    </div>
  );
}
