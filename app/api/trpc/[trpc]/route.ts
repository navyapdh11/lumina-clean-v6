import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/lib/trpc/server';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

const handler = async (req: NextRequest) => {
  const authObj = await getAuth(req as any);
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({ userId: authObj.userId || undefined }),
  });
};

export { handler as GET, handler as POST };
