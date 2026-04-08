import { Metadata } from 'next';
import BookClient from './BookClient';

export const metadata: Metadata = {
  title: 'Book Your Clean | PerthClean — Instant Booking',
  description: 'Book your professional cleaning service in 60 seconds. Instant quotes, flexible scheduling, secure payment via Stripe.',
  openGraph: {
    title: 'Book Your Clean | PerthClean',
    description: 'Instant booking for professional cleaning services.',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function BookPage() {
  return <BookClient />;
}
