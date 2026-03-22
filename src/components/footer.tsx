import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Github, Send } from "lucide-react";
import { goToMailingListSection } from "@/lib/mailing-list-nav";

const linkClassName = "text-muted-foreground hover:text-foreground transition-colors text-sm";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNewsletterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    goToMailingListSection(location.pathname, location.hash, navigate);
  };

  return (
    <footer
      className="footer-glass px-6 pt-6 mt-8 md:pt-14 md:mt-12"
      style={{ paddingBottom: "calc(3.5rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          {/* Branding */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-1.5 mb-4 group">
              <img src="/logo-small.png" alt="Bitsocial" className="h-6 w-6" />
              <span className="text-lg font-display text-muted-foreground group-hover:text-foreground transition-colors">
                Bitsocial
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-display font-semibold uppercase tracking-widest text-foreground/70 mb-5">
              {t("footer.product")}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/apps" className={linkClassName}>
                  {t("footer.apps")}
                </Link>
              </li>
              <li>
                <Link to="/docs" className={linkClassName}>
                  {t("footer.docs")}
                </Link>
              </li>
              <li>
                <Link to="/status" className={linkClassName}>
                  {t("footer.status")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-display font-semibold uppercase tracking-widest text-foreground/70 mb-5">
              {t("footer.resources")}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/blog" className={linkClassName}>
                  {t("footer.blog")}
                </Link>
              </li>
              <li>
                <Link to="/about" className={linkClassName}>
                  {t("footer.about")}
                </Link>
              </li>
              <li>
                <a href="/#mailing-list" className={linkClassName} onClick={handleNewsletterClick}>
                  {t("footer.newsletter")}
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-xs font-display font-semibold uppercase tracking-widest text-foreground/70 mb-5">
              {t("footer.community")}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://github.com/bitsocialnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClassName} inline-flex items-center gap-2`}
                >
                  <Github className="h-3.5 w-3.5" />
                  {t("footer.github")}
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/bitsocialnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClassName} inline-flex items-center gap-2`}
                >
                  <XIcon className="h-3.5 w-3.5" />
                  {t("footer.twitter")}
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/bitsocialnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClassName} inline-flex items-center gap-2`}
                >
                  <Send className="h-3.5 w-3.5" />
                  {t("footer.telegram")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-muted-foreground/70 text-xs">
          <p className="font-display tracking-wide">{t("footer.bottomTagline")}</p>
          <div className="flex items-center gap-3 text-xs">
            <a
              href="https://github.com/bitsocialnet/bitsocial-web/blob/master/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              {t("footer.license")}
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
