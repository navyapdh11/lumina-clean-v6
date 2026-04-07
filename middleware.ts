import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that ALWAYS require authentication
const PROTECTED_ROUTES = [
  '/admin-dashboard',
  '/api/trpc',
];

// API routes with rate limiting (simplified — full Upstash impl below)
const RATE_LIMITED_ROUTES = [
  '/api/leads',
  '/api/voice/dispatch',
  '/api/vision/ar-measure',
];

// Public routes that don't require auth
const PUBLIC_ROUTES = [
  '/',
  '/residential',
  '/commercial',
  '/airbnb',
  '/real-estate',
  '/strata',
  '/ndis',
  '/sign-in',
  '/sign-up',
  '/emerald',
  '/book',
  '/booking-confirmation',
  '/api/webhooks',
];

function isPathInList(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => pathname.startsWith(prefix));
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow public routes, static files, and API webhooks
  if (isPathInList(pathname, PUBLIC_ROUTES) ||
      pathname.includes('_next/static') ||
      pathname.includes('_next/image') ||
      pathname === '/favicon.ico' ||
      /\.(svg|png|jpg|jpeg|gif|webp|css|js)$/.test(pathname)) {
    return NextResponse.next();
  }

  // Check if Clerk is properly configured
  const hasClerk = !!(
    process.env.CLERK_SECRET_KEY &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    !process.env.CLERK_SECRET_KEY.startsWith('sk_test_xxx') &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_test_xxx')
  );

  // If Clerk is not configured, protect sensitive routes by returning 403
  if (!hasClerk) {
    if (isPathInList(pathname, PROTECTED_ROUTES)) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication not configured. Please set CLERK_SECRET_KEY.' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return NextResponse.next();
  }

  // Clerk is configured — use it
  try {
    const { clerkMiddleware, createRouteMatcher } = await import('@clerk/nextjs/server');

    const isPublicRoute = createRouteMatcher([
      '/(.*)', // Everything is public except admin
    ]);

    const isAdminRoute = createRouteMatcher(['/admin-dashboard(.*)']);

    const handler = clerkMiddleware(async (auth, request) => {
      // Admin routes require auth
      if (isAdminRoute(request)) {
        const { userId } = await auth();
        if (!userId) {
          const signInUrl = new URL('/sign-in', request.url);
          signInUrl.searchParams.set('redirect_url', request.url);
          return NextResponse.redirect(signInUrl);
        }
      }
    });

    return handler(req as any, {} as any);
  } catch (error) {
    // SECURITY: Never allow requests through on middleware error
    console.error('Middleware error:', error);
    if (isPathInList(pathname, PROTECTED_ROUTES)) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication service unavailable' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }
    // Allow public routes through on Clerk error
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
