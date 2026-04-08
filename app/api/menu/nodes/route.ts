import { NextRequest, NextResponse } from 'next/server';
import { getAccessibleNodes } from '@/lib/menu-graph';

export async function GET(req: NextRequest) {
  const userRole = req.headers.get('x-user-role') || 'admin';
  
  const nodes = getAccessibleNodes(userRole);
  
  return NextResponse.json(nodes.map(n => ({
    id: n.id,
    label: n.label,
    href: n.href,
    icon: n.icon,
    children: n.children,
  })));
}
