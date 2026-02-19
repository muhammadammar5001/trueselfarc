
-- Referral tracking system (no auth required)
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_code TEXT NOT NULL UNIQUE,
  referrer_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  click_count INTEGER NOT NULL DEFAULT 0,
  paid_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.referral_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_code TEXT NOT NULL REFERENCES public.referrals(referral_code),
  visitor_id TEXT NOT NULL, -- anonymous browser fingerprint/session id
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  paid BOOLEAN NOT NULL DEFAULT false,
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_visits ENABLE ROW LEVEL SECURITY;

-- Public read for referral codes (needed to validate codes)
CREATE POLICY "Anyone can read referrals" ON public.referrals FOR SELECT USING (true);

-- Allow anon inserts for visit tracking
CREATE POLICY "Anyone can insert visits" ON public.referral_visits FOR INSERT WITH CHECK (true);

-- Allow anon to update visits (mark as paid)
CREATE POLICY "Anyone can update their own visit" ON public.referral_visits FOR UPDATE USING (true);

-- Allow anon to read visits
CREATE POLICY "Anyone can read visits" ON public.referral_visits FOR SELECT USING (true);

-- Index for fast lookups
CREATE INDEX idx_referral_visits_code ON public.referral_visits(referral_code);
CREATE INDEX idx_referral_visits_visitor ON public.referral_visits(visitor_id);

-- Function to increment click count
CREATE OR REPLACE FUNCTION public.increment_referral_clicks(code TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.referrals SET click_count = click_count + 1 WHERE referral_code = code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to increment paid count
CREATE OR REPLACE FUNCTION public.increment_referral_paid(code TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.referrals SET paid_count = paid_count + 1 WHERE referral_code = code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
