import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'EmeraldClean Services – Residential, Commercial & Specialist Cleaning',
  description:
    "Explore EmeraldClean's full range of professional cleaning services: end-of-lease, standard home, carpet steam, office, mould remediation, and hazardous bio clean.",
};

export default function ServicesPage() {
  return <ServicesClient />;
}
