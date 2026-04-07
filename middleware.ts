import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/residential(.*)',
  '/commercial(.*)',
  '/airbnb(.*)',
  '/real-estate(.*)',
  '/strata(.*)',
  '/ndis(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/emerald(.*)',
  '/book(.*)',
  '/booking-confirmation(.*)',
  '/api/webhooks/(.*)',
  '/api/voice/(.*)',
  '/api/vision/(.*)',
  '/api/scraping/(.*)',
  '/api/tenders/(.*)',
  '/api/trpc/(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin-dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return;
  }

  const { userId } = await auth();

  if (isAdminRoute(req) && !userId) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // For non-public, non-admin routes, redirect to sign-in if not authenticated
  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
