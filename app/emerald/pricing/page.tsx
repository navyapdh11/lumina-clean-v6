import type { Metadata } from 'next';
import PricingClient from './PricingClient';

export const metadata: Metadata = {
  title: 'EmeraldClean Pricing – Simple, Transparent Pricing',
  description:
    'No hidden fees. No call-out charges. EmeraldClean offers Standard from $99, Deep Clean from $199, and custom specialist quotes. Book online in 60 seconds.',
};

export default function PricingPage() {
  return <PricingClient />;
}
