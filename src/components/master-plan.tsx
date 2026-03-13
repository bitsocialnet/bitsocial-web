import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

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
]

export default function MasterPlan() {
  const [showGif, setShowGif] = useState(false)

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-display font-normal text-center mb-16 text-muted-foreground"
        >
          Master Plan
        </motion.h2>

        <div className="relative">
          {/* Phases container with timeline line */}
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-blue-core via-blue-glow to-blue-core" />

            <div className="space-y-12">
              {phases.map((item, index) => (
                <motion.div
                  key={item.phase}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className={`flex flex-col md:flex-row items-center gap-6 ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-4 h-4 rounded-full bg-blue-core ring-4 ring-background border-2 border-blue-glow" />
                  </div>

                  {/* Content card */}
                  <div className="flex-1 glass-card p-6 max-w-md">
                    <div className="text-sm text-blue-glow font-display font-normal mb-2">
                      {item.phase}
                    </div>
                    <h3 className="text-2xl font-display font-semibold mb-3 text-muted-foreground">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center">
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

          <div className="flex justify-center mt-2">
            <motion.button
              onClick={() => setShowGif(true)}
              className="relative z-10 flex-shrink-0 cursor-pointer transition-all duration-300 hover:scale-110"
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
                e.stopPropagation()
                setShowGif(false)
              }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
