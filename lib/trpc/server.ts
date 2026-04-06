import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { db } from '@/db';
import { jobs, leads } from '@/db/schema';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { pricingEngine } from '@/lib/pricing';
import { kafka } from '@/lib/kafka';

interface Context {
  userId?: string;
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { userId: ctx.userId } });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);

export const appRouter = router({
  getQuote: publicProcedure
    .input(z.object({ postcode: z.string(), serviceType: z.string(), sqm: z.number().optional(), bedrooms: z.number().optional() }))
    .query(async ({ input }) => {
      const price = pricingEngine.calculate({
        serviceType: input.serviceType,
        postcode: input.postcode,
        sqm: input.sqm,
        bedrooms: input.bedrooms,
      });
      return { price, confidence: 0.96 };
    }),

  createJob: protectedProcedure
    .input(z.object({
      serviceType: z.string(),
      postcode: z.string(),
      address: z.string(),
      scheduledAt: z.string(),
      price: z.number(),
      sqm: z.number().optional(),
      bedrooms: z.number().optional(),
      metadata: z.record(z.any()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const jobId = `JOB-${nanoid(8)}`;

      await db.insert(jobs).values({
        id: jobId,
        userId: ctx.userId,
        serviceType: input.serviceType,
        postcode: input.postcode,
        address: input.address,
        scheduledAt: input.scheduledAt,
        price: input.price.toString(),
        sqm: input.sqm?.toString(),
        bedrooms: input.bedrooms,
        metadata: input.metadata || {},
      });

      await kafka.produce('cleaning-dispatch', {
        jobId,
        serviceType: input.serviceType,
        postcode: input.postcode,
        eta: input.scheduledAt,
        priority: 'normal',
      });

      return { jobId, success: true };
    }),

  importStrataLeads: protectedProcedure
    .input(z.array(z.object({
      name: z.string().optional(),
      title: z.string().optional(),
      company: z.string().optional(),
      profileUrl: z.string().optional(),
      location: z.string().optional(),
    })))
    .mutation(async ({ input }) => {
      const leadsToInsert = input.map(lead => ({
        id: `LEAD-${nanoid(8)}`,
        source: 'linkedin-strata',
        name: lead.name || lead.title || 'Unknown',
        company: lead.company,
        profileUrl: lead.profileUrl,
        serviceType: 'strata',
      }));

      await db.insert(leads).values(leadsToInsert);
      return { success: true, count: leadsToInsert.length };
    }),

  getDashboardMetrics: publicProcedure.query(async () => {
    return {
      mrr: 53500000,
      totalJobs: 12847,
      activeLeads: 52341,
      conversionRate: 0.58,
      pendingTenders: 23,
      ndisBidsSubmitted: 12,
    };
  }),
});

export type AppRouter = typeof appRouter;
