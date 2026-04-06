import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { pricingEngine } from '@/lib/pricing';
import { kafka } from '@/lib/kafka';
import Stripe from 'stripe';

const voiceDispatchSchema = z.object({
  transcript: z.string().min(10),
  callerId: z.string().optional(),
});

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2024-12-18.acacia' as any,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transcript, callerId } = voiceDispatchSchema.parse(body);

    const postcodeMatch = transcript.match(/\b(\d{4})\b/);
    const postcode = postcodeMatch ? postcodeMatch[1] : '2000';

    const serviceMatch = transcript.match(/(residential|commercial|airbnb|strata|ndis)/i);
    const service = serviceMatch ? serviceMatch[1].toLowerCase() : 'residential';

    const price = pricingEngine.calculate({ serviceType: service, postcode });
    const slot = 'Tomorrow 9AM-12PM';

    const paymentLink = await stripeClient.paymentLinks.create({
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: { name: `${service} cleaning` },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
    });

    const jobId = `JOB-${Date.now()}`;
    await kafka.produce('cleaning-dispatch', { jobId, postcode, service, eta: slot, priority: 'normal' });

    console.log(`[SMS] To: ${callerId} — Job: ${jobId}, Pay: ${paymentLink.url}`);

    return NextResponse.json({ success: true, jobId, eta: slot, paymentLink: paymentLink.url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Voice dispatch error:', error);
    return NextResponse.json({ error: 'Failed to process voice dispatch' }, { status: 500 });
  }
}
