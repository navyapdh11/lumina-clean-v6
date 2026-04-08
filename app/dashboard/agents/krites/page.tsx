'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Database, Search, Trash2, Activity, Clock, Zap, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
}

interface CacheEntry {
  key: string;
  value: string;
  timestamp: number;
  ttl: number;
  accessCount: number;
}

export default function KritesCachePage() {
  const [stats, setStats] = useState<CacheStats>({ size: 0, hits: 0, misses: 0, hitRate: 0 });
  const [entries, setEntries] = useState<CacheEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/cache/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      setStats({ size: 12, hits: 847, misses: 156, hitRate: 84.5 });
      setEntries([
        { key: 'semantic:abc123', value: '{"result":"cached"}', timestamp: Date.now() - 60000, ttl: 3600, accessCount: 5 },
        { key: 'semantic:def456', value: '{"result":"cached"}', timestamp: Date.now() - 120000, ttl: 3600, accessCount: 3 },
        { key: 'semantic:ghi789', value: '{"result":"cached"}', timestamp: Date.now() - 180000, ttl: 3600, accessCount: 1 },
      ]);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const handleClearCache = async () => {
    setLoading(true);
    try {
      await fetch('/api/cache/clear', { method: 'POST' });
      await fetchStats();
    } finally {
      setLoading(false);
    }
  };

  const handleWarmCache = async () => {
    setLoading(true);
    try {
      await fetch('/api/cache/warm', { method: 'POST' });
      await fetchStats();
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter(e => 
    e.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Krites Cache</h1>
            <p className="text-sm text-gray-500">Async Semantic Caching Engine</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleWarmCache}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Warm Cache
          </button>
          <button
            onClick={handleClearCache}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Database className="w-4 h-4" />
            <span className="text-sm">Cache Size</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">{stats.size}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Hits</span>
          </div>
          <span className="text-2xl font-bold text-green-600">{stats.hits}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Misses</span>
          </div>
          <span className="text-2xl font-bold text-red-600">{stats.misses}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Zap className="w-4 h-4" />
            <span className="text-sm">Hit Rate</span>
          </div>
          <span className="text-2xl font-bold text-purple-600">{stats.hitRate.toFixed(1)}%</span>
        </motion.div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Cache Entries</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search keys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="pb-3 font-medium">Key</th>
                <th className="pb-3 font-medium">TTL</th>
                <th className="pb-3 font-medium">Access</th>
                <th className="pb-3 font-medium">Age</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400">
                    No cache entries found
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry, i) => (
                  <motion.tr
                    key={entry.key}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b last:border-0"
                  >
                    <td className="py-3 font-mono text-sm text-purple-600">{entry.key}</td>
                    <td className="py-3 text-sm">{entry.ttl}s</td>
                    <td className="py-3 text-sm">{entry.accessCount}</td>
                    <td className="py-3 text-sm text-gray-500">
                      {Math.floor((Date.now() - entry.timestamp) / 1000)}s ago
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
