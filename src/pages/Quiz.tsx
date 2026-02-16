import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { questions, VARIABLES } from "@/lib/quizData";

const Quiz = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(VARIABLES.map((v) => [v, 0]))
  );

  const q = questions[current];
  const progress = ((current) / questions.length) * 100;

  const handleBack = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleAnswer = (optionScores: Record<string, number>) => {
    const newScores = { ...scores };
    Object.entries(optionScores).forEach(([key, val]) => {
      newScores[key] = (newScores[key] || 0) + val;
    });
    setScores(newScores);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      // Navigate to results with scores
      navigate("/results", { state: { scores: newScores } });
    }
  };

  const phases: Record<string, string> = {
    "The Scenarios": "Phase 1: The Scenarios",
    "The Inner World": "Phase 2: The Inner World",
    "The Hard Choices": "Phase 3: The Hard Choices",
    "Abstract & Synthesis": "Phase 4: Abstract & Synthesis",
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-2 flex items-center justify-between text-sm font-bold text-muted-foreground">
          <div className="flex items-center gap-3">
            {current > 0 && (
              <button
                onClick={handleBack}
                className="text-foreground hover:text-primary transition-colors text-lg"
                aria-label="Go back"
              >
                ←
              </button>
            )}
            <span>Question {current + 1}/{questions.length}</span>
          </div>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-4 rounded-full border-2 border-foreground bg-muted mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Question */}
        {/* Phase Header */}
        {q.phase && (
          <div className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {phases[q.phase] || q.phase}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <div className="doodle-card p-6 sm:p-8 mb-6 border-secondary">
             <h2 className="font-display text-base sm:text-lg font-bold text-secondary leading-snug">
                {q.text}
              </h2>
            </div>

            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAnswer(opt.scores)}
                  className="doodle-button w-full text-left px-4 py-3 text-xs sm:text-sm font-bold rounded-lg bg-card text-foreground hover:bg-muted"
                >
                  {String.fromCharCode(65 + i)}. {opt.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;
