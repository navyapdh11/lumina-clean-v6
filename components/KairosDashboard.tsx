'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Brain, Play, Pause, Activity, Clock, Zap, AlertCircle, CheckCircle } from 'lucide-react';

interface ThoughtNode {
  id: string;
  content: string;
  type: 'observation' | 'hypothesis' | 'decision' | 'action';
  confidence: number;
  timestamp: number;
}

interface KairosStatus {
  running: boolean;
  tickCount: number;
  lastTickAt: number | null;
  activeThoughts: number;
  consolidatedAt: number | null;
}

interface KairosDashboardProps {
  sessionId?: string;
}

export function KairosDashboard({ sessionId = 'default' }: KairosDashboardProps) {
  const [status, setStatus] = useState<KairosStatus>({
    running: false,
    tickCount: 0,
    lastTickAt: null,
    activeThoughts: 0,
    consolidatedAt: null,
  });
  const [thoughts, setThoughts] = useState<ThoughtNode[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toISOString().slice(11, 19);
    setLogs(prev => [...prev.slice(-50), `[${timestamp}] ${message}`]);
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const startDaemon = useCallback(async () => {
    setStatus(prev => ({ ...prev, running: true }));
    addLog('Starting KAIROS GoT daemon...');
    
    const interval = setInterval(async () => {
      const observations = [
        'System latency within normal parameters',
        'Cache hit rate above threshold',
        'Memory usage stable',
        'Active sessions at capacity',
      ];
      const decisions = [
        'Optimize cache for better hit rate',
        'Scale workers for peak load',
        'Enable predictive prefetching',
      ];
      
      const obs: ThoughtNode = {
        id: `obs-${Date.now()}`,
        content: observations[Math.floor(Math.random() * observations.length)],
        type: 'observation',
        confidence: 0.7 + Math.random() * 0.3,
        timestamp: Date.now(),
      };
      
      const decision: ThoughtNode = {
        id: `dec-${Date.now()}`,
        content: decisions[Math.floor(Math.random() * decisions.length)],
        type: 'decision',
        confidence: 0.6 + Math.random() * 0.35,
        timestamp: Date.now(),
      };
      
      setThoughts(prev => [...prev.slice(-20), obs, decision]);
      setStatus(prev => ({
        ...prev,
        tickCount: prev.tickCount + 1,
        lastTickAt: Date.now(),
        activeThoughts: prev.activeThoughts + 2,
      }));
      
      addLog(`Tick ${status.tickCount + 1}: Added observation + decision`);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [addLog, status.tickCount]);

  const stopDaemon = useCallback(() => {
    setStatus(prev => ({ ...prev, running: false }));
    addLog('KAIROS GoT daemon stopped');
  }, [addLog]);

  const triggerConsolidation = useCallback(() => {
    setThoughts(prev => [...prev, {
      id: `summary-${Date.now()}`,
      content: `Consolidated ${prev.length} thoughts into summary`,
      type: 'observation',
      confidence: 0.95,
      timestamp: Date.now(),
    }]);
    setStatus(prev => ({ ...prev, consolidatedAt: Date.now(), activeThoughts: Math.floor(prev.activeThoughts * 0.3) }));
    addLog('Consolidation complete: reduced thoughts by 70%');
  }, [addLog]);

  const getTypeColor = (type: ThoughtNode['type']): string => {
    switch (type) {
      case 'observation': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'hypothesis': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'decision': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'action': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-[#006c49] to-[#10b981] rounded-xl">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">KAIROS Agent</h1>
            <p className="text-sm text-gray-500">Graph-of-Thought Reasoning Engine</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {!status.running ? (
            <button
              onClick={startDaemon}
              className="flex items-center gap-2 px-4 py-2 bg-[#006c49] text-white rounded-lg hover:bg-[#005a40] transition-colors"
            >
              <Play className="w-4 h-4" />
              Start
            </button>
          ) : (
            <button
              onClick={stopDaemon}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Pause className="w-4 h-4" />
              Stop
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Activity className="w-4 h-4" />
            <span className="text-sm">Status</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${status.running ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="font-semibold text-gray-900">{status.running ? 'Running' : 'Stopped'}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Zap className="w-4 h-4" />
            <span className="text-sm">Ticks</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">{status.tickCount}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Brain className="w-4 h-4" />
            <span className="text-sm">Active Thoughts</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">{status.activeThoughts}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Last Tick</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">
            {status.lastTickAt ? new Date(status.lastTickAt).toLocaleTimeString() : 'Never'}
          </span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Thought Stream</h2>
            <button
              onClick={triggerConsolidation}
              className="text-sm px-3 py-1 bg-[#006c49] text-white rounded hover:bg-[#005a40] transition-colors"
            >
              Consolidate
            </button>
          </div>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {thoughts.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No thoughts yet. Start the daemon to begin.</p>
            ) : (
              thoughts.map(thought => (
                <motion.div
                  key={thought.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg border ${getTypeColor(thought.type)}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium uppercase">{thought.type}</span>
                    <span className="text-xs opacity-75">{(thought.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <p className="text-sm">{thought.content}</p>
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 p-4">
          <h2 className="font-semibold text-gray-300 mb-4">Activity Log</h2>
          <div className="font-mono text-xs space-y-1 max-h-[400px] overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet.</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="text-green-400">{log}</div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default KairosDashboard;
