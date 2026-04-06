import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { TRPCReactProvider } from '@/lib/trpc/react';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

export const metadata: Metadata = {
  title: 'LuminaClean | AI-Powered Cleaning Services Australia',
  description: "Australia's #1 AI-powered cleaning platform. Residential, Commercial, NDIS, Strata. Call 1300-LUMINA.",
  keywords: ['cleaning services', 'NDIS', 'strata', 'commercial cleaning', 'Sydney', 'Melbourne', 'Brisbane'],
  openGraph: {
    title: 'LuminaClean',
    description: 'AI-Powered Cleaning Empire',
    url: 'https://lumina-clean.com.au',
    siteName: 'LuminaClean',
    locale: 'en_AU',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#06b6d4',
          colorBackground: '#000000',
          colorText: '#ffffff',
        },
      }}
    >
      <html lang="en-AU" suppressHydrationWarning>
        <body className="bg-black text-white antialiased overflow-x-hidden">
          <TRPCReactProvider>
            {children}
            <Toaster />
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
