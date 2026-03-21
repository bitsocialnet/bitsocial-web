import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { triggerFeatureGlow, triggerTaglineGlow } from "@/lib/utils";

type FeatureId =
  | "open-source"
  | "peer-to-peer"
  | "social-apps"
  | "no-servers"
  | "no-global-bans"
  | "cryptographic-property";

interface Feature {
  id: FeatureId;
  description: string;
  expandedContent: string;
}

/** Circle quarter fillet via cubic Bézier (avoids elliptical-arc sweep ambiguity in SVG). */
const CONNECTOR_R = 10;

const features: Feature[] = [
  {
    id: "open-source",
    description:
      "Bitsocial is open source under GPLv2 license: the code is public, can be modified, and outside contributions are welcome.",
    expandedContent:
      "Please contribute! Bitsocial needs as many developers as possible to help it grow and succeed. You can find our team's code on https://github.com/bitsocialnet, pull requests are welcome. You are also free to fork our code and create your own Bitsocial app as well. You are very much encouraged to experiment with the code to create your own custom Bitsocial app; the more apps there are, the more opportunities the userbase has to grow, exponentially. Every Bitsocial app should be designed to be compatible with each other, so the overall Bitsocial userbase can be shared across clients, and thus new clients have a higher chance of success.",
  },
  {
    id: "peer-to-peer",
    description:
      "Bitsocial finally brings true decentralization to social media: it's not federated, and it's not on a blockchain either; rather, it is pure P2P, similarly to torrents, getting faster as more users join and seed the network.",
    expandedContent:
      "Unlike federated social media, Bitsocial can achieve absolute freedom of speech: Bitsocial is pure peer-to-peer—users can always connect to a community directly by knowing its address, and each user has full ownership of their own data, so no instance/relay exists with the power of censoring users or communities.\n\nUnlike blockchain-based social media, Bitsocial is infinitely scalable: users can be full nodes on about 2GB of RAM by simply browsing with the desktop app (uses IPFS), automatically seeding all communities from which they download content. All content is text-only (including links for media).",
  },
  {
    id: "social-apps",
    description:
      'Anyone can build a Bitsocial app (also known as a "client" for the Bitsocial protocol), with any interface of their choice.',
    expandedContent:
      "Bitsocial is a free protocol, nobody decides how many clients there may be. Build your own, share it, see it grow a userbase. The entire Bitsocial userbase is shared across clients, each client should be designed to be compatible with each other. The more clients there are, the more opportunities the userbase has to grow, exponentially.",
  },
  {
    id: "no-servers",
    description:
      'Bitsocial is serverless, so it\'s impossible for the network to "go down". No government can shut it down, either, and nobody owns the network as a whole.',
    expandedContent:
      'Users own their own communities, they run them with bitsocial nodes, so each community acts as its own "server" (P2P node). Crucially, Bitsocial nodes don\'t need a domain to function, no SSL, and they run on very low resources (e.g., a node runs on a raspberry pi, powering thousands of bitsocial communities at a time).',
  },
  {
    id: "no-global-bans",
    description:
      'Bitsocial itself is adminless; it is the true "digital public square" of the internet. Users are admins and moderators of their own communities and profiles, and nobody can ban them from the whole network.',
    expandedContent:
      'Nobody owns Bitsocial, therefore nobody can ban users from Bitsocial as a whole, as there are no "global admins" running the network. Bitsocial app developers may choose to blacklist certain users addresses and/or community addresses from their app, but nobody can ban them from the network as a whole, and anyone can create their own Bitsocial app as well. Interestingly, Twitter/"X" praised itself as the "digital town square" where people can speak freely, and yet a corporation (X Corp.) owns this so-called "public square"—a corporation whose admins can ban anyone at will. Bitsocial isn\'t controlled by any corporation, thus it is the true public square of the internet.',
  },
  {
    id: "cryptographic-property",
    description:
      "Bitsocial users own their own identities (e.g. profiles, communities they create) as private keys, just like how crypto users own their own coins with seed phrases.",
    expandedContent:
      "Finally, the web has cryptographically unseizable communities for the first time ever. Just like in the real world you may have your own private property, on Bitsocial you can have your own community as your property, with your own rules. A Bitsocial community and profile therefore act as if they're their own websites, even using their own domains as addresses, which other Bitsocial users subscribe to and connect to P2P. Even so—unlike traditional websites that can get taken down at any time by the domain registrar, DNS, SSL certificate, etc.—Bitsocial identities are pure P2P nodes, which are censorship-resistant, similarly to Bitcoin nodes and BitTorrent seeders.",
  },
];

/** Matches original feature-card framing: excerpt from the hero line with ellipses and commas. */
function featureTitleFromTaglineSegments(t: (key: string) => string, id: FeatureId): string {
  const e = "...";
  let segment: string;
  switch (id) {
    case "open-source":
      segment = t("hero.taglineSegments.openSource");
      return `${segment}${e}`;
    case "peer-to-peer":
      segment = t("hero.taglineSegments.p2p");
      return `${e}${segment}${e}`;
    case "social-apps":
      segment = t("hero.taglineSegments.socialApps");
      return `${e}${segment},${e}`;
    case "no-servers":
      segment = t("hero.taglineSegments.noServers");
      return `${e}${segment},${e}`;
    case "no-global-bans":
      segment = t("hero.taglineSegments.noBans");
      return `${e}${segment},${e}`;
    case "cryptographic-property":
      segment = t("hero.taglineSegments.crypto");
      return `${e}${segment}`;
  }
}

function featureConnectorPathD(isEven: boolean): string {
  const r = CONNECTOR_R;
  const k = 0.5522847498 * r;
  const yMid = 32;
  const yTop = yMid - r;
  const yBot = yMid + r;
  const xL = 250;
  const xR = 750;

  if (isEven) {
    return `M ${xL},0 L ${xL},${yTop} C ${xL},${yTop + k} ${xL + r - k},${yMid} ${xL + r},${yMid} L ${xR - r},${yMid} C ${xR - r + k},${yMid} ${xR},${yBot - k} ${xR},${yBot} L ${xR},64`;
  }
  return `M ${xR},0 L ${xR},${yTop} C ${xR},${yTop + k} ${xR - r + k},${yMid} ${xR - r},${yMid} L ${xL + r},${yMid} C ${xL + r - k},${yMid} ${xL},${yBot - k} ${xL},${yBot} L ${xL},64`;
}

export default function Features() {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && features.some((f) => f.id === hash)) {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        // Small delay to ensure DOM is ready
        timeoutId = setTimeout(() => {
          triggerFeatureGlow(hash);
        }, 100);
      }
    };

    // Handle initial hash on mount
    handleHashChange();

    // Listen for hash changes (navigation, back/forward buttons, etc.)
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const toggleExpand = (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    setExpandedId(expandedId === id ? null : id);
    // Remove focus after click to ensure hover state works properly
    event.currentTarget.blur();
  };

  const handleTitleClick = (id: string) => {
    window.history.replaceState(null, "", "#hero-tagline");
    triggerTaglineGlow(id);
  };

  return (
    <section className="py-24 px-6 md:-mt-32 md:pt-32">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-display font-normal text-center mb-16 text-muted-foreground"
        >
          Core Features
        </motion.h2>

        <div>
          {features.map((feature, index) => {
            const isExpanded = expandedId === feature.id;
            const isEven = index % 2 === 0;

            return (
              <div
                key={feature.id}
                id={feature.id}
                className={`scroll-mt-24 ${index < features.length - 1 ? "mb-12 md:mb-0" : ""}`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`flex flex-col ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  } gap-2 md:gap-8 items-center`}
                >
                  {/* Card Content */}
                  <div className="flex-1 w-full md:w-1/2">
                    <div className="glass-card p-6 md:p-8">
                      <h3 className="mb-4">
                        <button
                          type="button"
                          onClick={() => handleTitleClick(feature.id)}
                          className="interactive-feature-link w-full text-start text-xl md:text-2xl font-display font-normal italic text-muted-foreground focus-visible:outline-none"
                        >
                          {featureTitleFromTaglineSegments(t, feature.id)}
                        </button>
                      </h3>
                      <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Learn More Button */}
                  <div className="flex-1 w-full md:w-1/2 flex items-center justify-center">
                    <button
                      onClick={(e) => toggleExpand(feature.id, e)}
                      className="px-8 py-3 rounded-full glass-card text-muted-foreground hover:text-foreground font-display font-semibold hover:border-blue-glow ring-glow transition-all duration-300 w-full md:w-auto"
                    >
                      {isExpanded ? "Show Less" : "Learn More"}
                    </button>
                  </div>
                </motion.div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 md:mt-8">
                        <div className="glass-card p-6 md:p-8">
                          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                            {feature.expandedContent}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {index < features.length - 1 && (
                  <div
                    className="hidden md:block pointer-events-none select-none h-16 w-full shrink-0"
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 1000 64"
                      className="h-full w-full rtl:-scale-x-100"
                      fill="none"
                    >
                      <motion.path
                        className="feature-connector-path"
                        d={featureConnectorPathD(isEven)}
                        strokeWidth={2}
                        strokeLinecap="square"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                        {...(prefersReducedMotion
                          ? {}
                          : {
                              initial: { pathLength: 0 },
                              whileInView: { pathLength: 1 },
                              viewport: { once: true },
                              transition: {
                                duration: 1,
                                ease: "easeInOut",
                              },
                            })}
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
