import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, Globe, LayoutGrid, Monitor, Search, Smartphone, X } from "lucide-react";
import AppCard from "@/components/app-card";
import AppsDevsCta from "@/components/apps-devs-cta";
import AppsGithubTopicCta from "@/components/apps-github-topic-cta";
import AppTagPill from "@/components/app-tag-pill";
import CardInlineCta, { highlightedCtaClassName } from "@/components/card-inline-cta";
import CategoryFilter from "@/components/category-filter";
import Footer from "@/components/footer";
import Topbar from "@/components/topbar";
import {
  APPS,
  CATEGORIES,
  PLATFORM_ORDER,
  appMatchesPlatform,
  appMatchesSearch,
  appMatchesTag,
  getAppTagLabel,
  getCategoryDescription,
  getCategoryLabel,
  getPlatformShortLabel,
  parseTagFilter,
  serializeTagFilter,
  tagsMatchFilter,
  toggleTagInList,
  type AppCategorySlug,
  type AppPlatformSlug,
} from "@/lib/apps-data";
import { SUBMIT_APP_URL } from "@/lib/apps-urls";
import { useGraphicsMode } from "@/lib/graphics-mode";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

/** Cap on simultaneously active tag + category + platform filters. Mobile drops to 2
 *  because three chips don't fit inside the search bar at narrow widths. */
const MAX_FILTER_COUNT_DESKTOP = 3;
const MAX_FILTER_COUNT_MOBILE = 2;
const MOBILE_QUERY = "(max-width: 639px)";

function isValidCategory(value: string | null): value is AppCategorySlug {
  return value !== null && CATEGORIES.some((category) => category.slug === value);
}

function isValidPlatform(value: string | null): value is AppPlatformSlug {
  return value !== null && PLATFORM_ORDER.includes(value as AppPlatformSlug);
}

const platformIconMap = {
  android: Smartphone,
  desktop: Monitor,
  ios: Smartphone,
  web: Globe,
} as const;

function isFirefoxLikeBrowser() {
  return typeof navigator !== "undefined" && /\bFirefox\//i.test(navigator.userAgent);
}

function buildAppsHref(
  currentSearchParams: URLSearchParams,
  updates: Record<string, string | null>,
  options?: { clearAll?: boolean },
) {
  const nextSearchParams = options?.clearAll
    ? new URLSearchParams()
    : new URLSearchParams(currentSearchParams);

  Object.entries(updates).forEach(([key, value]) => {
    if (key === "tag" && value && value.trim().length > 0) {
      const nextTags = toggleTagInList(parseTagFilter(nextSearchParams.get("tag")), value);
      const serialized = serializeTagFilter(nextTags);
      if (serialized) {
        nextSearchParams.set("tag", serialized);
      } else {
        nextSearchParams.delete("tag");
      }
      return;
    }

    if (value && value.trim().length > 0) {
      nextSearchParams.set(key, value);
    } else {
      nextSearchParams.delete(key);
    }
  });

  const query = nextSearchParams.toString();
  return query ? `/apps?${query}` : "/apps";
}

export default function Apps() {
  const { t } = useTranslation();
  const graphicsMode = useGraphicsMode();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const maxFilterCount = isMobile ? MAX_FILTER_COUNT_MOBILE : MAX_FILTER_COUNT_DESKTOP;
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const platformParam = searchParams.get("platform");
  const tagParam = searchParams.get("tag");
  const normalizedCategoryParam = categoryParam?.trim().toLowerCase() ?? null;
  const normalizedPlatformParam = platformParam?.trim().toLowerCase() ?? null;
  const activeCategory = isValidCategory(normalizedCategoryParam) ? normalizedCategoryParam : null;
  const activePlatform = isValidPlatform(normalizedPlatformParam) ? normalizedPlatformParam : null;
  // Enforce the filter cap across category + platform + tags. If the URL specifies more
  // filters than the cap allows, drop excess tags first (they're the variable-length axis)
  // so the page still loads but only the first N apply.
  const baseFilterCount = (activeCategory ? 1 : 0) + (activePlatform ? 1 : 0);
  const maxTagsAllowed = Math.max(0, maxFilterCount - baseFilterCount);
  const activeTags = parseTagFilter(tagParam).slice(0, maxTagsAllowed);
  const query = searchParams.get("q") ?? "";

  const searchFilteredApps = APPS.filter((app) => appMatchesSearch(app, query, t)).filter((app) =>
    appMatchesTag(app, activeTags),
  );
  const appsForCategoryCounts = activePlatform
    ? searchFilteredApps.filter((app) => appMatchesPlatform(app, activePlatform))
    : searchFilteredApps;
  const appsForPlatformCounts = activeCategory
    ? searchFilteredApps.filter((app) => app.category === activeCategory)
    : searchFilteredApps;

  const categorySummaries = CATEGORIES.map((category) => ({
    ...category,
    label: getCategoryLabel(category, t),
    description: getCategoryDescription(category, t),
    count: appsForCategoryCounts.filter((app) => app.category === category.slug).length,
  })).filter((category) => category.count > 0 || category.slug === activeCategory);

  const platformSummaries = PLATFORM_ORDER.map((platform) => ({
    slug: platform,
    count: appsForPlatformCounts.filter((app) => appMatchesPlatform(app, platform)).length,
  })).filter((platform) => platform.count > 0 || platform.slug === activePlatform);

  const filteredApps = searchFilteredApps
    .filter((app) => (activeCategory ? app.category === activeCategory : true))
    .filter((app) => (activePlatform ? appMatchesPlatform(app, activePlatform) : true))
    .sort((left, right) => {
      if (left.featured !== right.featured) {
        return left.featured ? -1 : 1;
      }

      return left.name.localeCompare(right.name);
    });

  const isFiltered = Boolean(query || activePlatform || activeCategory || activeTags.length > 0);
  const isAtFilterCap = baseFilterCount + activeTags.length >= maxFilterCount;
  const useSimplifiedSurfaces = graphicsMode === "fallback" || isFirefoxLikeBrowser();

  function updateSearchParams(updates: Record<string, string | null>) {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value.trim().length > 0) {
        nextParams.set(key, value);
      } else {
        nextParams.delete(key);
      }
    });

    setSearchParams(nextParams, { replace: true });
  }

  function handleCategoryChange(category: AppCategorySlug | null) {
    // Adding a category (none currently set) at cap would exceed the limit.
    if (category && !activeCategory && isAtFilterCap) return;
    updateSearchParams({ category });
  }

  function handlePlatformChange(platform: AppPlatformSlug | null) {
    // Adding a platform (none currently set) at cap would exceed the limit.
    if (platform && !activePlatform && isAtFilterCap) return;
    updateSearchParams({ platform });
  }

  function handleTagSelect(tag: string) {
    // Removing an active tag is always allowed; only block fresh adds at cap.
    if (!tagsMatchFilter(activeTags, tag) && isAtFilterCap) return;
    // Toggle against the full URL tag list (not the cap-truncated `activeTags`)
    // so tags that were silently excluded by the cap aren't lost when the user
    // removes one of the visible chips. Mirrors the noscript path in `buildAppsHref`.
    const allCurrentTags = parseTagFilter(searchParams.get("tag"));
    updateSearchParams({ tag: serializeTagFilter(toggleTagInList(allCurrentTags, tag)) });
  }

  function clearFilters() {
    setSearchParams({}, { replace: true });
  }

  const clearFiltersHref = buildAppsHref(
    searchParams,
    { q: null, category: null, platform: null, tag: null },
    { clearAll: true },
  );

  const buildCardFilterHref = (
    updates: Partial<Record<"category" | "platform" | "tag", string | null>>,
  ) => {
    const nextUpdates: Record<string, string | null> = {};

    if ("category" in updates) {
      nextUpdates.category = updates.category ?? null;
    }

    if ("platform" in updates) {
      nextUpdates.platform = updates.platform ?? null;
    }

    if ("tag" in updates) {
      nextUpdates.tag = updates.tag ?? null;
    }

    return buildAppsHref(searchParams, nextUpdates);
  };

  return (
    <div
      className="apps-page min-h-screen overflow-x-hidden"
      data-surface-mode={useSimplifiedSurfaces ? "simplified" : "default"}
    >
      <noscript>
        <style>
          {`.apps-js-controls,.apps-js-sidebar,.apps-js-results{display:none!important;}`}
        </style>
      </noscript>
      <Topbar />
      <main className="px-4 pb-16 pt-28 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <section className="mb-6">
            <p className="text-xs font-display uppercase tracking-[0.2em] text-foreground/45">
              {t("apps.sectionLabel")}
            </p>
            <div className="mt-4 max-w-2xl">
              <h1 className="optical-display-start text-4xl font-display font-semibold leading-[1.1] text-balance text-muted-foreground md:text-6xl lg:text-7xl">
                {t("apps.title")}
              </h1>
              <p className="mt-3 max-w-2xl text-base md:text-lg text-balance leading-relaxed text-muted-foreground">
                {t("apps.subtitle")}
              </p>
            </div>
          </section>

          <section className="apps-js-controls glass-card mb-6 p-4 md:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
              <div className="flex h-12 flex-1 items-center gap-1.5 rounded-full border border-border/70 bg-background/70 pl-4 pr-1.5 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => updateSearchParams({ q: event.target.value || null })}
                  placeholder={t("apps.searchPlaceholder")}
                  className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/80"
                  aria-label={t("apps.searchPlaceholder")}
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => updateSearchParams({ q: null })}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                    aria-label={t("apps.clearSearch")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
                {activeTags.map((tag) => (
                  <AppTagPill
                    key={tag}
                    active
                    label={getAppTagLabel(tag, t)}
                    onClick={() => handleTagSelect(tag)}
                  />
                ))}
                {activePlatform ? (
                  <AppTagPill
                    active
                    label={getPlatformShortLabel(activePlatform, t)}
                    onClick={() => handlePlatformChange(null)}
                  />
                ) : null}
                {activeCategory ? (
                  <AppTagPill
                    active
                    label={
                      CATEGORIES.find((category) => category.slug === activeCategory)
                        ? getCategoryLabel(activeCategory, t)
                        : activeCategory
                    }
                    onClick={() => handleCategoryChange(null)}
                  />
                ) : null}
                {isFiltered ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    aria-label={t("apps.clearFilters")}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/70 px-3 py-1 text-xs font-semibold text-foreground/80 transition-all duration-300 hover:border-blue-glow hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{t("apps.clearFilters")}</span>
                  </button>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {platformSummaries.map((platform) => {
                  const Icon = platformIconMap[platform.slug];
                  const active = activePlatform === platform.slug;
                  const disabled = isAtFilterCap && !active && !activePlatform;
                  const baseClass = cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm",
                    active
                      ? "border-blue-core/30 text-foreground ring-glow shadow-[0_0_24px_rgba(37,99,235,0.12)] dark:border-blue-core/55"
                      : "border-border/70 text-foreground/80 hover:border-blue-glow hover:text-foreground",
                    disabled &&
                      "cursor-not-allowed opacity-40 hover:!border-border/70 hover:!text-foreground/80",
                  );
                  const inner = (
                    <>
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span>{getPlatformShortLabel(platform.slug, t)}</span>
                      <span
                        className={cn(
                          "hidden rounded-full border px-2 py-0.5 text-[11px] sm:inline",
                          active
                            ? "border-blue-core/20 text-foreground"
                            : "border-border/60 text-foreground/65",
                        )}
                      >
                        {platform.count}
                      </span>
                    </>
                  );

                  if (disabled) {
                    return (
                      <span
                        key={platform.slug}
                        className={baseClass}
                        aria-disabled="true"
                        title={t("apps.filterLimitReached", {
                          defaultValue: "Filter limit reached",
                        })}
                      >
                        {inner}
                      </span>
                    );
                  }

                  return (
                    <button
                      key={platform.slug}
                      type="button"
                      onClick={() => handlePlatformChange(active ? null : platform.slug)}
                      className={baseClass}
                    >
                      {inner}
                    </button>
                  );
                })}
              </div>

              <CardInlineCta
                href={SUBMIT_APP_URL}
                className={`apps-frosted-cta apps-frosted-cta-highlighted ${highlightedCtaClassName} hidden !px-6 !py-3 text-sm md:inline-flex`}
              >
                {t("apps.submitApp")}
              </CardInlineCta>
            </div>
          </section>

          <noscript>
            <section className="glass-card mb-6 p-4 md:p-5">
              <form
                action="/apps"
                method="get"
                className="flex flex-col gap-4 xl:flex-row xl:items-center"
              >
                {activeCategory ? (
                  <input type="hidden" name="category" value={activeCategory} />
                ) : null}
                {activePlatform ? (
                  <input type="hidden" name="platform" value={activePlatform} />
                ) : null}
                {tagParam && tagParam.trim().length > 0 ? (
                  <input type="hidden" name="tag" value={tagParam} />
                ) : null}
                <div className="flex h-12 flex-1 items-center gap-1.5 rounded-full border border-border/70 bg-background/70 pl-4 pr-1.5 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <input
                    type="search"
                    name="q"
                    defaultValue={query}
                    placeholder={t("apps.searchPlaceholder")}
                    className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/80"
                    aria-label={t("apps.searchPlaceholder")}
                  />
                  {query ? (
                    <a
                      href={buildAppsHref(searchParams, { q: null })}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                      aria-label={t("apps.clearSearch")}
                    >
                      <X className="h-4 w-4" />
                    </a>
                  ) : null}
                  {activeTags.map((tag) => (
                    <AppTagPill
                      key={tag}
                      active
                      href={buildAppsHref(searchParams, { tag })}
                      label={getAppTagLabel(tag, t)}
                    />
                  ))}
                  {activePlatform ? (
                    <AppTagPill
                      active
                      href={buildAppsHref(searchParams, { platform: null })}
                      label={getPlatformShortLabel(activePlatform, t)}
                    />
                  ) : null}
                  {activeCategory ? (
                    <AppTagPill
                      active
                      href={buildAppsHref(searchParams, { category: null })}
                      label={
                        CATEGORIES.find((category) => category.slug === activeCategory)
                          ? getCategoryLabel(activeCategory, t)
                          : activeCategory
                      }
                    />
                  ) : null}
                  {isFiltered ? (
                    <a
                      href={clearFiltersHref}
                      aria-label={t("apps.clearFilters")}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/70 px-3 py-1 text-xs font-semibold text-foreground/80 transition-all duration-300 hover:border-blue-glow hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{t("apps.clearFilters")}</span>
                    </a>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {platformSummaries.map((platform) => {
                    const Icon = platformIconMap[platform.slug];
                    const active = activePlatform === platform.slug;

                    return (
                      <a
                        key={platform.slug}
                        href={buildAppsHref(searchParams, {
                          platform: active ? null : platform.slug,
                        })}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm",
                          active
                            ? "border-blue-core/30 text-foreground ring-glow shadow-[0_0_24px_rgba(37,99,235,0.12)] dark:border-blue-core/55"
                            : "border-border/70 text-foreground/80 hover:border-blue-glow hover:text-foreground",
                        )}
                      >
                        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span>{getPlatformShortLabel(platform.slug, t)}</span>
                        <span
                          className={cn(
                            "hidden rounded-full border px-2 py-0.5 text-[11px] sm:inline",
                            active
                              ? "border-blue-core/20 text-foreground"
                              : "border-border/60 text-foreground/65",
                          )}
                        >
                          {platform.count}
                        </span>
                      </a>
                    );
                  })}
                </div>

                <button
                  type="submit"
                  className={`apps-frosted-cta apps-frosted-cta-highlighted ${highlightedCtaClassName} !px-6 !py-3 text-sm`}
                >
                  {t("apps.searchPlaceholder")}
                </button>

                <CardInlineCta
                  href={SUBMIT_APP_URL}
                  className={`apps-frosted-cta apps-frosted-cta-highlighted ${highlightedCtaClassName} hidden !px-6 !py-3 text-sm md:inline-flex`}
                >
                  {t("apps.submitApp")}
                </CardInlineCta>
              </form>
            </section>
          </noscript>

          <AppsDevsCta />
          <AppsGithubTopicCta />

          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="apps-js-sidebar">
              {/* Mobile: collapsed under a disclosure to save vertical space. */}
              <details className="apps-mobile-categories group glass-card overflow-hidden lg:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-xs font-display font-semibold uppercase tracking-[0.2em] text-foreground/55 [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center gap-2">
                    <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{t("apps.directoryLabel")}</span>
                  </span>
                  <ChevronDown
                    className="h-4 w-4 transition-transform duration-200 motion-reduce:transition-none motion-reduce:duration-0 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="border-t border-border/40 p-3">
                  <CategoryFilter
                    categories={categorySummaries}
                    activeCategory={activeCategory}
                    onCategoryChange={handleCategoryChange}
                    allLabel={t("apps.allProjects")}
                    allDescription={t("apps.allProjectsDescription")}
                    directoryLabel={t("apps.directoryLabel")}
                    hideHeader
                    isAtFilterCap={isAtFilterCap}
                    totalCount={appsForCategoryCounts.length}
                  />
                </div>
              </details>
              {/* Desktop: always shown as the sticky sidebar. */}
              <div className="hidden lg:block">
                <CategoryFilter
                  categories={categorySummaries}
                  activeCategory={activeCategory}
                  onCategoryChange={handleCategoryChange}
                  allLabel={t("apps.allProjects")}
                  allDescription={t("apps.allProjectsDescription")}
                  directoryLabel={t("apps.directoryLabel")}
                  isAtFilterCap={isAtFilterCap}
                  totalCount={appsForCategoryCounts.length}
                />
              </div>
            </div>

            <noscript>
              <details className="apps-mobile-categories group glass-card overflow-hidden lg:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-xs font-display font-semibold uppercase tracking-[0.2em] text-foreground/55 [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center gap-2">
                    <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{t("apps.directoryLabel")}</span>
                  </span>
                  <ChevronDown
                    className="h-4 w-4 transition-transform duration-200 motion-reduce:transition-none motion-reduce:duration-0 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="border-t border-border/40 p-3">
                  <CategoryFilter
                    categories={categorySummaries}
                    activeCategory={activeCategory}
                    allLabel={t("apps.allProjects")}
                    allDescription={t("apps.allProjectsDescription")}
                    directoryLabel={t("apps.directoryLabel")}
                    getCategoryHref={(category) => buildAppsHref(searchParams, { category })}
                    hideHeader
                    isAtFilterCap={isAtFilterCap}
                    totalCount={appsForCategoryCounts.length}
                  />
                </div>
              </details>
              <div className="hidden lg:block">
                <CategoryFilter
                  categories={categorySummaries}
                  activeCategory={activeCategory}
                  allLabel={t("apps.allProjects")}
                  allDescription={t("apps.allProjectsDescription")}
                  directoryLabel={t("apps.directoryLabel")}
                  getCategoryHref={(category) => buildAppsHref(searchParams, { category })}
                  isAtFilterCap={isAtFilterCap}
                  totalCount={appsForCategoryCounts.length}
                />
              </div>
            </noscript>

            <div className="apps-js-results">
              {filteredApps.length === 0 ? (
                <div className="glass-card flex min-h-[24rem] flex-col items-center justify-center text-center">
                  <p className="text-2xl font-display text-foreground/75">{t("apps.noMatches")}</p>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                    {t("apps.noMatchesDescription")}
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className={`${highlightedCtaClassName} mt-6 !px-5 !py-2 text-sm`}
                  >
                    {t("apps.clearFilters")}
                  </button>
                </div>
              ) : (
                <div className="grid gap-5 xl:grid-cols-2">
                  {filteredApps.map((app) => (
                    <AppCard
                      key={app.slug}
                      activeCategory={activeCategory}
                      activePlatform={activePlatform}
                      activeTags={activeTags}
                      app={app}
                      isAtFilterCap={isAtFilterCap}
                      onCategorySelect={(slug) => handleCategoryChange(slug)}
                      onPlatformSelect={(platform) => handlePlatformChange(platform)}
                      onTagSelect={handleTagSelect}
                      preferredPlatform={activePlatform}
                    />
                  ))}
                </div>
              )}
            </div>

            <noscript>
              <div>
                {filteredApps.length === 0 ? (
                  <div className="glass-card flex min-h-[24rem] flex-col items-center justify-center text-center">
                    <p className="text-2xl font-display text-foreground/75">
                      {t("apps.noMatches")}
                    </p>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                      {t("apps.noMatchesDescription")}
                    </p>
                    <a
                      href={clearFiltersHref}
                      className={`${highlightedCtaClassName} mt-6 inline-flex !px-5 !py-2 text-sm`}
                    >
                      {t("apps.clearFilters")}
                    </a>
                  </div>
                ) : (
                  <div className="grid gap-5 xl:grid-cols-2">
                    {filteredApps.map((app) => (
                      <AppCard
                        key={app.slug}
                        activeCategory={activeCategory}
                        activePlatform={activePlatform}
                        activeTags={activeTags}
                        app={app}
                        buildAppsHref={buildCardFilterHref}
                        detailHref={`/apps/${app.slug}`}
                        isAtFilterCap={isAtFilterCap}
                        preferredPlatform={activePlatform}
                      />
                    ))}
                  </div>
                )}
              </div>
            </noscript>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
