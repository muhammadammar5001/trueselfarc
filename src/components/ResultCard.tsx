import { forwardRef } from "react";
import { VARIABLES, VARIABLE_LABELS, type Archetype } from "@/lib/quizData";

interface ResultCardProps {
  archetype: Archetype;
  scores: Record<string, number>;
}

function getRarityTier(rarity: string): { color: string; label: string } {
  const match = rarity.match(/(\d+)/);
  const pct = match ? parseInt(match[1]) : 50;
  if (pct <= 3) return { color: "bg-rarity-elite text-white", label: rarity };
  if (pct <= 10) return { color: "bg-rarity-distinguished text-foreground", label: rarity };
  return { color: "bg-rarity-noteworthy text-foreground", label: rarity };
}

function getBarColor(percentage: number): string {
  if (percentage >= 80) return "bg-secondary";
  if (percentage >= 60) return "bg-secondary/80";
  if (percentage >= 40) return "bg-secondary/60";
  if (percentage >= 20) return "bg-secondary/40";
  return "bg-secondary/25";
}

const ResultCard = forwardRef<HTMLDivElement, ResultCardProps>(
  ({ archetype, scores }, ref) => {
    // Calculate max possible score for percentage conversion
    // Each question can give max ~3 points per variable, 20 questions
    const maxPossible = Math.max(...Object.values(scores), 1);
    const rarityTier = getRarityTier(archetype.rarity);

    return (
      <div
        ref={ref}
        className="doodle-card p-6 sm:p-8 max-w-sm mx-auto bg-card"
      >
        {/* Header */}
        <div className="text-center mb-5">
          <div className="text-5xl mb-2">{archetype.emoji}</div>
          <h2 className="text-3xl font-extrabold text-foreground leading-tight">
            {archetype.name}
          </h2>
          <p className="text-sm text-muted-foreground mt-2 font-semibold">
            {archetype.description}
          </p>
        </div>

        {/* Virality badge with rarity-based color */}
        <div className="doodle-border-sketch text-center py-3 px-4 mb-5">
          <p className="text-lg font-bold text-foreground">
            ✨ You are rare:{" "}
            <span className={`inline-block px-3 py-0.5 rounded-full text-sm font-bold ${rarityTier.color}`}>
              {archetype.rarity}
            </span>
          </p>
        </div>

        {/* Score bars as percentages */}
        <div className="space-y-3">
          {VARIABLES.map((v) => {
            const raw = scores[v] || 0;
            const percentage = Math.round((raw / maxPossible) * 100);
            return (
              <div key={v}>
                <div className="flex justify-between text-xs font-bold text-foreground mb-1">
                  <span>{VARIABLE_LABELS[v] || v}</span>
                  <span>{percentage}%</span>
                </div>
                <div className="w-full h-4 rounded-full border-2 border-foreground bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${getBarColor(percentage)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
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
