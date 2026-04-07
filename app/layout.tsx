import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import { TRPCReactProvider } from '@/lib/trpc/react';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/app/components/ThemeProvider';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LuminaClean – AI-Powered Premium Cleaning for Australia',
  description:
    'Australia\'s most advanced AI-powered cleaning services platform. Residential, commercial, NDIS, strata, Airbnb, and real estate cleaning with intelligent pricing and instant booking.',
  keywords: ['cleaning services', 'AI cleaning', 'commercial cleaning', 'NDIS', 'Airbnb cleaning', 'real estate cleaning', 'strata cleaning', 'Australia'],
  openGraph: {
    title: 'LuminaClean – AI-Powered Premium Cleaning for Australia',
    description: 'AI-powered premium cleaning services across Australia with intelligent pricing and instant booking.',
    url: 'https://lumina-clean.com.au',
    siteName: 'LuminaClean',
    type: 'website',
    locale: 'en_AU',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LuminaClean – AI-Powered Premium Cleaning for Australia',
    description: 'AI-powered premium cleaning services across Australia.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" suppressHydrationWarning className={`${inter.variable} ${manrope.variable}`}>
      <body className="bg-emerald-background text-emerald-text antialiased">
        <TRPCReactProvider>
          <ThemeProvider>{children}</ThemeProvider>
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
