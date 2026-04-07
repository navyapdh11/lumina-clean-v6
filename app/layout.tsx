import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
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
  title: 'EmeraldClean – Premium Precision Cleaning for Australia',
  description:
    'Eco-conscious premium cleaning services across Australia. Residential, commercial, specialist and hazardous cleaning with verified professionals.',
  keywords: ['cleaning services', 'end of lease', 'commercial cleaning', 'NDIS', 'Australia'],
  openGraph: {
    title: 'EmeraldClean – Premium Precision Cleaning for Australia',
    description: 'Eco-conscious premium cleaning services across Australia.',
    url: 'https://emeraldclean.com.au',
    siteName: 'EmeraldClean',
    type: 'website',
    locale: 'en_AU',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EmeraldClean – Premium Precision Cleaning for Australia',
    description: 'Eco-conscious premium cleaning services across Australia.',
  },
  robots: { index: true, follow: true },
};

export const dynamic = 'force-dynamic';

const hasValidClerkKey = () => {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
  return key.startsWith('pk_live_') || key.startsWith('pk_test_');
};

function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!hasValidClerkKey()) {
    // No valid Clerk key — render without Clerk
    return <>{children}</>;
  }

  return <ClerkProvider>{children}</ClerkProvider>;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html lang="en-AU" suppressHydrationWarning className={`${inter.variable} ${manrope.variable}`}>
        <body className="bg-emerald-background text-emerald-text antialiased">
          <ThemeProvider>{children}</ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
