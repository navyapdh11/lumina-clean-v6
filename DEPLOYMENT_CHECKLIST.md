# Deployment Checklist for LuminaClean v6.1

## ✅ Completed
- [x] All TypeScript errors fixed
- [x] New service pages created (Airbnb, Real Estate)
- [x] Quote/Assessment forms created (Commercial, NDIS, Strata)
- [x] Pricing calculator component added
- [x] Testimonials section added
- [x] Homepage enhanced with new sections
- [x] Database connection fixed
- [x] tRPC types corrected
- [x] README.md updated with full documentation
- [x] vercel.json configuration created

## ⚠️ Before Deploying to Production

### 1. Environment Variables
Replace all placeholder values in Vercel environment settings:
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Get from https://dashboard.clerk.com
- [ ] `CLERK_SECRET_KEY` - Get from Clerk dashboard
- [ ] `DATABASE_URL` - PlanetScale connection string
- [ ] `NEO4J_URI` - Neo4j Aura connection
- [ ] `NEO4J_USER` - Neo4j username
- [ ] `NEO4J_PASSWORD` - Neo4j password
- [ ] `OPENAI_API_KEY` - OpenAI API key (billing enabled)
- [ ] `DEEPGRAM_API_KEY` - Deepgram API key
- [ ] `TWILIO_ACCOUNT_SID` - Twilio account SID
- [ ] `TWILIO_AUTH_TOKEN` - Twilio auth token
- [ ] `TWILIO_PHONE_NUMBER` - Your Twilio phone number
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key (live mode)
- [ ] `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- [ ] `UPSTASH_REDIS_REST_URL` - Upstash Redis REST URL
- [ ] `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis REST token

### 2. External Services Setup
- [ ] **Clerk**: Create application at https://dashboard.clerk.com
  - Enable email/password authentication
  - Configure redirect URLs: `https://lumina-clean.com.au/*`
  
- [ ] **PlanetScale**: Create database
  - Run schema migrations: `pnpm db:push`
  - Create indexes for performance
  
- [ ] **Neo4j**: Create Aura instance
  - Initialize graph database schema
  
- [ ] **Stripe**: Setup payment products
  - Create payment link templates
  - Configure webhooks to `/api/webhooks/stripe`
  
- [ ] **Twilio**: Configure voice webhook
  - Point to `/api/voice/dispatch`
  
- [ ] **OpenAI**: Ensure billing is enabled
  - GPT-4o and GPT-4o-mini access
  
- [ ] **Kafka**: Setup cluster (optional for MVP)
  - Create `cleaning-dispatch` topic

### 3. Domain Configuration
- [ ] Purchase domain: `lumina-clean.com.au`
- [ ] Add domain to Vercel project settings
- [ ] Configure DNS records (Vercel will provide values)
- [ ] Enable HTTPS (automatic with Vercel)

### 4. Testing Before Deploy
- [ ] Test all routes locally with real environment variables
- [ ] Verify Clerk authentication works
- [ ] Test Stripe payment flow
- [ ] Verify database connections
- [ ] Test tRPC procedures
- [ ] Check all form submissions
- [ ] Verify 3D hero scene loads correctly
- [ ] Test mobile responsiveness

### 5. SEO & Analytics
- [ ] Add Google Analytics / Vercel Analytics
- [ ] Submit sitemap to Google Search Console
- [ ] Setup OpenGraph image for social sharing
- [ ] Add meta descriptions to all pages

### 6. Performance Optimization
- [ ] Enable Next.js Image optimization
- [ ] Configure CDN (Vercel does this automatically)
- [ ] Test Lighthouse scores in production
- [ ] Enable compression

## 🚀 Deployment Commands

```bash
# Option 1: Using Vercel CLI
cd /root/lumina-clean-v6
vercel --prod

# Option 2: Using pnpm script
pnpm deploy

# Option 3: Via Git push (if connected)
git add .
git commit -m "v6.1 - Enhanced with new features"
git push origin main
```

## 📋 Post-Deployment

- [ ] Verify all routes work in production
- [ ] Test authentication flow
- [ ] Verify database connections
- [ ] Test payment flow with real Stripe test card
- [ ] Monitor Vercel deployment logs
- [ ] Setup error monitoring (Sentry recommended)
- [ ] Configure automatic deployments on git push

## 🎯 Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| Homepage | ✅ Complete | With 3D hero, calculator, testimonials |
| Residential Page | ✅ Complete | AR scanner link |
| Commercial Page | ✅ Complete | Quote form added |
| NDIS Page | ✅ Complete | Assessment form added |
| Strata Page | ✅ Complete | Site audit form added |
| Airbnb Page | ✅ Complete | New in v6.1 |
| Real Estate Page | ✅ Complete | New in v6.1 |
| Booking Flow | ✅ Complete | Multi-step process |
| Admin Dashboard | ✅ Complete | Marketing Hub |
| API Routes | ⚠️ Needs Testing | Requires real credentials |
| Clerk Auth | ⚠️ Needs Config | Real keys required |
| Stripe Payments | ⚠️ Needs Config | Live keys + webhooks |
| Voice Dispatch | ⚠️ Needs Twilio | Real SID + token |
| AR Scanner | ✅ UI Complete | API route exists |

## 📞 Support

For deployment issues:
- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/app/building-your-application/deploying
- Clerk Setup: https://clerk.com/docs/quickstarts/nextjs

---

**Ready to deploy once all checklist items are complete!** 🚀
