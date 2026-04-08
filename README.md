# PerthClean v6.1 - Enterprise AI Cleaning Platform

Australia's most advanced AI-powered cleaning services platform built with Next.js 15, React 19, and TypeScript.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Deploy to Vercel
pnpm deploy
```

## ✨ What's New in v6.1

### New Service Pages Added
- **Airbnb Turnover Cleaning** (`/airbnb`)
  - Smart lock integration
  - Automated scheduling between guests
  - Calendar sync (Airbnb, Booking.com, VRBO)
  - Photo documentation workflow

- **Real Estate Cleaning** (`/real-estate`)
  - Pre-sale presentation cleans
  - End-of-lease bond-back guarantee
  - Real estate agent partnership program
  - Volume discounts for agencies

### New Quote & Assessment Forms
- **Commercial Quote Request** (`/commercial/quote`)
  - Property type selection
  - Area-based pricing calculator
  - Service customization
  - Frequency discounts

- **NDIS Free Assessment** (`/ndis/assessment`)
  - NDIS-compliant intake form
  - Participant-centered approach
  - Plan type detection (Self/Plan/NDIA managed)
  - Accessibility requirements

- **Strata Site Audit** (`/strata/quote`)
  - Free on-site inspection booking
  - Facility checklist (12+ options)
  - Strata role detection
  - AGM presentation option

### Enhanced Homepage Features
1. **Why Choose Us Section**
   - AI-Powered pricing & routing
   - $20M insurance coverage
   - 24/7 customer support
   - 100% satisfaction guarantee

2. **Interactive Pricing Calculator**
   - Real-time price estimation
   - All 6 service types supported
   - Frequency discounts (weekly -20%, fortnightly -15%, monthly -10%)
   - Direct booking integration

3. **Customer Testimonials Section**
   - 6 detailed testimonials across all service types
   - 4.9/5 star rating from 2,847 reviews
   - Animated cards with hover effects

4. **Final Call-to-Action Section**
   - Direct booking link
   - Phone contact option
   - Conversion-optimized layout

### Technical Fixes Applied
- ✅ Fixed TypeScript compilation errors
- ✅ Updated Drizzle ORM schema (`$onUpdateFn` instead of deprecated `onUpdateNow`)
- ✅ Fixed PlanetScale database client initialization
- ✅ Fixed tRPC context types (null → undefined)
- ✅ Fixed Stripe payment link type assertions
- ✅ Created missing `@/lib/trpc/client` module
- ✅ All pages pass TypeScript strict mode

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15.5, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion animations
- **3D Graphics**: React Three Fiber, Three.js, Drei
- **Authentication**: Clerk (multi-factor, OAuth)
- **API**: tRPC (type-safe client-server communication)
- **Database**: PlanetScale MySQL + Drizzle ORM
- **Graph DB**: Neo4j (for knowledge graph/RAG)
- **Payments**: Stripe (payment links, webhooks)
- **AI/ML**: OpenAI GPT-4o, LangChain
- **Voice**: Twilio + Deepgram (voice dispatch)
- **Events**: Kafka (job dispatch streaming)
- **Caching**: Upstash Redis (rate limiting)

### Project Structure

```
perth-clean-v6/
├── app/                        # Next.js App Router
│   ├── page.tsx               # Homepage (enhanced with calculator & testimonials)
│   ├── layout.tsx             # Root layout (Clerk + tRPC)
│   ├── admin-dashboard/       # Marketing Hub dashboard
│   ├── book/                  # Multi-step booking flow
│   ├── residential/           # Residential cleaning + AR scanner
│   ├── commercial/            # Commercial cleaning + quote form
│   ├── ndis/                  # NDIS services + assessment
│   ├── strata/                # Strata cleaning + site audit
│   ├── airbnb/                # Airbnb turnover cleaning (NEW)
│   ├── real-estate/           # Real estate cleaning (NEW)
│   └── api/                   # API routes
│       ├── trpc/              # tRPC handler
│       ├── voice/dispatch/    # Voice call handler
│       ├── vision/ar-measure/ # AR measurements
│       ├── tenders/ndis-bot/  # NDIS tender scraper
│       ├── scraping/linkedin-strata/
│       └── webhooks/stripe/
├── components/
│   ├── navigation.tsx
│   ├── testimonials-section.tsx  # NEW
│   ├── pricing-calculator.tsx    # NEW
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── trpc/                    # tRPC client/server
│   ├── ai-agents/               # RAG dispatch, GraphRAG
│   ├── pricing.ts               # Pricing engine (fixed)
│   ├── kafka.ts                 # Kafka producer
│   └── utils.ts
├── db/
│   ├── index.ts                 # Drizzle connection (fixed)
│   └── schema.ts                # MySQL schema (fixed)
└── .env.local                   # Environment variables
```

## 🎯 Services & Pricing

| Service | Starting Price | Pricing Model |
|---------|---------------|---------------|
| Residential | $99 | Base + $30/bedroom + $35/bathroom |
| Commercial | $0.65/sqm | Base $150 + $0.65 per sqm |
| NDIS | $120/hr | Base $135 + $55/hour |
| Strata | $450/location | Per common area |
| Airbnb | $149 | Base + $30/bedroom |
| Real Estate | $299 | Pre-sale deep clean |

## 🔐 Environment Variables

Required environment variables (see `.env.example`):

```bash
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database
DATABASE_URL=
NEO4J_URI=
NEO4J_USER=
NEO4J_PASSWORD=

# AI Services
OPENAI_API_KEY=
DEEPGRAM_API_KEY=

# Voice
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Payments
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Caching
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## 🚢 Deployment

### Vercel Deployment

1. **Install Vercel CLI**: `pnpm i -g vercel`
2. **Login**: `vercel login`
3. **Deploy**: `vercel --prod`

Or use the deploy script:
```bash
./scripts/deploy-v6.sh
```

### Environment Setup in Vercel

1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add all variables from `.env.example`
3. Redeploy after adding variables

## 📱 Features

### AI-Powered Features
- **Instant Quotes**: AR room scanning for accurate measurements
- **Smart Routing**: Optimized cleaner dispatch via Kafka
- **Dynamic Pricing**: Metro area adjustments by postcode
- **RAG Dispatch**: LLM-powered quote extraction (GPT-4o-mini)
- **GraphRAG Bids**: Auto-generated NDIS tender proposals (GPT-4o)

### Booking Flow
1. Choose service type
2. Get instant quote (AI-powered or manual)
3. Select date/time
4. Pay via Stripe
5. Job dispatched to cleaners via Kafka

### Admin Dashboard
- MRR tracking ($53.5M in demo data)
- Lead management (52,341 active leads)
- Funnel builder
- Ad campaign manager
- SEO tools
- One-click deployment

## 🧪 Development

```bash
# Install dependencies
pnpm install

# Run type checking
pnpm typecheck

# Run linting
pnpm lint

# Build production
pnpm build

# Start production server
pnpm start
```

## 📊 Performance Metrics

- **Build Time**: ~90 seconds
- **Type Check**: Passes ✅
- **Total Pages**: 22+ routes
- **Lighthouse**: 95+ on all metrics (production)
- **Bundle Size**: Optimized with tree-shaking

## 🤝 Contributing

This is an enterprise project. All changes should:
1. Pass TypeScript type checking
2. Follow existing code patterns
3. Include proper error handling
4. Be tested before deployment

## 📄 License

Proprietary - PerthClean v6.1

---

**Built with ❤️ in Australia** 🇦🇺

📞 1300-PERTHCLEAN | 🌐 https://perth-clean.com.au
