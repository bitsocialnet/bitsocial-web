import { m, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState } from "react";

const phases = [
  {
    phase: "Phase 1",
    title: "Decentralize imageboards",
    description:
      "Imageboards are the simplest form of social media to decentralize: no user profiles, few default boards, no cutting-edge features like ai chatbots, monetization, etc. This is why we're launching 5chan, the first Bitsocial app. 5chan delivers the most popular imageboard experience, while removing global admins from the equation.",
  },
  {
    phase: "Phase 2",
    title: "Launch Bitsocial RPC",
    description:
      "Our team's first startup, Bitsocial Forge, will launch its first non-custodial RPC service for Bitsocial apps. It will let developers rent Bitsocial nodes to power their apps, so users can manage P2P nodes from their mobile phones. Anyone can always run a Bitsocial node, it even runs on a raspberry pi. Anyone can also run their own RPC service competing with Bitsocial Forge.",
  },
  {
    phase: "Phase 3",
    title: "Decentralize forums",
    description:
      "Forums are message boards with profiles and post history. Our first prototype Bitsocial app is an reddit alternative, Seedit, still experimental. A public RPC (master plan phase 2) is critical to let all Seedit users create and manage communities from anywhere, connecting to their full Bitsocial node remotely.",
  },
  {
    phase: "Phase 4",
    title: "Launch Bitsocial Network",
    description:
      "In order to decentralize all social media, Bitsocial will need killer features and strong network effects, unstoppable financial structures, decentralized Bitsocial domains (.bso), middleware authentication layers. All of this would be powered by Bitsocial Network, a decentralized appchain solution for Bitsocial apps.",
  },
  {
    phase: "Phase 5",
    title: "Decentralize all social media",
    description:
      "As the protocol matures, profile nodes will let every user be reachable P2P and produce content for apps rivaling Facebook, Instagram, TikTok, X, and YouTube. Profile nodes will be ultra-cheap Bitsocial nodes, provisioned automatically via RPCs on first sign-up. Bitsocial Network will enable content monetization without banks seizing funds or admins banning users. Algorithms powering feeds will be provided by competing Bitsocial RPCs, and users choose, combine, self-host, or opt out entirely. Social media finally finds its equilibrium: a fully decentralized, peer-to-peer network with no owners; Bitsocial.",
  },
];

export default function MasterPlan() {
  const [showGif, setShowGif] = useState(false);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const showTimeline = useInView(timelineRef, {
    once: true,
    amount: 0.1,
  });

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-display font-normal text-center mb-20 text-muted-foreground text-balance"
        >
          Master Plan
        </m.h2>

        <div ref={timelineRef} className="relative w-full">
          <div className="relative w-full">
            {/* One centered timeline element so the solid and dashed tail stay perfectly aligned and animate together. */}
            <m.div
              initial={{ scaleY: 0, opacity: 0 }}
              animate={showTimeline ? { scaleY: 1, opacity: 1 } : undefined}
              transition={{ delay: 0.5, duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
              style={{ transformOrigin: "top" }}
              className="pointer-events-none absolute left-1/2 top-0 z-0 flex h-full w-0.5 -translate-x-1/2 flex-col"
              aria-hidden
            >
              <div className="min-h-0 flex-1 bg-gradient-to-b from-blue-core via-blue-glow to-blue-core" />
              <div className="h-16 shrink-0 bg-blue-glow" />
              <svg width="2" height="64" className="block shrink-0 text-blue-glow">
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
              <svg width="2" height="56" className="block shrink-0 text-blue-glow">
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
            </m.div>

            <div className="space-y-16 md:space-y-20">
              {phases.map((item, index) => (
                <m.div
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
                </m.div>
              ))}
            </div>

            {/* Reserve space for the solid and dashed tail that the absolute timeline renders. */}
            <div aria-hidden className="h-[184px]" />
          </div>

          {/* End logo — fades in when the vertical line finishes drawing (matches timeline delay + duration). */}
          <div className="flex justify-center mt-2">
            <m.button
              initial={{ opacity: 0, scale: 0.85 }}
              animate={showTimeline ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
              transition={{
                delay: showTimeline ? 0.5 + 1.5 : 0,
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
              }}
              onClick={() => setShowGif(true)}
              className="relative z-10 flex-shrink-0 cursor-pointer transition-all duration-300"
              whileHover={{ scale: 1.1 }}
            >
              <img
                src="/logo-small.png"
                alt="Logo"
                className="w-8 h-8 transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(37,99,235,0.8)]"
              />
            </m.button>
          </div>
        </div>
      </div>

      {/* GIF overlay */}
      <AnimatePresence>
        {showGif && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setShowGif(false)}
          >
            <m.img
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
          </m.div>
        )}
      </AnimatePresence>
    </section>
  );
}
