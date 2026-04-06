import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { pricingEngine } from '@/lib/pricing';
import { z } from 'zod';

const quoteSchema = z.object({ postcode: z.string(), service: z.string(), price: z.number(), slot: z.string(), confidence: z.number() });

const ragPrompt = PromptTemplate.fromTemplate(`
You are LuminaClean AI Dispatch (2026 Enterprise).
Context: Australian cleaning services, all states.
Laws: Fair Work Act 2009, WHS Act 2011, NDIS Practice Standards 2026.
Pricing: residential $99-299, commercial $0.65/sqm, strata $450/location.

User Query: {query}
Extract: postcode, service type, urgency, special requirements.
Return ONLY valid JSON: {{"postcode": "2000", "service": "residential", "price": 199, "slot": "Tomorrow 9AM-12PM", "confidence": 0.96}}
`);

export async function ragQuoteEngine(query: string) {
  if (!process.env.OPENAI_API_KEY) {
    const postcodeMatch = query.match(/\b(\d{4})\b/);
    const serviceMatch = query.match(/(residential|commercial|airbnb|strata|ndis)/i);
    const postcode = postcodeMatch ? postcodeMatch[1] : '2000';
    const service = serviceMatch ? serviceMatch[1].toLowerCase() : 'residential';
    const price = pricingEngine.calculate({ serviceType: service, postcode });
    return { postcode, service, price, slot: 'Tomorrow 9AM-12PM', confidence: 0.92 };
  }

  const llm = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 });
  const chain = ragPrompt.pipe(llm);
  const response = await chain.invoke({ query });

  try {
    const content = typeof response.content === 'string' ? response.content : '';
    const jsonMatch = content.match(/\{[^}]+\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    const parsed = JSON.parse(jsonMatch[0]);
    return quoteSchema.parse(parsed);
  } catch {
    const postcodeMatch = query.match(/\b(\d{4})\b/);
    const serviceMatch = query.match(/(residential|commercial|airbnb|strata|ndis)/i);
    const postcode = postcodeMatch ? postcodeMatch[1] : '2000';
    const service = serviceMatch ? serviceMatch[1].toLowerCase() : 'residential';
    const price = pricingEngine.calculate({ serviceType: service, postcode });
    return { postcode, service, price, slot: 'Tomorrow 9AM-12PM', confidence: 0.90 };
  }
}
