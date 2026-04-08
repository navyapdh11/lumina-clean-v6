import type { Metadata } from 'next';
import RealEstateClient from './RealEstateClient';

export const metadata: Metadata = {
  title: 'Real Estate Cleaning | PerthClean — Pre-Sale & End-of-Lease',
  description: 'Professional pre-sale presentation cleans and bond-back guaranteed end-of-leash cleaning. Trusted by 200+ real estate agencies. From $299.',
  openGraph: {
    title: 'Real Estate Cleaning | PerthClean',
    description: 'Pre-sale and end-of-lease cleaning with bond-back guarantee.',
    type: 'website',
  },
};

export default function RealEstatePage() {
  return <RealEstateClient />;
}
