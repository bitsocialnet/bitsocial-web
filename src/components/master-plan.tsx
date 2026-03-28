import { m, useInView } from "framer-motion";
import { useRef, useState } from "react";
import EasterEggOverlay from "@/components/easter-egg-overlay";

const phases = [
  {
    phase: "Phase 1",
    status: "Ongoing",
    title: "Decentralize imageboards",
    description:
      "Imageboards are the simplest form of social media to decentralize: anonymous posting, few default boards, and no profile graph. This is why we're launching 5chan, the first Bitsocial app. 5chan proves Bitsocial can replace centralized imageboards while removing global admins from the equation.",
  },
  {
    phase: "Phase 2",
    title: "Launch Bitsocial RPC",
    description:
      "Bitsocial Forge will launch the first non-custodial RPC service for Bitsocial apps. Bitsocial RPC will let apps and users manage Bitsocial nodes remotely, while preserving the option to self-host or run competing RPC infrastructure. Users will be able to create and manage unstoppable p2p communities from anywhere.",
  },
  {
    phase: "Phase 3",
    title: "Decentralize forums",
    description:
      "Forums add persistent identities, post history, and community management. Our first prototype Bitsocial app to decentralize forums is Seedit, a reddit alternative. Seedit will bring Reddit-style discussion to Bitsocial once Phase 2 makes always-on communities practical from anywhere.",
  },
  {
    phase: "Phase 4",
    title: "Launch Bitsocial Network",
    description:
      "In order to decentralize all social media, Bitsocial apps will need killer features and strong network effects, unstoppable financial structures, decentralized Bitsocial domains (.bso), common liquidity. All of this will be powered by Bitsocial Network, a decentralized appchain solution for Bitsocial apps.",
  },
  {
    phase: "Phase 5",
    title: "Decentralize all social media",
    description:
      "With profile nodes, public RPCs, and Bitsocial Network in place, Bitsocial apps will be able to rival all kinds of social media, including Facebook, Instagram, TikTok, X, and YouTube. Profile nodes will be ultra-cheap Bitsocial nodes, provisioned automatically via RPCs on first sign-up. Bitsocial Network will enable content monetization without banks seizing funds or admins banning users. Multiple Bitsocial RPCs will compete to provide feeds powered by algorithms (or no algorithms at all), and users choose, combine, self-host, or opt out entirely. Social media finally finds its equilibrium: a fully decentralized, peer-to-peer network with no owners; Bitsocial.",
  },
];

const easterEgg = {
  alt: "SpongeBob",
  gifSrc: "/spongebob-easter-egg.gif",
};

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
                  initial={{ x: index % 2 === 0 ? -40 : 40 }}
                  whileInView={{ x: 0 }}
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
                      {"status" in item ? (
                        <span className="ml-2 text-amber-400/90">— {item.status}</span>
                      ) : null}
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

      <EasterEggOverlay
        imageSrc={easterEgg.gifSrc}
        alt={easterEgg.alt}
        open={showGif}
        onOpenChange={setShowGif}
      />
    </section>
  );
}
