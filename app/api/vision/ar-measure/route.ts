import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const arMeasureSchema = z.object({
  measurements: z.object({
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
  }).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = arMeasureSchema.parse(body);

    const m = validated.measurements || {};
    const sqm = (m.length && m.width) ? m.length * m.width : 45;
    const bedrooms = Math.max(1, Math.floor(sqm / 15));
    const price = 99 + bedrooms * 30;

    return NextResponse.json({ sqm, bedrooms, price });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('AR measure error:', error);
    return NextResponse.json({ error: 'Failed to process AR scan' }, { status: 500 });
  }
}
