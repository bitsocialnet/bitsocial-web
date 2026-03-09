import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { triggerFeatureGlow } from "@/lib/utils"

interface Feature {
  id: string
  title: string
  description: string
  expandedContent: string
}

const features: Feature[] = [
  {
    id: "open-source",
    title: "Bitsocial is an open-source...",
    description:
      "Bitsocial is open source under GPLv2 license: the code is public, can be modified, and outside contributions are welcome.",
    expandedContent:
      "Please contribute! Bitsocial needs as many developers as possible to help it grow and succeed. You can find our team's code on https://github.com/bitsocialnet, pull requests are welcome. You are also free to fork our code and create your own Bitsocial app as well. You are very much encouraged to experiment with the code to create your own custom Bitsocial app; the more apps there are, the more opportunities the userbase has to grow, exponentially. Every Bitsocial app should be designed to be compatible with each other, so the overall Bitsocial userbase can be shared across clients, and thus new clients have a higher chance of success.",
  },
  {
    id: "peer-to-peer",
    title: "...peer-to-peer network...",
    description:
      "Bitsocial finally brings true decentralization to social media: it's not federated, and it's not on a blockchain either; rather, it is pure P2P, similarly to torrents, getting faster as more users join and seed the network.",
    expandedContent:
      "Unlike federated social media, Bitsocial can achieve absolute freedom of speech: Bitsocial is pure peer-to-peer—users can always connect to a community directly by knowing its address, and each user has full ownership of their own data, so no instance/relay exists with the power of censoring users or communities.\n\nUnlike blockchain-based social media, Bitsocial is infinitely scalable: users can be full nodes on about 2GB of RAM by simply browsing with the desktop app (uses IPFS), automatically seeding all communities from which they download content. All content is text-only (including links for media).",
  },
  {
    id: "social-apps",
    title: "...for social apps,...",
    description:
      'Anyone can build a Bitsocial app (also known as a "client" for the Bitsocial protocol), with any interface of their choice.',
    expandedContent:
      "Bitsocial is a free protocol, nobody decides how many clients there may be. Build your own, share it, see it grow a userbase. The entire Bitsocial userbase is shared across clients, each client should be designed to be compatible with each other. The more clients there are, the more opportunities the userbase has to grow, exponentially.",
  },
  {
    id: "no-servers",
    title: "...with no servers,...",
    description:
      'Bitsocial is serverless, so it\'s impossible for the network to "go down". No government can shut it down, either, and nobody owns the network as a whole.',
    expandedContent:
      'Users own their own communities, they run them with bitsocial nodes, so each community acts as its own "server" (P2P node). Crucially, Bitsocial nodes don\'t need a domain to function, no SSL, and they run on very low resources (e.g., a node runs on a raspberry pi, powering thousands of bitsocial communities at a time).',
  },
  {
    id: "no-global-bans",
    title: "...no global bans,...",
    description:
      'Bitsocial itself is adminless; it is the true "digital public square" of the internet. Users are admins and moderators of their own communities and profiles, and nobody can ban them from the whole network.',
    expandedContent:
      'Nobody owns Bitsocial, therefore nobody can ban users from Bitsocial as a whole, as there are no "global admins" running the network. Bitsocial app developers may choose to blacklist certain users addresses and/or community addresses from their app, but nobody can ban them from the network as a whole, and anyone can create their own Bitsocial app as well. Interestingly, Twitter/"X" praised itself as the "digital town square" where people can speak freely, and yet a corporation (X Corp.) owns this so-called "public square"—a corporation whose admins can ban anyone at will. Bitsocial isn\'t controlled by any corporation, thus it is the true public square of the internet.',
  },
  {
    id: "cryptographic-property",
    title: "...where users and communities are cryptographic property.",
    description:
      "Bitsocial users own their own identities (e.g. profiles, communities they create) as private keys, just like how crypto users own their own coins with seed phrases.",
    expandedContent:
      "Finally, the web has cryptographically unseizable communities for the first time ever. Just like in the real world you may have your own private property, on Bitsocial you can have your own community as your property, with your own rules. A Bitsocial community and profile therefore act as if they're their own websites, even using their own domains as addresses, which other Bitsocial users subscribe to and connect to P2P. Even so—unlike traditional websites that can get taken down at any time by the domain registrar, DNS, SSL certificate, etc.—Bitsocial identities are pure P2P nodes, which are censorship-resistant, similarly to Bitcoin nodes and BitTorrent seeders.",
  },
]

export default function Features() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash && features.some((f) => f.id === hash)) {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        // Small delay to ensure DOM is ready
        timeoutId = setTimeout(() => {
          triggerFeatureGlow(hash)
        }, 100)
      }
    }

    // Handle initial hash on mount
    handleHashChange()

    // Listen for hash changes (navigation, back/forward buttons, etc.)
    window.addEventListener("hashchange", handleHashChange)

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  const toggleExpand = (
    id: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setExpandedId(expandedId === id ? null : id)
    // Remove focus after click to ensure hover state works properly
    event.currentTarget.blur()
  }

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

        <div className="space-y-12 md:space-y-16">
          {features.map((feature, index) => {
            const isExpanded = expandedId === feature.id
            const isEven = index % 2 === 0

            return (
              <div key={feature.id} id={feature.id} className="scroll-mt-24">
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
                      <h3 className="text-xl md:text-2xl font-display font-normal mb-4 text-muted-foreground italic">
                        {feature.title}
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
                      className="px-8 py-3 border border-border bg-card/50 backdrop-blur-md text-muted-foreground hover:text-foreground font-display font-semibold hover:border-blue-glow ring-glow transition-all duration-300 w-full md:w-auto"
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
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
