import { useCallback, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowUpRight, Mail, Radio, Search, X } from "lucide-react";
import { useCommunity, useFeed } from "@bitsocial/bitsocial-react-hooks";
import AppTagPill from "@/components/app-tag-pill";
import BlogP2PModal from "@/components/blog-p2p-modal";
import BlogPostCard from "@/components/blog-post-card";
import { highlightedCtaClassName } from "@/components/card-inline-cta";
import Footer from "@/components/footer";
import Topbar from "@/components/topbar";
import { goToMailingListSection } from "@/lib/mailing-list-nav";
import {
  BLOG_COMMUNITY_ADDRESS,
  BLOG_COMMUNITY_PUBLIC_KEY,
  type BlogFlair,
} from "@/lib/blog-community";
import { useBlogLoadingState } from "@/lib/blog-state-string";
import { useBrowserPureP2PAccountUpgrade } from "@/lib/use-browser-pure-p2p-account-upgrade";
import { cn } from "@/lib/utils";

function buildBlogHref(currentParams: URLSearchParams, updates: Record<string, string | null>) {
  const next = new URLSearchParams(currentParams);
  Object.entries(updates).forEach(([key, value]) => {
    if (value && value.trim().length > 0) next.set(key, value);
    else next.delete(key);
  });
  const query = next.toString();
  return query ? `/blog?${query}` : "/blog";
}

interface FeedPostLike {
  cid?: string;
  timestamp?: number;
  title?: string;
  content?: string;
  author?: { displayName?: string; address?: string };
  flair?: BlogFlair;
  flairs?: BlogFlair[];
}

function getPostFlairText(post: FeedPostLike): string | null {
  const flair = post.flair ?? post.flairs?.[0];
  return flair?.text ?? null;
}

function postMatchesQuery(post: FeedPostLike, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return [
    post.title,
    post.content,
    post.author?.displayName,
    post.author?.address,
    getPostFlairText(post),
  ].some((value) => value && value.toLowerCase().includes(q));
}

function postMatchesFlair(post: FeedPostLike, flair: string | null): boolean {
  if (!flair) return true;
  const postFlair = getPostFlairText(post);
  return Boolean(postFlair && postFlair.toLowerCase() === flair.toLowerCase());
}

const ADDRESS_CLASSNAME = "italic font-medium text-foreground/80";

export default function Blog() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const activeFlair = searchParams.get("tag");
  const [p2pModalOpen, setP2pModalOpen] = useState(false);
  useBrowserPureP2PAccountUpgrade();

  // CommunityIdentifier: pass both name and publicKey so hooks can resolve
  // even when the .bso address hasn't propagated through name routers yet.
  const communityIdentifier = useMemo(
    () => ({ name: BLOG_COMMUNITY_ADDRESS, publicKey: BLOG_COMMUNITY_PUBLIC_KEY }),
    [],
  );
  const community = useCommunity({ community: communityIdentifier }) as {
    state?: string;
    updatingState?: string;
    flairs?: { post?: BlogFlair[] };
    rules?: string[];
  };
  const feedOptions = useMemo(
    () => ({
      communities: [communityIdentifier],
      sortType: "new" as const,
      postsPerPage: 25,
    }),
    [communityIdentifier],
  );
  const { feed, hasMore, loadMore, state: feedLifecycleState } = useFeed(feedOptions);
  const loadingState = useBlogLoadingState(community);

  const posts = (feed ?? []) as FeedPostLike[];
  const flairs = community.flairs?.post ?? [];
  const flairCounts = new Map<string, number>();
  for (const post of posts) {
    const flair = getPostFlairText(post);
    if (flair) flairCounts.set(flair, (flairCounts.get(flair) ?? 0) + 1);
  }

  const filteredPosts = posts.filter(
    (post) => postMatchesQuery(post, query) && postMatchesFlair(post, activeFlair),
  );

  const isFiltered = Boolean(query || activeFlair);
  const isFeedReady = feedLifecycleState === "succeeded" || posts.length > 0;
  const isInitialLoad = !isFeedReady && posts.length === 0;

  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value && value.trim().length > 0) next.set(key, value);
        else next.delete(key);
      });
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const handleFlairSelect = useCallback(
    (flair: string) => {
      const isActive = activeFlair?.toLowerCase() === flair.toLowerCase();
      updateSearchParams({ tag: isActive ? null : flair });
    },
    [activeFlair, updateSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const handleNewsletterClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      goToMailingListSection(location.pathname, location.hash, navigate);
    },
    [navigate],
  );

  return (
    <div className="blog-page min-h-screen overflow-x-hidden">
      <Topbar />
      <main className="px-4 pb-16 pt-28 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <section className="mb-6">
            <p className="text-xs font-display uppercase tracking-[0.2em] text-foreground/45">
              {t("blog.sectionLabel")}
            </p>
            <div className="mt-4 max-w-2xl">
              <h1 className="optical-display-start text-4xl font-display font-semibold leading-[1.1] text-balance text-muted-foreground md:text-6xl lg:text-7xl">
                {t("blog.title")}
              </h1>
              <p className="mt-3 max-w-2xl text-base md:text-lg text-balance leading-relaxed text-muted-foreground">
                <Trans
                  i18nKey="blog.subtitle"
                  values={{ address: BLOG_COMMUNITY_ADDRESS }}
                  components={{
                    devs: (
                      <Link
                        to="/about"
                        className="font-medium text-foreground/85 underline decoration-blue-glow/40 decoration-2 underline-offset-4 transition-colors hover:text-foreground hover:decoration-blue-glow"
                      />
                    ),
                    address: <em className={ADDRESS_CLASSNAME} />,
                  }}
                />
              </p>
            </div>
          </section>

          <section className="glass-card mb-6 p-4 md:p-5">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-11 min-w-0 flex-1 items-center gap-1.5 rounded-full border border-border/70 bg-background/70 pl-3 pr-1.5 shadow-[0_12px_28px_rgba(15,23,42,0.05)] sm:h-12 sm:pl-4">
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => updateSearchParams({ q: event.target.value || null })}
                    placeholder={t("blog.searchPlaceholder")}
                    className="apps-search-input min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/80"
                    aria-label={t("blog.searchPlaceholder")}
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={() => updateSearchParams({ q: null })}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                      aria-label={t("blog.clearSearch")}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
                  {activeFlair ? (
                    <AppTagPill
                      active
                      label={activeFlair}
                      onClick={() => handleFlairSelect(activeFlair)}
                    />
                  ) : null}
                  {isFiltered ? (
                    <button
                      type="button"
                      onClick={clearFilters}
                      aria-label={t("blog.clearFilters")}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/70 px-3 py-1 text-xs font-semibold text-foreground/80 transition-all duration-300 hover:border-blue-glow hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{t("blog.clearFilters")}</span>
                    </button>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => setP2pModalOpen(true)}
                  className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-full border border-border/70 px-3 text-sm font-semibold text-foreground/80 transition-all duration-300 hover:border-blue-glow hover:text-foreground sm:h-12 sm:gap-2 sm:px-4"
                  aria-label={t("blog.p2p.button")}
                >
                  <Radio className="h-4 w-4" />
                  <span className="sm:hidden">P2P</span>
                  <span className="hidden sm:inline">{t("blog.p2p.button")}</span>
                </button>
              </div>

              {flairs.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {flairs.map((flair) => {
                    const isActive = activeFlair?.toLowerCase() === flair.text.toLowerCase();
                    const count = flairCounts.get(flair.text) ?? 0;
                    return (
                      <button
                        key={flair.text}
                        type="button"
                        onClick={() => handleFlairSelect(flair.text)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm",
                          isActive
                            ? "border-blue-core/30 text-foreground ring-glow shadow-[0_0_24px_rgba(37,99,235,0.12)] dark:border-blue-core/55"
                            : "border-border/70 text-foreground/80 hover:border-blue-glow hover:text-foreground",
                        )}
                      >
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: flair.backgroundColor ?? "rgb(37,99,235)" }}
                          aria-hidden="true"
                        />
                        <span>{flair.text}</span>
                        <span
                          className={cn(
                            "hidden rounded-full border px-2 py-0.5 text-[11px] sm:inline",
                            isActive
                              ? "border-blue-core/20 text-foreground"
                              : "border-border/60 text-foreground/65",
                          )}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </section>

          {loadingState ? (
            <div
              className="mb-4 flex items-center gap-3 rounded-full border border-blue-core/20 bg-blue-core/[0.06] px-4 py-2 text-xs text-foreground/75"
              role="status"
              aria-live="polite"
            >
              <span
                className="relative inline-flex h-2 w-2 items-center justify-center"
                aria-hidden="true"
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-core opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-core" />
              </span>
              <span>{loadingState}</span>
            </div>
          ) : null}

          {isInitialLoad ? (
            <div className="space-y-5">
              {["skeleton-a", "skeleton-b", "skeleton-c"].map((skeletonId) => (
                <div
                  key={skeletonId}
                  aria-hidden="true"
                  className="glass-card animate-pulse space-y-4 p-5 md:p-6"
                >
                  <div className="h-3 w-32 rounded-full bg-foreground/10" />
                  <div className="h-6 w-3/4 rounded-full bg-foreground/15" />
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded-full bg-foreground/10" />
                    <div className="h-3 w-5/6 rounded-full bg-foreground/10" />
                    <div className="h-3 w-2/3 rounded-full bg-foreground/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="glass-card flex min-h-[16rem] flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-2xl font-display text-foreground/75">
                {isFiltered ? t("blog.noMatches") : t("blog.noPosts")}
              </p>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                {isFiltered ? (
                  t("blog.noMatchesDescription")
                ) : (
                  <Trans
                    i18nKey="blog.noPostsDescription"
                    values={{ address: BLOG_COMMUNITY_ADDRESS }}
                    components={{ address: <em className={ADDRESS_CLASSNAME} /> }}
                  />
                )}
              </p>
              {isFiltered ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className={`${highlightedCtaClassName} mt-2 !px-5 !py-2 text-sm`}
                >
                  {t("blog.clearFilters")}
                </button>
              ) : (
                <a
                  href="/#mailing-list"
                  onClick={handleNewsletterClick}
                  className={`${highlightedCtaClassName} mt-2 !px-5 !py-2 text-sm`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{t("blog.subscribeNewsletter")}</span>
                  </span>
                </a>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-5">
                {filteredPosts.map((post) => (
                  <BlogPostCard
                    key={post.cid ?? `${post.timestamp ?? "post"}-${post.title ?? ""}`}
                    post={post}
                    activeFlair={activeFlair}
                    onFlairSelect={handleFlairSelect}
                    buildFlairHref={(flair) => buildBlogHref(searchParams, { tag: flair })}
                  />
                ))}
              </div>

              <div className="mt-8 flex flex-col items-center gap-4">
                {hasMore ? (
                  <button
                    type="button"
                    onClick={() => {
                      void loadMore();
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-border/70 px-5 py-2 text-sm font-semibold text-foreground/80 transition-all duration-300 hover:border-blue-glow hover:text-foreground"
                  >
                    {t("blog.loadMore")}
                  </button>
                ) : null}
                <a
                  href="/#mailing-list"
                  onClick={handleNewsletterClick}
                  className={`${highlightedCtaClassName} !px-5 !py-2 text-sm`}
                >
                  <span className="inline-flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>{t("blog.subscribeNewsletter")}</span>
                  </span>
                </a>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
      <BlogP2PModal open={p2pModalOpen} onOpenChange={setP2pModalOpen} />
    </div>
  );
}
