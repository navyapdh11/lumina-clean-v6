import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { pricingEngine } from '@/lib/pricing';
import { kafka } from '@/lib/kafka';
import Stripe from 'stripe';

// SECURITY: Validate API key for voice dispatch to prevent abuse
const VOICE_API_SECRET = process.env.VOICE_API_SECRET || process.env.STRIPE_SECRET_KEY;

const voiceDispatchSchema = z.object({
  transcript: z.string().min(10),
  callerId: z.string().optional(),
  apiKey: z.string().optional(),
});

// SECURITY: No fallback to mock key — fail gracefully if not configured
const stripeClient = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia' as any,
    })
  : null;

export async function POST(req: NextRequest) {
  try {
    // SECURITY: Require API key or valid Stripe configuration
    const body = await req.json();
    const parsed = voiceDispatchSchema.parse(body);

    // Check API key if provided
    if (VOICE_API_SECRET && parsed.apiKey !== VOICE_API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // SECURITY: Ensure Stripe is configured before creating payment links
    if (!stripeClient) {
      return NextResponse.json(
        { error: 'Payment processing not configured' },
        { status: 503 }
      );
    }

    const { transcript, callerId } = parsed;

    const postcodeMatch = transcript.match(/\b(\d{4})\b/);
    const postcode = postcodeMatch ? postcodeMatch[1] : '2000';

    const serviceMatch = transcript.match(/(residential|commercial|airbnb|strata|ndis)/i);
    const service = serviceMatch ? serviceMatch[1].toLowerCase() : 'residential';

    const price = pricingEngine.calculate({ serviceType: service, postcode });
    const slot = 'Tomorrow 9AM-12PM';

    // Create Stripe payment link with proper typing
    const paymentLink = await stripeClient.paymentLinks.create({
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: { name: `${service} cleaning - ${slot}` },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      after_completion: {
        type: 'redirect',
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://lumina-clean-v6.vercel.app'}/booking-confirmation/voice`,
      },
    } as any);

    const jobId = `JOB-${Date.now()}`;

    // Dispatch via Kafka (graceful if Kafka not configured)
    try {
      await kafka.produce('cleaning-dispatch', {
        jobId,
        postcode,
        service,
        eta: slot,
        priority: 'normal',
        callerId: callerId ? callerId.slice(-4) : undefined, // Only log last 4 digits for privacy
      });
    } catch (e) {
      console.error('Kafka dispatch failed (non-fatal):', e);
    }

    console.log(`[Voice Dispatch] Job: ${jobId}, Price: $${price}`); // No PII in logs

    return NextResponse.json({
      success: true,
      jobId,
      eta: slot,
      price,
      paymentLink: paymentLink.url,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Voice dispatch error:', error);
    return NextResponse.json(
      { error: 'Failed to process voice dispatch' },
      { status: 500 }
    );
  }
}
