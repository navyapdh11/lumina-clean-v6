'use client';

import { ClerkProvider } from '@clerk/nextjs';

const INVALID_PATTERNS = [
  'xxx',
  'REPLACE_ME',
  'placeholder',
  'changeme',
];

const hasValidClerkKey = !!(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.CLERK_SECRET_KEY &&
  (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_live_') ||
   process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_test_')) &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('_xxx') &&
  !process.env.CLERK_SECRET_KEY.includes('_xxx') &&
  INVALID_PATTERNS.every(p => !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!.includes(p) && !process.env.CLERK_SECRET_KEY!.includes(p))
);

export function ClerkProviderFallback({ children }: { children: React.ReactNode }) {
  if (!hasValidClerkKey) {
    return <>{children}</>;
  }

  return <ClerkProvider>{children}</ClerkProvider>;
}
