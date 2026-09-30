import { Github, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  ABOUT_URL,
  BITSOCIAL_URL,
  BLOG_URL,
  CONTRIBUTE_URL,
  FOOTER_TOKEN_LINKS,
  GITHUB_URL,
  PROOF_OF_CONCEPT_URL,
  RICH_LIST_PATH,
  TELEGRAM_URL,
  TWITTER_URL,
  type ExternalLink,
} from "@/lib/site";
import {
  CoinGeckoIcon,
  DexScreenerIcon,
  EtherscanIcon,
  UniswapIcon,
  XIcon,
} from "@/components/icons";

const linkClassName =
  "touch-target inline-flex items-center text-muted-foreground hover:text-foreground transition-colors text-sm";

function FooterLinkIcon({ icon }: { icon: ExternalLink["icon"] }) {
  if (icon === "coingecko") {
    return <CoinGeckoIcon className="h-3.5 w-3.5" />;
  }
  if (icon === "uniswap") {
    return <UniswapIcon className="h-3.5 w-3.5" />;
  }
  if (icon === "dexscreener") {
    return <DexScreenerIcon className="h-3.5 w-3.5" />;
  }
  if (icon === "etherscan") {
    return <EtherscanIcon className="h-3.5 w-3.5" />;
  }
  return null;
}

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer
      // The footer is a bordered card with 2rem top corners, so phones keep a 1.5rem inset
      // instead of the 1rem page gutter, which pushed the links against the border.
      className="footer-glass mt-8 px-[max(1.5rem,var(--space-page-inline))] pt-6 md:mt-12 md:pt-14"
      style={{ paddingBottom: "calc(3.5rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="touch-target mb-4 inline-flex items-center gap-1.5 group">
              <img src="/logo-small.png" alt="" aria-hidden="true" className="h-6 w-6" />
              <span className="text-lg font-display text-muted-foreground group-hover:text-foreground transition-colors">
                Bitsocial Chain
              </span>
            </a>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {t("footer.chainTagline")}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-display font-semibold uppercase tracking-widest text-foreground/70 mb-5">
              {t("footer.token")}
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
              <li>
                <a href={RICH_LIST_PATH} className={linkClassName}>
                  {t("nav.richList")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-display font-semibold uppercase tracking-widest text-foreground/70 mb-5">
              {t("footer.resources")}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href={BLOG_URL} className={linkClassName}>
                  {t("footer.blog")}
                </a>
              </li>
              <li>
                <a
                  href={PROOF_OF_CONCEPT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClassName}
                >
                  {t("footer.proofOfConcept")}
                </a>
              </li>
              <li>
                <a href={ABOUT_URL} className={linkClassName}>
                  {t("footer.about")}
                </a>
              </li>
              <li>
                <a href={BITSOCIAL_URL} className={linkClassName}>
                  {t("footer.mainSite")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-display font-semibold uppercase tracking-widest text-foreground/70 mb-5">
              {t("footer.community")}
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
              <li>
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClassName} inline-flex items-center gap-2`}
                >
                  <Send className="h-3.5 w-3.5" />
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-muted-foreground/70 text-xs">
          <p className="font-display tracking-wide">{t("footer.chainBottomTagline")}</p>
          <div className="flex items-center gap-3 text-xs">
            <a
              href={CONTRIBUTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target inline-flex items-center transition-colors hover:text-foreground"
            >
              {t("footer.contribute")}
            </a>
            <span className="text-border/50">&bull;</span>
            <a
              href="https://bitsocialforge.com"
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="touch-target inline-flex items-center transition-colors hover:text-foreground"
            >
              &copy; {new Date().getFullYear()} Bitsocial Forge, Inc.
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
