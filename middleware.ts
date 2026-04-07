import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Only import Clerk if credentials are available
const hasClerk = !!(
  process.env.CLERK_SECRET_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

let isPublicRoute: (req: NextRequest) => boolean = () => false;
let isAdminRoute: (req: NextRequest) => boolean = () => false;
let clerkHandler: ReturnType<typeof import('@clerk/nextjs/server').clerkMiddleware> | null = null;

if (hasClerk) {
  const { clerkMiddleware, createRouteMatcher } = await import('@clerk/nextjs/server');

  isPublicRoute = createRouteMatcher([
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

  isAdminRoute = createRouteMatcher(['/admin-dashboard(.*)']);

  clerkHandler = clerkMiddleware(async (auth, req) => {
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
}

export default async function middleware(req: NextRequest) {
  // No Clerk credentials — skip auth, allow all requests through
  if (!clerkHandler) {
    return NextResponse.next();
  }

  return clerkHandler(req as Parameters<typeof clerkHandler>[0], req as Parameters<typeof clerkHandler>[1]);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/webhooks|emerald).*)',
  ],
};
