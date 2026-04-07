import { mysqlTable, varchar, int, decimal, datetime, json, text, index } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(),
  clerkId: varchar('clerk_id', { length: 255 }).unique().notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  role: varchar('role', { length: 20 }).default('customer').notNull(),
  createdAt: datetime('created_at', { mode: 'string' }).default(sql`NOW()`).notNull(),
  updatedAt: datetime('updated_at', { mode: 'string' }).default(sql`NOW()`).$onUpdateFn(() => sql`NOW()`),
}, (table) => [
  index('idx_clerk_id').on(table.clerkId),
  index('idx_email').on(table.email),
]);

export const jobs = mysqlTable('jobs', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  serviceType: varchar('service_type', { length: 50 }).notNull(),
  postcode: varchar('postcode', { length: 10 }).notNull(),
  address: text('address').notNull(),
  sqm: decimal('sqm', { precision: 10, scale: 2 }),
  bedrooms: int('bedrooms'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  scheduledAt: datetime('scheduled_at', { mode: 'string' }),
  completedAt: datetime('completed_at', { mode: 'string' }),
  stripePaymentId: varchar('stripe_payment_id', { length: 255 }),
  metadata: json('metadata'),
  createdAt: datetime('created_at', { mode: 'string' }).default(sql`NOW()`).notNull(),
  updatedAt: datetime('updated_at', { mode: 'string' }).default(sql`NOW()`).$onUpdateFn(() => sql`NOW()`),
}, (table) => [
  index('idx_user_id').on(table.userId),
  index('idx_status').on(table.status),
  index('idx_postcode').on(table.postcode),
  index('idx_scheduled_at').on(table.scheduledAt),
]);

export const leads = mysqlTable('leads', {
  id: varchar('id', { length: 255 }).primaryKey(),
  source: varchar('source', { length: 50 }).notNull(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  company: varchar('company', { length: 255 }),
  profileUrl: varchar('profile_url', { length: 512 }),
  serviceType: varchar('service_type', { length: 50 }),
  status: varchar('status', { length: 20 }).default('new').notNull(),
  metadata: json('metadata'),
  createdAt: datetime('created_at', { mode: 'string' }).default(sql`NOW()`).notNull(),
}, (table) => [
  index('idx_source').on(table.source),
  index('idx_status').on(table.status),
  index('idx_service_type').on(table.serviceType),
]);

export const tenders = mysqlTable('tenders', {
  id: varchar('id', { length: 255 }).primaryKey(),
  source: varchar('source', { length: 100 }).notNull(),
  title: text('title').notNull(),
  value: decimal('value', { precision: 12, scale: 2 }),
  deadline: datetime('deadline', { mode: 'string' }),
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  bidSubmitted: int('bid_submitted').default(0),
  bidValue: decimal('bid_value', { precision: 12, scale: 2 }),
  confidence: decimal('confidence', { precision: 5, scale: 4 }),
  metadata: json('metadata'),
  createdAt: datetime('created_at', { mode: 'string' }).default(sql`NOW()`).notNull(),
}, (table) => [
  index('idx_source').on(table.source),
  index('idx_status').on(table.status),
]);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type Tender = typeof tenders.$inferSelect;
export type NewTender = typeof tenders.$inferInsert;
