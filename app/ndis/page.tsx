import type { Metadata } from 'next';
import NdisClient from './NdisClient';

export const metadata: Metadata = {
  title: 'Ndis Cleaning | PerthClean',
  description: 'Professional ndis cleaning services with AI-powered pricing.',
};

export default function NdisPage() {
  return <NdisClient />;
}
