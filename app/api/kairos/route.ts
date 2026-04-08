import { NextRequest, NextResponse } from 'next/server';
import { 
  initializeState, 
  runKairosGoTTickLoop, 
  getGraphSnapshot,
  type KairosGoTState,
} from '@/lib/kairos-got';

const sessions = new Map<string, KairosGoTState>();

function getOrCreateState(sessionId: string): KairosGoTState {
  let state = sessions.get(sessionId);
  if (!state) {
    state = initializeState(sessionId);
    sessions.set(sessionId, state);
  }
  return state;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session') || 'default';
  
  const state = getOrCreateState(sessionId);
  const thoughts = getGraphSnapshot(state);
  
  return NextResponse.json({
    sessionId,
    tickCount: state.tickCount,
    lastConsolidatedAt: state.lastConsolidatedAt,
    activeThoughts: thoughts.length,
    recentThoughts: thoughts.slice(-10).map(t => ({
      id: t.id,
      content: t.content,
      type: t.type,
      confidence: t.confidence,
      timestamp: t.timestamp,
    })),
  });
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session') || 'default';
  const action = searchParams.get('action') || 'tick';
  
  const state = getOrCreateState(sessionId);
  
  if (action === 'tick') {
    await runKairosGoTTickLoop(state);
    return NextResponse.json({
      success: true,
      tickCount: state.tickCount,
      activeThoughts: getGraphSnapshot(state).length,
    });
  }
  
  if (action === 'consolidate') {
    state.lastConsolidatedAt = 0;
    return NextResponse.json({
      success: true,
      message: 'Consolidation triggered',
    });
  }
  
  if (action === 'reset') {
    const newState = initializeState(sessionId);
    sessions.set(sessionId, newState);
    return NextResponse.json({
      success: true,
      message: 'Session reset',
    });
  }
  
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
