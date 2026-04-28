import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { Globe, Monitor, Search, Smartphone, X } from "lucide-react";
import AppCard from "@/components/app-card";
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
  tagsMatchFilter,
  type AppCategorySlug,
  type AppPlatformSlug,
} from "@/lib/apps-data";
import { useGraphicsMode } from "@/lib/graphics-mode";
import { cn } from "@/lib/utils";

const SUBMIT_APP_URL =
  "https://github.com/bitsocialnet/bitsocial-web/issues/new?title=%5BApp+Submission%5D+&labels=app-submission&template=app-submission.md";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const platformParam = searchParams.get("platform");
  const tagParam = searchParams.get("tag");
  const normalizedCategoryParam = categoryParam?.trim().toLowerCase() ?? null;
  const normalizedPlatformParam = platformParam?.trim().toLowerCase() ?? null;
  const activeCategory = isValidCategory(normalizedCategoryParam) ? normalizedCategoryParam : null;
  const activePlatform = isValidPlatform(normalizedPlatformParam) ? normalizedPlatformParam : null;
  const activeTag = tagParam && tagParam.trim().length > 0 ? tagParam.trim() : null;
  const query = searchParams.get("q") ?? "";

  const searchFilteredApps = APPS.filter((app) => appMatchesSearch(app, query, t)).filter((app) =>
    appMatchesTag(app, activeTag),
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

  const isFiltered = Boolean(query || activePlatform || activeCategory || activeTag);
  const useSimplifiedSurfaces = graphicsMode !== "full" || isFirefoxLikeBrowser();

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
    updateSearchParams({ category });
  }

  function handlePlatformChange(platform: AppPlatformSlug | null) {
    updateSearchParams({ platform });
  }

  function handleTagSelect(tag: string) {
    updateSearchParams({
      tag: tagsMatchFilter(activeTag, tag) ? null : tag,
    });
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
      nextUpdates.tag =
        updates.tag && tagsMatchFilter(activeTag, updates.tag) ? null : (updates.tag ?? null);
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
          {`.apps-js-header-filters,.apps-js-controls,.apps-js-sidebar,.apps-js-results{display:none!important;}`}
        </style>
      </noscript>
      <Topbar />
      <main className="px-4 pb-16 pt-28 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <section className="mb-6">
            <p className="text-xs font-display uppercase tracking-[0.2em] text-foreground/45">
              {t("apps.sectionLabel")}
            </p>
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h1 className="optical-display-start text-4xl font-display font-semibold leading-[1.1] text-balance text-muted-foreground md:text-6xl lg:text-7xl">
                  {t("apps.title")}
                </h1>
                <p className="mt-3 max-w-2xl text-base md:text-lg text-balance leading-relaxed text-muted-foreground">
                  {t("apps.subtitle")}
                </p>
              </div>

              <div className="apps-js-header-filters flex flex-wrap items-center gap-2">
                {activeTag ? (
                  <AppTagPill
                    active
                    label={getAppTagLabel(activeTag, t)}
                    onClick={() => handleTagSelect(activeTag)}
                  />
                ) : null}
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
                    className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-sm font-semibold text-foreground/80 transition-all duration-300 hover:border-blue-glow hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                    <span>{t("apps.clearFilters")}</span>
                  </button>
                ) : null}
              </div>

              <noscript>
                <div className="flex flex-wrap items-center gap-2">
                  {activeTag ? (
                    <AppTagPill
                      active
                      href={buildAppsHref(searchParams, { tag: null })}
                      label={getAppTagLabel(activeTag, t)}
                    />
                  ) : null}
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
                      className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-sm font-semibold text-foreground/80 transition-all duration-300 hover:border-blue-glow hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                      <span>{t("apps.clearFilters")}</span>
                    </a>
                  ) : null}
                </div>
              </noscript>
            </div>
          </section>

          <section className="apps-js-controls glass-card mb-6 p-4 md:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
              <label className="relative block flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => updateSearchParams({ q: event.target.value || null })}
                  placeholder={t("apps.searchPlaceholder")}
                  className="h-12 w-full rounded-full border border-border/70 bg-background/70 px-11 pr-11 text-sm text-foreground shadow-[0_12px_28px_rgba(15,23,42,0.05)] placeholder:text-muted-foreground/80"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => updateSearchParams({ q: null })}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                    aria-label={t("apps.clearSearch")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </label>

              <div className="flex flex-wrap gap-2">
                {platformSummaries.map((platform) => {
                  const Icon = platformIconMap[platform.slug];
                  const active = activePlatform === platform.slug;

                  return (
                    <button
                      key={platform.slug}
                      type="button"
                      onClick={() => handlePlatformChange(active ? null : platform.slug)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300",
                        active
                          ? "border-blue-core/30 text-foreground ring-glow shadow-[0_0_24px_rgba(37,99,235,0.12)] dark:border-blue-core/55"
                          : "border-border/70 text-foreground/80 hover:border-blue-glow hover:text-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{getPlatformShortLabel(platform.slug, t)}</span>
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[11px]",
                          active
                            ? "border-blue-core/20 text-foreground"
                            : "border-border/60 text-foreground/65",
                        )}
                      >
                        {platform.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <CardInlineCta
                href={SUBMIT_APP_URL}
                className={`apps-frosted-cta apps-frosted-cta-highlighted ${highlightedCtaClassName} !px-6 !py-3 text-sm`}
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
                {activeTag ? <input type="hidden" name="tag" value={activeTag} /> : null}
                <label className="relative block flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    name="q"
                    defaultValue={query}
                    placeholder={t("apps.searchPlaceholder")}
                    className="h-12 w-full rounded-full border border-border/70 bg-background/70 px-11 pr-11 text-sm text-foreground shadow-[0_12px_28px_rgba(15,23,42,0.05)] placeholder:text-muted-foreground/80"
                  />
                  {query ? (
                    <a
                      href={buildAppsHref(searchParams, { q: null })}
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                      aria-label={t("apps.clearSearch")}
                    >
                      <X className="h-4 w-4" />
                    </a>
                  ) : null}
                </label>

                <div className="flex flex-wrap gap-2">
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
                          "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300",
                          active
                            ? "border-blue-core/30 text-foreground ring-glow shadow-[0_0_24px_rgba(37,99,235,0.12)] dark:border-blue-core/55"
                            : "border-border/70 text-foreground/80 hover:border-blue-glow hover:text-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{getPlatformShortLabel(platform.slug, t)}</span>
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[11px]",
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
                  className={`apps-frosted-cta apps-frosted-cta-highlighted ${highlightedCtaClassName} !px-6 !py-3 text-sm`}
                >
                  {t("apps.submitApp")}
                </CardInlineCta>
              </form>
            </section>
          </noscript>

          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="apps-js-sidebar">
              <CategoryFilter
                categories={categorySummaries}
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
                allLabel={t("apps.allProjects")}
                allDescription={t("apps.allProjectsDescription")}
                directoryLabel={t("apps.directoryLabel")}
                totalCount={appsForCategoryCounts.length}
              />
            </div>

            <noscript>
              <CategoryFilter
                categories={categorySummaries}
                activeCategory={activeCategory}
                allLabel={t("apps.allProjects")}
                allDescription={t("apps.allProjectsDescription")}
                directoryLabel={t("apps.directoryLabel")}
                getCategoryHref={(category) => buildAppsHref(searchParams, { category })}
                totalCount={appsForCategoryCounts.length}
              />
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
                      activeTag={activeTag}
                      app={app}
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
                        activeTag={activeTag}
                        app={app}
                        buildAppsHref={buildCardFilterHref}
                        detailHref={`/apps/${app.slug}`}
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
