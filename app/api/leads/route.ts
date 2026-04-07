import { NextResponse } from 'next/server';
import { db } from '@/db';
import { leads } from '@/db/schema';
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, ...leadData } = body;

    if (!type) {
      return NextResponse.json(
        { error: 'Lead type is required' },
        { status: 400 }
      );
    }

    const leadId = nanoid();

    await db.insert(leads).values({
      id: leadId,
      type,
      businessName: leadData.businessName || null,
      contactName: leadData.contactName || leadData.participantName || leadData.strataName || 'Unknown',
      email: leadData.email,
      phone: leadData.phone || null,
      propertyType: leadData.propertyType || null,
      sqm: leadData.sqm ? parseInt(leadData.sqm) : null,
      floors: leadData.floors ? parseInt(leadData.floors) : null,
      frequency: leadData.frequency || null,
      services: leadData.services ? JSON.stringify(leadData.services) : null,
      message: leadData.message || null,
      ndisNumber: leadData.ndisNumber || null,
      planType: leadData.planType || null,
      livingSituation: leadData.livingSituation || null,
      strataName: leadData.strataName || null,
      role: leadData.role || null,
      lotCount: leadData.lotCount ? parseInt(leadData.lotCount) : null,
      levels: leadData.levels ? parseInt(leadData.levels) : null,
      facilities: leadData.facilities ? JSON.stringify(leadData.facilities) : null,
      currentProvider: leadData.currentProvider || null,
    });

    console.log(`✅ Lead submitted successfully: ${leadId} (${type})`);

    return NextResponse.json({
      success: true,
      leadId,
      message: 'Lead submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting lead:', error);
    return NextResponse.json(
      { error: 'Failed to submit lead', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
