import { motion } from "framer-motion";

// Floating brain doodle
const BrainDoodle = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M30 50 C30 50 28 42 22 38 C16 34 12 28 14 22 C16 16 22 14 26 16 C28 10 34 8 38 12 C42 10 48 14 48 20 C52 24 50 32 44 36 C38 40 32 46 30 50Z" />
    <path d="M26 20 C28 24 32 24 34 20" opacity="0.5" />
    <path d="M22 28 C26 30 34 30 38 28" opacity="0.5" />
    <path d="M30 16 L30 50" strokeDasharray="3 4" opacity="0.3" />
  </svg>
);

// Thought bubble
const ThoughtBubble = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <ellipse cx="28" cy="20" rx="18" ry="14" strokeDasharray="4 3" />
    <circle cx="14" cy="38" r="4" />
    <circle cx="8" cy="44" r="2.5" />
    <path d="M20 16 Q28 12 36 16" opacity="0.4" />
    <path d="M18 22 Q28 26 38 22" opacity="0.4" />
  </svg>
);

// Lightbulb / insight
const LightbulbDoodle = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 40 50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 C12 6 6 12 6 20 C6 26 10 30 14 34 L14 40 L26 40 L26 34 C30 30 34 26 34 20 C34 12 28 6 20 6Z" />
    <line x1="14" y1="44" x2="26" y2="44" />
    <line x1="16" y1="48" x2="24" y2="48" />
    <line x1="20" y1="2" x2="20" y2="0" opacity="0.5" />
    <line x1="8" y1="8" x2="5" y2="5" opacity="0.5" />
    <line x1="32" y1="8" x2="35" y2="5" opacity="0.5" />
    <line x1="2" y1="20" x2="0" y2="20" opacity="0.5" />
    <line x1="38" y1="20" x2="40" y2="20" opacity="0.5" />
  </svg>
);

// Spiral / zen
const SpiralDoodle = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M25 25 C25 22 28 20 30 22 C32 24 30 28 26 28 C22 28 20 24 20 20 C20 16 24 12 28 12 C34 12 38 18 38 24 C38 32 32 38 24 38 C16 38 10 30 10 22 C10 14 16 6 26 6" strokeDasharray="3 3" />
  </svg>
);

// Heart-brain connection
const HeartBrainDoodle = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 60 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18 C15 12 8 8 4 14 C0 20 15 30 15 30 C15 30 30 20 26 14 C22 8 15 12 15 18Z" opacity="0.7" />
    <path d="M20 20 L40 20" strokeDasharray="2 3" opacity="0.4" />
    <path d="M45 12 C42 8 48 6 50 10 C54 8 58 12 54 16 C50 20 48 18 45 20 C42 18 40 16 36 16 C40 12 42 14 45 12Z" opacity="0.7" />
  </svg>
);

// Atom / mind particle
const AtomDoodle = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="25" cy="25" r="3" fill="currentColor" opacity="0.4" />
    <ellipse cx="25" cy="25" rx="20" ry="8" strokeDasharray="4 3" />
    <ellipse cx="25" cy="25" rx="20" ry="8" transform="rotate(60 25 25)" strokeDasharray="4 3" />
    <ellipse cx="25" cy="25" rx="20" ry="8" transform="rotate(120 25 25)" strokeDasharray="4 3" />
  </svg>
);

const doodleComponents = [
  { Component: BrainDoodle, positions: "top-8 left-4 sm:left-8", size: "w-14 h-14 sm:w-16 sm:h-16", delay: 0 },
  { Component: ThoughtBubble, positions: "top-16 right-4 sm:right-10", size: "w-12 h-12 sm:w-14 sm:h-14", delay: 1.2 },
  { Component: LightbulbDoodle, positions: "bottom-24 left-6 sm:left-12", size: "w-10 h-12 sm:w-12 sm:h-14", delay: 0.6 },
  { Component: SpiralDoodle, positions: "top-1/3 right-2 sm:right-6", size: "w-12 h-12 sm:w-14 sm:h-14", delay: 2.0 },
  { Component: HeartBrainDoodle, positions: "bottom-16 right-6 sm:right-14", size: "w-16 h-12 sm:w-18 sm:h-14", delay: 1.5 },
  { Component: AtomDoodle, positions: "bottom-1/3 left-2 sm:left-6", size: "w-12 h-12 sm:w-14 sm:h-14", delay: 0.8 },
];

const QuizDoodles = () => (
  <>
    {doodleComponents.map(({ Component, positions, size, delay }, i) => (
      <motion.div
        key={i}
        className={`absolute ${positions} pointer-events-none`}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: [0, 0.4, 0.6, 0.4],
          scale: [0.8, 1, 1.05, 0.95, 1],
          y: [0, -8, 0, 6, 0],
          rotate: [0, 3, -2, 1, 0],
        }}
        transition={{
          duration: 6 + i * 0.5,
          repeat: Infinity,
          delay: delay,
          ease: "easeInOut",
        }}
      >
        <Component className={`${size}`} style={{ color: '#B7410E' }} />
      </motion.div>
    ))}
  </>
);

export default QuizDoodles;
