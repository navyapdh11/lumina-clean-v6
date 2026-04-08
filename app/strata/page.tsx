import type { Metadata } from 'next';
import StrataClient from './StrataClient';

export const metadata: Metadata = {
  title: 'Strata Cleaning | LuminaClean',
  description: 'Professional strata cleaning services with AI-powered pricing.',
};

export default function StrataPage() {
  return <StrataClient />;
}
