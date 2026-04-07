import { invokeLLM } from "../_core/llm";

/**
 * Extract text content from LLM response
 */
function extractContent(message: any): string {
  if (typeof message?.content === "string") {
    return message.content;
  }
  if (Array.isArray(message?.content)) {
    return message.content
      .filter((c: any) => c.type === "text")
      .map((c: any) => c.text)
      .join("");
  }
  return "";
}

/**
 * Onboarding Agent - Generates growth profile from business info
 */
export async function generateGrowthProfile(input: {
  name: string;
  type: string;
  city: string;
  mainOffer: string;
  targetCustomer: string;
  brandTone: string;
}) {
  const prompt = `You are ZOE, an AI growth agent. Generate a Growth Profile as JSON only:
Business: ${input.name}, Type: ${input.type}, City: ${input.city}, 
Offer: ${input.mainOffer}, Target: ${input.targetCustomer}, 
Tone: ${input.brandTone}

Return ONLY valid JSON (no markdown, no extra text):
{
  "idealCustomer": "...",
  "winningHooks": ["hook1", "hook2", "hook3"],
  "bestCreativeFormat": "...",
  "recommendedTargeting": {"key": "value"},
  "competitorWeakness": "..."
}`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a growth strategy AI. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = extractContent(response.choices?.[0]?.message);
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from LLM");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("[AI] Failed to generate growth profile:", error);
    throw error;
  }
}

/**
 * Creative Agent - Generates ad copy for campaigns
 */
export async function generateAdCopy(input: {
  businessName: string;
  goal: string;
  format: string;
  city: string;
}) {
  const prompt = `You are ZOE. Generate a Meta Ad for ${input.businessName}. 
Goal: ${input.goal}. Format: ${input.format}. City: ${input.city}.

Return JSON only — no markdown:
{
  "headline": "...",
  "primaryText": "...",
  "cta": "...",
  "hook": "...",
  "targetAudience": "..."
}`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are an ad copywriter. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = extractContent(response.choices?.[0]?.message);
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from LLM");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("[AI] Failed to generate ad copy:", error);
    throw error;
  }
}

/**
 * Reporting Agent - Generates WhatsApp report
 */
export async function generateWhatsAppReport(input: {
  leads: number;
  bestAd: string;
  cpl: number;
  spend: number;
  roas: number;
  actions: number;
}) {
  const prompt = `You are ZOE, an AI growth agent. Generate a friendly WhatsApp message to a business owner. 
This week: ${input.leads} leads, best ad ${input.bestAd} at ₹${input.cpl}/lead, spend ₹${input.spend}, ROAS ${input.roas}x, ${input.actions} automated actions taken. 
Casual English, under 150 words. 
End with: Nothing you need to do — just reviewing 👍`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a friendly AI growth agent writing WhatsApp messages.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return extractContent(response.choices?.[0]?.message);
  } catch (error) {
    console.error("[AI] Failed to generate WhatsApp report:", error);
    throw error;
  }
}

/**
 * Content Agent - Generates Instagram content
 */
export async function generateInstagramContent(input: {
  businessName: string;
  theme: string;
  tone: string;
}) {
  const prompt = `You are ZOE. Generate Instagram content for ${input.businessName}.
Theme: ${input.theme}. Tone: ${input.tone}.

Return JSON only:
{
  "caption": "...",
  "imagePrompt": "..."
}`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a content creator. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = extractContent(response.choices?.[0]?.message);
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from LLM");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("[AI] Failed to generate Instagram content:", error);
    throw error;
  }
}

/**
 * Optimization Agent - Analyzes campaign performance
 */
export async function analyzeAndOptimizeCampaign(input: {
  campaignName: string;
  leads: number;
  spend: number;
  cpl: number;
  roas: number;
  benchmarkCpl: number;
}) {
  const prompt = `You are ZOE. Analyze campaign "${input.campaignName}":
Leads: ${input.leads}, Spend: ₹${input.spend}, CPL: ₹${input.cpl}, ROAS: ${input.roas}x
Benchmark CPL: ₹${input.benchmarkCpl}

Recommend: SCALE / PAUSE / KEEP. Provide reasoning in under 50 words.`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a campaign optimization expert.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = extractContent(response.choices?.[0]?.message);
    const action = content.includes("SCALE")
      ? "SCALE"
      : content.includes("PAUSE")
        ? "PAUSE"
        : "KEEP";

    return {
      action,
      reasoning: content,
    };
  } catch (error) {
    console.error("[AI] Failed to analyze campaign:", error);
    throw error;
  }
}
