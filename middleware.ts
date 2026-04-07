import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

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
  '/api/webhooks/(.*)',
  '/api/voice/(.*)',
  '/api/vision/(.*)',
  '/api/scraping/(.*)',
  '/api/tenders/(.*)',
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
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/webhooks|emerald).*)',
  ],
};
