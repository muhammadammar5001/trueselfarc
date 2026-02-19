import { supabase } from "@/integrations/supabase/client";

const VISITOR_ID_KEY = "trueself_visitor_id";
const REFERRAL_CODE_KEY = "trueself_ref";

function getOrCreateVisitorId(): string {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

/** Capture referral code from URL and track the visit */
export async function captureReferral() {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  if (!ref) return;

  // Store it for later payment tracking
  sessionStorage.setItem(REFERRAL_CODE_KEY, ref);

  const visitorId = getOrCreateVisitorId();

  // Check if this visitor already visited via this code
  const { data: existing } = await supabase
    .from("referral_visits")
    .select("id")
    .eq("referral_code", ref)
    .eq("visitor_id", visitorId)
    .maybeSingle();

  if (!existing) {
    // Track new visit
    await supabase.from("referral_visits").insert({
      referral_code: ref,
      visitor_id: visitorId,
    });
    // Increment click count
    await supabase.rpc("increment_referral_clicks", { code: ref });
  }
}

/** Mark current visitor as paid (call after successful payment) */
export async function markReferralPaid() {
  const ref = sessionStorage.getItem(REFERRAL_CODE_KEY);
  if (!ref) return;

  const visitorId = getOrCreateVisitorId();

  await supabase
    .from("referral_visits")
    .update({ paid: true, paid_at: new Date().toISOString() })
    .eq("referral_code", ref)
    .eq("visitor_id", visitorId);

  // Increment paid count
  await supabase.rpc("increment_referral_paid", { code: ref });
}

/** Get stored referral code */
export function getStoredReferralCode(): string | null {
  return sessionStorage.getItem(REFERRAL_CODE_KEY);
}
