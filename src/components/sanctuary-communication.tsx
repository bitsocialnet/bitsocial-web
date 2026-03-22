import { m } from "framer-motion";
import { Check, X } from "lucide-react";
import { useState, useRef, useCallback } from "react";

type ApproachId = "federated" | "blockchain" | "bitsocial";

const approaches: { id: ApproachId; label: string; subtitle: string }[] = [
  { id: "federated", label: "Federated", subtitle: "Bluesky, Mastodon, Lemmy, Nostr" },
  { id: "blockchain", label: "Blockchain", subtitle: "DeSo, Lens, Farcaster, Minds, Steemit" },
  { id: "bitsocial", label: "Bitsocial", subtitle: "The only peer-to-peer social network" },
];

const rows: { label: string; values: Record<ApproachId, string> }[] = [
  {
    label: "Run a node",
    values: {
      federated: "Server + domain + SSL",
      blockchain: "Datacenter hardware",
      bitsocial: "Low resources (e.g., Raspberry Pi)",
    },
  },
  {
    label: "Scalability",
    values: {
      federated: "Bottleneck per instance",
      blockchain: "Chain grows, costs rise",
      bitsocial: "More users = faster",
    },
  },
  {
    label: "Infra cost",
    values: {
      federated: "Hosting + domain fees",
      blockchain: "Expensive chain storage",
      bitsocial: "Zero",
    },
  },
  {
    label: "Resilience",
    values: {
      federated: "DDoS, SSL revoked, domain seized",
      blockchain: "Validator censorship",
      bitsocial: "No single point of failure",
    },
  },
  {
    label: "Run a full node",
    values: {
      federated: "Deploy and maintain a server",
      blockchain: "Sync terabytes of chain data",
      bitsocial: "Open a Bitsocial app",
    },
  },
];

function ComparisonCard({
  approach,
  isBitsocial,
}: {
  approach: (typeof approaches)[number];
  isBitsocial: boolean;
}) {
  return (
    <div
      className={`glass-card p-5 md:p-7 h-full ${
        isBitsocial ? "border !border-blue-glow shadow-[0_0_20px_rgba(37,99,235,0.35)]" : ""
      }`}
    >
      <div className="mb-4 pb-3 border-b border-[var(--glass-border-subtle)]">
        <h3 className="text-base md:text-lg font-display font-semibold">{approach.label}</h3>
        <p className="text-xs text-muted-foreground/60">{approach.subtitle}</p>
      </div>
      <div className="space-y-3.5">
        {rows.map((row) => (
          <div key={row.label}>
            <p className="text-xs uppercase tracking-wider text-muted-foreground/50 mb-0.5">
              {row.label}
            </p>
            <div className="flex gap-2 items-start">
              {isBitsocial ? (
                <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" aria-hidden />
              ) : (
                <X className="h-4 w-4 shrink-0 text-red-500 mt-0.5" aria-hidden />
              )}
              <p
                className={`text-sm font-medium min-w-0 ${
                  isBitsocial ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {row.values[approach.id]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SanctuaryCommunication() {
  const [activeTab, setActiveTab] = useState<ApproachId>("bitsocial");
  const touchStartX = useRef(0);

  const activeIndex = approaches.findIndex((a) => a.id === activeTab);

  const handleSwipe = useCallback(
    (startX: number, endX: number) => {
      const diff = startX - endX;
      const threshold = 50;
      const idx = approaches.findIndex((a) => a.id === activeTab);
      const isRtl = document.documentElement.dir === "rtl";
      const effectiveDiff = isRtl ? -diff : diff;

      if (effectiveDiff > threshold && idx < approaches.length - 1) {
        setActiveTab(approaches[idx + 1].id);
      } else if (effectiveDiff < -threshold && idx > 0) {
        setActiveTab(approaches[idx - 1].id);
      }
    },
    [activeTab],
  );

  return (
    <section id="sanctuary-communication" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section label — reads last (smallest, muted) per visual hierarchy principle */}
        <m.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xs md:text-sm font-display tracking-[0.2em] uppercase text-center mb-6 text-muted-foreground/50"
        >
          Sanctuary Communication
        </m.p>

        {/* Hero statement — reads first (biggest, boldest) */}
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-display font-semibold text-center mb-6 text-balance leading-[1.1] text-muted-foreground"
        >
          It just works.
        </m.h2>

        {/* Supporting text — reads second */}
        <m.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-lg text-center text-muted-foreground max-w-2xl mx-auto mb-16 text-balance leading-relaxed"
        >
          No servers to rent. No domains to buy. No chains to sync. A Bitsocial node runs on a
          Raspberry Pi — and like BitTorrent, the more people join, the faster and more resilient it
          gets.
        </m.p>

        {/* ---- Mobile: tabbed carousel ---- */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="md:hidden"
        >
          {/* Tab pills */}
          <div className="flex gap-1.5 justify-center mb-5" role="tablist">
            {approaches.map((a) => (
              <button
                key={a.id}
                role="tab"
                aria-selected={activeTab === a.id}
                aria-controls={`panel-${a.id}`}
                onClick={() => setActiveTab(a.id)}
                className={`px-4 py-2 rounded-full text-xs font-display font-medium transition-all duration-300 ${
                  activeTab === a.id
                    ? a.id === "bitsocial"
                      ? "bg-blue-core text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                      : "glass-card text-foreground"
                    : "text-muted-foreground/60 hover:text-muted-foreground"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>

          {/* Swipeable card area */}
          <div
            className="overflow-hidden"
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              handleSwipe(touchStartX.current, e.changedTouches[0].clientX);
            }}
          >
            <div
              className="flex transition-transform duration-300 ease-out motion-reduce:transition-none"
              style={{
                transform: `translateX(-${activeIndex * 100}%)`,
              }}
            >
              {approaches.map((a) => (
                <div key={a.id} id={`panel-${a.id}`} role="tabpanel" className="min-w-full px-0.5">
                  <ComparisonCard approach={a} isBitsocial={a.id === "bitsocial"} />
                </div>
              ))}
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-1.5 mt-4" aria-hidden>
            {approaches.map((a, i) => (
              <button
                key={a.id}
                tabIndex={-1}
                aria-label={a.label}
                onClick={() => setActiveTab(a.id)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "w-6 bg-blue-glow"
                    : "w-1.5 bg-muted-foreground/20 hover:bg-muted-foreground/40"
                }`}
              />
            ))}
          </div>
        </m.div>

        {/* ---- Desktop: three-column grid ---- */}
        <div className="hidden md:grid md:grid-cols-3 gap-5">
          {approaches.map((a, i) => (
            <m.div
              key={a.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
            >
              <ComparisonCard approach={a} isBitsocial={a.id === "bitsocial"} />
            </m.div>
          ))}
        </div>

        {/* Founder attribution — links to whitepaper discussion */}
        <m.a
          href="https://github.com/plebbit/whitepaper/discussions/2#:~:text=your%20community%20literally,solve%20that%20problem."
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="block text-center text-xs md:text-sm text-muted-foreground/40 mt-14 italic max-w-lg mx-auto rounded-md hover:text-muted-foreground/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-glow/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
        >
          &ldquo;Your community literally cannot be banned or blocked by anyone, even a government.
          We solve that problem.&rdquo;
          <span className="not-italic block mt-1">— Esteban Abaroa, Bitsocial founder</span>
        </m.a>
      </div>
    </section>
  );
}
