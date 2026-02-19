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

    const sections = [
      "The Archetype",
      "Core Identity",
      "The 5-D Analysis",
      "The Superpower",
      "The Shadow",
      "Stress Response",
      "Relationship Dynamics",
      "Ideal Partner Profile",
      "Career Destiny",
      "Social Battery",
      "Decision Logic",
      "The Burning Building Insight",
      "Untapped Potential",
      "Friendship Role",
      "The Final TrueSelf Verdict",
    ];

    const systemPrompt = `You are an expert Behavioral Analyst and Psychological Profiler for TrueSelf AI Blueprint.

Your task is to generate a deeply insightful, 15-section personality report based on 5 numerical scores (0-20 scale): Control & Structure, Emotional Depth, Social Energy, Risk Orientation, Love & Sacrifice.

Tone: Sophisticated, insightful, slightly witty, and highly personalized. Avoid generic "horoscope" language. Use psychological terminology but keep it readable. Make the user feel understood on a level no one else has reached.

You must return a JSON object with a "sections" array containing exactly 15 objects, each with "title" (string) and "content" (string).

The 15 sections and what each should contain:

1. THE ARCHETYPE — A powerful archetype name (like "The Silent Architect" or "The Rebel Visionary") with a 1-sentence declaration of who they are.
2. CORE IDENTITY — 3-4 sentences of deep truth about their fundamental nature. Go beyond surface traits.
3. THE 5-D ANALYSIS — Interpret the interplay and balance of all 5 scores. How do they create tension or harmony? 3-4 sentences.
4. THE SUPERPOWER — What makes them elite? The rare ability their score combination produces. 2-3 sentences.
5. THE SHADOW — What they hide from others. The vulnerability beneath the surface. Be honest but compassionate. 2-3 sentences.
6. STRESS RESPONSE — How they act under pressure. Fight, flight, freeze, or fawn — and why. 2-3 sentences.
7. RELATIONSHIP DYNAMICS — Their attachment style in love. How they connect, withdraw, or protect themselves. 3-4 sentences.
8. IDEAL PARTNER PROFILE — Who fits them best? Describe the complementary personality, not a checklist. 2-3 sentences.
9. CAREER DESTINY — The roles and environments they were born for. Be specific, not generic. 2-3 sentences.
10. SOCIAL BATTERY — How they recharge. What drains them. The social rhythm that keeps them sane. 2-3 sentences.
11. DECISION LOGIC — Heart vs Head analysis. How they actually make choices when it matters. 2-3 sentences.
12. THE BURNING BUILDING INSIGHT — If everything was on fire, what would they save? An analysis of their deepest values based on their scores. 2-3 sentences.
13. UNTAPPED POTENTIAL — One specific skill or mindset shift they should develop. Be actionable. 2-3 sentences.
14. FRIENDSHIP ROLE — The friend they are in a group. The protector, the comedian, the strategist? 2-3 sentences.
15. THE FINAL TRUESELF VERDICT — One powerful, memorable closing statement that captures their entire essence. Make it quotable. 1-2 sentences.

Return ONLY valid JSON. No markdown, no code fences.`;

    const userPrompt = `Archetype: "${archetype.name}" (${archetype.rarity})
Description: ${archetype.description}
Scores (each 0-20 scale):
- Control & Structure (CS): ${scores.CS}
- Emotional Depth (ED): ${scores.ED}
- Social Energy (SE): ${scores.SE}
- Risk Orientation (RO): ${scores.RO}
- Love & Sacrifice (LS): ${scores.LS}

Generate the 15-section personality report as JSON.`;

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
