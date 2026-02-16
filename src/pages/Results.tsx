import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import { getArchetype, VARIABLES } from "@/lib/quizData";
import ResultCard from "@/components/ResultCard";

type Phase = "calculating" | "paywall" | "result";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scores: Record<string, number> = location.state?.scores ||
    Object.fromEntries(VARIABLES.map((v) => [v, 0]));
  const archetype = getArchetype(scores);
  const cardRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<Phase>("calculating");

  useEffect(() => {
    if (!location.state?.scores) {
      navigate("/");
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (phase === "calculating") {
      const timer = setTimeout(() => setPhase("paywall"), 2500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleUnlock = () => {
    // Mock payment
    setPhase("result");
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      const dataUrl = canvas.toDataURL("image/png");

      // Try native share (mobile), else download
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

      // Fallback: download
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

              {/* Free hook sentence + blurred preview */}
              <div className="relative mb-6 overflow-hidden rounded-lg">
                <div className="p-4 bg-muted/50 space-y-2">
                  <p className="text-sm text-foreground font-semibold leading-relaxed">
                    You have the mind of a strategist, but your{" "}
                  </p>
                  <div className="blur-md select-none pointer-events-none space-y-2">
                    <p className="text-sm text-foreground font-semibold leading-relaxed">
                      heart is currently winning the battle. Your emotional depth shapes every decision you make...
                    </p>
                    <div className="h-3 bg-foreground/20 rounded w-full" />
                    <div className="h-3 bg-foreground/20 rounded w-4/5" />
                    <div className="h-4 bg-primary/30 rounded w-1/2 mt-3" />
                    <div className="h-3 bg-foreground/20 rounded w-full" />
                    <div className="h-3 bg-foreground/20 rounded w-2/3" />
                  </div>
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
