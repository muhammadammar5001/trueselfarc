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

  try {
    await supabase.functions.invoke("track-referral", {
      body: { action: "visit", referral_code: ref, visitor_id: visitorId },
    });
  } catch (e) {
    console.error("Referral tracking error:", e);
  }
}

/** Mark current visitor as paid (call after successful payment) */
export async function markReferralPaid() {
  const ref = sessionStorage.getItem(REFERRAL_CODE_KEY);
  if (!ref) return;

  const visitorId = getOrCreateVisitorId();

  try {
    await supabase.functions.invoke("track-referral", {
      body: { action: "paid", referral_code: ref, visitor_id: visitorId },
    });
  } catch (e) {
    console.error("Referral paid tracking error:", e);
  }
}

/** Get stored referral code */
export function getStoredReferralCode(): string | null {
  return sessionStorage.getItem(REFERRAL_CODE_KEY);
}
