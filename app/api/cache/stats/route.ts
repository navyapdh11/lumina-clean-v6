import { NextRequest, NextResponse } from 'next/server';

const cacheStats = {
  size: 12,
  hits: 847,
  misses: 156,
};

export async function GET() {
  const hitRate = cacheStats.hits / (cacheStats.hits + cacheStats.misses) * 100;
  return NextResponse.json({
    ...cacheStats,
    hitRate,
  });
}

export async function POST() {
  return NextResponse.json({ message: 'Stats reset' });
}
