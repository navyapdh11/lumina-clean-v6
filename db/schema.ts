import { mysqlTable, varchar, int, decimal, text, timestamp, boolean } from 'drizzle-orm/mysql-core';

export const jobs = mysqlTable('jobs', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }),
  serviceType: varchar('service_type', { length: 50 }).notNull(), // residential, commercial, ndis, strata, airbnb, real-estate
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, confirmed, in-progress, completed, cancelled
  postcode: varchar('postcode', { length: 10 }).notNull(),
  scheduledAt: varchar('scheduled_at', { length: 50 }).notNull(),
  address: text('address').notNull(),
  phone: varchar('phone', { length: 30 }),
  email: varchar('email', { length: 255 }),
  bedrooms: int('bedrooms').default(0),
  bathrooms: int('bathrooms').default(0),
  sqm: int('sqm'),
  frequency: varchar('frequency', { length: 20 }), // one-time, weekly, fortnightly, monthly
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stripePaymentLink: text('stripe_payment_link'),
  stripePaymentId: varchar('stripe_payment_id', { length: 255 }),
  notes: text('notes'),
  metadata: text('metadata'), // JSON string
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const leads = mysqlTable('leads', {
  id: varchar('id', { length: 255 }).primaryKey(),
  type: varchar('type', { length: 30 }).notNull(), // commercial-quote, ndis-assessment, strata-audit, general
  businessName: varchar('business_name', { length: 255 }),
  contactName: varchar('contact_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 30 }),
  propertyType: varchar('property_type', { length: 50 }),
  sqm: int('sqm'),
  floors: int('floors'),
  frequency: varchar('frequency', { length: 20 }),
  services: text('services'), // JSON array of selected services
  message: text('message'),
  ndisNumber: varchar('ndis_number', { length: 50 }),
  planType: varchar('plan_type', { length: 30 }), // self-managed, plan-managed, ndia-managed
  livingSituation: varchar('living_situation', { length: 50 }),
  strataName: varchar('strata_name', { length: 255 }),
  role: varchar('role', { length: 50 }), // strata-manager, committee-member, executive
  lotCount: int('lot_count'),
  levels: int('levels'),
  facilities: text('facilities'), // JSON array
  currentProvider: varchar('current_provider', { length: 255 }),
  // LinkedIn scraping fields
  name: varchar('name', { length: 255 }),
  company: varchar('company', { length: 255 }),
  profileUrl: text('profile_url'),
  serviceType: varchar('service_type', { length: 30 }),
  // Lead management
  status: varchar('status', { length: 20 }).default('new'), // new, contacted, qualified, converted, lost
  source: varchar('source', { length: 50 }).default('website'), // website, linkedin, referral, google
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const testimonials = mysqlTable('testimonials', {
  id: varchar('id', { length: 255 }).primaryKey(),
  authorName: varchar('author_name', { length: 100 }).notNull(),
  location: varchar('location', { length: 100 }).notNull(),
  rating: int('rating').notNull().default(5),
  serviceType: varchar('service_type', { length: 30 }).notNull(),
  text: text('text').notNull(),
  verified: boolean('verified').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const metrics = mysqlTable('metrics', {
  id: varchar('id', { length: 255 }).primaryKey(),
  type: varchar('type', { length: 30 }).notNull(), // mrr, leads, conversion, tenders
  value: decimal('value', { precision: 15, scale: 2 }).notNull(),
  period: varchar('period', { length: 20 }).notNull(), // daily, weekly, monthly
  recordedAt: timestamp('recorded_at').defaultNow().notNull(),
});

export const photos = mysqlTable('photos', {
  id: varchar('id', { length: 255 }).primaryKey(),
  jobId: varchar('job_id', { length: 255 }), // Optional: link to a job
  leadId: varchar('lead_id', { length: 255 }), // Optional: link to a lead
  url: varchar('url', { length: 500 }).notNull(),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  title: varchar('title', { length: 255 }),
  altText: text('alt_text'),
  mimeType: varchar('mime_type', { length: 50 }),
  size: int('size'), // bytes
  width: int('width'),
  height: int('height'),
  sortOrder: int('sort_order').default(0),
  status: varchar('status', { length: 20 }).default('ready'), // processing, ready, failed
  uploadedBy: varchar('uploaded_by', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
