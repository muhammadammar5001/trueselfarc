import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { archetype, scores } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert Behavioral Analyst and Psychological Profiler for TrueSelf AI Blueprint — a warm, insightful, slightly witty mentor figure.

Your task is to generate a deeply insightful personality report based on 5 numerical scores (each can range from negative to ~20): Control & Structure (CS), Emotional Depth (ED), Social Energy (SE), Risk Orientation (RO), Love & Sacrifice (LS).

TONE: Warm, insightful, slightly witty — like a wise mentor. No robotic or medical jargon. Avoid long paragraphs. Use short, punchy bullet points where possible.

You must return a JSON object with this exact structure:
{
  "dimensions": [
    {
      "key": "CS",
      "label": "Control & Structure",
      "coreTruth": "What this score says about their true nature (1-2 sentences)",
      "superpower": "A positive trait of this score (1 sentence)",
      "blindSpot": "Something they should be careful about (1 sentence)"
    },
    // ... repeat for ED, SE, RO, LS
  ],
  "sections": [
    { "title": "Section Title", "content": "Section content..." }
    // exactly 15 sections
  ],
  "powerArchetype": "A memorable 2-3 word archetype name like 'The Bold Strategist' or 'The Soulful Observer'"
}

DIMENSION ANALYSIS RULES:
- Interpret each score relative to the others. A score of 12 with others at 4 is dominant. A score of -2 is notably low.
- Identify the dominant (highest) and weakest (lowest) traits and explain behavioral tendencies.
- Be specific and personal, not generic.

The 15 sections (use short punchy bullet points, not long paragraphs):

1. THE ARCHETYPE — A powerful archetype name with a 1-sentence declaration.
2. CORE IDENTITY — 3-4 bullet points about their fundamental nature. Compare relative strengths.
3. THE 5-D ANALYSIS — How the 5 scores create tension or harmony. Identify dominant vs weak traits.
4. THE SUPERPOWER — The rare ability their score combination produces.
5. THE SHADOW — What they hide from others. Be honest but compassionate.
6. STRESS RESPONSE — Fight, flight, freeze, or fawn — and why.
7. RELATIONSHIP DYNAMICS — Attachment style, how they connect or withdraw.
8. IDEAL PARTNER PROFILE — The complementary personality, not a checklist.
9. CAREER DESTINY — Specific roles and environments they thrive in.
10. SOCIAL BATTERY — How they recharge, what drains them.
11. DECISION LOGIC — Heart vs Head. How they actually choose when it matters.
12. THE BURNING BUILDING INSIGHT — What they'd save reveals their deepest values.
13. UNTAPPED POTENTIAL — One specific, actionable skill or mindset shift.
14. FRIENDSHIP ROLE — The friend they are in a group (protector, comedian, strategist?).
15. THE FINAL TRUESELF VERDICT — One powerful, quotable closing statement.

Return ONLY valid JSON. No markdown, no code fences.`;

    const userPrompt = `Archetype: "${archetype.name}" (${archetype.rarity})
Description: ${archetype.description}
Scores (each can range from negative to ~20):
- Control & Structure (CS): ${scores.CS}
- Emotional Depth (ED): ${scores.ED}
- Social Energy (SE): ${scores.SE}
- Risk Orientation (RO): ${scores.RO}
- Love & Sacrifice (LS): ${scores.LS}

Dominant trait: ${Object.entries(scores).sort((a: any, b: any) => b[1] - a[1])[0][0]} (${Object.entries(scores).sort((a: any, b: any) => b[1] - a[1])[0][1]})
Weakest trait: ${Object.entries(scores).sort((a: any, b: any) => a[1] - b[1])[0][0]} (${Object.entries(scores).sort((a: any, b: any) => a[1] - b[1])[0][1]})

Generate the full personality report as JSON.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI generation failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    let text = data.choices?.[0]?.message?.content || "";
    
    // Strip markdown code fences if present
    text = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    let report;
    try {
      report = JSON.parse(text);
    } catch {
      console.error("Failed to parse AI response as JSON:", text);
      return new Response(
        JSON.stringify({ error: "Failed to parse report" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(report), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-report error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
