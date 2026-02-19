import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import { supabase } from "@/integrations/supabase/client";
import { getArchetype, VARIABLES } from "@/lib/quizData";
import ResultCard from "@/components/ResultCard";
import ReportView from "@/components/ReportView";

type Phase = "calculating" | "paywall" | "result";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scores: Record<string, number> = location.state?.scores ||
    Object.fromEntries(VARIABLES.map((v) => [v, 0]));
  const archetype = getArchetype(scores);
  const cardRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<Phase>("calculating");
  const [aiText, setAiText] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(true);
  const [reportSections, setReportSections] = useState<{ title: string; content: string }[]>([]);
  const [reportLoading, setReportLoading] = useState(false);

  // Split AI text into teaser (first ~12 words) and hidden rest
  const words = aiText.split(" ");
  const teaserText = words.slice(0, 12).join(" ");
  const hiddenText = words.slice(12).join(" ");

  useEffect(() => {
    if (!location.state?.scores) {
      navigate("/");
    }
  }, [location.state, navigate]);

  // Fetch AI text immediately during calculating phase
  useEffect(() => {
    const fetchAiText = async () => {
      setAiLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("generate-result", {
          body: { archetype, scores },
        });
        if (error) throw error;
        setAiText(data?.text || "");
      } catch (err) {
        console.error("AI generation failed:", err);
        setAiText("Your personality profile is truly one of a kind. Take a moment to reflect on what makes you, you.");
      } finally {
        setAiLoading(false);
      }
    };
    fetchAiText();
  }, []);

  useEffect(() => {
    if (phase === "calculating") {
      // Wait for both minimum time and AI response
      const minTime = new Promise(r => setTimeout(r, 2500));
      const waitForAi = new Promise<void>(r => {
        if (!aiLoading) { r(); return; }
        const interval = setInterval(() => {
          // This will re-check via closure
        }, 100);
        const timeout = setTimeout(() => { clearInterval(interval); r(); }, 8000);
        return () => { clearInterval(interval); clearTimeout(timeout); };
      });
      const timer = setTimeout(() => setPhase("paywall"), aiLoading ? 4000 : 2500);
      return () => clearTimeout(timer);
    }
  }, [phase, aiLoading]);

  const handleUnlock = async () => {
    // Mock payment — in production, this would verify Lemon Squeezy / Stripe payment
    setPhase("result");
    setReportLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-report", {
        body: { archetype, scores },
      });
      if (error) throw error;
      setReportSections(data?.sections || []);
    } catch (err) {
      console.error("Report generation failed:", err);
    } finally {
      setReportLoading(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      const dataUrl = canvas.toDataURL("image/png");

      if (navigator.share && navigator.canShare) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "trueself-result.png", { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `I'm "${archetype.name}" — TrueSelf`,
            text: `My TrueSelf archetype is "${archetype.name}" (${archetype.rarity}). Take the quiz!`,
            files: [file],
          });
          return;
        }
      }

      const link = document.createElement("a");
      link.download = "trueself-result.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <AnimatePresence mode="wait">
        {/* CALCULATING */}
        {phase === "calculating" && (
          <motion.div
            key="calc"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="text-6xl mb-6 inline-block"
            >
              🎭
            </motion.div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              Calculating...
            </h2>
            <p className="text-muted-foreground font-semibold">
              Analyzing your 5 dimensions
            </p>
            <div className="mt-6 flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-4 h-4 rounded-full bg-primary border-2 border-foreground"
                  animate={{ y: [0, -12, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.6,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* PAYWALL */}
        {phase === "paywall" && (
          <motion.div
            key="pay"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center max-w-sm"
          >
            <div className="doodle-card p-8">
              {/* Teaser preview */}
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">{archetype.emoji}</div>
                <h2 className="text-3xl font-bold text-foreground leading-tight">
                  "{archetype.name}"
                </h2>
                <p className="text-sm text-muted-foreground mt-2 font-semibold">
                  {archetype.description.slice(0, 80)}...
                </p>
              </div>

              {/* AI teaser: real first words visible, rest blurred */}
              <div className="relative mb-6 overflow-hidden rounded-lg">
                <div className="p-4 bg-muted/50 space-y-2">
                  {aiLoading ? (
                    <motion.p
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-sm text-foreground font-semibold"
                    >
                      Crafting your personalized insight...
                    </motion.p>
                  ) : (
                    <>
                      <p className="text-sm text-foreground font-semibold leading-relaxed">
                        {teaserText}{" "}
                      </p>
                      <div className="blur-md select-none pointer-events-none space-y-2">
                        <p className="text-sm text-foreground font-semibold leading-relaxed">
                          {hiddenText || "...unlock to discover the rest of your personalized insight."}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div className="absolute inset-0 top-12 bg-gradient-to-b from-transparent via-transparent to-card" />
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-4 font-semibold">
                  Your full 5-dimension breakdown is ready
                </p>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleUnlock}
                  className="doodle-button bg-primary text-primary-foreground px-8 py-4 text-xl w-full rounded-lg mb-3"
                >
                  🔓 Unlock for $1.49
                </motion.button>
                <p className="text-xs text-muted-foreground">
                  One-time payment • Instant access
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* RESULT */}
        {phase === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm"
          >
            <ResultCard ref={cardRef} archetype={archetype} scores={scores} />

            {/* AI-generated roast & cheer */}
            <div className="doodle-card p-5 mt-4 bg-card">
              <h3 className="font-bold text-foreground text-sm mb-2">Your Roast & Cheer 🔥</h3>
              {aiLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    Generating your personalized insight...
                  </motion.span>
                </div>
              ) : (
                <p className="text-sm text-foreground leading-relaxed">{aiText}</p>
              )}
            </div>

            {/* 15-Section Report */}
            <div className="mt-4">
              <h3 className="font-bold text-foreground text-lg mb-3 text-center">
                📖 Your Full Personality Report
              </h3>
              {reportLoading ? (
                <div className="doodle-card p-6 bg-card text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="text-4xl mb-3 inline-block"
                  >
                    🧠
                  </motion.div>
                  <p className="text-sm text-muted-foreground font-semibold">
                    Generating your 15-section report...
                  </p>
                </div>
              ) : reportSections.length > 0 ? (
                <ReportView sections={reportSections} />
              ) : null}
            </div>

            <div className="mt-6 space-y-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleShare}
                className="doodle-button bg-secondary text-secondary-foreground px-6 py-4 text-lg w-full rounded-lg"
              >
                📸 Share to Instagram
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/")}
                className="doodle-button bg-muted text-foreground px-6 py-3 text-base w-full rounded-lg"
              >
                ↩️ Take Again
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Results;
