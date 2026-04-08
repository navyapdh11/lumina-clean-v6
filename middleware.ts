import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const hasClerkKeys = !!(
  process.env.CLERK_SECRET_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.CLERK_SECRET_KEY.length > 20 &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.length > 20 &&
  !process.env.CLERK_SECRET_KEY.includes('_xxx') &&
  !process.env.CLERK_SECRET_KEY.includes('changeme') &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_live_')
);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip static files and asset paths
  if (
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname === '/favicon.ico' ||
    pathname === '/icon.svg' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    /\.(svg|png|jpg|jpeg|gif|webp|css|js|woff2?)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // If Clerk is NOT configured, allow everything through (graceful degradation)
  if (!hasClerkKeys) {
    return NextResponse.next();
  }

  // Clerk IS configured — use Clerk middleware for admin protection
  try {
    const { clerkMiddleware, createRouteMatcher } = await import('@clerk/nextjs/server');

    const isAdminRoute = createRouteMatcher(['/admin-dashboard(.*)']);

    const handler = clerkMiddleware(async (auth, request) => {
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
    console.error('Clerk middleware error:', error);
    // If Clerk fails, allow public routes through
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff2)$).*)'],
};
