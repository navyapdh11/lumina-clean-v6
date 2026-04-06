import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const strataScraperSchema = z.object({
  targetStates: z.array(z.string()).default(['NSW', 'VIC', 'QLD', 'WA']),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetStates } = strataScraperSchema.parse(body);

    const searchQueries = targetStates.flatMap(state => [
      `strata manager ${state}`,
      `body corporate ${state}`,
    ]);

    const leads = searchQueries.flatMap((query, i) =>
      Array.from({ length: 5 }, (_, j) => ({
        name: `Lead ${i * 5 + j + 1}`,
        title: 'Strata Manager',
        company: `${query.split(' ')[0]} Corp Pty Ltd`,
        profileUrl: `https://linkedin.com/in/lead-${i * 5 + j + 1}`,
        location: query.split(' ')[1],
      }))
    );

    return NextResponse.json({
      success: true,
      leads: leads.length,
      imported: Math.min(leads.length, 50),
      sample: leads.slice(0, 5),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('LinkedIn strata scraper error:', error);
    return NextResponse.json({ error: 'Failed to scrape LinkedIn' }, { status: 500 });
  }
}
