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
      "Executive Summary",
      "Your Archetype Profile",
      "Control & Structure Deep Dive",
      "Emotional Depth Deep Dive",
      "Social Energy Deep Dive",
      "Risk Orientation Deep Dive",
      "Love & Sacrifice Deep Dive",
      "Your Strongest Dimension",
      "Your Growth Edge",
      "Relationship Style",
      "Career & Work Style",
      "Stress Response Pattern",
      "Hidden Superpower",
      "Your Shadow Side",
      "Personal Growth Roadmap",
    ];

    const systemPrompt = `You are TrueSelf, an insightful personality analyst. You write in a warm, direct, second-person voice ("you"). No generic platitudes. Every sentence should feel personal based on the scores.

You must return a JSON object with a "sections" array containing exactly 15 objects, each with "title" (string) and "content" (string, 2-4 sentences).

The 15 sections in order are:
${sections.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Guidelines per section:
- Executive Summary: A punchy 2-sentence overview of who they are.
- Archetype Profile: What makes this archetype unique, referencing rarity.
- Dimension Deep Dives (5 sections): For each of CS, ED, SE, RO, LS — interpret the score. High = strength, low = growth area. Be specific.
- Strongest Dimension: Identify the highest score and explain how it shapes their life.
- Growth Edge: Identify lowest score, frame it as an opportunity, not a flaw.
- Relationship Style: How their score combo affects romantic/platonic bonds.
- Career & Work Style: What environments and roles suit them.
- Stress Response: How they cope based on their profile.
- Hidden Superpower: A surprising strength from their unique score combination.
- Shadow Side: A blind spot they should watch for. Be honest but kind.
- Growth Roadmap: 2-3 concrete actions they can take this week.

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
