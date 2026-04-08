import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const isClerkConfigured =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_test_xxx');

export default function SignInPage() {
  if (!isClerkConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-cyan-950 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🔧</div>
          <h1 className="text-3xl font-bold text-white mb-4">Setup Required</h1>
          <p className="text-gray-400 mb-8">
            Clerk authentication is not configured. Please set{' '}
            <code className="bg-white/10 px-2 py-1 rounded text-cyan-400">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code>{' '}
            in your environment variables.
          </p>
          <Link href="/" className="bg-cyan-500 px-8 py-3 rounded-xl font-bold text-white hover:bg-cyan-600 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-cyan-950 flex items-center justify-center px-6">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: '#06b6d4',
            colorBackground: '#000000',
            colorText: '#ffffff',
            borderRadius: '1rem',
          },
        }}
      />
    </div>
  );
}
