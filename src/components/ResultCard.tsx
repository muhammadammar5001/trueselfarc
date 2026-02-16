import { forwardRef } from "react";
import { VARIABLES, VARIABLE_LABELS, type Archetype } from "@/lib/quizData";

interface ResultCardProps {
  archetype: Archetype;
  scores: Record<string, number>;
}

const barColors: Record<string, string> = {
  CS: "bg-secondary",
  ED: "bg-doodle-purple",
  SE: "bg-doodle-green",
  RO: "bg-doodle-orange",
  LS: "bg-primary",
};

const ResultCard = forwardRef<HTMLDivElement, ResultCardProps>(
  ({ archetype, scores }, ref) => {
    const maxScore = Math.max(...Object.values(scores), 1);

    return (
      <div
        ref={ref}
        className="doodle-card p-6 sm:p-8 max-w-sm mx-auto bg-card"
      >
        {/* Header */}
        <div className="text-center mb-5">
          <div className="text-5xl mb-2">{archetype.emoji}</div>
          <h2 className="font-display text-3xl font-extrabold text-foreground leading-tight">
            {archetype.name}
          </h2>
          <p className="text-sm text-muted-foreground mt-2 font-semibold">
            {archetype.description}
          </p>
        </div>

        {/* Virality badge */}
        <div className="doodle-border-sketch text-center py-3 px-4 mb-5 bg-accent/30">
          <p className="font-display text-lg font-bold text-foreground">
            ✨ You are rare: <span className="text-primary">{archetype.rarity}</span>
          </p>
        </div>

        {/* Score bars */}
        <div className="space-y-3">
          {VARIABLES.map((v) => (
            <div key={v}>
              <div className="flex justify-between text-xs font-bold text-foreground mb-1">
                <span>{VARIABLE_LABELS[v] || v}</span>
                <span>{scores[v] || 0}</span>
              </div>
              <div className="w-full h-4 rounded-full border-2 border-foreground bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full ${barColors[v]}`}
                  style={{ width: `${((scores[v] || 0) / maxScore) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Branding */}
        <p className="text-center text-xs text-muted-foreground mt-5 font-bold">
          trueself.app 🎭
        </p>
      </div>
    );
  }
);

ResultCard.displayName = "ResultCard";

export default ResultCard;
