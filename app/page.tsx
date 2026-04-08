'use client';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Link from 'next/link';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Navigation } from '@/components/navigation';
import { ArrowRight, Sparkles, Shield, Clock, Phone, Headphones, Zap, Award } from 'lucide-react';
import { TestimonialsSection } from '@/components/testimonials-section';
import { PricingCalculator } from '@/components/pricing-calculator';

function Hero3D() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} scale={2.5}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color="#06b6d4" wireframe emissive="#7c3aed" emissiveIntensity={0.5} />
    </mesh>
  );
}

function HeroScene() {
  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 60 }} dpr={[1, 2]}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <mesh>
        <sphereGeometry args={[100, 32, 32]} />
        <meshBasicMaterial color="#7c3aed" side={THREE.BackSide} transparent opacity={0.03} />
      </mesh>
      <Hero3D />
      <Environment preset="city" />
      <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} maxPolarAngle={Math.PI / 2} />
    </Canvas>
  );
}

export default function HomePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-cyan-950">
      <Navigation />

      <section className="h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <HeroScene />
        </div>

        <div className="z-10 text-center max-w-5xl px-6 pt-20">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6"
          >
            PerthClean
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            Australia&apos;s AI-Powered Cleaning Empire
          </motion.p>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">NDIS Registered</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10">
              <Clock className="w-5 h-5 text-cyan-400" />
              <span className="text-gray-300">Same-Day Service</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-gray-300">AI-Powered Pricing</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col md:flex-row gap-6 justify-center"
          >
            <Link href="/residential/ar-scanner" className="bg-gradient-to-r from-green-500 to-emerald-600 px-10 py-5 rounded-3xl text-lg font-bold hover:scale-105 transition-transform flex items-center justify-center gap-3">
              📱 AR Room Scanner <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/admin-dashboard" className="bg-gradient-to-r from-cyan-500 to-blue-600 px-10 py-5 rounded-3xl text-lg font-bold hover:scale-105 transition-transform flex items-center justify-center gap-3">
              ⚙️ Admin Hub <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="tel:1300737842" className="bg-gradient-to-r from-purple-500 to-pink-600 px-10 py-5 rounded-3xl text-lg font-bold hover:scale-105 transition-transform flex items-center justify-center gap-3">
              📞 1300-PERTHCLEAN <Phone className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-5xl font-bold text-center bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-16"
          >
            Enterprise-Grade Services
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Residential', icon: '🏡', desc: 'AI-powered instant quotes via AR scanning', href: '/residential' },
              { name: 'Commercial', icon: '🏢', desc: 'Office cleaning from $0.65/sqm', href: '/commercial' },
              { name: 'NDIS', icon: '♿', desc: 'Registered provider, compliant supports', href: '/ndis' },
              { name: 'Strata', icon: '🏗️', desc: 'Body corporate specialists', href: '/strata' },
              { name: 'Airbnb', icon: '🔑', desc: 'Turnover cleaning with smart locks', href: '/airbnb' },
              { name: 'Real Estate', icon: '🏘️', desc: 'Pre-sale & rental cleans', href: '/real-estate' },
            ].map((service, i) => (
              <motion.div key={service.name} initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link href={service.href}>
                  <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-cyan-500/50 transition-all hover:scale-105 group">
                    <div className="text-5xl mb-4">{service.icon}</div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">{service.name}</h3>
                    <p className="text-gray-400">{service.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 px-6 bg-black/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-5xl font-bold text-center bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-16"
          >
            Why Choose PerthClean?
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: 'AI-Powered', desc: 'Smart pricing, optimized routing, and predictive quality control', color: 'text-yellow-400' },
              { icon: Shield, title: 'Fully Insured', desc: '$20M public liability and worker\'s compensation coverage', color: 'text-green-400' },
              { icon: Headphones, title: '24/7 Support', desc: 'Round-the-clock customer service via phone, chat, or email', color: 'text-cyan-400' },
              { icon: Award, title: 'Satisfaction Guarantee', desc: '100% happiness guarantee or we\'ll re-clean for free', color: 'text-purple-400' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 text-center"
              >
                <feature.icon className={`w-16 h-16 ${feature.color} mx-auto mb-4`} />
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Calculator */}
      <PricingCalculator />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Final CTA */}
      <section className="py-24 px-6 bg-gradient-to-r from-purple-950 via-black to-cyan-950">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-8"
          >
            Ready for a Cleaner Experience?
          </motion.h2>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-2xl text-gray-300 mb-12"
          >
            Join thousands of happy customers across Australia
          </motion.p>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col md:flex-row gap-6 justify-center"
          >
            <Link href="/book" className="bg-gradient-to-r from-green-500 to-emerald-600 px-12 py-6 rounded-3xl text-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-3">
              📅 Book Your Clean Now <ArrowRight className="w-6 h-6" />
            </Link>
            <a href="tel:1300737842" className="bg-gradient-to-r from-purple-500 to-pink-600 px-12 py-6 rounded-3xl text-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-3">
              📞 Call 1300-PERTHCLEAN <Phone className="w-6 h-6" />
            </a>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
