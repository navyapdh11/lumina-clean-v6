import type { Metadata } from 'next';
import HomeClient from '../components/HomeClient';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness'],
  name: 'EmeraldClean',
  url: 'https://emeraldclean.com.au',
  areaServed: 'Australia',
  description: 'Eco-conscious premium cleaning services across Australia.',
  priceRange: '$$',
  openingHours: 'Mo-Sa 07:00+10:00',
};

export const metadata: Metadata = {
  title: 'EmeraldClean – Premium Precision Cleaning for Australia',
  description:
    'Eco-conscious premium cleaning services across Australia. Residential, commercial, specialist and hazardous cleaning with verified professionals.',
};

export default function EmeraldPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
