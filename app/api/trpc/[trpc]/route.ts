import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/lib/trpc/server';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

const handler = async (req: NextRequest) => {
  // Safely extract auth info — don't crash if Clerk is not configured
  let userId: string | undefined;

  try {
    const authObj = await getAuth(req as any);
    userId = authObj.userId || undefined;
  } catch {
    // Clerk not configured or auth failed — userId remains undefined
    // Individual protected procedures will handle the missing auth
  }

  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({ userId }),
  });
};

export { handler as GET, handler as POST };
