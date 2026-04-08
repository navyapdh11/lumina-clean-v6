import type { Metadata } from 'next';
import NdisClient from './NdisClient';

export const metadata: Metadata = {
  title: 'NDIS Cleaning | PerthClean — Registered Provider',
  description: 'Professional NDIS cleaning services with participant-centered approach. Registered provider, flexible scheduling, compassionate care.',
  openGraph: {
    title: 'NDIS Cleaning | PerthClean',
    description: 'Registered NDIS provider with participant-centered cleaning services.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NDIS Cleaning | PerthClean',
  },
};

export default function NdisPage() {
  return <NdisClient />;
}
