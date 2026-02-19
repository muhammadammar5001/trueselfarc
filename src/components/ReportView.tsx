import { motion } from "framer-motion";

interface ReportSection {
  title: string;
  content: string;
}

interface ReportViewProps {
  sections: ReportSection[];
}

const sectionEmojis = [
  "🎭", "🧬", "📊", "⚡", "🌑",
  "🔥", "💞", "💍", "🚀", "🔋",
  "🧠", "🏠", "💎", "🤝", "🏆",
];

const ReportView = ({ sections }: ReportViewProps) => {
  return (
    <div className="space-y-4">
      {sections.map((section, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className="doodle-card p-5 bg-card"
        >
          <h3 className="font-bold text-foreground text-sm mb-2 flex items-center gap-2">
            <span>{sectionEmojis[i] || "📌"}</span>
            <span>{section.title}</span>
          </h3>
          <p className="text-sm text-foreground leading-relaxed">
            {section.content}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default ReportView;
