import { Metadata } from 'next';
import ResidentialClient from './ResidentialClient';

export const metadata: Metadata = {
  title: 'Residential Cleaning | PerthClean — AI-Powered Home Cleaning',
  description: 'Professional residential cleaning with AI-powered pricing. Instant quotes, same-day service, 100% satisfaction guarantee. Serving all of Australia.',
  openGraph: {
    title: 'Residential Cleaning | PerthClean',
    description: 'AI-powered home cleaning with instant quotes. From $99.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Residential Cleaning | PerthClean',
    description: 'AI-powered home cleaning with instant quotes.',
  },
};

export default function ResidentialPage() {
  return <ResidentialClient />;
}
