import type { Metadata } from 'next';
import CommercialClient from './CommercialClient';

export const metadata: Metadata = {
  title: 'Commercial Cleaning | LuminaClean',
  description: 'Professional commercial cleaning services with AI-powered pricing.',
};

export default function CommercialPage() {
  return <CommercialClient />;
}
