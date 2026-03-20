import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const phases = [
  {
    phase: "Phase 1",
    title: "Lorem Ipsum",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    phase: "Phase 2",
    title: "Dolor Sit Amet",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    phase: "Phase 3",
    title: "Consectetur Adipiscing",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    phase: "Phase 4",
    title: "Sed Do Eiusmod",
    description:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    phase: "Phase 5",
    title: "Tempor Incididunt",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

export default function MasterPlan() {
  const [showGif, setShowGif] = useState(false);

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-display font-normal text-center mb-20 text-muted-foreground"
        >
          Master Plan
        </motion.h2>

        <div className="relative">
          <div className="relative">
            {/* Timeline line - visible on both mobile and desktop */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-blue-core via-blue-glow to-blue-core" />

            <div className="space-y-16 md:space-y-20">
              {phases.map((item, index) => (
                <motion.div
                  key={item.phase}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Phase indicator */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center">
                      <span className="text-sm font-display font-semibold text-muted-foreground tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  {/* Content card */}
                  <div className="flex-1 glass-card p-7 md:p-8 max-w-lg">
                    <div className="text-xs text-blue-glow/80 font-display font-medium uppercase tracking-widest mb-3">
                      {item.phase}
                    </div>
                    <h3 className="text-xl md:text-2xl font-display font-semibold mb-3 text-foreground/85">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Dashed continuation line - visible on both mobile and desktop */}
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-16 bg-blue-glow" />
            <svg width="2" height="64" className="text-blue-glow">
              <line
                x1="1"
                y1="0"
                x2="1"
                y2="64"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
            </svg>
            <svg width="2" height="56" className="text-blue-glow">
              <line
                x1="1"
                y1="0"
                x2="1"
                y2="56"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="2 4"
              />
            </svg>
          </div>

          {/* End logo */}
          <div className="flex justify-center mt-2">
            <motion.button
              onClick={() => setShowGif(true)}
              className="relative z-10 flex-shrink-0 cursor-pointer transition-all duration-300"
              whileHover={{ scale: 1.1 }}
            >
              <img
                src="/logo-small.png"
                alt="Logo"
                className="w-8 h-8 transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(37,99,235,0.8)]"
              />
            </motion.button>
          </div>
        </div>
      </div>

      {/* GIF overlay */}
      <AnimatePresence>
        {showGif && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setShowGif(false)}
          >
            <motion.img
              src="https://media1.tenor.com/m/zI1Evz0Qc24AAAAd/spongebob-squarepants-nickelodeon.gif"
              alt="Spongebob"
              className="max-w-[90vw] max-h-[90vh] cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setShowGif(false);
              }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
