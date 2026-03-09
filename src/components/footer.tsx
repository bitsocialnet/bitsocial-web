import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

const linkClassName =
  "text-muted-foreground hover:text-foreground transition-colors text-lg md:text-sm"

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Branding */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-1 mb-4">
              <img src="/logo-small.png" alt="Bitsocial" className="h-6 w-6" />
              <span className="text-lg font-display font-regular text-muted-foreground">
                Bitsocial
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-foreground text-sm">
              {t("footer.product")}
            </h4>
            <ul className="space-y-2">
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
            <h4 className="font-display font-semibold mb-4 text-foreground text-sm">
              {t("footer.resources")}
            </h4>
            <ul className="space-y-2">
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
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-foreground text-sm">
              {t("footer.community")}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/bitsocialnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClassName}
                >
                  {t("footer.github")}
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/bitsocialnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClassName}
                >
                  {t("footer.twitter")}
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/bitsocialnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClassName}
                >
                  {t("footer.telegram")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-muted-foreground text-sm">
          <p className="font-display">{t("footer.bottomTagline")}</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/bitsocialnet/bitsocial-web/blob/master/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              {t("footer.license")}
            </a>
            <span>&copy; {new Date().getFullYear()} Bitsocial Labs</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
