import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface ReferralStats {
  referrer_name: string;
  referral_code: string;
  click_count: number;
  paid_count: number;
  created_at: string;
  visitors: {
    visitor_id: string;
    visited_at: string;
    paid: boolean;
    paid_at: string | null;
  }[];
}

const Referrals = () => {
  const [mode, setMode] = useState<"lookup" | "create">("lookup");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLookup = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    setStats(null);
    try {
      const { data, error: err } = await supabase.functions.invoke("track-referral", {
        body: { action: "stats", referral_code: code.trim().toLowerCase() },
      });
      if (err) throw err;
      if (data?.error) {
        setError(data.error);
      } else {
        setStats(data);
      }
    } catch (e: any) {
      setError(e.message || "Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!code.trim() || !name.trim()) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const { data, error: err } = await supabase.functions.invoke("track-referral", {
        body: {
          action: "create",
          referral_code: code.trim().toLowerCase(),
          referrer_name: name.trim(),
        },
      });
      if (err) throw err;
      if (data?.error) {
        setError(data.error);
      } else {
        setSuccess(`✅ Referral code "${code.trim().toLowerCase()}" created! Share your link: ${window.location.origin}?ref=${code.trim().toLowerCase()}`);
        setCode("");
        setName("");
      }
    } catch (e: any) {
      setError(e.message || "Failed to create code");
    } finally {
      setLoading(false);
    }
  };

  const conversionRate = stats
    ? stats.click_count > 0
      ? ((stats.paid_count / stats.click_count) * 100).toFixed(1)
      : "0"
    : "0";

  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <h1 className="text-4xl font-display font-extrabold text-foreground text-center mb-2">
          📊 Referral Dashboard
        </h1>
        <p className="text-muted-foreground text-center mb-8 text-sm font-semibold">
          Track your referral performance
        </p>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setMode("lookup"); setError(""); setSuccess(""); }}
            className={`flex-1 py-2 rounded-lg font-semibold text-sm border-2 transition-all ${
              mode === "lookup"
                ? "bg-primary text-primary-foreground border-foreground"
                : "bg-muted text-muted-foreground border-transparent"
            }`}
          >
            🔍 Check Stats
          </button>
          <button
            onClick={() => { setMode("create"); setError(""); setSuccess(""); setStats(null); }}
            className={`flex-1 py-2 rounded-lg font-semibold text-sm border-2 transition-all ${
              mode === "create"
                ? "bg-primary text-primary-foreground border-foreground"
                : "bg-muted text-muted-foreground border-transparent"
            }`}
          >
            ➕ Create Code
          </button>
        </div>

        {/* Create mode */}
        {mode === "create" && (
          <div className="doodle-card p-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1">Your Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah"
                className="w-full px-4 py-3 rounded-lg border-2 border-foreground/20 bg-background text-foreground font-semibold focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1">Referral Code</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))}
                placeholder="e.g. sarah2025"
                className="w-full px-4 py-3 rounded-lg border-2 border-foreground/20 bg-background text-foreground font-semibold focus:border-primary outline-none"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCreate}
              disabled={loading || !code.trim() || !name.trim()}
              className="doodle-button bg-primary text-primary-foreground px-6 py-3 text-base w-full rounded-lg disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Referral Code"}
            </motion.button>
          </div>
        )}

        {/* Lookup mode */}
        {mode === "lookup" && (
          <div className="doodle-card p-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1">Your Referral Code</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))}
                placeholder="e.g. sarah2025"
                className="w-full px-4 py-3 rounded-lg border-2 border-foreground/20 bg-background text-foreground font-semibold focus:border-primary outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLookup}
              disabled={loading || !code.trim()}
              className="doodle-button bg-primary text-primary-foreground px-6 py-3 text-base w-full rounded-lg disabled:opacity-50"
            >
              {loading ? "Loading..." : "View My Stats"}
            </motion.button>
          </div>
        )}

        {/* Error / Success */}
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-semibold text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 rounded-lg bg-primary/10 text-primary text-sm font-semibold text-center break-all">
            {success}
          </div>
        )}

        {/* Stats display */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            <div className="doodle-card p-6">
              <p className="text-sm text-muted-foreground font-semibold mb-1">
                Influencer: <span className="text-foreground">{stats.referrer_name}</span>
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Code: <span className="font-mono text-foreground">{stats.referral_code}</span> · Since{" "}
                {new Date(stats.created_at).toLocaleDateString()}
              </p>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-foreground">{stats.click_count}</p>
                  <p className="text-xs text-muted-foreground font-semibold">Clicks</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">{stats.paid_count}</p>
                  <p className="text-xs text-muted-foreground font-semibold">Paid</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-foreground">{conversionRate}%</p>
                  <p className="text-xs text-muted-foreground font-semibold">Conv. Rate</p>
                </div>
              </div>
            </div>

            {/* Recent visitors */}
            {stats.visitors.length > 0 && (
              <div className="doodle-card p-6">
                <h3 className="font-bold text-foreground text-sm mb-3">Recent Visitors</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {stats.visitors.map((v, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded bg-muted text-xs"
                    >
                      <div>
                        <span className="font-mono text-foreground">{v.visitor_id.slice(0, 8)}...</span>
                        <span className="text-muted-foreground ml-2">
                          {new Date(v.visited_at).toLocaleDateString()}
                        </span>
                      </div>
                      <span
                        className={`font-semibold px-2 py-0.5 rounded ${
                          v.paid
                            ? "bg-primary/20 text-primary"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {v.paid ? "💰 Paid" : "👀 Visited"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Share link */}
            <div className="doodle-card p-4 text-center">
              <p className="text-xs text-muted-foreground font-semibold mb-1">Your referral link:</p>
              <p className="text-sm font-mono text-foreground break-all bg-muted p-2 rounded">
                {window.location.origin}?ref={stats.referral_code}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Referrals;
