'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/navigation';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';

function ARScene({ onMeasure }: { onMeasure: (data: { sqm: number; bedrooms: number; price: number }) => void }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [scanning, setScanning] = useState(false);

  useFrame((state) => {
    if (meshRef.current && scanning) {
      meshRef.current.rotation.y = state.clock.elapsedTime;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  useEffect(() => {
    if (scanning) {
      const timer = setTimeout(() => {
        const sqm = Math.floor(Math.random() * 60) + 30;
        const bedrooms = Math.max(1, Math.floor(sqm / 15));
        const price = 99 + bedrooms * 30;
        onMeasure({ sqm, bedrooms, price });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [scanning, onMeasure]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color={scanning ? '#22c55e' : '#06b6d4'} wireframe />
      </mesh>
      <OrbitControls autoRotate enableZoom={false} />
      {scanning && (
        <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2, 2.1, 32]} />
          <meshBasicMaterial color="#22c55e" transparent opacity={0.5} />
        </mesh>
      )}
    </>
  );
}

export default function ARScannerPage() {
  const router = useRouter();
  const [measurements, setMeasurements] = useState<{ sqm: number; bedrooms: number; price: number } | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = useCallback(async () => {
    setIsScanning(true);
    try {
      const mockData = { measurements: { length: 8, width: 6 } };
      const response = await fetch('/api/vision/ar-measure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockData),
      });
      const data = await response.json();
      setMeasurements(data);
    } catch (error) {
      console.error('AR scan error:', error);
    } finally {
      setIsScanning(false);
    }
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-cyan-950">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 py-20 pt-32 text-center">
        <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-8">📱 AR Room Scanner</h1>
        <p className="text-xl text-gray-300 mb-12">Point → Scan → Instant Quote</p>

        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center mb-16">
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 min-w-[280px]">
            <h3 className="text-2xl font-bold mb-4">Live Results</h3>
            {measurements ? (
              <div className="space-y-3 text-left">
                <div>📏 Area: <span className="font-bold text-2xl">{measurements.sqm.toFixed(1)} sqm</span></div>
                <div>🛏️ Bedrooms: <span className="font-bold text-2xl">{measurements.bedrooms}</span></div>
                <div className="text-3xl font-black text-green-400">${measurements.price.toFixed(0)}</div>
              </div>
            ) : (
              <p className="text-gray-500">Scan a room to see results</p>
            )}
          </div>

          <Button
            size="lg"
            onClick={handleScan}
            disabled={isScanning}
            className="px-12 py-8 bg-gradient-to-r from-green-500 to-emerald-600 text-xl font-bold rounded-3xl hover:scale-105 transition-all shadow-2xl disabled:opacity-50"
          >
            {isScanning ? '⏳ Scanning...' : '📐 Simulated Scan'}
          </Button>
        </div>

        {measurements && measurements.price > 0 && (
          <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 px-12 py-8 text-xl" onClick={() => router.push(`/book?price=${measurements.price}`)}>
            ✅ Book Now — ${measurements.price}
          </Button>
        )}

        <div className="h-[400px] mt-12 rounded-3xl overflow-hidden border border-white/10 bg-black/50">
          <Canvas camera={{ position: [5, 5, 5], fov: 60 }} dpr={[1, 2]}>
            <ARScene onMeasure={setMeasurements} />
          </Canvas>
        </div>
      </div>
    </motion.div>
  );
}
