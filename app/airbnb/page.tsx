import { Metadata } from 'next';
import AirbnbClient from './AirbnbClient';

export const metadata: Metadata = {
  title: 'Airbnb Turnover Cleaning | PerthClean — Smart Host Cleaning',
  description: 'Automated Airbnb turnover cleaning between guests. Smart lock integration, 2-4 hour turnaround, photo documentation. From $120.',
  openGraph: {
    title: 'Airbnb Turnover Cleaning | PerthClean',
    description: 'Automated cleaning between guests with smart lock integration. From $120.',
    type: 'website',
  },
};

export default function AirbnbPage() {
  return <AirbnbClient />;
}
