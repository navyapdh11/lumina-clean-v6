import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

const ROLES = {
  admin: ['*'],
  ops_manager: [
    'read:admin', 'read:bookings', 'write:bookings', 'assign:bookings',
    'reschedule:bookings', 'read:analytics', 'read:audit'
  ],
  cleaner: ['read:self', 'update:booking-status'],
  viewer: ['read:analytics']
};

const tokens = new Map<string, { userId: string; role: string; ts: number }>();

const AUDIT_LOG: Array<{
  id: string; ts: string; actor: string; role: string;
  action: string; entity: string; entityId: string; meta: Record<string, unknown>;
}> = [];

const SESSIONS = new Map<string, express.Response>();

function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 12)}`;
}

function auth(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const token = req.header('x-token');
  if (!token) {
    res.status(401).json({ error: 'missing_token' });
    return;
  }
  const payload = tokens.get(token);
  if (!payload) {
    res.status(401).json({ error: 'invalid_token' });
    return;
  }
  (req as express.Request & { user: { id: string; role: string } }).user = {
    id: payload.userId,
    role: payload.role
  };
  next();
}

function checkPermission(role: string, permission: string): boolean {
  const perms = ROLES[role as keyof typeof ROLES];
  if (!perms) return false;
  return perms.includes('*') || perms.includes(permission);
}

function logAudit(
  req: express.Request,
  action: string,
  entity: string,
  entityId: string,
  meta: Record<string, unknown> = {}
): void {
  const user = (req as express.Request & { user?: { id: string; role: string } }).user;
  AUDIT_LOG.unshift({
    id: generateId('audit'),
    ts: new Date().toISOString(),
    actor: user?.id ?? 'system',
    role: user?.role ?? 'anonymous',
    action,
    entity,
    entityId,
    meta
  });
  if (AUDIT_LOG.length > 1000) {
    AUDIT_LOG.length = 1000;
  }
}

app.post('/api/auth/login', (req, res) => {
  const { email, password, role = 'ops_manager' } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'bad_request' });
    return;
  }
  const userId = generateId('u');
  const token = generateId('tk');
  tokens.set(token, { userId, role, ts: Date.now() });
  res.json({ me: { userId, role }, token });
});

app.post('/api/auth/logout', (req, res) => {
  const token = req.header('x-token');
  if (token) tokens.delete(token);
  res.status(204).end();
});

app.get('/api/me', auth, (req, res) => {
  const user = (req as express.Request & { user: { id: string; role: string } }).user;
  res.json({ user, permissions: ROLES[user.role as keyof typeof ROLES] || [] });
});

app.get('/api/availability', auth, (req, res) => {
  const { date = new Date().toISOString().slice(0, 10) } = req.query;
  const slots = Array.from({ length: 12 }, (_, i) => {
    const h = 8 + i;
    return { id: `s_${i}`, time: `${String(h).padStart(2, '0')}:00`, cleanerName: ['Mia', 'Leo', 'Nina'][i % 3] || null };
  });
  logAudit(req, 'availability.viewed', 'calendar', 'self', { date });
  res.json({ items: slots, date });
});

app.post('/api/bookings/draft', auth, (req, res) => {
  const { slotId, plan, price } = req.body;
  const id = generateId('draft');
  logAudit(req, 'booking.draft_created', 'booking', id, { slotId, plan });
  res.json({ id, status: 'draft', plan, price });
});

const BOOKINGS = Array.from({ length: 128 }, (_, i) => ({
  id: `LC-${9200 + i}`,
  customerName: ['Sarah Chen', 'Michael Torres', 'Ava Patel', 'Noah Kim'][i % 4],
  plan: ['Weekly', 'Fortnightly', 'One-Off'][i % 3],
  status: ['Scheduled', 'AR Complete', 'Assigned', 'In Progress'][i % 4],
  assignedTo: i % 5 === 0 ? null : ['Mia', 'Leo', 'Nina'][i % 3],
  date: `2026-04-${String((i % 28) + 1).padStart(2, '0')}`
}));

app.get('/api/admin/summary', auth, (req, res) => {
  if (!checkPermission((req as express.Request & { user: { role: string } }).user.role, 'read:admin')) {
    res.status(403).json({ error: 'forbidden' });
    return;
  }
  res.json({
    bookingsToday: 14,
    bookingsDelta: '+3 from yesterday',
    avgCleanScore: 98,
    co2Offset: 184,
    croConversion: 34,
    activeCleaners: 9,
    slaHitRate: 96
  });
});

app.get('/api/admin/bookings', auth, (req, res) => {
  const { status = '', q = '', dateFrom = '', dateTo = '', page = '1', limit = '15' } = req.query;
  const p = Math.max(parseInt(page as string, 10) || 1, 1);
  const l = Math.min(Math.max(parseInt(limit as string, 10) || 15, 1), 100);
  let items = [...BOOKINGS];
  if (status) {
    items = items.filter(b => b.status.toLowerCase() === String(status).toLowerCase());
  }
  if (q) {
    const query = String(q).toLowerCase();
    items = items.filter(b =>
      [b.id, b.customerName, b.plan, b.status, b.assignedTo || ''].join(' ').includes(query)
    );
  }
  if (dateFrom) items = items.filter(b => b.date >= String(dateFrom));
  if (dateTo) items = items.filter(b => b.date <= String(dateTo));
  const total = items.length;
  items = items.slice((p - 1) * l, p * l);
  res.json({ items, page: p, limit: l, total, totalPages: Math.ceil(total / l) });
});

app.patch('/api/admin/bookings/:id', auth, (req, res) => {
  const booking = BOOKINGS.find(b => b.id === req.params.id);
  if (!booking) {
    res.status(404).json({ error: 'not_found' });
    return;
  }
  Object.assign(booking, req.body || {});
  logAudit(req, 'booking.updated', 'booking', booking.id, { changes: req.body });
  res.json({ ok: true, booking });
});

app.post('/api/admin/bookings/:id/assign', auth, (req, res) => {
  const booking = BOOKINGS.find(b => b.id === req.params.id);
  if (!booking) {
    res.status(404).json({ error: 'not_found' });
    return;
  }
  booking.assignedTo = req.body.cleanerName || 'Unassigned';
  booking.status = 'Assigned';
  logAudit(req, 'booking.assigned', 'booking', booking.id, { cleanerName: booking.assignedTo });
  res.json({ ok: true, booking });
});

app.get('/api/admin/cleaners', auth, (req, res) => {
  res.json({
    items: [
      { id: 'c1', name: 'Mia', activeJobs: 2 },
      { id: 'c2', name: 'Leo', activeJobs: 1 }
    ]
  });
});

app.get('/api/admin/analytics', auth, (req, res) => {
  res.json({
    revenue: [12, 18, 14, 20],
    conversion: [22, 28, 31, 34],
    funnel: [
      { label: 'Visited', value: 100 },
      { label: 'Booked', value: 34 }
    ]
  });
});

app.get('/api/admin/bookings/stream', auth, (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive'
  });
  const send = (payload: string) => res.write(`data: ${payload}\n\n`);
  const eventHandler = (payload: string) => send(payload);
  SESSIONS.set(generateId('session'), res);
  const ping = setInterval(() => res.write(': ping\n\n'), 25000);
  function onClose() {
    clearInterval(ping);
    SESSIONS.delete(req.params.id);
  }
  req.on('close', onClose);
  req.on('error', onClose);
  send(JSON.stringify({ type: 'connected', ts: Date.now() }));
});

function broadcast(type: string, payload: unknown): void {
  const msg = JSON.stringify({ type, payload, ts: Date.now() });
  const sessionsArray = Array.from(SESSIONS.values());
  for (const res of sessionsArray) {
    try {
      res.write(`data: ${msg}\n\n`);
    } catch {
      SESSIONS.delete(generateId('session'));
    }
  }
}

app.post('/api/audit/events', auth, (req, res) => {
  const { action, entity, entityId, meta } = req.body;
  logAudit(req, action, entity, entityId, meta);
  res.status(202).json({ ok: true });
  broadcast('audit.created', {
    action, entity, entityId, meta,
    actor: (req as express.Request & { user: { id: string; role: string } }).user.id,
    role: (req as express.Request & { user: { id: string; role: string } }).user.role
  });
});

app.get('/api/menu/nodes', auth, (req, res) => {
  const userRole = (req as express.Request & { user: { role: string } }).user.role;
  const { menuNavigator } = require('./menu-graph');
  const nodes = menuNavigator.getAccessibleNodes(userRole);
  res.json(nodes.map(n => ({ id: n.id, label: n.label, href: n.href, icon: n.icon })));
});

app.use('/admin', auth, (req, res) => {
  res.json({ admin: 'dashboard', message: 'Admin panel would be served here' });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'internal_error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server listening on ${PORT}`));

export default app;
