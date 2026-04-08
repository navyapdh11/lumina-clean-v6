'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';

const NAV_SECTIONS = [
  { name: 'Home', href: '/', icon: '🏠' },
  { name: 'Residential', href: '/residential', icon: '🏡' },
  { name: 'Commercial', href: '/commercial', icon: '🏢' },
  { name: 'Airbnb', href: '/airbnb', icon: '🔑' },
  { name: 'Real Estate', href: '/real-estate', icon: '🏘️' },
  { name: 'Strata', href: '/strata', icon: '🏗️' },
  { name: 'NDIS', href: '/ndis', icon: '♿' },
  { name: 'Gallery', href: '/photo-gallery', icon: '📸' },
  { name: 'Admin', href: '/admin-dashboard', icon: '⚙️' },
];

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-black/80 backdrop-blur-2xl border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              PerthClean
            </Link>

            <div className="hidden lg:flex items-center gap-2">
              {NAV_SECTIONS.map((section) => (
                <Link
                  key={section.href}
                  href={section.href}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    pathname === section.href
                      ? 'bg-white/10 text-cyan-400'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.name}
                  {pathname === section.href && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <a
                href="tel:1300737842"
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-2 rounded-full font-semibold hover:scale-105 transition-transform"
              >
                <Phone className="w-4 h-4" />
                1300-PERTHCLEAN
              </a>
              <Link href="/sign-in" className="text-gray-300 hover:text-white transition-colors">
                Sign In
              </Link>
            </div>

            <button
              className="lg:hidden text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl lg:hidden pt-20"
          >
            <div className="flex flex-col gap-4 px-6">
              {NAV_SECTIONS.map((section) => (
                <Link
                  key={section.href}
                  href={section.href}
                  className={`text-xl py-4 border-b border-white/10 ${
                    pathname === section.href ? 'text-cyan-400' : 'text-gray-300'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {section.icon} {section.name}
                </Link>
              ))}
              <a href="tel:1300737842" className="text-xl py-4 text-cyan-400 border-b border-white/10">
                📞 1300-PERTHCLEAN
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
