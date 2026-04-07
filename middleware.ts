import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // No Clerk credentials — skip auth entirely
  if (!process.env.CLERK_SECRET_KEY || !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    if (pathname.startsWith('/admin-dashboard')) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
    return NextResponse.next();
  }

  // Clerk is configured — use it
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { clerkMiddleware } = require('@clerk/nextjs/server');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createRouteMatcher } = require('@clerk/nextjs/server');

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handler = clerkMiddleware(async (auth: any, _req: NextRequest) => {
    const { userId } = await auth();
    if (isPublicRoute(_req)) return;
    if (isAdminRoute(_req) && !userId) {
      return NextResponse.redirect(new URL('/sign-in', _req.url));
    }
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', _req.url));
    }
  });

  return handler(req as Parameters<typeof handler>[0], req as Parameters<typeof handler>[1]);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
