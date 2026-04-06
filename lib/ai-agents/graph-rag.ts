import { ChatOpenAI } from '@langchain/openai';

export class GraphRAG {
  static async generateBid({ tender, context, pricingStrategy }: { tender: any; context: string; pricingStrategy: string }) {
    if (!process.env.OPENAI_API_KEY) {
      return {
        value: tender.value * 0.88,
        confidence: 0.94,
        methodology: 'Standard NDIS-compliant cleaning methodology',
        timeline: '4 weeks mobilization',
        complianceChecklist: ['WHS Act 2011', 'Fair Work Act 2009', 'NDIS Practice Standards 2026'],
      };
    }

    const llm = new ChatOpenAI({ model: 'gpt-4o', temperature: 0 });
    const bidPrompt = `
Tender: ${tender.title}
Value: $${tender.value}M
Compliance: ${context}
Strategy: ${pricingStrategy}

Generate compliant bid with pricing, methodology, timeline.
Return JSON: { value, confidence, methodology, timeline, complianceChecklist }
`;
    const response = await llm.invoke(bidPrompt);
    const content = typeof response.content === 'string' ? response.content : '{}';
    return JSON.parse(content);
  }
}
