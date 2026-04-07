import { NextResponse } from 'next/server';
import { db } from '@/db';
import { leads } from '@/db/schema';
import { nanoid } from 'nanoid';
import { z } from 'zod';

const leadSchema = z.object({
  type: z.string().min(1).max(50),
  businessName: z.string().max(255).optional().nullable(),
  contactName: z.string().max(255).optional().nullable(),
  participantName: z.string().max(255).optional().nullable(),
  strataName: z.string().max(255).optional().nullable(),
  email: z.string().email().max(255),
  phone: z.string().max(30).optional().nullable(),
  propertyType: z.string().max(50).optional().nullable(),
  sqm: z.union([z.string(), z.number()]).optional().nullable(),
  floors: z.union([z.string(), z.number()]).optional().nullable(),
  frequency: z.string().max(20).optional().nullable(),
  services: z.array(z.string()).optional().nullable(),
  message: z.string().optional().nullable(),
  ndisNumber: z.string().max(50).optional().nullable(),
  planType: z.string().max(30).optional().nullable(),
  livingSituation: z.string().max(50).optional().nullable(),
  role: z.string().max(50).optional().nullable(),
  lotCount: z.union([z.string(), z.number()]).optional().nullable(),
  levels: z.union([z.string(), z.number()]).optional().nullable(),
  facilities: z.array(z.string()).optional().nullable(),
  currentProvider: z.string().max(255).optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();

    // Validate input with Zod
    const parsed = leadSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.errors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const leadId = `LEAD-${nanoid(8)}`;

    const safeInt = (val: string | number | null | undefined): number | null => {
      if (val == null) return null;
      const n = typeof val === 'string' ? parseInt(val, 10) : val;
      return isNaN(n) ? null : n;
    };

    await db.insert(leads).values({
      id: leadId,
      type: data.type,
      businessName: data.businessName ?? null,
      contactName: data.contactName ?? data.participantName ?? data.strataName ?? 'Unknown',
      email: data.email,
      phone: data.phone ?? null,
      propertyType: data.propertyType ?? null,
      sqm: safeInt(data.sqm),
      floors: safeInt(data.floors),
      frequency: data.frequency ?? null,
      services: data.services ? JSON.stringify(data.services) : null,
      message: data.message ?? null,
      ndisNumber: data.ndisNumber ?? null,
      planType: data.planType ?? null,
      livingSituation: data.livingSituation ?? null,
      strataName: data.strataName ?? null,
      role: data.role ?? null,
      lotCount: safeInt(data.lotCount),
      levels: safeInt(data.levels),
      facilities: data.facilities ? JSON.stringify(data.facilities) : null,
      currentProvider: data.currentProvider ?? null,
    });

    return NextResponse.json({
      success: true,
      leadId,
      message: 'Lead submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting lead:', error);
    return NextResponse.json(
      { error: 'Failed to submit lead' },
      { status: 500 }
    );
  }
}
