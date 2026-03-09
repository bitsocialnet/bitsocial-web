import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { useGraphicsMode } from "@/lib/graphics-mode"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import HamburgerButton from "./hamburger-button"
import LanguageSelector from "./language-selector"
import MobileMenu from "./mobile-menu"

function NavLink({
  to,
  href,
  children,
  onClick,
  className: extraClassName,
  noUnderline,
}: {
  to?: string
  href?: string
  children: React.ReactNode
  onClick?: () => void
  className?: string
  noUnderline?: boolean
}) {
  const baseClassName =
    "text-muted-foreground hover:text-foreground transition-colors relative group text-base md:text-base font-display leading-none py-2 px-2 block"
  const className = extraClassName
    ? `${baseClassName} ${extraClassName}`
    : baseClassName
  const content = (
    <>
      {children}
      {!noUnderline && (
        <span className="absolute bottom-1 left-0 w-0 h-px bg-blue-glow group-hover:w-full transition-all duration-300" />
      )}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {content}
      </a>
    )
  }

  if (to) {
    return (
      <Link to={to} className={className} onClick={onClick}>
        {content}
      </Link>
    )
  }

  return (
    <button className={className} onClick={onClick}>
      {content}
    </button>
  )
}

export default function Topbar() {
  const { t } = useTranslation()
  const graphicsMode = useGraphicsMode()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [menuHeight, setMenuHeight] = useState(0)

  const handleNavClick = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 border-b border-border",
          graphicsMode === "full" ? "topbar-frosted" : "bg-card",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex items-center justify-between relative">
          <Link to="/" className="flex items-center gap-1 group">
            <img src="/logo-small.png" alt="Bitsocial" className="h-8 w-8" />
            <span className="text-xl font-display font-regular text-muted-foreground">
              Bitsocial
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            {/* Nav links */}
            <div className="flex items-center gap-5">
              <NavLink to="/apps" onClick={handleNavClick}>
                {t("nav.apps")}
              </NavLink>
              <NavLink to="/docs" onClick={handleNavClick}>
                {t("nav.docs")}
              </NavLink>
              <NavLink to="/status" onClick={handleNavClick}>
                {t("nav.status")}
              </NavLink>
              <NavLink
                href="https://github.com/bitsocialnet"
                onClick={handleNavClick}
              >
                GitHub
              </NavLink>
            </div>

            {/* Divider */}
            <div className="h-4 w-px bg-border mx-4" />

            {/* Utility controls */}
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <HamburgerButton
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </div>

        {/* Mobile Menu - positioned absolutely below topbar */}
        <MobileMenu isOpen={isMobileMenuOpen} onHeightChange={setMenuHeight}>
          {/* Nav links */}
          <div className="flex flex-col gap-1">
            <NavLink to="/apps" onClick={handleNavClick} noUnderline>
              {t("nav.apps")}
            </NavLink>
            <NavLink to="/docs" onClick={handleNavClick} noUnderline>
              {t("nav.docs")}
            </NavLink>
            <NavLink to="/status" onClick={handleNavClick} noUnderline>
              {t("nav.status")}
            </NavLink>
            <NavLink
              href="https://github.com/bitsocialnet"
              onClick={handleNavClick}
              noUnderline
            >
              GitHub
            </NavLink>
          </div>

          {/* Controls */}
          <div className="border-t border-border pt-4 mt-2 flex flex-row gap-2">
            <div className="flex-1">
              <LanguageSelector mobile />
            </div>
            <div className="flex-1">
              <ThemeToggle mobile />
            </div>
          </div>
        </MobileMenu>
      </motion.nav>
      {/* Spacer to push content down when menu is open */}
      <motion.div
        animate={{ height: menuHeight }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="md:hidden"
        aria-hidden="true"
      />
    </>
  )
}
