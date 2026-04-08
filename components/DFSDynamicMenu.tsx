'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Calendar, BarChart3, Bot, Settings, Users, CreditCard,
  PlusCircle, FileText, TrendingUp, DollarSign, Search, Brain,
  Database, Plug, User, ChevronRight, Menu, X, LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  dashboard: Home,
  'calendar-check': Calendar,
  calendar: Calendar,
  'bar-chart': BarChart3,
  bot: Bot,
  settings: Settings,
  users: Users,
  'credit-card': CreditCard,
  'plus-circle': PlusCircle,
  'file-text': FileText,
  'trending-up': TrendingUp,
  'dollar-sign': DollarSign,
  search: Search,
  brain: Brain,
  database: Database,
  plug: Plug,
  user: User,
};

interface MenuNode {
  id: string;
  label: string;
  href: string;
  icon: string;
  children?: string[];
}

interface DFSMenuProps {
  userRole?: string;
  currentPath?: string;
}

export function DFSDynamicMenu({ userRole = 'admin', currentPath = '/dashboard' }: DFSMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuNodes, setMenuNodes] = useState<MenuNode[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    async function fetchMenuNodes() {
      try {
        const res = await fetch('/api/menu/nodes', {
          headers: { 'x-token': 'mock-token' }
        });
        if (res.ok) {
          const data = await res.json();
          setMenuNodes(data);
        }
      } catch {
        setMenuNodes(getDefaultNodes());
      }
    }
    fetchMenuNodes();
  }, []);

  const getDefaultNodes = (): MenuNode[] => [
    { id: 'root', label: 'Dashboard', href: '/dashboard', icon: 'dashboard', children: ['bookings', 'calendar', 'analytics', 'agents', 'settings'] },
    { id: 'bookings', label: 'Bookings', href: '/dashboard/bookings', icon: 'calendar-check', children: ['booking-detail', 'booking-new'] },
    { id: 'calendar', label: 'Calendar', href: '/dashboard/calendar', icon: 'calendar' },
    { id: 'analytics', label: 'Analytics', href: '/dashboard/analytics', icon: 'bar-chart', children: ['revenue', 'performance'] },
    { id: 'agents', label: 'AI Agents', href: '/dashboard/agents', icon: 'bot', children: ['kairos', 'krites'] },
    { id: 'settings', label: 'Settings', href: '/dashboard/settings', icon: 'settings' },
    { id: 'booking-detail', label: 'Booking Detail', href: '/dashboard/bookings/[id]', icon: 'file-text' },
    { id: 'booking-new', label: 'New Booking', href: '/dashboard/bookings/new', icon: 'plus-circle' },
    { id: 'revenue', label: 'Revenue', href: '/dashboard/analytics/revenue', icon: 'dollar-sign' },
    { id: 'performance', label: 'Performance', href: '/dashboard/analytics/performance', icon: 'trending-up' },
    { id: 'kairos', label: 'KAIROS', href: '/dashboard/agents/kairos', icon: 'brain' },
    { id: 'krites', label: 'Krites Cache', href: '/dashboard/agents/krites', icon: 'database' },
  ];

  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) return menuNodes;
    const query = searchQuery.toLowerCase();
    return menuNodes.filter(node =>
      node.label.toLowerCase().includes(query) ||
      node.href.toLowerCase().includes(query)
    );
  }, [menuNodes, searchQuery]);

  const handleNavigate = useCallback((href: string) => {
    router.push(href);
    setIsOpen(false);
  }, [router]);

  const toggleExpand = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  const getNodeChildren = useCallback((nodeId: string): MenuNode[] => {
    const parent = menuNodes.find(n => n.id === nodeId);
    if (!parent?.children) return [];
    return menuNodes.filter(n => parent.children?.includes(n.id));
  }, [menuNodes]);

  const isActive = useCallback((href: string) => currentPath === href, [currentPath]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gradient-to-r from-[#006c49] to-[#10b981] text-white p-4 shadow-lg flex items-center justify-between"
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-2">
          <Menu className="w-5 h-5" />
          <span className="font-semibold">Menu</span>
        </div>
        <ChevronRight className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white shadow-xl overflow-hidden"
          >
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#006c49] focus:border-transparent"
                />
              </div>
            </div>

            <nav className="max-h-[60vh] overflow-y-auto">
              {filteredNodes.map(node => {
                const Icon = iconMap[node.icon] || Home;
                const children = getNodeChildren(node.id);
                const hasChildren = children.length > 0;
                const isExpanded = expandedNodes.has(node.id);
                const active = isActive(node.href);

                return (
                  <div key={node.id}>
                    <button
                      onClick={() => {
                        if (hasChildren) {
                          toggleExpand(node.id);
                        } else {
                          handleNavigate(node.href);
                        }
                      }}
                      className={`w-full p-3 flex items-center gap-3 hover:bg-[#e9f6f3] transition-colors border-b ${
                        active ? 'bg-[#e9f6f3] border-l-4 border-l-[#006c49]' : ''
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${active ? 'text-[#006c49]' : 'text-gray-500'}`} />
                      <div className="flex-1 text-left">
                        <span className={`font-medium block ${active ? 'text-[#006c49]' : 'text-gray-700'}`}>
                          {node.label}
                        </span>
                        <span className="text-xs text-gray-400">{node.href}</span>
                      </div>
                      {hasChildren && (
                        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      )}
                    </button>

                    <AnimatePresence>
                      {hasChildren && isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="bg-gray-50"
                        >
                          {children.map(child => {
                            const ChildIcon = iconMap[child.icon] || Home;
                            const childActive = isActive(child.href);
                            return (
                              <button
                                key={child.id}
                                onClick={() => handleNavigate(child.href)}
                                className={`w-full pl-12 p-2 flex items-center gap-2 hover:bg-[#e9f6f3] transition-colors border-b ${
                                  childActive ? 'bg-[#e9f6f3]' : ''
                                }`}
                              >
                                <ChildIcon className={`w-4 h-4 ${childActive ? 'text-[#006c49]' : 'text-gray-400'}`} />
                                <span className={`text-sm ${childActive ? 'text-[#006c49] font-medium' : 'text-gray-600'}`}>
                                  {child.label}
                                </span>
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DFSDynamicMenu;
