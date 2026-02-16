import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const DoodleStar = ({ className, style }: {className?: string;style?: React.CSSProperties;}) =>
<svg className={className} style={style} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 4 L23 15 L35 15 L25 22 L28 34 L20 26 L12 34 L15 22 L5 15 L17 15 Z" />
  </svg>;


const DoodleCircle = ({ className, style }: {className?: string;style?: React.CSSProperties;}) =>
<svg className={className} style={style} viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="25" cy="25" r="20" strokeDasharray="5 5" />
  </svg>;


const DoodleZigzag = ({ className }: {className?: string;}) =>
<svg className={className} viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="0,15 12,5 24,15 36,5 48,15 60,5 72,15 84,5 100,15" />
  </svg>;


const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 overflow-hidden relative">
      {/* Doodle decorations */}
      <DoodleStar className="absolute top-12 left-8 w-10 h-10 text-primary float opacity-60" />
      <DoodleStar className="absolute top-24 right-12 w-8 h-8 text-secondary float opacity-50" style={{ animationDelay: "1s" }} />
      <DoodleCircle className="absolute bottom-20 left-12 w-14 h-14 text-doodle-purple float opacity-40" style={{ animationDelay: "0.5s" }} />
      <DoodleCircle className="absolute top-32 left-1/3 w-10 h-10 text-doodle-green float opacity-30" style={{ animationDelay: "1.5s" }} />
      <DoodleStar className="absolute bottom-32 right-16 w-12 h-12 text-accent float opacity-50" style={{ animationDelay: "2s" }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-md relative z-10 shadow-none border-inherit rounded-none">

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-7xl mb-6">

          🎭
        </motion.div>

        <h1 className="text-5xl sm:text-6xl font-display font-extrabold mb-3 leading-tight text-accent">
          True<span className="text-primary">Self</span>
        </h1>

        <DoodleZigzag className="w-48 mx-auto text-primary mb-6" />

        <p className="text-lg text-muted-foreground font-semibold mb-2">To find your personality
 Please don't be fake.<span className="squiggle-underline">really</span> are.
        </p>
        <p className="text-sm text-muted-foreground mb-10">
          20 questions. 5 phases. 1 truth.
        </p>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/quiz")}
          className="doodle-button bg-primary text-primary-foreground px-10 py-4 text-xl rounded-lg">

          ✏️ Start Test
        </motion.button>

        <p className="mt-8 text-xs bg-inherit text-center font-bold text-doodle-green">
          Takes about 4 minutes • 100% anonymous
        </p>
      </motion.div>
    </div>);

};

export default Index;