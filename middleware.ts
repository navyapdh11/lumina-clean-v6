import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Check if Clerk credentials are available
const hasClerk = !!(
  process.env.CLERK_SECRET_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.CLERK_SECRET_KEY !== 'sk_test_xxx' &&
  process.env.CLERK_SECRET_KEY !== 'sk_test_xxx_replace_before_deploy' &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'pk_test_xxx' &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'pk_test_xxx_replace_before_deploy'
);

// Dynamic import to avoid crash when Clerk is not configured
async function getClerkMiddleware() {
  if (!hasClerk) {
    return null;
  }
  const { clerkMiddleware, createRouteMatcher } = await import('@clerk/nextjs/server');
  return { clerkMiddleware, createRouteMatcher };
}

export default async function middleware(req: NextRequest) {
  // No Clerk credentials — skip auth, allow all requests through
  if (!hasClerk) {
    return NextResponse.next();
  }

  try {
    const clerk = await getClerkMiddleware();
    if (!clerk) {
      return NextResponse.next();
    }

    const { clerkMiddleware, createRouteMatcher } = clerk;

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

    const handler = clerkMiddleware(async (auth, request) => {
      if (isPublicRoute(request)) {
        return;
      }

      const { userId } = await auth();

      if (isAdminRoute(request) && !userId) {
        const signInUrl = new URL('/sign-in', request.url);
        signInUrl.searchParams.set('redirect_url', request.url);
        return NextResponse.redirect(signInUrl);
      }

      if (!userId) {
        const signInUrl = new URL('/sign-in', request.url);
        signInUrl.searchParams.set('redirect_url', request.url);
        return NextResponse.redirect(signInUrl);
      }
    });

    return handler(req as any, {} as any);
  } catch (error) {
    // If Clerk fails, let the request through
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
