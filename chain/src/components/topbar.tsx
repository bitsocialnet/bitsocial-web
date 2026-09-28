import { type MouseEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { m } from "framer-motion";
import HamburgerButton from "@/components/hamburger-button";
import LanguageSelector, { NoJsLanguageSelector } from "@/components/language-selector";
import MobileMenu from "@/components/mobile-menu";
import { NoJsThemeToggle, ThemeToggle } from "@/components/theme-toggle";
import { TOPBAR_LINKS, type ExternalLink } from "@/lib/site";
import { cn, getScrollBehavior } from "@/lib/utils";

// Every topbar control is an explicit 44px flex-centred box on every pointer type, matching the
// about site. Relying on a coarse-pointer minimum size instead grows the links on touch devices
// without re-centring their labels, so the bar looks different on an iPad than on a laptop.
const navLinkClassName =
  "text-muted-foreground hover:text-foreground transition-colors relative group flex min-h-11 items-center px-2 text-lg md:text-base font-display leading-none";
const desktopNavLinkClassName = "h-11 min-w-11 justify-center";
const compactNavigationTriggerBufferPx = 160;
const MOBILE_MENU_INTERACTION_GUARD_ATTRIBUTE = "data-mobile-menu-interaction-guard";

function NavLink({
  link,
  onClick,
  className: extraClassName,
}: {
  link: ExternalLink;
  onClick?: () => void;
  className?: string;
}) {
  const className = extraClassName ? `${navLinkClassName} ${extraClassName}` : navLinkClassName;

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={onClick}
    >
      {link.label}
    </a>
  );
}

const FAQ_ID = "faq";

// The one in-page link. The href keeps it working without JavaScript; with it, the click scrolls
// smoothly (unless reduced motion is on) like bitsocial.net's topbar FAQ instead of the anchor's
// instant jump, and replaces the hash so the jump does not stack history entries.
function FaqNavLink({ onClick, className }: { onClick?: () => void; className?: string }) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.();
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();

    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#${FAQ_ID}`,
    );
    // Closing the mobile menu animates `height: auto`, and framer-motion restores the window scroll
    // after measuring it on the next frame, which cancels a smooth scroll started now. Two frames
    // puts the scroll after that measurement.
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        document
          .getElementById(FAQ_ID)
          ?.scrollIntoView({ behavior: getScrollBehavior(), block: "start" }),
      ),
    );
  };

  return (
    <a href={`#${FAQ_ID}`} className={cn(navLinkClassName, className)} onClick={handleClick}>
      FAQ
    </a>
  );
}

function TopbarLinks({ links, onNavClick }: { links: ExternalLink[]; onNavClick: () => void }) {
  return (
    <div className="topbar-links flex items-center gap-5 whitespace-nowrap">
      {links.map((link) => (
        <NavLink
          key={link.href}
          link={link}
          onClick={onNavClick}
          className={desktopNavLinkClassName}
        />
      ))}
      <FaqNavLink onClick={onNavClick} className={desktopNavLinkClassName} />
    </div>
  );
}

function DesktopNavigation({
  links,
  onNavClick,
  includeNoJsControls = true,
}: {
  links: ExternalLink[];
  onNavClick: () => void;
  includeNoJsControls?: boolean;
}) {
  return (
    <div className="topbar-desktop-nav flex h-11 items-center">
      <TopbarLinks links={links} onNavClick={onNavClick} />
      {links.length > 0 ? <div className="h-4 w-px bg-border mx-4" /> : null}
      <div className="topbar-controls flex items-center gap-2">
        <div className="js-only">
          <LanguageSelector />
        </div>
        <div className="js-only">
          <ThemeToggle />
        </div>
        {includeNoJsControls ? (
          <noscript>
            <div className="topbar-nojs-controls nojs-inline-flex items-center gap-2">
              <NoJsLanguageSelector />
              <NoJsThemeToggle />
            </div>
          </noscript>
        ) : null}
      </div>
    </div>
  );
}

function NoJsMobileMenu({ links }: { links: ExternalLink[] }) {
  return (
    <details className="nojs-mobile-menu">
      <summary className="nojs-mobile-summary flex h-11 w-11 list-none cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
        <span className="sr-only">Menu</span>
        <span className="relative h-5 w-5">
          <span className="absolute left-0 top-0.5 h-0.5 w-5 rounded-full bg-current" />
          <span className="absolute left-0 top-[9px] h-0.5 w-5 rounded-full bg-current" />
          <span className="absolute left-0 top-[17px] h-0.5 w-5 rounded-full bg-current" />
        </span>
      </summary>

      <div className="nojs-mobile-panel px-4 py-6">
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink key={link.href} link={link} />
          ))}
          <FaqNavLink />
        </nav>

        <div className="mt-2 flex flex-col gap-3 border-t border-border/30 pt-4">
          <div>
            <NoJsThemeToggle mobile />
          </div>
          <div>
            <NoJsLanguageSelector mobile />
          </div>
        </div>
      </div>
    </details>
  );
}

export default function Topbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [usesCompactNavigation, setUsesCompactNavigation] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );
  const menuContainerRef = useRef<HTMLElement>(null);
  const topbarContentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const desktopNavMeasureRef = useRef<HTMLDivElement>(null);
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const updateNavigationMode = useCallback(() => {
    const availableWidth = topbarContentRef.current?.getBoundingClientRect().width ?? 0;
    const logoWidth = logoRef.current?.getBoundingClientRect().width ?? 0;
    const desktopNavWidth = desktopNavMeasureRef.current?.getBoundingClientRect().width ?? 0;

    if (!availableWidth || !logoWidth || !desktopNavWidth) {
      return;
    }

    const nextUsesCompactNavigation =
      logoWidth + desktopNavWidth + compactNavigationTriggerBufferPx > availableWidth;
    setUsesCompactNavigation((current) =>
      current === nextUsesCompactNavigation ? current : nextUsesCompactNavigation,
    );
  }, []);

  useLayoutEffect(() => {
    updateNavigationMode();

    const resizeObserver = new ResizeObserver(() => {
      updateNavigationMode();
    });

    if (topbarContentRef.current) {
      resizeObserver.observe(topbarContentRef.current);
    }

    if (logoRef.current) {
      resizeObserver.observe(logoRef.current);
    }

    if (desktopNavMeasureRef.current) {
      resizeObserver.observe(desktopNavMeasureRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [updateNavigationMode]);

  useEffect(() => {
    if (!usesCompactNavigation) {
      setIsMobileMenuOpen(false);
      setIsMenuExpanded(false);
    }
  }, [usesCompactNavigation]);

  useEffect(() => {
    if (!usesCompactNavigation || !isMobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMobileMenu();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (menuContainerRef.current?.contains(e.target as Node)) {
        return;
      }

      const eventTarget =
        e.target instanceof Element
          ? e.target
          : e.target instanceof Node
            ? e.target.parentElement
            : null;
      if (eventTarget?.closest(`[${MOBILE_MENU_INTERACTION_GUARD_ATTRIBUTE}]`)) {
        return;
      }

      e.preventDefault();
      closeMobileMenu();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [closeMobileMenu, usesCompactNavigation, isMobileMenuOpen]);

  const handleNavClick = () => {
    closeMobileMenu();
  };

  const handleMenuToggle = () => {
    setIsMobileMenuOpen((isOpen) => {
      const nextIsOpen = !isOpen;
      if (nextIsOpen) {
        setIsMenuExpanded(true);
      }
      return nextIsOpen;
    });
  };

  return (
    <m.nav
      ref={menuContainerRef}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      }}
      aria-label="Bitsocial Chain site navigation"
      className="topbar-position fixed z-50 mx-auto max-w-7xl"
    >
      <div
        className={cn(
          "relative overflow-hidden topbar-frosted",
          isMenuExpanded ? "rounded-[2rem]" : "rounded-full",
        )}
      >
        <div className="relative px-4 md:px-5 py-2">
          <div
            ref={desktopNavMeasureRef}
            aria-hidden="true"
            className="pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap"
          >
            <DesktopNavigation
              links={TOPBAR_LINKS}
              onNavClick={handleNavClick}
              includeNoJsControls={false}
            />
          </div>

          <div ref={topbarContentRef} className="flex h-11 items-center justify-between">
            <a
              ref={logoRef}
              href="/"
              className="group inline-flex h-11 shrink-0 items-center gap-1 transition-colors"
            >
              <img
                src="/logo-small.png"
                width={32}
                height={32}
                alt=""
                aria-hidden="true"
                className="h-8 w-8 transition-[filter] group-hover:brightness-110"
              />
              <span className="text-xl font-display font-regular text-muted-foreground group-hover:text-foreground transition-colors">
                Bitsocial Chain
              </span>
            </a>

            {usesCompactNavigation ? (
              <div className="flex h-11 items-center gap-2">
                <HamburgerButton isOpen={isMobileMenuOpen} onClick={handleMenuToggle} />
              </div>
            ) : (
              <DesktopNavigation links={TOPBAR_LINKS} onNavClick={handleNavClick} />
            )}

            <noscript>
              <NoJsMobileMenu links={TOPBAR_LINKS} />
            </noscript>
          </div>
        </div>
        <MobileMenu
          isOpen={usesCompactNavigation && isMobileMenuOpen}
          onExitComplete={() => setIsMenuExpanded(false)}
        >
          <div className="flex flex-col gap-1">
            {TOPBAR_LINKS.map((link) => (
              <NavLink key={link.href} link={link} onClick={handleNavClick} />
            ))}
            <FaqNavLink onClick={handleNavClick} />
          </div>

          <div className="mt-2 flex flex-row gap-2 border-t border-border/30 pt-4">
            <div className="flex-1">
              <LanguageSelector
                mobile
                mobileMenuInteractionGuardAttribute={MOBILE_MENU_INTERACTION_GUARD_ATTRIBUTE}
              />
            </div>
            <div className="flex-1">
              <ThemeToggle mobile />
            </div>
          </div>
        </MobileMenu>
      </div>
    </m.nav>
  );
}

export function TopbarSpacer({ className }: { className?: string }) {
  return <div className={cn("h-[4.75rem] shrink-0", className)} aria-hidden="true" />;
}
