import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/db';
import { jobs } from '@/db/schema';
import { eq } from 'drizzle-orm';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('⚠️ STRIPE_SECRET_KEY is not set — Stripe webhook will return 503');
}

const stripeClient = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-12-18.acacia' as any })
  : null;

// SECURITY: Track processed webhook events to prevent replay attacks
const processedEvents = new Map<string, number>();
const EVENT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function isEventProcessed(eventId: string): boolean {
  // Clean up old entries
  const now = Date.now();
  for (const [id, timestamp] of processedEvents.entries()) {
    if (now - timestamp > EVENT_TTL_MS) {
      processedEvents.delete(id);
    }
  }
  return processedEvents.has(eventId);
}

export async function POST(req: NextRequest) {
  try {
    if (!stripeClient) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    }

    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    let event: Stripe.Event;
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        return NextResponse.json({ error: 'STRIPE_WEBHOOK_SECRET not set' }, { status: 503 });
      }
      event = stripeClient!.webhooks.constructEvent(body, sig || '', webhookSecret);
    } catch (err) {
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    // SECURITY: Check for replay attacks
    if (isEventProcessed(event.id)) {
      console.log(`[Stripe Webhook] Duplicate event detected: ${event.id}`);
      return NextResponse.json({ received: true, duplicate: true });
    }
    processedEvents.set(event.id, Date.now());

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const jobId = paymentIntent.metadata.jobId;

      if (jobId && db) {
        await db
          .update(jobs)
          .set({ status: 'confirmed', stripePaymentId: paymentIntent.id })
          .where(eq(jobs.id, jobId));

        console.log(`[Stripe Webhook] Job ${jobId} confirmed, payment: ${paymentIntent.id}`);
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const jobId = paymentIntent.metadata.jobId;

      if (jobId && db) {
        await db
          .update(jobs)
          .set({ status: 'payment_failed', stripePaymentId: paymentIntent.id })
          .where(eq(jobs.id, jobId));

        console.error(`[Stripe Webhook] Job ${jobId} payment failed: ${paymentIntent.id}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
