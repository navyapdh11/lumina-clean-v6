'use client';

import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { Component, type ReactNode } from 'react';

interface Props {}

interface State {
  hasError: boolean;
}

export default class ClerkSignUp extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="text-center">
          <div className="text-6xl mb-6">🔧</div>
          <h1 className="text-3xl font-bold text-white mb-4">Setup Required</h1>
          <p className="text-gray-400 mb-8">
            Clerk authentication is not configured. Please set{' '}
            <code className="bg-white/10 px-2 py-1 rounded text-cyan-400">
              NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
            </code>{' '}
            in your environment variables.
          </p>
          <Link
            href="/"
            className="bg-cyan-500 px-8 py-3 rounded-xl font-bold text-white hover:bg-cyan-600 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      );
    }

    return (
      <SignUp
        appearance={{
          variables: {
            colorPrimary: '#06b6d4',
            colorBackground: '#000000',
            colorText: '#ffffff',
            borderRadius: '1rem',
          },
        }}
      />
    );
  }
}
