import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, referral_code, visitor_id, referrer_name } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Create a new referral code for an influencer
    if (action === "create") {
      if (!referral_code || !referrer_name) {
        return new Response(JSON.stringify({ error: "referral_code and referrer_name required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: existing } = await supabase
        .from("referrals")
        .select("id")
        .eq("referral_code", referral_code)
        .maybeSingle();
      if (existing) {
        return new Response(JSON.stringify({ error: "Code already exists" }), {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { error: insertErr } = await supabase
        .from("referrals")
        .insert({ referral_code, referrer_name });
      if (insertErr) {
        return new Response(JSON.stringify({ error: insertErr.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get stats for a referral code
    if (action === "stats") {
      const { data, error: fetchErr } = await supabase
        .from("referrals")
        .select("referrer_name, referral_code, click_count, paid_count, created_at")
        .eq("referral_code", referral_code)
        .maybeSingle();
      if (fetchErr || !data) {
        return new Response(JSON.stringify({ error: "Referral code not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      // Get recent visitors
      const { data: visitors } = await supabase
        .from("referral_visits")
        .select("visitor_id, visited_at, paid, paid_at")
        .eq("referral_code", referral_code)
        .order("visited_at", { ascending: false })
        .limit(50);
      return new Response(JSON.stringify({ ...data, visitors: visitors || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "visit") {
      // Check if already visited
      const { data: existing } = await supabase
        .from("referral_visits")
        .select("id")
        .eq("referral_code", referral_code)
        .eq("visitor_id", visitor_id)
        .maybeSingle();

      if (!existing) {
        const { error: insertErr } = await supabase
          .from("referral_visits")
          .insert({ referral_code, visitor_id });

        if (insertErr) {
          console.error("Insert error:", insertErr);
          return new Response(JSON.stringify({ error: insertErr.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        await supabase.rpc("increment_referral_clicks", { code: referral_code });
      }

      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "paid") {
      await supabase
        .from("referral_visits")
        .update({ paid: true, paid_at: new Date().toISOString() })
        .eq("referral_code", referral_code)
        .eq("visitor_id", visitor_id);

      await supabase.rpc("increment_referral_paid", { code: referral_code });

      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("track-referral error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
