import { Github } from "lucide-react";
import {
  BITSOCIAL_URL,
  CONTRIBUTE_URL,
  DOCS_URL,
  FOOTER_TOKEN_LINKS,
  GITHUB_URL,
  TWITTER_URL,
  type ExternalLink,
} from "@/lib/site";
import { CoinGeckoIcon, EtherscanIcon, UniswapIcon, XIcon } from "@/components/icons";

const linkClassName = "text-muted-foreground hover:text-foreground transition-colors text-sm";

function FooterLinkIcon({ icon }: { icon: ExternalLink["icon"] }) {
  if (icon === "coingecko") {
    return <CoinGeckoIcon className="h-3.5 w-3.5" />;
  }
  if (icon === "uniswap") {
    return <UniswapIcon className="h-3.5 w-3.5" />;
  }
  if (icon === "etherscan") {
    return <EtherscanIcon className="h-3.5 w-3.5" />;
  }
  return null;
}

export default function Footer() {
  return (
    <footer
      className="footer-glass px-6 pt-6 mt-8 md:pt-14 md:mt-12"
      style={{ paddingBottom: "calc(3.5rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="inline-flex items-center gap-1.5 mb-4 group">
              <img src="/logo-small.png" alt="" aria-hidden="true" className="h-6 w-6" />
              <span className="text-lg font-display text-muted-foreground group-hover:text-foreground transition-colors">
                Bitsocial Chain
              </span>
            </a>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              The token powering Bitsocial Chain — an unstoppable, fully decentralized Ethereum L2
              for sovereign communities.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-display font-semibold uppercase tracking-widest text-foreground/70 mb-5">
              Token
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_TOKEN_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${linkClassName} inline-flex items-center gap-2`}
                  >
                    <FooterLinkIcon icon={link.icon} />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-display font-semibold uppercase tracking-widest text-foreground/70 mb-5">
              Resources
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href={BITSOCIAL_URL} className={linkClassName}>
                  Main Site
                </a>
              </li>
              <li>
                <a href={DOCS_URL} className={linkClassName}>
                  Docs
                </a>
              </li>
              <li>
                <a href="#mailing-list" className={linkClassName}>
                  Newsletter
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-display font-semibold uppercase tracking-widest text-foreground/70 mb-5">
              Community
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClassName} inline-flex items-center gap-2`}
                >
                  <Github className="h-3.5 w-3.5" />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={TWITTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClassName} inline-flex items-center gap-2`}
                >
                  <XIcon className="h-3.5 w-3.5" />
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-muted-foreground/70 text-xs">
          <p className="font-display tracking-wide">Decentralize all social media</p>
          <div className="flex items-center gap-3 text-xs">
            <a
              href={CONTRIBUTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Improve this page
            </a>
            <span className="text-border/50">&bull;</span>
            <a
              href="https://bitsocialforge.com"
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="hover:text-foreground transition-colors"
            >
              &copy; {new Date().getFullYear()} Bitsocial Forge, Inc.
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
