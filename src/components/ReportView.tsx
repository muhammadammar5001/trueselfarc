import { motion } from "framer-motion";

interface DimensionAnalysis {
  key: string;
  label: string;
  coreTruth: string;
  superpower: string;
  blindSpot: string;
}

interface ReportSection {
  title: string;
  content: string;
}

interface ReportViewProps {
  sections: ReportSection[];
  dimensions?: DimensionAnalysis[];
  powerArchetype?: string;
}

const sectionEmojis = [
  "🎭", "🧬", "📊", "⚡", "🌑",
  "🔥", "💞", "💍", "🚀", "🔋",
  "🧠", "🏠", "💎", "🤝", "🏆",
];

const dimensionEmojis: Record<string, string> = {
  CS: "🏗️",
  ED: "🪞",
  SE: "⚡",
  RO: "🃏",
  LS: "🛡️",
};

const ReportView = ({ sections, dimensions, powerArchetype }: ReportViewProps) => {
  return (
    <div className="space-y-4">
      {/* Power Archetype Badge */}
      {powerArchetype && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="doodle-border-sketch text-center py-4 px-5 bg-card"
        >
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">
            Your Power Archetype
          </p>
          <p className="text-2xl font-extrabold text-foreground">
            🏆 {powerArchetype}
          </p>
        </motion.div>
      )}

      {/* Per-Dimension Breakdown */}
      {dimensions && dimensions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="doodle-card p-5 bg-card"
        >
          <h3 className="font-bold text-foreground text-sm mb-4 text-center">
            🔬 Per-Dimension Breakdown
          </h3>
          <div className="space-y-4">
            {dimensions.map((dim, i) => (
              <motion.div
                key={dim.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="border-2 border-foreground/15 rounded-lg p-4 space-y-2"
              >
                <h4 className="font-extrabold text-foreground text-sm flex items-center gap-2">
                  <span>{dimensionEmojis[dim.key] || "📌"}</span>
                  {dim.label}
                </h4>
                <div className="space-y-1.5 text-sm">
                  <p className="text-foreground">
                    <span className="font-bold text-primary">Core Truth:</span>{" "}
                    {dim.coreTruth}
                  </p>
                  <p className="text-foreground">
                    <span className="font-bold text-secondary">Superpower:</span>{" "}
                    {dim.superpower}
                  </p>
                  <p className="text-foreground">
                    <span className="font-bold" style={{ color: "hsl(var(--destructive))" }}>Blind Spot:</span>{" "}
                    {dim.blindSpot}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 15 Report Sections */}
      {sections.map((section, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (dimensions ? 0.6 : 0) + i * 0.08, duration: 0.4 }}
          className="doodle-card p-5 bg-card"
        >
          <h3 className="font-bold text-foreground text-sm mb-2 flex items-center gap-2">
            <span>{sectionEmojis[i] || "📌"}</span>
            <span>{section.title}</span>
          </h3>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
            {section.content}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default ReportView;
