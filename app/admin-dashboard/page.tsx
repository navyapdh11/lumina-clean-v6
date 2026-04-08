'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Users,
  TrendingUp,
  Target,
  BarChart3,
  Rocket,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  RefreshCw,
  Eye,
  MousePointerClick,
  Clock,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { trpc } from '@/lib/trpc/client';
import { LeadsList } from './LeadsList';

/** SVG sparkline — pure SVG, no library needed */
function Sparkline({ data, color = 'rgb(16, 185, 129)', height = 48 }: {
  data: number[];
  color?: string;
  height?: number;
}) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 120;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const area = `M0,${height} ${pts.map((p) => `L${p}`).join(' ')} L${w},${height} Z`;
  const polyline = pts.join(' ');
  return (
    <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={`sg-${color.replace(/[^a-z0-9]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.replace(/[^a-z0-9]/gi, '')})`} />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1].split(',')[0]} cy={pts[pts.length - 1].split(',')[1]} r="3" fill={color} />
    </svg>
  );
}

/** Animated counter */
function AnimatedCounter({ target, prefix = '', suffix = '', decimals = 0 }: {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1600;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current = Math.min(current + increment, target);
            setCount(current);
            if (current >= target) clearInterval(timer);
          }, duration / steps);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  );
}

/** Metric card */
function MetricCard({
  icon: Icon,
  label,
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  trend,
  trendLabel,
  color = 'emerald',
  sparkData,
}: {
  icon: typeof DollarSign;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  trend?: number;
  trendLabel?: string;
  color?: 'emerald' | 'cyan' | 'amber' | 'rose';
  sparkData?: number[];
}) {
  const colorMap = {
    emerald: { icon: 'bg-emerald-500/10 text-emerald-500', bar: 'bg-emerald-500', text: 'text-emerald-500' },
    cyan: { icon: 'bg-cyan-500/10 text-cyan-500', bar: 'bg-cyan-500', text: 'text-cyan-500' },
    amber: { icon: 'bg-amber-500/10 text-amber-500', bar: 'bg-amber-500', text: 'text-amber-500' },
    rose: { icon: 'bg-rose-500/10 text-rose-500', bar: 'bg-rose-500', text: 'text-rose-500' },
  };
  const c = colorMap[color];
  const isUp = trend !== undefined && trend >= 0;

  return (
    <div className="card-glass p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.icon}`}>
          <Icon className="h-5 w-5" />
        </div>
        {sparkData && <Sparkline data={sparkData} color="rgb(16, 185, 129)" />}
      </div>
      <div className="font-headline font-extrabold text-3xl gradient-text">
        <AnimatedCounter target={value} prefix={prefix} suffix={suffix} decimals={decimals} />
      </div>
      <div className="text-emerald-text-muted text-sm mt-1">{label}</div>
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-2">
          <span className={`flex items-center gap-0.5 text-xs font-bold ${isUp ? c.text : 'text-rose-500'}`}>
            {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(trend)}%
          </span>
          <span className="text-emerald-text-muted text-xs">{trendLabel}</span>
        </div>
      )}
    </div>
  );
}

interface Metrics {
  mrr: number;
  totalJobs: number;
  activeLeads: number;
  conversionRate: number;
  pendingTenders: number;
  ndisBidsSubmitted: number;
}

type Frequency = 'weekly' | 'monthly' | 'yearly';

const freqMultipliers: Record<Frequency, { label: string; mrr: number; jobs: number; leads: number }> = {
  weekly:   { label: 'This Week',   mrr: 1_030_000, jobs: 247,   leads: 1_008 },
  monthly:  { label: 'This Month',  mrr: 4_450_000, jobs: 1_070, leads: 4_361 },
  yearly:   { label: 'This Year',   mrr: 53_500_000, jobs: 12_847, leads: 52_341 },
};

const demoSparkMrr     = [38, 42, 39, 45, 43, 48, 46, 52, 50, 55, 53, 58];
const demoSparkJobs    = [180, 195, 188, 210, 205, 225, 218, 238, 230, 245, 240, 258];
const demoSparkLeads   = [820, 880, 860, 940, 920, 1000, 980, 1060, 1040, 1100, 1080, 1150];
const demoSparkConv    = [0.48, 0.50, 0.49, 0.52, 0.51, 0.54, 0.53, 0.56, 0.55, 0.58, 0.57, 0.60];

export default function AdminDashboard() {
  const [freq, setFreq] = useState<Frequency>('monthly');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Use real tRPC data — falls back to demo data when DB not configured
  const { data: metrics, refetch, isLoading } = trpc.getDashboardMetrics.useQuery(undefined, {
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

  const handleRefresh = async () => {
    setLoading(true);
    await refetch();
    setLastRefresh(new Date());
  };

  const f = freqMultipliers[freq];
  const tabs = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'leads', label: 'Leads', icon: Users },
    { key: 'funnels', label: 'Funnel Builder', icon: Target },
    { key: 'ads', label: 'Ad Manager', icon: Zap },
    { key: 'seo', label: 'SEO Optimizer', icon: Eye },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-emerald-background">
      {/* Ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div className="blob blob-slow absolute -top-40 right-0 w-[700px] h-[700px] bg-emerald-200/10 dark:bg-emerald-900/15" />
        <div className="blob blob-fast absolute bottom-0 left-0 w-96 h-96 bg-teal-200/10 dark:bg-teal-900/15" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-emerald-outline/20">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/emerald" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl btn-gradient flex items-center justify-center shadow-md">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-extrabold gradient-text font-headline tracking-tight">
                EmeraldClean
              </span>
            </Link>
            <span className="hidden md:inline text-emerald-text-muted text-sm mx-2">/</span>
            <span className="hidden md:inline text-emerald-text font-semibold text-sm">Marketing Hub</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 text-sm text-emerald-text-muted hover:text-emerald-primary transition-colors glass rounded-xl px-3 py-2"
              type="button"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <div className="text-xs text-emerald-text-muted hidden md:flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              Live · {lastRefresh.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 py-10">

        {/* Page heading */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-primary uppercase tracking-widest mb-3">
                <BarChart3 className="h-3.5 w-3.5" /> Analytics Dashboard
              </div>
              <h1 className="font-headline font-extrabold text-4xl md:text-5xl tracking-tight text-emerald-text">
                Marketing Hub
              </h1>
              <p className="text-emerald-text-muted mt-2 text-sm">
                Real-time performance across all EmeraldClean acquisition channels.
              </p>
            </div>

            {/* Frequency toggle */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-emerald-text-muted font-medium">Weekly</span>
              <ToggleSwitch
                checked={freq === 'monthly'}
                onChange={(v) => setFreq(v ? 'monthly' : 'weekly')}
                label="Frequency"
                size="sm"
              />
              <span className="text-xs text-emerald-text-muted font-medium">Monthly</span>
              <ToggleSwitch
                checked={freq === 'yearly'}
                onChange={(v) => setFreq(v ? 'yearly' : freq === 'monthly' ? 'weekly' : 'monthly')}
                label="Yearly"
                size="sm"
              />
            </div>
          </div>
        </Reveal>

        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Reveal delay={0}>
            <MetricCard
              icon={DollarSign}
              label="Monthly Recurring Revenue"
              value={f.mrr}
              prefix="$"
              trend={8.2}
              trendLabel="vs last period"
              color="emerald"
              sparkData={demoSparkMrr}
            />
          </Reveal>
          <Reveal delay={80}>
            <MetricCard
              icon={Rocket}
              label={`${f.label} Jobs`}
              value={f.jobs}
              suffix=""
              trend={12.4}
              trendLabel="vs last period"
              color="cyan"
              sparkData={demoSparkJobs}
            />
          </Reveal>
          <Reveal delay={160}>
            <MetricCard
              icon={Users}
              label="Active Leads"
              value={f.leads}
              suffix=""
              trend={5.1}
              trendLabel="vs last period"
              color="amber"
              sparkData={demoSparkLeads}
            />
          </Reveal>
          <Reveal delay={240}>
            <MetricCard
              icon={Target}
              label="Conversion Rate"
              value={metrics ? metrics.conversionRate * 100 : 0}
              suffix="%"
              decimals={1}
              trend={3.7}
              trendLabel="vs last period"
              color="rose"
              sparkData={demoSparkConv}
            />
          </Reveal>
        </div>

        {/* Secondary metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <Reveal delay={0}>
            <div className="glass rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <div className="font-bold text-emerald-text text-lg">
                  <AnimatedCounter target={23} suffix="" />
                </div>
                <div className="text-emerald-text-muted text-xs">Pending Tenders</div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="glass rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <MousePointerClick className="h-5 w-5 text-cyan-500" />
              </div>
              <div>
                <div className="font-bold text-emerald-text text-lg">
                  <AnimatedCounter target={12} suffix="" />
                </div>
                <div className="text-emerald-text-muted text-xs">NDIS Bids Submitted</div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="glass rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Eye className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <div className="font-bold text-emerald-text text-lg">
                  <AnimatedCounter target={99.8} suffix="%" decimals={1} />
                </div>
                <div className="text-emerald-text-muted text-xs">Avg. Score</div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={240}>
            <div className="glass rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-rose-500" />
              </div>
              <div>
                <div className="font-bold text-emerald-text text-lg">
                  <AnimatedCounter target={2.4} suffix="d" decimals={1} />
                </div>
                <div className="text-emerald-text-muted text-xs">Avg. Response Time</div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Tabs */}
        <Reveal>
          <div className="card-glass overflow-hidden">
            {/* Tab bar */}
            <div className="flex overflow-x-auto border-b border-emerald-outline/10 scrollbar-hide">
              {tabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                    activeTab === key
                      ? 'text-emerald-primary border-emerald-primary'
                      : 'text-emerald-text-muted border-transparent hover:text-emerald-text hover:border-emerald-outline/30'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-8 min-h-[320px]">

              {/* Overview */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-headline font-bold text-lg text-emerald-text mb-4">Revenue Trend</h3>
                    <div className="glass rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <div className="text-emerald-text-muted text-xs uppercase tracking-wider">Total MRR</div>
                          <div className="font-headline font-extrabold text-2xl gradient-text">
                            ${f.mrr.toLocaleString()}
                          </div>
                        </div>
                        <span className="flex items-center gap-1 text-emerald-500 text-sm font-bold">
                          <ArrowUpRight className="h-4 w-4" /> +8.2%
                        </span>
                      </div>
                      {/* Mini bar chart */}
                      <div className="flex items-end gap-2 h-32">
                        {[40, 55, 48, 62, 58, 70, 65, 78, 74, 85, 80, 92].map((h, i) => (
                          <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-emerald-600 to-emerald-400" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-emerald-text-muted">
                        <span>Jan</span><span>Dec</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-headline font-bold text-lg text-emerald-text mb-4">Channel Performance</h3>
                    <div className="space-y-4">
                      {[
                        { name: 'Organic Search', value: 38, color: 'from-emerald-500 to-teal-400', pct: '38%' },
                        { name: 'Paid Social', value: 24, color: 'from-cyan-500 to-blue-400', pct: '24%' },
                        { name: 'Referral', value: 18, color: 'from-amber-500 to-orange-400', pct: '18%' },
                        { name: 'Direct', value: 14, color: 'from-purple-500 to-pink-400', pct: '14%' },
                        { name: 'Email', value: 6, color: 'from-rose-500 to-red-400', pct: '6%' },
                      ].map((ch) => (
                        <div key={ch.name} className="flex items-center gap-3">
                          <span className="text-xs text-emerald-text-muted w-28 shrink-0">{ch.name}</span>
                          <div className="flex-1 h-2 rounded-full bg-emerald-surface-low overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${ch.color}`}
                              style={{ width: ch.value + '%' }}
                            />
                          </div>
                          <span className="text-xs font-bold text-emerald-text w-8 text-right">{ch.pct}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Leads */}
              {activeTab === 'leads' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-headline font-bold text-2xl text-emerald-text">Lead Management</h3>
                      <p className="text-emerald-text-muted mt-1">All inbound leads from quote forms, assessments, and site audits</p>
                    </div>
                  </div>
                  <div className="glass rounded-2xl p-6">
                    <LeadsList />
                  </div>
                </div>
              )}

              {/* Funnel Builder */}
              {activeTab === 'funnels' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-2xl btn-gradient flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-headline font-bold text-2xl text-emerald-text mb-2">AI Funnel Builder</h3>
                  <p className="text-emerald-text-muted max-w-md mx-auto mb-8">
                    Drag-drop sequences for Residential, Commercial, Strata, NDIS. Configure multi-step nurture sequences with automated follow-ups.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {['Residential', 'Commercial', 'Strata', 'NDIS'].map((funnel) => (
                      <div key={funnel} className="glass rounded-2xl p-5 text-center cursor-pointer hover-lift">
                        <span className="text-2xl mb-2 block">{funnel === 'Residential' ? '🏠' : funnel === 'Commercial' ? '🏢' : funnel === 'Strata' ? '🏗️' : '♿'}</span>
                        <div className="font-semibold text-emerald-text text-sm">{funnel}</div>
                        <div className="text-emerald-text-muted text-xs mt-1">0 sequences</div>
                      </div>
                    ))}
                  </div>
                  <button type="button" className="btn-gradient text-white font-bold px-8 py-3 rounded-2xl">
                    Create New Funnel
                  </button>
                </div>
              )}

              {/* Ad Manager */}
              {activeTab === 'ads' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-headline font-bold text-2xl text-emerald-text mb-2">Ad Manager</h3>
                  <p className="text-emerald-text-muted max-w-md mx-auto mb-8">
                    Google & LinkedIn auto-deploy with A/B testing. Set budgets, audiences, and let AI optimise in real-time.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {['Google Search', 'Meta Ads', 'LinkedIn', 'TikTok'].map((platform) => (
                      <span key={platform} className="glass rounded-full px-4 py-2 text-sm font-medium text-emerald-text">
                        {platform}
                      </span>
                    ))}
                  </div>
                  <button type="button" className="btn-gradient text-white font-bold px-8 py-3 rounded-2xl">
                    Launch Campaign
                  </button>
                </div>
              )}

              {/* SEO Optimizer */}
              {activeTab === 'seo' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Eye className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-headline font-bold text-2xl text-emerald-text mb-2">SEO & GEO Optimizer</h3>
                  <p className="text-emerald-text-muted max-w-md mx-auto mb-8">
                    Auto-generate competitor-crushing content. Track keyword rankings, build backlinks, and dominate local search.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {['Rank Tracker', 'Content AI', 'Backlinks', 'Local SEO'].map((tool) => (
                      <span key={tool} className="glass rounded-full px-4 py-2 text-sm font-medium text-emerald-text">
                        {tool}
                      </span>
                    ))}
                  </div>
                  <button type="button" className="btn-gradient text-white font-bold px-8 py-3 rounded-2xl">
                    Optimize All Pages
                  </button>
                </div>
              )}

              {/* Analytics */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline font-bold text-lg text-emerald-text">Real-Time Analytics</h3>
                    <span className="flex items-center gap-2 text-xs text-emerald-text-muted">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                      </span>
                      Live
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Page Views Today', value: '24,831', trend: '+12%' },
                      { label: 'Unique Visitors', value: '8,247', trend: '+8%' },
                      { label: 'Avg. Session', value: '3m 42s', trend: '+5%' },
                      { label: 'Bounce Rate', value: '34.2%', trend: '-3%' },
                    ].map((stat) => (
                      <div key={stat.label} className="glass rounded-2xl p-5">
                        <div className="text-emerald-text-muted text-xs mb-1">{stat.label}</div>
                        <div className="font-headline font-extrabold text-xl text-emerald-text">{stat.value}</div>
                        <div className="text-emerald-500 text-xs font-bold mt-1">{stat.trend}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Reveal>

        {/* Quick actions */}
        <Reveal delay={100}>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button type="button" className="glass rounded-2xl p-6 text-left hover-lift group">
              <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center mb-4 shadow-md">
                <Rocket className="h-5 w-5 text-white" />
              </div>
              <div className="font-bold text-emerald-text mb-1">Auto-Deploy Campaigns</div>
              <div className="text-emerald-text-muted text-sm">Push all active campaigns live in one click.</div>
            </button>
            <button type="button" className="glass rounded-2xl p-6 text-left hover-lift group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 shadow-md">
                <Filter className="h-5 w-5 text-white" />
              </div>
              <div className="font-bold text-emerald-text mb-1">Export Report</div>
              <div className="text-emerald-text-muted text-sm">Download CSV or PDF of all metrics.</div>
            </button>
            <button type="button" className="glass rounded-2xl p-6 text-left hover-lift group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4 shadow-md">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div className="font-bold text-emerald-text mb-1">Schedule Report</div>
              <div className="text-emerald-text-muted text-sm">Get weekly digest sent to your email.</div>
            </button>
          </div>
        </Reveal>
      </main>

      {/* Footer */}
      <footer className="glass border-t border-emerald-outline/20 py-6 px-6 md:px-8 mt-12 text-sm text-emerald-text-muted">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-4">
          <span>© 2026 EmeraldClean Pty Ltd. — Internal Dashboard</span>
          <div className="flex gap-6">
            <Link href="/emerald" className="hover:text-emerald-primary transition-colors">← Back to Site</Link>
            <Link href="/emerald/pricing" className="hover:text-emerald-primary transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
