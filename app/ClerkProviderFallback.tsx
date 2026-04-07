'use client';

import { ClerkProvider } from '@clerk/nextjs';

const hasValidClerkKey = !!(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_live_')
);

export function ClerkProviderFallback({ children }: { children: React.ReactNode }) {
  if (!hasValidClerkKey) {
    return <>{children}</>;
  }

  return <ClerkProvider>{children}</ClerkProvider>;
}
